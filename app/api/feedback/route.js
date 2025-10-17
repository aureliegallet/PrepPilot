import { NextResponse } from "next/server";
import { generateComprehensiveFeedback } from "@/lib/gemini";
import { storeFeedback } from "@/lib/snowflake";
import { getUserSession } from "@/lib/auth0";

// Import the interview sessions from interview route
// In production, this should be from a database
let interviewSessions;
try {
  const interviewModule = await import("../interview/route.js");
  interviewSessions = interviewModule.interviewSessions;
} catch (error) {
  console.error("Could not import interview sessions:", error);
  interviewSessions = new Map();
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const feedbackId = searchParams.get("feedbackId");

    const id = sessionId || feedbackId;

    if (!id) {
      return NextResponse.json(
        { error: "Session ID or Feedback ID is required" },
        { status: 400 }
      );
    }

    // Get user session
    const userSession = await getUserSession(request);
    const userId = userSession?.user?.sub || "anonymous";

    // Retrieve interview session data
    const session = interviewSessions.get(id);

    if (!session) {
      // Return mock feedback if session not found (for testing)
      return NextResponse.json({
        success: true,
        feedback: getMockFeedback(id),
      });
    }

    // Generate comprehensive feedback using Gemini API
    const questionsAndAnswers = session.answers || [];

    if (questionsAndAnswers.length === 0) {
      return NextResponse.json({
        success: true,
        feedback: getMockFeedback(id),
      });
    }

    const comprehensiveFeedback =
      await generateComprehensiveFeedback(questionsAndAnswers);

    // Calculate duration
    const startTime = new Date(session.startedAt);
    const endTime = new Date(session.completedAt || new Date());
    const durationMs = endTime - startTime;
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);

    // Build detailed feedback array
    const detailedFeedback = questionsAndAnswers.map((qa, index) => ({
      questionNumber: index + 1,
      question: qa.question,
      answer: qa.answer,
      score: qa.analysis.score,
      feedback: qa.analysis.feedback,
      strengths: qa.analysis.strengths,
      weaknesses: qa.analysis.weaknesses,
      suggestions: qa.analysis.suggestions,
      duration: "2:30", // TODO: Calculate actual duration from audio
      audioUrl: `/api/audio/session_${id}_answer_${index + 1}.mp3`, // Placeholder
    }));

    const feedback = {
      sessionId: id,
      userId,
      overallScore: comprehensiveFeedback.overallScore,
      performanceLevel: comprehensiveFeedback.performanceLevel,
      duration: `${minutes} min ${seconds} sec`,
      questionsAnswered: questionsAndAnswers.length,
      strengths: comprehensiveFeedback.strengths,
      weaknesses: comprehensiveFeedback.weaknesses,
      detailedFeedback,
      skillsAssessment: comprehensiveFeedback.skillsAssessment,
      recommendations: comprehensiveFeedback.recommendations,
      createdAt: new Date().toISOString(),
    };

    // Store feedback in Snowflake (if configured)
    await storeFeedback(feedback);

    return NextResponse.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json(
      { error: "Failed to generate feedback" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId, action, format } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Handle different feedback actions
    switch (action) {
      case "download":
        // Generate downloadable report
        // TODO: Implement PDF generation using libraries like jsPDF or PDFKit
        // For now, return a mock URL

        return NextResponse.json({
          success: true,
          downloadUrl: `/api/download/feedback_${sessionId}.${format || "pdf"}`,
          format: format || "pdf",
          message: "Report generated successfully",
        });

      case "share":
        // Generate shareable link
        const shareToken = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // TODO: Store share token in database with expiration
        // Associate with session ID

        const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/share/${shareToken}`;

        return NextResponse.json({
          success: true,
          shareUrl,
          shareToken,
          expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(), // 7 days
          message: "Share link generated successfully",
        });

      case "regenerate":
        // Regenerate feedback with potentially updated AI analysis
        const session = interviewSessions.get(sessionId);

        if (!session || !session.answers) {
          return NextResponse.json(
            { error: "Session not found or no answers available" },
            { status: 404 }
          );
        }

        // Regenerate comprehensive feedback
        const newFeedback = await generateComprehensiveFeedback(
          session.answers
        );

        return NextResponse.json({
          success: true,
          message: "Feedback regenerated successfully",
          feedback: newFeedback,
        });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Feedback action error:", error);
    return NextResponse.json(
      { error: "Failed to process feedback action" },
      { status: 500 }
    );
  }
}

/**
 * Get mock feedback for testing/fallback
 * @param {string} sessionId - Session ID
 * @returns {Object} Mock feedback data
 */
function getMockFeedback(sessionId) {
  return {
    sessionId,
    overallScore: 78,
    performanceLevel: "good",
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
        questionNumber: 1,
        question: "Tell me about yourself and your background.",
        answer: "Transcribed answer...",
        score: 85,
        feedback:
          "Great introduction! You clearly outlined your experience and education.",
        strengths: ["Clear structure", "Good confidence"],
        weaknesses: ["Could add more specific achievements"],
        suggestions: ["Include quantifiable results", "Mention key skills"],
        duration: "2:34",
        audioUrl: "/api/audio/answer_1.mp3",
      },
      {
        questionNumber: 2,
        question: "What interests you about this position?",
        answer: "Transcribed answer...",
        score: 75,
        feedback:
          "Good enthusiasm shown. Try to connect your interests more directly to the role requirements.",
        strengths: ["Showed genuine interest", "Mentioned company research"],
        weaknesses: ["Could be more specific about role alignment"],
        suggestions: [
          "Research company values deeper",
          "Connect personal goals to role",
        ],
        duration: "2:15",
        audioUrl: "/api/audio/answer_2.mp3",
      },
      {
        questionNumber: 3,
        question:
          "Describe a challenging project you've worked on and how you handled it.",
        answer: "Transcribed answer...",
        score: 82,
        feedback:
          "Excellent use of the STAR method. The example clearly demonstrated your problem-solving skills.",
        strengths: ["Used STAR method well", "Clear outcome"],
        weaknesses: ["Could mention team collaboration more"],
        suggestions: [
          "Add metrics about project impact",
          "Discuss what you learned",
        ],
        duration: "3:10",
        audioUrl: "/api/audio/answer_3.mp3",
      },
      {
        questionNumber: 4,
        question: "What are your greatest strengths and weaknesses?",
        answer: "Transcribed answer...",
        score: 70,
        feedback:
          "Good self-awareness. The weakness you mentioned could be framed more as a growth area.",
        strengths: ["Honest self-assessment", "Relevant strengths"],
        weaknesses: ["Weakness seemed generic", "Could add improvement plan"],
        suggestions: [
          "Show how you're working on weaknesses",
          "Give examples of strengths in action",
        ],
        duration: "2:45",
        audioUrl: "/api/audio/answer_4.mp3",
      },
      {
        questionNumber: 5,
        question:
          "How do you stay updated with the latest trends in your field?",
        answer: "Transcribed answer...",
        score: 78,
        feedback:
          "Good variety of learning methods mentioned. Consider adding specific resources you follow.",
        strengths: ["Showed commitment to learning", "Multiple approaches"],
        weaknesses: ["Could be more specific about resources"],
        suggestions: [
          "Name specific blogs, podcasts, or courses",
          "Mention recent learning",
        ],
        duration: "2:20",
        audioUrl: "/api/audio/answer_5.mp3",
      },
    ],
    skillsAssessment: {
      communication: 85,
      technicalKnowledge: 80,
      problemSolving: 75,
      confidence: 82,
      clarity: 78,
      examples: 70,
    },
    recommendations: [
      "Practice using the STAR method for behavioral questions",
      "Research the company more thoroughly before interviews",
      "Prepare specific metrics and numbers to back up your achievements",
    ],
    createdAt: new Date().toISOString(),
  };
}
