import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY0;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is missing" },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=" +
        apiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          audioConfig: {
            audioEncoding: "MP3",
          },
          input: { text },
          voice: {
            languageCode: "en-US",
            name: "en-US-Standard-A",
          },
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch audio" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
