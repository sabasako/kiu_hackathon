import React from "react";

export default async function ImagePage() {
  // Dynamically collect all available API keys from environment variables
  const apiKeys = [];
  for (let i = 0; i < 8; i++) {
    const keyName = `GEMINI_API_KEY${i}`;
    const key = process.env[keyName];
    if (key) {
      apiKeys.push(key);
    }
  }

  if (apiKeys.length === 0) {
    return <div>No API keys are available</div>;
  }

  const promptsWithKeys = [
    {
      prompt:
        "The battlefield after the clash — Seljuk soldiers defeated, Georgians standing victorious, georgian flag is out on banners, some helping wounded comrades, others planting banners in the ground, heavy emotional impact.",
      apiKey: apiKeys[0],
    },
    {
      prompt:
        "Medieval Georgian knights on horseback charging across a mountain pass with flowing banners, dramatic lighting casting long shadows.",
      apiKey: apiKeys[1],
    },
    {
      prompt:
        "A Georgian fortress on a mountainside overlooking a valley, sunset light illuminating stone walls and towers, medieval era.",
      apiKey: apiKeys[2],
    },
    {
      prompt:
        "Georgian warriors in traditional armor sharing a meal around a campfire, mountains in background, preparing for tomorrow's battle.",
      apiKey: apiKeys[3],
    },
    {
      prompt:
        "Georgian Queen Tamar presiding over her court, surrounded by nobles and military commanders, inside an ornate medieval palace.",
      apiKey: apiKeys[4],
    },
    {
      prompt:
        "Georgian archers positioned on a hillside, drawing bows against approaching enemy forces, morning mist clearing in the valley below.",
      apiKey: apiKeys[5],
    },
    {
      prompt:
        "Medieval Georgian blacksmiths forging weapons and armor, workshop filled with smoke and flying sparks, preparing for war.",
      apiKey: apiKeys[6],
    },
    {
      prompt:
        "Georgian military ships with distinctive flags sailing across the Black Sea, medieval era naval battle formation.",
      apiKey: apiKeys[7],
    },
    {
      prompt:
        "Georgian cavalry scouts watching enemy movements from a ridge, detailed medieval armor and weaponry, moody cloudy sky.",
      apiKey: apiKeys[8],
    },
    {
      prompt:
        "Medieval Georgian feast celebration after military victory, tables filled with traditional food, musicians playing, soldiers rejoicing.",
      apiKey: apiKeys[9],
    },
  ];

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
              aspectRatio: "4:3",
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
    return <div>No images were generated</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">
        Generated Images ({images.length} of {promptsWithKeys.length})
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map((img: any, idx: number) => (
          <div
            key={idx}
            className="flex flex-col border rounded-xl overflow-hidden shadow-lg"
          >
            <img
              src={img.url}
              alt={`Generated Image ${img.promptIndex + 1}`}
              className="w-full h-64 object-cover"
            />
            <div className="p-4 bg-white">
              <h3 className="font-bold text-lg mb-2">
                Prompt {img.promptIndex + 1}
              </h3>
              <p className="text-sm text-gray-700">{img.prompt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
