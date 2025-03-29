"use client";

// import type React from "react";

import { useState, useRef } from "react";
import { Upload, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Properly implementing the Button component
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import Image from "next/image";
import xSymbol from "../app/assets/x-symbol-svgrepo-com.svg";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export function FileUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [studyMaterial, setStudyMaterial] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Create a ref for the file input and drop zone
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const addFiles = (newFiles: File[]) => {
    // Filter only PDF files
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
      // Set validation error if both files and study material are empty
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
    // Reset validation error if text is added, or set it if both are empty
    if (value.trim()) {
      setValidationError(false);
    } else if (!files.length) {
      setValidationError(true);
    }
  };

  // Drag and drop handlers
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

    // Only set isDragging to false if we're leaving the drop zone and not entering a child element
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validate if both study material and files are empty
    if (!studyMaterial.trim() && files.length === 0) {
      setValidationError(true);
      return;
    }

    try {
      console.log("Study Material:", studyMaterial);
      console.log("Files:", files);
      // Reset validation error on successful submission
      setValidationError(false);
    } catch (err) {
      setError("An error occurred while processing your request.");
    }
  }

  // Function to trigger file input click
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Get the error styles for borders
  const getErrorBorderStyle = () => {
    return validationError ? "border-[#FA4D4D]" : "";
  };

  // Get the error styles for text
  const getErrorTextStyle = () => {
    return validationError ? "text-[#FA4D4D]" : "";
  };

  // Get drop zone border style
  const getDropZoneBorderStyle = () => {
    if (isDragging) {
      return "border-primary";
    }
    if (validationError) {
      return "border-[#FA4D4D]";
    }
    return "border-slate-300 dark:border-slate-700";
  };

  // Get drop zone hover style
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
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="study-material" className={getErrorTextStyle()}>
            Study Material
          </Label>
          <Textarea
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

              {/* File input implementation */}
              <input
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
    </div>
  );
}
