"use client";

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
import {
  Upload,
  MessageSquare,
  BarChart3,
  Plane,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      icon: Upload,
      title: "Upload Documents",
      description:
        "Upload your resume and job description to get started with personalized interview questions.",
    },
    {
      icon: MessageSquare,
      title: "AI-Powered Interview",
      description:
        "Practice with our AI interviewer that adapts to your responses in real-time.",
    },
    {
      icon: BarChart3,
      title: "Detailed Feedback",
      description:
        "Get comprehensive feedback on your performance with actionable insights.",
    },
  ];

  const benefits = [
    "Personalized interview questions based on your resume and job description",
    "Real-time voice interaction with AI interviewer",
    "Detailed performance analytics and scoring",
    "Review your answers with audio playback",
    "Practice as many times as you want",
    "Improve confidence and interview skills",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <Plane className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">PrepPilot</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href="/upload">
              <Button variant="outline">Get Started</Button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 sm:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="secondary" className="mb-4">
              <Plane className="h-3 w-3 mr-1" />
              Your Interview Copilot
            </Badge>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
              Navigate Your Next Interview with{" "}
              <span className="text-primary">Confidence</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Let PrepPilot be your guide. Upload your resume and job description,
              and we'll help you chart a course to interview success.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/upload">
              <Button size="lg" className="text-lg px-8 group">
                Start Practicing
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to improve your interview skills
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors h-full">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="outline" className="font-mono">
                      Step {index + 1}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mt-4">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose PrepPilot?
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to ace your next interview
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Card className="bg-primary text-primary-foreground border-0">
            <CardContent className="pt-6 text-center space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Ready to Ace Your Interview?
              </h2>
              <p className="text-lg opacity-90">
                Join thousands of candidates who have improved their interview
                skills with our AI-powered platform.
              </p>
              <Link href="/upload">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 group"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2025 PrepPilot. Built with Next.js and shadcn/ui.</p>
        </div>
      </footer>
    </div>
  );
}
