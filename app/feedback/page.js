"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { StepIndicator } from "@/components/StepIndicator";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Plane,
  Download,
  Share2,
  Play,
  Pause,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";

export default function FeedbackPage() {
  const [audioPlaying, setAudioPlaying] = useState({});
  const [audioProgress, setAudioProgress] = useState({});

  // Mock data
  const overallScore = 78;
  const duration = "18 minutes";
  const questionsAnswered = 5;
  const totalQuestions = 5;

  const performanceBadge = 
    overallScore >= 80 ? "Excellent" : 
    overallScore >= 60 ? "Good" : 
    "Needs Work";

  const badgeVariant = 
    overallScore >= 80 ? "default" : 
    overallScore >= 60 ? "secondary" : 
    "destructive";

  // Question scores for bar chart
  const questionScores = [
    { question: "Q1", score: 85 },
    { question: "Q2", score: 72 },
    { question: "Q3", score: 80 },
    { question: "Q4", score: 75 },
    { question: "Q5", score: 78 },
  ];

  // Skills assessment for radar chart
  const skillsData = [
    { skill: "Technical", score: 82 },
    { skill: "Communication", score: 75 },
    { skill: "Problem Solving", score: 80 },
    { skill: "Experience", score: 78 },
    { skill: "Cultural Fit", score: 70 },
    { skill: "Confidence", score: 85 },
  ];

  const strengths = [
    "Strong technical knowledge and ability to explain complex concepts clearly",
    "Good examples of past projects that demonstrate relevant experience",
    "Confident and articulate communication style",
    "Well-prepared with specific examples and metrics",
  ];

  const weaknesses = [
    "Could improve on providing more specific examples in behavioral questions",
    "Sometimes answers could be more concise and to the point",
    "More emphasis on teamwork and collaboration would strengthen responses",
  ];

  // Detailed feedback per question
  const detailedFeedback = [
    {
      id: 1,
      question: "Can you tell me about yourself and your professional background?",
      score: 85,
      answer: "I am a software engineer with 5 years of experience...",
      feedback: "Excellent introduction! You clearly communicated your background and highlighted relevant experiences. Consider starting with a brief summary of your current role before diving into your history.",
      audioUrl: null,
    },
    {
      id: 2,
      question: "What interests you most about this position?",
      score: 72,
      answer: "I'm interested in the company's mission and the opportunity to work on challenging projects...",
      feedback: "Good response, but could be improved by being more specific about what aspects of the role excite you and how they align with your career goals.",
      audioUrl: null,
    },
    {
      id: 3,
      question: "Describe a challenging project you've worked on. What was your role?",
      score: 80,
      answer: "I worked on a large-scale data migration project...",
      feedback: "Strong answer with good use of the STAR method. You clearly explained the situation, your role, the actions you took, and the results. Great job!",
      audioUrl: null,
    },
    {
      id: 4,
      question: "What technical skills do you feel are most relevant to this role?",
      score: 75,
      answer: "Based on the job description, I believe my experience with...",
      feedback: "You demonstrated good technical knowledge. To improve, provide specific examples of how you've used these skills in real projects.",
      audioUrl: null,
    },
    {
      id: 5,
      question: "How do you handle working under pressure and tight deadlines?",
      score: 78,
      answer: "I prioritize tasks and communicate regularly with my team...",
      feedback: "Good answer showing self-awareness. Adding a specific example of a time you successfully managed a high-pressure situation would make this even stronger.",
      audioUrl: null,
    },
  ];

  const toggleAudioPlayback = (questionId) => {
    setAudioPlaying(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));

    // Simulate audio progress
    if (!audioPlaying[questionId]) {
      const interval = setInterval(() => {
        setAudioProgress(prev => {
          const current = prev[questionId] || 0;
          if (current >= 100) {
            clearInterval(interval);
            setAudioPlaying(p => ({ ...p, [questionId]: false }));
            return { ...prev, [questionId]: 0 };
          }
          return { ...prev, [questionId]: current + 5 };
        });
      }, 200);
    }
  };

  const downloadReport = () => {
    // Simulate download
    alert("Report download would start here. This would generate a PDF with your complete feedback.");
  };

  const shareResults = () => {
    // Simulate share
    alert("Share functionality would allow you to share your results via email or social media.");
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
        </div>
      </nav>

      {/* Step Indicator */}
      <StepIndicator currentStep={3} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4">Your Interview Feedback</h1>
          <p className="text-lg text-muted-foreground">
            Here's a comprehensive analysis of your performance
          </p>
        </motion.div>

        {/* Overall Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-2">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary mb-2">
                    {overallScore}
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    out of 100
                  </div>
                  <Progress value={overallScore} className="h-3" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Duration</span>
                    <span className="font-medium">{duration}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Questions</span>
                    <span className="font-medium">{questionsAnswered}/{totalQuestions}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Performance</span>
                    <Badge variant={badgeVariant}>{performanceBadge}</Badge>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button onClick={downloadReport} variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Report
                  </Button>
                  <Button onClick={shareResults} variant="outline" className="w-full">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Results
                  </Button>
                  <Link href="/upload" className="w-full">
                    <Button className="w-full">
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Practice Again
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-8 mb-8"
        >
          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Question-by-Question Scores</CardTitle>
              <CardDescription>Your performance on each question</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={questionScores}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="question" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="score" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Radar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Skills Assessment</CardTitle>
              <CardDescription>Breakdown across key competencies</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={skillsData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="skill" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.5}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Strengths & Weaknesses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-8 mb-8"
        >
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {strengths.map((strength, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-sm">{strength}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-orange-500" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {weaknesses.map((weakness, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <XCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                    <span className="text-sm">{weakness}</span>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Feedback Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Detailed Feedback</CardTitle>
              <CardDescription>Question-by-question analysis with audio playback</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="q1">
                <TabsList className="grid grid-cols-5 w-full">
                  {detailedFeedback.map((item, index) => (
                    <TabsTrigger key={item.id} value={`q${item.id}`}>
                      Q{item.id}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {detailedFeedback.map((item) => (
                  <TabsContent key={item.id} value={`q${item.id}`} className="space-y-4 mt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-lg mb-2">{item.question}</h3>
                        <div className="flex items-center gap-4 mb-4">
                          <Badge variant={item.score >= 80 ? "default" : "secondary"}>
                            Score: {item.score}/100
                          </Badge>
                          <Progress value={item.score} className="flex-1 max-w-xs" />
                        </div>
                      </div>
                    </div>

                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <h4 className="font-medium text-sm mb-2">Your Answer:</h4>
                        <p className="text-sm text-muted-foreground italic">
                          {item.answer}
                        </p>
                      </CardContent>
                    </Card>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Audio Playback:</h4>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => toggleAudioPlayback(item.id)}
                            >
                              {audioPlaying[item.id] ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                            <Progress 
                              value={audioProgress[item.id] || 0} 
                              className="flex-1" 
                            />
                            <span className="text-sm text-muted-foreground">
                              {Math.round(audioProgress[item.id] || 0)}%
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <h4 className="font-medium text-sm mb-2">AI Feedback:</h4>
                        <p className="text-sm leading-relaxed">{item.feedback}</p>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-primary text-primary-foreground border-0">
            <CardContent className="p-8 text-center space-y-4">
              <h2 className="text-3xl font-bold">Great Job on Completing the Interview!</h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                Practice makes perfect. The more you practice, the more confident you'll become.
                Ready for another round?
              </p>
              <Link href="/upload">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  Start New Interview
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
