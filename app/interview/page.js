"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AudioVisualizer } from "@/components/AudioVisualizer";
import { StepIndicator } from "@/components/StepIndicator";
import {
  Sparkles,
  Mic,
  MicOff,
  Play,
  Pause,
  Square,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Mock conversation data
const mockQuestions = [
  "Tell me about yourself and your background.",
  "What interests you about this position?",
  "Can you describe a challenging project you've worked on?",
  "How do you handle tight deadlines and pressure?",
  "Where do you see yourself in five years?",
];

export default function InterviewPage() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [messages, setMessages] = useState([]);
  const scrollAreaRef = useRef(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleStart = () => {
    setHasStarted(true);
    setIsRecording(true);

    // Add first question
    const firstQuestion = mockQuestions[0];
    setMessages([
      {
        id: 1,
        type: "ai",
        content: firstQuestion,
        timestamp: new Date(),
      },
    ]);

    toast.success("Interview started!");
  };

  const handlePause = () => {
    setIsPaused(true);
    setIsRecording(false);
    toast.info("Interview paused");
  };

  const handleResume = () => {
    setIsPaused(false);
    setIsRecording(true);
    toast.success("Interview resumed");
  };

  const handleStopRecording = () => {
    if (!isRecording) return;

    setIsRecording(false);

    // Simulate user answer
    const userAnswer =
      "This is a simulated answer to the interview question. In a real implementation, this would be the transcribed audio from the user's response.";

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        type: "user",
        content: userAnswer,
        timestamp: new Date(),
      },
    ]);

    // Move to next question after a delay
    setTimeout(() => {
      if (currentQuestionIndex < mockQuestions.length - 1) {
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);

        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            type: "ai",
            content: mockQuestions[nextIndex],
            timestamp: new Date(),
          },
        ]);

        setIsRecording(true);
      } else {
        toast.success("Interview completed!");
        setTimeout(() => setShowEndDialog(true), 1000);
      }
    }, 1500);
  };

  const handleEndInterview = () => {
    setShowEndDialog(true);
  };

  const handleConfirmEnd = () => {
    toast.success("Generating feedback...");
    router.push("/feedback");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">AI Interviewer</span>
          </Link>
          <Badge variant="outline" className="font-mono">
            Question {currentQuestionIndex + 1} / {mockQuestions.length}
          </Badge>
        </div>
      </nav>

      {/* Step Indicator */}
      <StepIndicator currentStep={2} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-2 gap-8"
        >
          {/* Left Column - Audio Control */}
          <Card className="h-[600px] flex flex-col">
            <CardContent className="flex-1 flex flex-col items-center justify-center p-8">
              {!hasStarted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Ready to Begin?</h2>
                    <p className="text-muted-foreground">
                      Click start when you&apos;re ready to begin your interview
                    </p>
                  </div>

                  <AudioVisualizer isRecording={false} />

                  <Button size="lg" onClick={handleStart} className="px-8">
                    <Play className="mr-2 h-5 w-5" />
                    Start Interview
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-8 w-full flex flex-col items-center">
                  <AudioVisualizer isRecording={isRecording && !isPaused} />

                  <div className="flex gap-4 flex-wrap justify-center">
                    {isPaused ? (
                      <Button size="lg" onClick={handleResume}>
                        <Play className="mr-2 h-5 w-5" />
                        Resume
                      </Button>
                    ) : (
                      <Button size="lg" onClick={handlePause} variant="outline">
                        <Pause className="mr-2 h-5 w-5" />
                        Pause
                      </Button>
                    )}

                    {isRecording && !isPaused && (
                      <Button
                        size="lg"
                        onClick={handleStopRecording}
                        variant="secondary"
                      >
                        <Square className="mr-2 h-5 w-5" />
                        Stop Answering
                      </Button>
                    )}

                    <Button
                      size="lg"
                      onClick={handleEndInterview}
                      variant="destructive"
                    >
                      End Interview
                    </Button>
                  </div>

                  <Card className="w-full bg-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <p className="text-sm text-center text-muted-foreground">
                        {isRecording && !isPaused
                          ? "🎤 Listening... Speak your answer clearly"
                          : isPaused
                          ? "⏸️ Interview paused"
                          : "⏹️ Click 'Stop Answering' when you finish"}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right Column - Chat Interface */}
          <Card className="h-[600px] flex flex-col">
            <div className="border-b p-4">
              <h3 className="font-semibold">Interview Conversation</h3>
              <p className="text-sm text-muted-foreground">
                Real-time questions and answers
              </p>
            </div>

            <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
              <AnimatePresence>
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                    <p>Start the interview to see questions appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`flex gap-3 ${
                          message.type === "user" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <Avatar className="shrink-0">
                          <AvatarFallback
                            className={
                              message.type === "ai"
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary"
                            }
                          >
                            {message.type === "ai" ? "AI" : "You"}
                          </AvatarFallback>
                        </Avatar>

                        <div
                          className={`flex-1 space-y-1 ${
                            message.type === "user" ? "items-end" : ""
                          }`}
                        >
                          <div
                            className={`inline-block rounded-lg p-3 ${
                              message.type === "ai"
                                ? "bg-muted"
                                : "bg-primary text-primary-foreground"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                          <p className="text-xs text-muted-foreground px-1">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </ScrollArea>
          </Card>
        </motion.div>
      </div>

      {/* End Interview Dialog */}
      <AlertDialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Interview?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to end the interview? You&apos;ll be taken
              to the feedback page to review your performance.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Interview</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmEnd}>
              View Feedback
              <ArrowRight className="ml-2 h-4 w-4" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
