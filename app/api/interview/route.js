import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, sessionId, answer, questionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Get session data
    const session = global.sessions?.[sessionId];
    if (!session) {
      return NextResponse.json(
        { error: "Session not found. Please upload documents first." },
        { status: 404 }
      );
    }

    switch (action) {
      case "start":
        return handleStart(session);
      
      case "submit_answer":
        return handleSubmitAnswer(session, questionId, answer);
      
      case "pause":
      case "resume":
        return NextResponse.json({ success: true, action });
      
      case "end":
        return handleEnd(session);
      
      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Interview API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function handleStart(session) {
  // Return the first question
  const questions = session.questions || [];
  
  if (questions.length === 0) {
    return NextResponse.json(
      { error: "No questions available" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    question: questions[0],
    questionNumber: 1,
    totalQuestions: questions.length,
  });
}

async function handleSubmitAnswer(session, questionId, answer) {
  // Store answer
  if (!session.answers) {
    session.answers = [];
  }

  session.answers.push({
    questionId,
    answer,
    timestamp: new Date().toISOString(),
  });

  // Get next question
  const questions = session.questions || [];
  const currentIndex = questions.findIndex(q => q.id === questionId);
  const nextIndex = currentIndex + 1;

  if (nextIndex < questions.length) {
    return NextResponse.json({
      success: true,
      nextQuestion: questions[nextIndex],
      questionNumber: nextIndex + 1,
      totalQuestions: questions.length,
      isComplete: false,
    });
  }

  // Interview complete
  return NextResponse.json({
    success: true,
    isComplete: true,
    message: "Interview completed",
  });
}

async function handleEnd(session) {
  session.completedAt = new Date().toISOString();
  
  return NextResponse.json({
    success: true,
    message: "Interview ended",
  });
}

// Simulated transcription endpoint
export async function PUT(request) {
  try {
    const formData = await request.formData();
    const audio = formData.get("audio");
    const sessionId = formData.get("sessionId");

    if (!audio || !sessionId) {
      return NextResponse.json(
        { error: "Audio file and session ID are required" },
        { status: 400 }
      );
    }

    // In production, this would use a speech-to-text service
    // For demo, return a simulated transcription
    const simulatedTranscription = "This is a simulated transcription of the user's answer. In a production environment, this would be the actual transcription from a speech-to-text service like Google Cloud Speech-to-Text or OpenAI Whisper.";

    return NextResponse.json({
      success: true,
      transcription: simulatedTranscription,
    });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Failed to transcribe audio" },
      { status: 500 }
    );
  }
}
