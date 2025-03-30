"use client";

import { useState } from "react";

export default function TextToSpeechPage() {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text) return;
    setLoading(true);
    setAudioUrl(null);

    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (data.audioContent) {
        const blob = new Blob(
          [Uint8Array.from(atob(data.audioContent), (c) => c.charCodeAt(0))],
          { type: "audio/wav" }
        );
        setAudioUrl(URL.createObjectURL(blob));
      }
    } catch (error) {
      console.error("Error fetching audio:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Text to Speech</h1>
      <textarea
        className="w-full max-w-lg p-2 border rounded-md"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to convert to speech..."
      />
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Processing..." : "Convert to Speech"}
      </button>
      {audioUrl && (
        <audio controls className="mt-4">
          <source src={audioUrl} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
}
