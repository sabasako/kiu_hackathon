"use client";

// import type React from "react";

import { useState, useRef } from "react";
import { Upload, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import xSymbol from "../app/assets/x-symbol-svgrepo-com.svg";
import { Button } from "./ui/button";
import { VideoPreview } from "./video-preview";
import handleVideoGenerate from "@/actions";

export function Content() {
  const [files, setFiles] = useState<File[]>([]);
  const [studyMaterial, setStudyMaterial] = useState<string>("");
  const [validationError, setValidationError] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const addFiles = (newFiles: File[]) => {
    const pdfFiles = newFiles.filter(
      (file) =>
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf")
    );

    if (pdfFiles.length > 0) {
      setFiles((prev) => [...prev, ...pdfFiles]);
      setValidationError(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      addFiles(newFiles);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const updatedFiles = prev.filter((_, i) => i !== index);
      if (updatedFiles.length === 0 && !studyMaterial.trim()) {
        setValidationError(true);
      }
      return updatedFiles;
    });
  };

  const handleStudyMaterialChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setStudyMaterial(value);
    if (value.trim()) {
      setValidationError(false);
    } else if (!files.length) {
      setValidationError(true);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      dropZoneRef.current &&
      !dropZoneRef.current.contains(e.relatedTarget as Node)
    ) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      addFiles(droppedFiles);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!studyMaterial.trim() && files.length === 0) {
      setValidationError(true);
      return;
    }

    try {
      setLoading(true);

      const { images, urls, voiceover, voiceJson, video } =
        await handleVideoGenerate(studyMaterial);

      if (!images) {
        setError("Failed to generate video.");
        return;
      }

      console.log({ images });
      console.log({ voiceover });
      console.log({ urls });
      console.log({ voiceJson: voiceJson.script });

      console.log(video);

      setValidationError(false);
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  }

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getErrorBorderStyle = () => {
    return validationError ? "border-[#FA4D4D]" : "";
  };

  const getErrorTextStyle = () => {
    return validationError ? "text-[#FA4D4D]" : "";
  };

  const getDropZoneBorderStyle = () => {
    if (isDragging) {
      return "border-primary";
    }
    if (validationError) {
      return "border-[#FA4D4D]";
    }
    return "border-slate-300 dark:border-slate-700";
  };

  const getDropZoneHoverStyle = () => {
    if (isDragging) {
      return "hover:border-primary";
    }
    if (validationError) {
      return "hover:border-[#FA4D4D]";
    }
    return "hover:border-slate-400 dark:hover:border-slate-600";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <div className="flex justify-center lg:justify-start ">
        <VideoPreview isLoading={loading} />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 ">
        <h2 className="text-2xl font-semibold mb-6 text-slate-900 dark:text-slate-50">
          Create Your Educational Video
        </h2>

        <div className="space-y-6">
          <div className="space-y-6">
            <form onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="study-material" className={getErrorTextStyle()}>
                  Study Material
                </Label>
                <Textarea
                  disabled={loading}
                  value={studyMaterial}
                  onChange={handleStudyMaterialChange}
                  id="study-material"
                  placeholder="Paste your study material here or upload files below"
                  className={`min-h-[150px] ${getErrorBorderStyle()} ${
                    validationError ? "focus-visible:ring-[#FA4D4D]" : ""
                  }`}
                />
                {validationError && (
                  <p className="text-sm text-[#FA4D4D] mt-1">
                    Please provide study material or upload files
                  </p>
                )}
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <Label className={getErrorTextStyle()}>Upload Files</Label>

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
                            <Image
                              src={xSymbol}
                              width={14}
                              height={14}
                              alt="X Symbol"
                            />
                          </Button>
                        </Card>
                      ))}
                    </div>
                  )}

                  <div
                    ref={dropZoneRef}
                    className={`flex flex-col items-center justify-center border-2 border-dashed ${getDropZoneBorderStyle()} rounded-lg p-8 transition-colors ${getDropZoneHoverStyle()} ${
                      isDragging ? "bg-primary/5" : ""
                    }`}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload
                      className={`h-10 w-10 mb-2 ${
                        validationError
                          ? "text-[#FA4D4D]"
                          : isDragging
                          ? "text-primary"
                          : "text-slate-400"
                      }`}
                    />
                    <p
                      className={`text-sm mb-4 text-center ${
                        validationError
                          ? "text-[#FA4D4D]"
                          : isDragging
                          ? "text-primary"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {isDragging
                        ? "Drop files here"
                        : "Drag and drop your PDF files here or click to browse"}
                    </p>

                    <input
                      disabled={loading}
                      ref={fileInputRef}
                      id="file-upload"
                      type="file"
                      multiple
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleBrowseClick}
                    >
                      Browse Files
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full mt-6"
                size="lg"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <span className="h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                    Generating Video...
                  </span>
                ) : (
                  "Generate Video"
                )}
              </Button>
            </form>
          </div>{" "}
        </div>
      </div>
    </div>
  );
}
