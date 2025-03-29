import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY0 });

const userData = "Lesson about didgori battle";

export async function GET(request: Request) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: userData,
  });
  console.log(response.text);

  return NextResponse.json({
    message: response.text,
  });
}
