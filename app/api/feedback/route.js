import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

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

    // Get session data
    const session = global.sessions?.[sessionId];
    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Generate feedback using Gemini AI or use mock data
    let feedback;
    
    if (genAI && session.answers && session.answers.length > 0) {
      feedback = await generateAIFeedback(session);
    } else {
      feedback = generateMockFeedback(session);
    }

    return NextResponse.json({
      success: true,
      ...feedback,
    });
  } catch (error) {
    console.error("Feedback API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function generateAIFeedback(session) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Prepare answers summary
    const answersText = session.answers
      .map((a, i) => `Question ${i + 1}: ${session.questions[i]?.question}\nAnswer: ${a.answer}`)
      .join("\n\n");

    const prompt = `Analyze the following interview responses and provide detailed feedback.

${answersText}

Please provide:
1. An overall score (0-100)
2. Scores for individual questions (0-100)
3. Strengths (list of 3-4 points)
4. Areas for improvement (list of 3-4 points)
5. Detailed feedback for each question

Format the response as JSON with this structure:
{
  "overallScore": number,
  "questionScores": [{"question": "Q1", "score": number}, ...],
  "skillsData": [{"skill": "Technical", "score": number}, ...],
  "strengths": ["strength 1", ...],
  "weaknesses": ["weakness 1", ...],
  "detailedFeedback": [{"id": 1, "score": number, "feedback": "text"}, ...]
}

Return ONLY the JSON, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse the JSON response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error("Error parsing Gemini feedback:", parseError);
    }
  } catch (error) {
    console.error("Gemini API error in feedback:", error);
  }

  // Fall back to mock data if AI fails
  return generateMockFeedback(session);
}

function generateMockFeedback(session) {
  const numQuestions = session.questions?.length || 5;
  
  // Generate question scores
  const questionScores = Array.from({ length: numQuestions }, (_, i) => ({
    question: `Q${i + 1}`,
    score: Math.floor(70 + Math.random() * 25), // Random score between 70-95
  }));

  // Calculate overall score as average
  const overallScore = Math.round(
    questionScores.reduce((sum, q) => sum + q.score, 0) / questionScores.length
  );

  // Skills data
  const skillsData = [
    { skill: "Technical", score: Math.floor(75 + Math.random() * 20) },
    { skill: "Communication", score: Math.floor(70 + Math.random() * 20) },
    { skill: "Problem Solving", score: Math.floor(75 + Math.random() * 20) },
    { skill: "Experience", score: Math.floor(70 + Math.random() * 20) },
    { skill: "Cultural Fit", score: Math.floor(65 + Math.random() * 25) },
    { skill: "Confidence", score: Math.floor(75 + Math.random() * 20) },
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

  const detailedFeedback = session.questions?.map((q, i) => ({
    id: q.id,
    question: q.question,
    score: questionScores[i]?.score || 75,
    answer: session.answers?.[i]?.answer || "Answer not recorded",
    feedback: generateQuestionFeedback(q, questionScores[i]?.score || 75),
  })) || [];

  return {
    overallScore,
    duration: "18 minutes",
    questionsAnswered: numQuestions,
    totalQuestions: numQuestions,
    questionScores,
    skillsData,
    strengths,
    weaknesses,
    detailedFeedback,
  };
}

function generateQuestionFeedback(question, score) {
  if (score >= 85) {
    return `Excellent answer! You demonstrated strong understanding and provided clear, relevant examples. Your response was well-structured and comprehensive.`;
  } else if (score >= 75) {
    return `Good answer overall. You covered the main points, but could strengthen your response with more specific examples or additional details.`;
  } else if (score >= 65) {
    return `Decent response, but there's room for improvement. Consider using the STAR method (Situation, Task, Action, Result) to structure your answer more effectively.`;
  } else {
    return `This answer needs work. Try to be more specific and provide concrete examples from your experience. Practice articulating your thoughts more clearly.`;
  }
}
