"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FileUpload({ label, accept, onFileSelect, file, description }) {
  const [error, setError] = useState("");

  const onDrop = useCallback(
    (acceptedFiles, rejectedFiles) => {
      setError("");

      if (rejectedFiles.length > 0) {
        setError("Invalid file type. Please upload a supported file.");
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.size > 10 * 1024 * 1024) {
          // 10MB limit
          setError("File size must be less than 10MB");
          return;
        }
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    multiple: false,
  });

  const removeFile = (e) => {
    e.stopPropagation();
    onFileSelect(null);
    setError("");
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      <Card
        {...getRootProps()}
        className={`cursor-pointer transition-all ${
          isDragActive
            ? "border-primary bg-primary/5 border-2"
            : file
            ? "border-primary/50 bg-primary/5"
            : "border-dashed hover:border-primary/50"
        } ${error ? "border-destructive" : ""}`}
      >
        <CardContent className="p-6">
          <input {...getInputProps()} />

          {!file ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center text-center space-y-4"
            >
              <div
                className={`p-4 rounded-full ${
                  isDragActive ? "bg-primary/20" : "bg-muted"
                }`}
              >
                <Upload
                  className={`h-8 w-8 ${
                    isDragActive ? "text-primary" : "text-muted-foreground"
                  }`}
                />
              </div>
              <div>
                <p className="text-sm font-medium">
                  {isDragActive ? "Drop file here" : "Drag & drop file here"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  or click to browse
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                Supported formats: {Object.values(accept).flat().join(", ")}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={removeFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-destructive"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
