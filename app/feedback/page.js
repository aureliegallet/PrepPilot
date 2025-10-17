"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { StepIndicator } from "@/components/StepIndicator";
import {
  Sparkles,
  Download,
  Share2,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  Play,
  Pause,
  Home,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

// Mock feedback data
const mockFeedback = {
  overallScore: 78,
  duration: "15 min 23 sec",
  questionsAnswered: 5,
  strengths: [
    "Clear and confident communication",
    "Good examples of past experience",
    "Strong technical knowledge",
    "Professional demeanor",
  ],
  weaknesses: [
    "Could provide more specific metrics in answers",
    "Some answers were too brief",
    "Missed opportunity to discuss team collaboration",
  ],
  detailedFeedback: [
    {
      question: "Tell me about yourself and your background.",
      score: 85,
      feedback:
        "Great introduction! You clearly outlined your experience and education. Consider adding more about what motivates you professionally.",
      duration: "2:34",
    },
    {
      question: "What interests you about this position?",
      score: 75,
      feedback:
        "Good answer, but could be more specific about how your skills match the role requirements. Research the company more thoroughly.",
      duration: "1:45",
    },
    {
      question: "Can you describe a challenging project you've worked on?",
      score: 82,
      feedback:
        "Excellent use of the STAR method. The example was relevant and showed problem-solving skills. Could include more about the team dynamics.",
      duration: "3:12",
    },
    {
      question: "How do you handle tight deadlines and pressure?",
      score: 70,
      feedback:
        "The answer was a bit generic. Provide a specific example with measurable outcomes to make your response more compelling.",
      duration: "1:56",
    },
    {
      question: "Where do you see yourself in five years?",
      score: 78,
      feedback:
        "Good balance between ambition and realism. Consider tying your goals more directly to the company's growth trajectory.",
      duration: "2:18",
    },
  ],
};

const performanceData = mockFeedback.detailedFeedback.map((item, index) => ({
  question: `Q${index + 1}`,
  score: item.score,
}));

const skillsData = [
  { skill: "Communication", score: 85 },
  { skill: "Technical Knowledge", score: 80 },
  { skill: "Problem Solving", score: 75 },
  { skill: "Confidence", score: 82 },
  { skill: "Clarity", score: 78 },
  { skill: "Examples", score: 70 },
];

const chartConfig = {
  score: {
    label: "Score",
    color: "hsl(var(--primary))",
  },
};

export default function FeedbackPage() {
  const [playingAudio, setPlayingAudio] = useState(null);

  const handleDownload = () => {
    toast.success("Downloading feedback report...");
    // Implement download logic
  };

  const handleShare = () => {
    toast.success("Share link copied to clipboard!");
    // Implement share logic
  };

  const toggleAudio = (index) => {
    if (playingAudio === index) {
      setPlayingAudio(null);
      toast.info("Audio paused");
    } else {
      setPlayingAudio(index);
      toast.success("Playing audio...");
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return { variant: "default", text: "Excellent" };
    if (score >= 60) return { variant: "secondary", text: "Good" };
    return { variant: "destructive", text: "Needs Work" };
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
          <Link href="/">
            <Button variant="outline" size="sm">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      {/* Step Indicator */}
      <StepIndicator currentStep={3} />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold">
              Interview Feedback
            </h1>
            <p className="text-lg text-muted-foreground">
              Here&apos;s your detailed performance analysis and areas for
              improvement
            </p>
          </div>

          {/* Overall Score Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-3 gap-6 items-center">
                  <div className="text-center md:text-left">
                    <p className="text-sm text-muted-foreground mb-2">
                      Overall Score
                    </p>
                    <div className="flex items-baseline gap-2 justify-center md:justify-start">
                      <span
                        className={`text-6xl font-bold ${getScoreColor(
                          mockFeedback.overallScore
                        )}`}
                      >
                        {mockFeedback.overallScore}
                      </span>
                      <span className="text-2xl text-muted-foreground">
                        /100
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Performance</span>
                      <span className="font-medium">
                        {mockFeedback.overallScore}%
                      </span>
                    </div>
                    <Progress
                      value={mockFeedback.overallScore}
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">
                        {mockFeedback.duration}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Questions:</span>
                      <span className="font-medium">
                        {mockFeedback.questionsAnswered}
                      </span>
                    </div>
                    <Badge
                      {...getScoreBadge(mockFeedback.overallScore)}
                      className="w-full justify-center"
                    >
                      {getScoreBadge(mockFeedback.overallScore).text}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button onClick={handleDownload} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
            <Button onClick={handleShare} variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Share Results
            </Button>
            <Link href="/upload">
              <Button>
                <TrendingUp className="mr-2 h-4 w-4" />
                Practice Again
              </Button>
            </Link>
          </div>

          {/* Performance Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Question-by-Question Scores</CardTitle>
                  <CardDescription>
                    Your performance on each question
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData}>
                        <XAxis dataKey="question" />
                        <YAxis domain={[0, 100]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="score"
                          fill="var(--color-score)"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Skills Assessment</CardTitle>
                  <CardDescription>
                    Breakdown of your key skills
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={skillsData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="skill" />
                        <PolarRadiusAxis domain={[0, 100]} />
                        <Radar
                          dataKey="score"
                          stroke="hsl(var(--primary))"
                          fill="hsl(var(--primary))"
                          fillOpacity={0.5}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ThumbsUp className="h-5 w-5 text-green-600" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {mockFeedback.strengths.map((strength, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        className="flex items-start gap-2"
                      >
                        <div className="mt-0.5 h-2 w-2 rounded-full bg-green-600 shrink-0" />
                        <span className="text-sm">{strength}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ThumbsDown className="h-5 w-5 text-orange-600" />
                    Areas for Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {mockFeedback.weaknesses.map((weakness, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.45 + index * 0.05 }}
                        className="flex items-start gap-2"
                      >
                        <div className="mt-0.5 h-2 w-2 rounded-full bg-orange-600 shrink-0" />
                        <span className="text-sm">{weakness}</span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Detailed Feedback */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Detailed Question Feedback</CardTitle>
                <CardDescription>
                  Review each question with audio playback and AI feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="0" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    {mockFeedback.detailedFeedback.map((_, index) => (
                      <TabsTrigger key={index} value={index.toString()}>
                        Q{index + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {mockFeedback.detailedFeedback.map((item, index) => (
                    <TabsContent
                      key={index}
                      value={index.toString()}
                      className="space-y-4"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="font-semibold mb-2">
                              {item.question}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Duration: {item.duration}</span>
                              <Badge {...getScoreBadge(item.score)}>
                                Score: {item.score}/100
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Your Answer
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleAudio(index)}
                            >
                              {playingAudio === index ? (
                                <>
                                  <Pause className="mr-2 h-3 w-3" />
                                  Pause
                                </>
                              ) : (
                                <>
                                  <Play className="mr-2 h-3 w-3" />
                                  Play Audio
                                </>
                              )}
                            </Button>
                          </div>
                          {playingAudio === index && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              className="bg-muted p-3 rounded-lg"
                            >
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1 bg-primary/20 rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-primary"
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{
                                      duration: 10,
                                      ease: "linear",
                                    }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {item.duration}
                                </span>
                              </div>
                            </motion.div>
                          )}
                        </div>

                        <Separator />

                        <div className="space-y-2">
                          <span className="text-sm font-medium">
                            AI Feedback
                          </span>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {item.feedback}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <span className="text-sm font-medium">
                            Performance
                          </span>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">
                                Score
                              </span>
                              <span className="font-medium">
                                {item.score}/100
                              </span>
                            </div>
                            <Progress value={item.score} className="h-2" />
                          </div>
                        </div>
                      </div>
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
            transition={{ delay: 0.6 }}
          >
            <Card className="bg-primary text-primary-foreground border-0">
              <CardContent className="pt-6 text-center space-y-4">
                <h3 className="text-2xl font-bold">Ready for Another Round?</h3>
                <p className="opacity-90">
                  Keep practicing to improve your scores and build confidence
                </p>
                <Link href="/upload">
                  <Button size="lg" variant="secondary">
                    Start New Interview
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
