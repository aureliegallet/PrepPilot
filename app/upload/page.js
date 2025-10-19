"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/FileUpload";
import { StepIndicator } from "@/components/StepIndicator";
import { toast } from "sonner";
import { Plane, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const acceptedFileTypes = {
    "application/pdf": [".pdf"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    "application/msword": [".doc"],
    "text/plain": [".txt"],
  };

  const handleStartInterview = async () => {
    if (!resume || !jobDescription) {
      toast.error("Please upload both resume and job description");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("jobDescription", jobDescription);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await response.json();
      
      toast.success(`Successfully uploaded! ${data.questionCount} questions generated.`);
      
      // Store session ID for the interview
      if (typeof window !== "undefined") {
        sessionStorage.setItem("interviewSessionId", data.sessionId);
      }

      // Navigate to interview page
      setTimeout(() => {
        router.push("/interview");
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload files. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const canStartInterview = resume && jobDescription && !isUploading;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Plane className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">PrepPilot</span>
            </motion.div>
          </Link>
        </div>
      </nav>

      {/* Step Indicator */}
      <StepIndicator currentStep={1} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Upload Your Documents</h1>
          <p className="text-lg text-muted-foreground">
            Upload your resume and the job description to get started with personalized interview questions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Document Upload</CardTitle>
              <CardDescription>
                Supported formats: PDF, DOCX, DOC, TXT (Max 10MB per file)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FileUpload
                label="Resume / CV"
                description="Upload your resume or curriculum vitae"
                accept={acceptedFileTypes}
                onFileSelect={setResume}
                file={resume}
              />

              <FileUpload
                label="Job Description"
                description="Upload the job description for the position you're applying to"
                accept={acceptedFileTypes}
                onFileSelect={setJobDescription}
                file={jobDescription}
              />

              <div className="pt-4">
                <Button
                  onClick={handleStartInterview}
                  disabled={!canStartInterview}
                  className="w-full text-lg py-6 group"
                  size="lg"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing Files...
                    </>
                  ) : (
                    <>
                      Start Interview
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
                {!canStartInterview && !isUploading && (
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Please upload both files to continue
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-4 mt-8"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">5-10</div>
                <p className="text-sm text-muted-foreground">Questions Generated</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">15-20</div>
                <p className="text-sm text-muted-foreground">Minutes Duration</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">AI</div>
                <p className="text-sm text-muted-foreground">Powered Analysis</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
