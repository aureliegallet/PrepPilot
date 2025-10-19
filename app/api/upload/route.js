import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Helper function to extract text from file buffer
async function extractTextFromFile(file) {
  const buffer = await file.arrayBuffer();
  const text = Buffer.from(buffer).toString("utf-8");
  
  // For PDF and DOCX, we'd normally use a proper parser
  // For this demo, we'll treat all as text files
  // In production, use libraries like pdf-parse or mammoth for proper extraction
  return text;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const resume = formData.get("resume");
    const jobDescription = formData.get("jobDescription");

    if (!resume || !jobDescription) {
      return NextResponse.json(
        { error: "Both resume and job description are required" },
        { status: 400 }
      );
    }

    // Validate file sizes (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (resume.size > maxSize || jobDescription.size > maxSize) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    // Extract text from files
    let resumeText, jobDescriptionText;
    try {
      resumeText = await extractTextFromFile(resume);
      jobDescriptionText = await extractTextFromFile(jobDescription);
    } catch (error) {
      console.error("Error extracting text:", error);
      return NextResponse.json(
        { error: "Failed to process files. Please ensure they are valid text-based documents." },
        { status: 400 }
      );
    }

    // Generate interview questions using Gemini AI
    let questions = [];
    let sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    if (genAI) {
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
          }
        } catch (parseError) {
          console.error("Error parsing Gemini response:", parseError);
          // Fall back to default questions
          questions = generateDefaultQuestions();
        }
      } catch (error) {
        console.error("Gemini API error:", error);
        // Fall back to default questions
        questions = generateDefaultQuestions();
      }
    } else {
      // No API key, use default questions
      console.log("No Gemini API key found, using default questions");
      questions = generateDefaultQuestions();
    }

    // Store session data (in production, use a database)
    // For now, we'll use in-memory storage or rely on client-side sessionStorage
    const sessionData = {
      sessionId,
      resumeText: resumeText.substring(0, 5000),
      jobDescriptionText: jobDescriptionText.substring(0, 3000),
      questions,
      createdAt: new Date().toISOString(),
    };

    // In production, store this in a database
    // For demo purposes, we'll return it to the client
    if (typeof global.sessions === "undefined") {
      global.sessions = {};
    }
    global.sessions[sessionId] = sessionData;

    return NextResponse.json({
      success: true,
      sessionId,
      questionCount: questions.length,
      message: "Files uploaded and processed successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateDefaultQuestions() {
  return [
    {
      id: 1,
      question: "Can you tell me about yourself and your professional background?",
      category: "experience"
    },
    {
      id: 2,
      question: "What interests you most about this position and our company?",
      category: "behavioral"
    },
    {
      id: 3,
      question: "Describe a challenging project you've worked on. What was your role and how did you overcome obstacles?",
      category: "problem-solving"
    },
    {
      id: 4,
      question: "What technical skills from your resume do you feel are most relevant to this role?",
      category: "technical"
    },
    {
      id: 5,
      question: "How do you stay updated with the latest trends and technologies in your field?",
      category: "technical"
    },
    {
      id: 6,
      question: "Tell me about a time when you had to work with a difficult team member. How did you handle it?",
      category: "behavioral"
    },
    {
      id: 7,
      question: "Where do you see yourself in 5 years, and how does this role fit into your career goals?",
      category: "experience"
    }
  ];
}
