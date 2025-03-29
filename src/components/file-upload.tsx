"use client";

import type React from "react";

import { useState } from "react";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";

export function FileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [studyMaterial, setStudyMaterial] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      console.log("Study Material:", studyMaterial);
      console.log("Files:", files);
    } catch {}
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="study-material">Study Material</Label>
          <Textarea
            value={studyMaterial}
            onChange={(e) => setStudyMaterial(e.target.value)}
            id="study-material"
            placeholder="Paste your study material here or upload files below"
            className="min-h-[150px]"
          />
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <Label>Upload Files</Label>

          <div className="grid gap-4">
            {files.length > 0 && (
              <div className="space-y-2">
                {files.map((file, index) => (
                  <Card
                    key={index}
                    className="p-3 flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-2">
                      <FileText size={20} className="text-blue-500" />
                      <span className="text-sm truncate max-w-[200px]">
                        {file.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-8 w-8 p-0"
                    >
                      &times;
                    </Button>
                  </Card>
                ))}
              </div>
            )}

            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 transition-colors hover:border-slate-400 dark:hover:border-slate-600">
              <Upload className="h-10 w-10 text-slate-400 mb-2" />
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 text-center">
                Drag and drop your PDF files here or click to browse
              </p>
              <Button
                variant="secondary"
                className="relative"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
                Browse Files
              </Button>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full mt-6" size="lg">
          Generate Video
        </Button>
      </form>
    </div>
  );
}
