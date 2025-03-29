// /app/image/page.tsx or an API route like /app/api/generate/route.ts

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const prompts = [
  "A panoramic view of the Didgori mountains during summer — wide green hills, dramatic skies, ancient Georgian landscape, morning mist over the peaks, cinematic lighting, historical atmosphere.",
  "A close-up of King David IV overlooking the valley from a cliff, a tense and thoughtful expression, wearing medieval Georgian armor with a red cape, wind blowing his hair and cloak, dark clouds gathering in the background.",
  "An endless army stretching across the plains — Seljuk soldiers with turbans and curved swords, hundreds of tents, war flags waving, horses and war drums, seen from a high angle to show their vast number.",
  // "The Seljuk army approaching a distant medieval city (Tbilisi) under the burning sun, dust clouds rising from their march, smoke from burning villages in the background, showing threat and tension.",
  // "King David IV rallying his troops on a rocky hill — determined faces, knights in traditional Georgian armor, banners of crosses waving in the wind, fiery sunset casting golden light.",
  // "Georgian soldiers kneeling in prayer before battle, priests blessing them, icons held high, emotional intensity on their faces, symbolizing unity and spiritual strength, soft divine light breaking through clouds.",
  // "A small Georgian unit approaching the Seljuk camp under a white flag, soldiers in disguise hiding weapons beneath their cloaks, Seljuk guards watching with suspicion, early morning lighting.",
  // "Sudden ambush in chaos — Georgians drawing swords and striking surprised Seljuk soldiers, intense close-quarters combat, shocked expressions, dramatic dust and motion blur.",
  // "The Seljuk camp in turmoil — horses rearing, tents on fire, soldiers running in all directions, smoke and confusion everywhere, top-down view capturing the disorder.",
  // "The main Georgian army charging downhill with full force — cavalry and infantry in perfect formation, King David at the front on horseback with sword raised, banners flying, thunderous energy.",
  // "Close-up of Georgian warriors mid-charge, eyes burning with resolve, swords glinting in sunlight, some murmuring prayers, symbolizing faith and ferocity.",
  // "The battlefield after the clash — Seljuk soldiers defeated, Georgians standing victorious, some helping wounded comrades, others planting banners in the ground, heavy emotional impact.",
  // "Seljuk remnants retreating in panic through the valley, throwing away weapons, shadows chasing them as Georgian cavalry pursue in the background, dusk falling over the scene.",
  // "Georgian soldiers raising their flags on a hill stained with signs of battle, the sun breaking through clouds above them, proud and exhausted faces, some kneeling in gratitude.",
  // "An epic wide shot — King David IV holding his sword aloft on a mountaintop, surrounded by his warriors, with golden light pouring over the landscape. Text engraved on a rock: “Didgori – The Miraculous Victory”.",
];

export async function generateDidgoriImages() {
  const imagePromises = prompts.map((prompt) =>
    openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
    })
  );

  const responses = await Promise.all(imagePromises);
  const imageUrls = responses.map((res) => res.data[0].url);

  return imageUrls;
}

export default async function ImagePage() {
  const imagePromises = prompts.map((prompt) =>
    openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1024",
    })
  );

  const responses = await Promise.all(imagePromises);
  const imageUrls = responses.map((res) => res.data[0].url);

  return (
    <div>
      <h1 className="text-3xl mt-8 mb-20">Didgori Battle Images</h1>
      {imageUrls.map((url, index) => (
        <img key={index} src={url} alt={`Generated image ${index + 1}`} />
      ))}
    </div>
  );
}
