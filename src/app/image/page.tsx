import React from "react";

export const revalidate = 0;

export default async function ImagePage() {
  const prompt =
    "A panoramic view of the Didgori mountains during summer — wide green hills, dramatic skies, ancient Georgian landscape, morning mist over the peaks, cinematic lighting, historical atmosphere.";

  const apiKey = process.env.GEMINI_API_KEY;
  let images = [];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instances: [
            {
              prompt,
            },
          ],
          parameters: {
            number_of_images: 1,
            aspect_ratio: "4:3",
            person_generation: "ALLOW_ADULT",
          },
        }),
        cache: "no-store",
      }
    );

    const data = await response.json();
    images =
      data.predictions?.map((prediction: any) => {
        return {
          url: `data:${prediction.mimeType};base64,${prediction.bytesBase64Encoded}`,
        };
      }) || [];
  } catch (error) {
    console.error("Error fetching from Imagen 3:", error);
  }

  if (!images.length) {
    return <div>Image not generated</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Imagen 3 Results</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {images.map((img: any, idx: number) => (
          <img
            key={idx}
            src={img.url}
            alt={`Generated Image ${idx + 1}`}
            className="w-full rounded-xl shadow-xl"
          />
        ))}
      </div>
    </div>
  );
}
