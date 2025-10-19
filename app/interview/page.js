"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AudioVisualizer } from "@/components/AudioVisualizer";
import { StepIndicator } from "@/components/StepIndicator";
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
import { toast } from "sonner";
import { Plane, Play, Pause, StopCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function InterviewPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const scrollRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    // Get session ID from sessionStorage
    if (typeof window !== "undefined") {
      const id = sessionStorage.getItem("interviewSessionId");
      if (!id) {
        toast.error("No active session found. Please upload your documents first.");
        router.push("/upload");
        return;
      }
      setSessionId(id);
      loadQuestions(id);
    }
  }, [router]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadQuestions = async (id) => {
    try {
      // In a real app, this would fetch from the API
      // For demo, we'll use default questions
      const defaultQuestions = [
        {
          id: 1,
          question: "Can you tell me about yourself and your professional background?",
          category: "experience"
        },
        {
          id: 2,
          question: "What interests you most about this position?",
          category: "behavioral"
        },
        {
          id: 3,
          question: "Describe a challenging project you've worked on. What was your role?",
          category: "problem-solving"
        },
        {
          id: 4,
          question: "What technical skills do you feel are most relevant to this role?",
          category: "technical"
        },
        {
          id: 5,
          question: "How do you handle working under pressure and tight deadlines?",
          category: "behavioral"
        }
      ];
      setQuestions(defaultQuestions);
    } catch (error) {
      console.error("Error loading questions:", error);
      toast.error("Failed to load questions");
    }
  };

  const startInterview = async () => {
    if (questions.length === 0) {
      toast.error("No questions available");
      return;
    }

    setInterviewStarted(true);
    
    // Add first question to messages
    const firstQuestion = questions[0];
    setMessages([
      {
        id: 1,
        type: "ai",
        text: firstQuestion.question,
        timestamp: new Date().toISOString(),
      },
    ]);

    toast.success("Interview started! Answer the question when ready.");
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await processAnswer(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      toast.success("Recording started");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Failed to access microphone. Please check permissions.");
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      toast.info("Recording paused");
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      toast.success("Recording resumed");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
    }
  };

  const processAnswer = async (audioBlob) => {
    try {
      // Add user answer to messages (simulated transcription)
      const simulatedAnswer = "This is a simulated transcription of your answer. In production, this would be the actual transcription from speech-to-text.";
      
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          type: "user",
          text: simulatedAnswer,
          timestamp: new Date().toISOString(),
        },
      ]);

      // Move to next question
      const nextIndex = currentQuestionIndex + 1;
      
      if (nextIndex < questions.length) {
        setCurrentQuestionIndex(nextIndex);
        
        setTimeout(() => {
          const nextQuestion = questions[nextIndex];
          setMessages(prev => [
            ...prev,
            {
              id: prev.length + 1,
              type: "ai",
              text: nextQuestion.question,
              timestamp: new Date().toISOString(),
            },
          ]);
          toast.info("Next question ready!");
        }, 1000);
      } else {
        // Interview complete
        toast.success("Interview completed! Generating feedback...");
        setTimeout(() => {
          router.push("/feedback");
        }, 2000);
      }
    } catch (error) {
      console.error("Error processing answer:", error);
      toast.error("Failed to process answer");
    }
  };

  const endInterview = () => {
    setShowEndDialog(true);
  };

  const confirmEndInterview = () => {
    setShowEndDialog(false);
    toast.success("Generating your feedback...");
    setTimeout(() => {
      router.push("/feedback");
    }, 1500);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

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
          <div className="flex items-center gap-4">
            {interviewStarted && (
              <Badge variant="outline" className="text-sm">
                Question {currentQuestionIndex + 1} of {questions.length}
              </Badge>
            )}
          </div>
        </div>
      </nav>

      {/* Step Indicator */}
      <StepIndicator currentStep={2} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Left Panel - Audio Interaction */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="border-2">
              <CardContent className="p-8">
                <div className="flex flex-col items-center space-y-8">
                  <AudioVisualizer isRecording={isRecording && !isPaused} />

                  {!interviewStarted ? (
                    <Button
                      onClick={startInterview}
                      size="lg"
                      className="w-full text-lg py-6"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Start Interview
                    </Button>
                  ) : (
                    <div className="w-full space-y-4">
                      {!isRecording ? (
                        <Button
                          onClick={startRecording}
                          size="lg"
                          className="w-full text-lg py-6"
                        >
                          <Play className="mr-2 h-5 w-5" />
                          Start Recording
                        </Button>
                      ) : (
                        <div className="space-y-3">
                          <div className="flex gap-3">
                            {!isPaused ? (
                              <Button
                                onClick={pauseRecording}
                                variant="outline"
                                size="lg"
                                className="flex-1 text-lg py-6"
                              >
                                <Pause className="mr-2 h-5 w-5" />
                                Pause
                              </Button>
                            ) : (
                              <Button
                                onClick={resumeRecording}
                                variant="outline"
                                size="lg"
                                className="flex-1 text-lg py-6"
                              >
                                <Play className="mr-2 h-5 w-5" />
                                Resume
                              </Button>
                            )}
                            <Button
                              onClick={stopRecording}
                              variant="default"
                              size="lg"
                              className="flex-1 text-lg py-6"
                            >
                              <StopCircle className="mr-2 h-5 w-5" />
                              Stop
                            </Button>
                          </div>
                        </div>
                      )}

                      {interviewStarted && (
                        <Button
                          onClick={endInterview}
                          variant="destructive"
                          size="lg"
                          className="w-full"
                        >
                          End Interview
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Status Card */}
                  <Card className="w-full bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge variant={isRecording ? "default" : "secondary"}>
                          {isPaused ? "Paused" : isRecording ? "Recording" : "Ready"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Panel - Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="border-2 h-full">
              <CardContent className="p-6 h-full flex flex-col">
                <h2 className="text-2xl font-bold mb-4">Interview Conversation</h2>
                
                <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
                  <div className="space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <p>Click "Start Interview" to begin</p>
                      </div>
                    ) : (
                      <AnimatePresence>
                        {messages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`flex gap-3 ${
                              message.type === "user" ? "flex-row-reverse" : ""
                            }`}
                          >
                            <Avatar className="h-10 w-10 shrink-0">
                              <AvatarFallback className={
                                message.type === "ai" 
                                  ? "bg-primary text-primary-foreground" 
                                  : "bg-secondary"
                              }>
                                {message.type === "ai" ? "AI" : "You"}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`flex-1 ${
                              message.type === "user" ? "text-right" : ""
                            }`}>
                              <Card className={
                                message.type === "ai" 
                                  ? "bg-muted" 
                                  : "bg-primary text-primary-foreground"
                              }>
                                <CardContent className="p-4">
                                  <p className="text-sm leading-relaxed">
                                    {message.text}
                                  </p>
                                  <p className={`text-xs mt-2 ${
                                    message.type === "ai" 
                                      ? "text-muted-foreground" 
                                      : "text-primary-foreground/70"
                                  }`}>
                                    {formatTime(message.timestamp)}
                                  </p>
                                </CardContent>
                              </Card>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* End Interview Dialog */}
      <AlertDialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Interview?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to end the interview? You've answered {currentQuestionIndex + 1} out of {questions.length} questions.
              Your feedback will be generated based on your current responses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Interview</AlertDialogCancel>
            <AlertDialogAction onClick={confirmEndInterview}>
              End & Get Feedback
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
