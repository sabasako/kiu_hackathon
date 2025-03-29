import { GoogleGenerativeAI } from "@google/generative-ai";

async function main() {
  // IMPORTANT: Make sure you have set the GOOGLE_GENAI_API_KEY environment variable.
  const apiKey = process.env.GOOGLE_GENAI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_GENAI_API_KEY environment variable is not set.");
  }
  const genAI = new GoogleGenerativeAI(apiKey);

  const eduTopic = "Explain the concept of gravity for elementary school students.";
  const modelName = "gemini-1.5-flash"; // Or "gemini-1.0-pro" or any other appropriate model
  const model = genAI.getGenerativeModel({ model: modelName });

interface GenerateContentResult {
    response: {
        text: () => string;
    };
}

async function generateVoiceover(topic: string): Promise<string | null> {
    const prompt: string = `Create a voiceover script explaining the following topic: "${topic}".
        The script should be designed for elementary school students.
        It needs to be approximately 40 seconds long when read at a normal pace.
        Focus on simple explanations and engaging language.
        Avoid jargon. Make it sound like a friendly teacher is explaining it.`;

    try {
        const result: GenerateContentResult = await model.generateContent(prompt);
        const response = result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating voiceover:", error);
        return null;
    }
}

interface GenerateImagePromptsResult {
    response: {
        text: () => string;
    };
}

async function generateImagePrompts(topic: string): Promise<string | null> {
    const prompt: string = `Generate 10 image prompts suitable for a short educational video about "${topic}" for elementary school students.
        Each prompt should describe a visual scene that illustrates the topic.
        Focus on clear and engaging visuals.  The prompts should be concise and visually descriptive.
        Format the output as a numbered list:
        1. [Description of image]
        2. [Description of image]
        ...and so on.`;

    try {
        const result: GenerateImagePromptsResult = await model.generateContent(prompt);
        const response = result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating image prompts:", error);
        return null;
    }
}

  // --- Execution ---
  try {
    const voiceoverText = await generateVoiceover(eduTopic);
    const imagePromptsText = await generateImagePrompts(eduTopic);

    if (voiceoverText) {
      console.log("--- Voiceover Script ---");
      console.log(voiceoverText);
    }

    if (imagePromptsText) {
      console.log("\n--- Image Prompts ---");
      console.log(imagePromptsText);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

(async () => {
  await main();
})();