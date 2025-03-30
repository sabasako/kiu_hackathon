"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { uploadBase64Image } from "./lib/gcsUploader";
import { randomUUID } from "crypto";
import { createVideoJson } from "./lib/createVideoJson";

interface GenerateImagePromptsResult {
  response: {
    text: () => string;
  };
}

interface GenerateContentResult {
  response: {
    text: () => string;
  };
}

export default async function handleVideoGenerate(input: string) {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_GENAI_API_KEY environment variable is not set.");
  }
  const genAI = new GoogleGenerativeAI(apiKey);

  const eduTopic = input;
  const modelName = "gemini-1.5-flash";
  const model = genAI.getGenerativeModel({ model: modelName });

  const voiceoverText = await generateVoiceover(eduTopic, model);
  const imagePromptsText = await generateImagePrompts(eduTopic, model);

  if (!voiceoverText || !imagePromptsText) {
    throw new Error("Failed to generate content.");
  }

<<<<<<< HEAD
  if (voiceoverText) {
    console.log("--- Voiceover Script ---");
    console.log(voiceoverText);
    let voiceoverTextToParse = voiceoverText.script
      .map((entry: any) => entry.text)
      .join(" ");
    console.log(voiceoverTextToParse);
  }
=======
  const cleanJSON = voiceoverText
    .replace(/```json\n/, "")
    .replace(/\n```\n/, "")
    .trim();

  const voiceJson: { script: { text: string; time: number }[] } =
    JSON.parse(cleanJSON);
>>>>>>> 47cda5a60a94da2560963842f6c755935b859177

  const { error, images } = await getImages(imagePromptsText.split("\n\n"));

  if (error) {
    throw new Error(error);
  }

  if (!images || images.length === 0) {
    throw new Error("No images generated.");
  }

  const urls = await Promise.all(
    images.map(async (img, i) => {
      const base64 = img.url.replace(/^data:image\/(png|jpeg);base64,/, "");
      const uploadedUrl = await uploadBase64Image(
        base64,
        `image-${randomUUID()}-${i}.jpeg`
      );

      return {
        url: uploadedUrl,
        promptIndex: img.promptIndex as number,
        promp: img.prompt as string,
      };
    })
  );

  const video = await createVideo(voiceJson.script, urls);

  return {
    images,
    urls,
    voiceover: voiceoverText,
    voiceJson,
    video,
  };
}

async function generateVoiceover(
  topic: string,
  model: any
): Promise<string | null> {
  const prompt: string = `Create a voiceover script explaining the following topic: "${topic}".
  The script should be designed for elementary school students.
  It needs to be approximately 40 seconds long when read at a normal pace.
  Focus on simple explanations and engaging language.
  Avoid jargon. Make it sound like a friendly teacher is explaining it.
  Divide the script into 10 sections, each lasting amount of time necessery for reading that text.
  adjust the timing to ensure good pacing and clarity.
  Each section should be concise and easy to understand.
  Format the output EXACTLY as a Json file with the following structure:
  {
      "script": [
          {
              "text": "[Text for section 1]",
              "time": 3
          },
          {
              "text": "[Text for section 2]",
              "time": 5,
          },
          ...
          {
              "text": "[Text for section 10]",
              "time": 4`;

  try {
    const result: GenerateContentResult = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating voiceover:", error);
    return null;
  }
}

async function generateImagePrompts(
  topic: string,
  model: any
): Promise<string | null> {
  const prompt: string = `Generate 10 image prompts suitable for a short educational video about "${topic}" for elementary school students.
        Each prompt should describe a visual scene that illustrates the topic.
        Focus on clear and engaging visuals.  The prompts should be concise and visually descriptive.
        Format the output as a numbered list:
        1. [Description of image]
        2. [Description of image]
        ...and so on.`;

  try {
    const result: GenerateImagePromptsResult = await model.generateContent(
      prompt
    );
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating image prompts:", error);
    return null;
  }
}

async function getImages(prompts: string[]) {
  // Dynamically collect all available API keys from environment variables
  const apiKeys: string[] = [];
  for (let i = 0; i < 8; i++) {
    const keyName = `GEMINI_API_KEY${i}`;
    const key = process.env[keyName];
    if (key) {
      apiKeys.push(key);
    }
  }

  if (apiKeys.length === 0) {
    return { error: "No API keys found." };
  }

  const promptsWithKeys = prompts.map((prompt, index) => ({
    prompt,
    apiKey: apiKeys[index],
  }));

  const fetchImage = async (
    task: { prompt: string; apiKey: string },
    index: number
  ) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${task.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            instances: [{ prompt: task.prompt }],
            parameters: {
              sampleCount: 1,
              aspectRatio: "9:16",
            },
          }),
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (data.error) {
        console.error(
          `Error with prompt ${index} with ${promptsWithKeys[index].apiKey}: ${data.error.message}`
        );
        return null;
      }

      if (!data.predictions || data.predictions.length === 0) {
        return null;
      }

      return {
        url: `data:${data.predictions[0].mimeType};base64,${data.predictions[0].bytesBase64Encoded}`,
        prompt: task.prompt,
        promptIndex: index,
      };
    } catch (error) {
      console.error(
        `Error with API request for prompt ${index} with ${promptsWithKeys[index].apiKey}: ${error}`
      );
      return null;
    }
  };

  let images: any[] = [];
  try {
    // Execute all requests in parallel
    const fetchPromises = promptsWithKeys.map((task, index) =>
      fetchImage(task, index)
    );
    const results = await Promise.all(fetchPromises);

    // Filter out null results and add to images array
    images = results.filter((result) => result !== null);
  } catch (error) {
    console.error("Error in image generation process:", error);
  }

  if (!images.length) {
    return { error: "No images generated." };
  }

  return { images };
}

async function createVideo(
  voiceJson: { text: string; time: number }[],
  urls: {
    url: string;
    promptIndex: number;
  }[]
) {
  const inputBody = createVideoJson(voiceJson, urls);

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-api-key": "Rx9G8dzhnGneSU39EVxLEH3pA7F89OLV7JRUmEfO",
  };

  fetch("https://api.shotstack.io/edit/{version}/render", {
    method: "POST",
    body: JSON.stringify(inputBody),
    headers: headers,
  })
    .then(function (res) {
      console.log(res);

      return res.json();
    })
    .then(function (body) {
      return body;
    })
    .catch(function (error) {
      console.error("Error in video creation process:", error);
    });
}
