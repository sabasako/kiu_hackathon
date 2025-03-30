import { Storage } from "@google-cloud/storage";
import path from "path";

// Load credentials from key file
const storage = new Storage({
  keyFilename: path.join(process.cwd(), "gcs-key.json"),
});

const BUCKET_NAME = "kiu_hackathon";

export async function uploadBase64Image(
  base64: string,
  filename: string
): Promise<string> {
  const bucket = storage.bucket(BUCKET_NAME);
  const file = bucket.file(`uploads/${filename}`);
  const buffer = Buffer.from(base64, "base64");

  await file.save(buffer, {
    metadata: {
      contentType: "image/jpeg",
    },
    // public: true,
    resumable: false,
  });

  return `https://storage.googleapis.com/${BUCKET_NAME}/uploads/${filename}`;
}
