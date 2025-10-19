import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId, resumeText, jobDescriptionText } = body;

    if (!sessionId || !resumeText || !jobDescriptionText) {
      return NextResponse.json(
        { error: "Session ID, resume text, and job description text are required" },
        { status: 400 }
      );
    }

    // Validate sessionId to prevent prototype pollution
    if (typeof sessionId !== 'string' || sessionId.includes('__proto__') || sessionId.includes('prototype') || sessionId.includes('constructor')) {
      return NextResponse.json(
        { error: "Invalid session ID" },
        { status: 400 }
      );
    }

    // Generate interview questions using Gemini AI
    let questions = [];

    if (!genAI) {
      return NextResponse.json(
        { error: "Gemini API key not configured. Please add GEMINI_API_KEY to your .env.local file." },
        { status: 500 }
      );
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const prompt = `Based on the following resume and job description, generate 7-10 relevant interview questions.
      
Resume:
${resumeText.substring(0, 3000)}

Job Description:
${jobDescriptionText.substring(0, 2000)}

Please generate questions that:
1. Test technical skills mentioned in the job description
2. Assess experience related to the resume
3. Evaluate problem-solving abilities
4. Check cultural fit
5. Are open-ended and require detailed answers

Format the output as a JSON array of objects with the following structure:
[
  {
    "id": 1,
    "question": "question text here",
    "category": "technical|behavioral|experience|problem-solving"
  }
]

Return ONLY the JSON array, no additional text.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Try to parse the JSON response
      try {
        // Extract JSON from the response (handle markdown code blocks)
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          questions = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("No JSON array found in response");
        }
      } catch (parseError) {
        console.error("Error parsing Gemini response:", parseError);
        return NextResponse.json(
          { error: "Failed to generate questions. Please try again." },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error("Gemini API error:", error);
      return NextResponse.json(
        { error: "Failed to generate questions using AI. Please check your API key and try again." },
        { status: 500 }
      );
    }

    // Get or create session data
    const sessions = global.sessions || {};
    if (!global.sessions) {
      global.sessions = Object.create(null);
    }

    // Update session with questions and reviewed text
    if (!Object.prototype.hasOwnProperty.call(sessions, sessionId)) {
      global.sessions[sessionId] = {
        sessionId,
        createdAt: new Date().toISOString(),
      };
    }

    global.sessions[sessionId].resumeText = resumeText.substring(0, 5000);
    global.sessions[sessionId].jobDescriptionText = jobDescriptionText.substring(0, 3000);
    global.sessions[sessionId].questions = questions;

    return NextResponse.json({
      success: true,
      sessionId,
      questionCount: questions.length,
      questions,
      message: "Questions generated successfully",
    });
  } catch (error) {
    console.error("Generate questions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
