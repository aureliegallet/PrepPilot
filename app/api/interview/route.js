import { NextResponse } from "next/server";
import { analyzeAnswer } from "@/lib/gemini";
import { getUserSession } from "@/lib/auth0";

// In-memory storage for interview sessions (replace with database in production)
const interviewSessions = new Map();

export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId, action, audioData, currentQuestion, answer } = body;

    // Validate request
    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Get user session
    const userSession = await getUserSession(request);
    const userId = userSession?.user?.sub || "anonymous";

    // Handle different interview actions
    switch (action) {
      case "start":
        // Initialize interview session
        if (!interviewSessions.has(sessionId)) {
          return NextResponse.json(
            { error: "Invalid session ID. Please upload files first." },
            { status: 400 }
          );
        }

        const session = interviewSessions.get(sessionId);
        session.status = "in_progress";
        session.startedAt = new Date().toISOString();

        return NextResponse.json({
          success: true,
          question: session.questions[0].question,
          questionIndex: 0,
          totalQuestions: session.questions.length,
        });

      case "submit_answer":
        // Process user's answer
        const currentSession = interviewSessions.get(sessionId);
        if (!currentSession) {
          return NextResponse.json(
            { error: "Session not found" },
            { status: 404 }
          );
        }

        const questionIndex = currentQuestion || 0;
        const question = currentSession.questions[questionIndex];

        // Transcribe audio if provided
        // TODO: Implement audio transcription using Web Speech API or Whisper
        const transcription =
          answer ||
          (await transcribeAudio(audioData)) ||
          "User's transcribed answer...";

        // Analyze the answer using Gemini API
        const analysis = await analyzeAnswer(question.question, transcription);

        // Store the answer and analysis
        if (!currentSession.answers) {
          currentSession.answers = [];
        }
        currentSession.answers.push({
          questionIndex,
          question: question.question,
          answer: transcription,
          analysis,
          timestamp: new Date().toISOString(),
        });

        // Get next question
        const nextIndex = questionIndex + 1;
        const hasMoreQuestions = nextIndex < currentSession.questions.length;

        if (hasMoreQuestions) {
          return NextResponse.json({
            success: true,
            transcription,
            analysis: {
              score: analysis.score,
              quickFeedback: analysis.feedback,
            },
            nextQuestion: currentSession.questions[nextIndex].question,
            questionIndex: nextIndex,
            totalQuestions: currentSession.questions.length,
          });
        } else {
          currentSession.status = "completed";
          currentSession.completedAt = new Date().toISOString();

          return NextResponse.json({
            success: true,
            transcription,
            analysis: {
              score: analysis.score,
              quickFeedback: analysis.feedback,
            },
            completed: true,
            message: "Interview completed! Generating your feedback...",
          });
        }

      case "pause":
        const pauseSession = interviewSessions.get(sessionId);
        if (pauseSession) {
          pauseSession.status = "paused";
          pauseSession.pausedAt = new Date().toISOString();
        }

        return NextResponse.json({
          success: true,
          message: "Interview paused",
        });

      case "resume":
        const resumeSession = interviewSessions.get(sessionId);
        if (resumeSession) {
          resumeSession.status = "in_progress";
        }

        const currentQ = resumeSession?.answers?.length || 0;
        return NextResponse.json({
          success: true,
          message: "Interview resumed",
          currentQuestion: resumeSession.questions[currentQ]?.question,
          questionIndex: currentQ,
        });

      case "end":
        const endSession = interviewSessions.get(sessionId);
        if (endSession) {
          endSession.status = "completed";
          endSession.completedAt = new Date().toISOString();
        }

        return NextResponse.json({
          success: true,
          message: "Interview completed",
          feedbackId: sessionId,
        });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Interview error:", error);
    return NextResponse.json(
      { error: "Failed to process interview action" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    const session = interviewSessions.get(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      sessionId,
      currentQuestion: session.answers?.length || 0,
      totalQuestions: session.questions?.length || 0,
      status: session.status || "pending",
    });
  } catch (error) {
    console.error("Get interview error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve interview data" },
      { status: 500 }
    );
  }
}

/**
 * Store session questions (called from upload route)
 * @param {string} sessionId - Session ID
 * @param {Array} questions - Generated questions
 */
export function storeSessionQuestions(sessionId, questions) {
  interviewSessions.set(sessionId, {
    questions,
    status: "pending",
    answers: [],
    createdAt: new Date().toISOString(),
  });
}

/**
 * Transcribe audio data
 * TODO: Implement using Web Speech API or OpenAI Whisper
 * @param {string} audioData - Base64 encoded audio
 * @returns {Promise<string>} Transcribed text
 */
async function transcribeAudio(audioData) {
  if (!audioData) {
    return null;
  }

  // Mock implementation
  // In production, integrate with:
  // - OpenAI Whisper API
  // - Google Speech-to-Text
  // - Browser's Web Speech API (client-side)

  /* Example with OpenAI Whisper:
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    model: "whisper-1",
  });
  return transcription.text;
  */

  return null;
}

// Export the sessions map for use in other routes
export { interviewSessions };
