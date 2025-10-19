"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StepIndicator } from "@/components/StepIndicator";
import { toast } from "sonner";
import { Plane, ArrowRight, Loader2, Edit2, Save, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReviewPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [editingResume, setEditingResume] = useState(false);
  const [editingJob, setEditingJob] = useState(false);
  const [editedResumeText, setEditedResumeText] = useState("");
  const [editedJobText, setEditedJobText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Get session data from sessionStorage
    if (typeof window !== "undefined") {
      const storedSessionId = sessionStorage.getItem("reviewSessionId");
      const storedResumeText = sessionStorage.getItem("resumeText");
      const storedJobText = sessionStorage.getItem("jobDescriptionText");

      if (!storedSessionId || !storedResumeText || !storedJobText) {
        toast.error("No upload data found. Please upload files first.");
        router.push("/upload");
        return;
      }

      setSessionId(storedSessionId);
      setResumeText(storedResumeText);
      setJobDescriptionText(storedJobText);
      setEditedResumeText(storedResumeText);
      setEditedJobText(storedJobText);
    }
  }, [router]);

  const handleEditResume = () => {
    setEditingResume(true);
    setEditedResumeText(resumeText);
  };

  const handleSaveResume = () => {
    setResumeText(editedResumeText);
    setEditingResume(false);
    toast.success("Resume text updated");
  };

  const handleCancelEditResume = () => {
    setEditedResumeText(resumeText);
    setEditingResume(false);
  };

  const handleEditJob = () => {
    setEditingJob(true);
    setEditedJobText(jobDescriptionText);
  };

  const handleSaveJob = () => {
    setJobDescriptionText(editedJobText);
    setEditingJob(false);
    toast.success("Job description text updated");
  };

  const handleCancelEditJob = () => {
    setEditedJobText(jobDescriptionText);
    setEditingJob(false);
  };

  const handleGenerateQuestions = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          resumeText,
          jobDescriptionText,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate questions");
      }

      const data = await response.json();

      toast.success(`Successfully generated ${data.questionCount} questions!`);

      // Store session ID for the interview
      if (typeof window !== "undefined") {
        sessionStorage.setItem("interviewSessionId", sessionId);
      }

      // Navigate to interview page
      setTimeout(() => {
        router.push("/interview");
      }, 1000);
    } catch (error) {
      console.error("Generate questions error:", error);
      toast.error(error.message || "Failed to generate questions. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
      <StepIndicator currentStep={1.5} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Review Extracted Content</h1>
          <p className="text-lg text-muted-foreground">
            Review the text extracted from your documents. You can edit the content if needed before generating interview questions.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Extracted Text Content</CardTitle>
              <CardDescription>
                Review and edit the extracted text from your uploaded files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="resume" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="resume">Resume / CV</TabsTrigger>
                  <TabsTrigger value="job">Job Description</TabsTrigger>
                </TabsList>

                <TabsContent value="resume" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Resume Content</h3>
                    {!editingResume ? (
                      <Button
                        onClick={handleEditResume}
                        variant="outline"
                        size="sm"
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveResume}
                          size="sm"
                          variant="default"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          onClick={handleCancelEditResume}
                          size="sm"
                          variant="outline"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>

                  {!editingResume ? (
                    <div className="p-4 bg-muted rounded-md max-h-96 overflow-y-auto whitespace-pre-wrap font-mono text-sm">
                      {resumeText}
                    </div>
                  ) : (
                    <textarea
                      value={editedResumeText}
                      onChange={(e) => setEditedResumeText(e.target.value)}
                      className="w-full h-96 p-4 bg-muted rounded-md font-mono text-sm resize-none"
                    />
                  )}
                </TabsContent>

                <TabsContent value="job" className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Job Description Content</h3>
                    {!editingJob ? (
                      <Button
                        onClick={handleEditJob}
                        variant="outline"
                        size="sm"
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveJob}
                          size="sm"
                          variant="default"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          onClick={handleCancelEditJob}
                          size="sm"
                          variant="outline"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>

                  {!editingJob ? (
                    <div className="p-4 bg-muted rounded-md max-h-96 overflow-y-auto whitespace-pre-wrap font-mono text-sm">
                      {jobDescriptionText}
                    </div>
                  ) : (
                    <textarea
                      value={editedJobText}
                      onChange={(e) => setEditedJobText(e.target.value)}
                      className="w-full h-96 p-4 bg-muted rounded-md font-mono text-sm resize-none"
                    />
                  )}
                </TabsContent>
              </Tabs>

              <div className="pt-6">
                <Button
                  onClick={handleGenerateQuestions}
                  disabled={isGenerating || editingResume || editingJob}
                  className="w-full text-lg py-6 group"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Questions with AI...
                    </>
                  ) : (
                    <>
                      Generate Interview Questions
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
                {(editingResume || editingJob) && (
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Please save or cancel your edits before proceeding
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Tip:</strong> Review the extracted text carefully. If the extraction didn't capture everything correctly, you can edit the text to ensure the AI generates the most relevant interview questions for your needs.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
