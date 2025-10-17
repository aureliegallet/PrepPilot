"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileUpload } from "@/components/FileUpload";
import { StepIndicator } from "@/components/StepIndicator";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function UploadPage() {
  const router = useRouter();
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

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

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Files uploaded successfully!");

      // Navigate to interview page
      router.push("/interview");
    } catch (error) {
      toast.error("Failed to upload files. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const isComplete = resume && jobDescription;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">AI Interviewer</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      {/* Step Indicator */}
      <StepIndicator currentStep={1} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold">
              Upload Your Documents
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload your resume and the job description to generate
              personalized interview questions tailored to your experience and
              the role.
            </p>
          </div>

          {/* Upload Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
              <CardDescription>
                Both documents are required to start the interview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FileUpload
                label="Resume"
                description="Upload your resume in PDF or DOCX format"
                accept={{
                  "application/pdf": [".pdf"],
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                    [".docx"],
                  "application/msword": [".doc"],
                }}
                file={resume}
                onFileSelect={setResume}
              />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    and
                  </span>
                </div>
              </div>

              <FileUpload
                label="Job Description"
                description="Upload the job description in PDF, DOCX, or TXT format"
                accept={{
                  "application/pdf": [".pdf"],
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                    [".docx"],
                  "application/msword": [".doc"],
                  "text/plain": [".txt"],
                }}
                file={jobDescription}
                onFileSelect={setJobDescription}
              />
            </CardContent>
          </Card>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      AI-Powered Personalization
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Our AI will analyze both documents to create interview
                      questions that match your experience with the job
                      requirements, ensuring a realistic and relevant practice
                      session.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Link href="/">
              <Button variant="outline" size="lg">
                Cancel
              </Button>
            </Link>
            <Button
              size="lg"
              disabled={!isComplete || isUploading}
              onClick={handleStartInterview}
              className="group"
            >
              {isUploading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="h-5 w-5 mr-2 border-2 border-background border-t-transparent rounded-full"
                  />
                  Uploading...
                </>
              ) : (
                <>
                  Start Interview
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
