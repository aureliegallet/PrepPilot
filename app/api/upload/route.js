import { NextResponse } from "next/server";
import { generateInterviewQuestions } from "@/lib/gemini";
import { storeInterviewSession } from "@/lib/snowflake";
import { getUserSession } from "@/lib/auth0";

// Import interview sessions storage
let interviewSessions;
try {
  const interviewModule = await import("../interview/route.js");
  interviewSessions = interviewModule.interviewSessions;
} catch (error) {
  console.error("Could not import interview sessions:", error);
  interviewSessions = new Map();
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const resume = formData.get("resume");
    const jobDescription = formData.get("jobDescription");

    // Validate files
    if (!resume || !jobDescription) {
      return NextResponse.json(
        { error: "Both resume and job description are required" },
        { status: 400 }
      );
    }

    console.log("Resume:", resume.name, resume.size);
    console.log("Job Description:", jobDescription.name, jobDescription.size);

    // Get user session (if Auth0 is configured)
    const session = await getUserSession(request);
    const userId = session?.user?.sub || "anonymous";

    // Extract text from files
    // TODO: Implement PDF/DOCX parsing using libraries like pdf-parse or mammoth
    // For now, we'll use mock text extraction
    const resumeText = await extractTextFromFile(resume);
    const jobDescriptionText = await extractTextFromFile(jobDescription);

    // Generate interview questions using Gemini API
    const questions = await generateInterviewQuestions(
      resumeText,
      jobDescriptionText
    );

    // Create session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Store in interview sessions map
    interviewSessions.set(sessionId, {
      questions,
      status: "pending",
      answers: [],
      createdAt: new Date().toISOString(),
    });

    // Store session data in Snowflake (if configured)
    await storeInterviewSession({
      sessionId,
      userId,
      resumeData: {
        fileName: resume.name,
        fileSize: resume.size,
        text: resumeText,
      },
      jobDescription: jobDescriptionText,
      questionsGenerated: questions.length,
      questions,
    });

    // Return success response with session info
    return NextResponse.json({
      success: true,
      message: "Files uploaded successfully",
      sessionId,
      questionsGenerated: questions.length,
      questions: questions.slice(0, 5), // Return first 5 questions for the interview
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process files" },
      { status: 500 }
    );
  }
}

/**
 * Extract text from uploaded file
 * TODO: Implement actual PDF/DOCX parsing
 * Install packages: npm install pdf-parse mammoth
 * @param {File} file - Uploaded file
 * @returns {Promise<string>} Extracted text
 */
async function extractTextFromFile(file) {
  // Mock implementation - returns placeholder text
  // In production, use libraries like:
  // - pdf-parse for PDF files
  // - mammoth for DOCX files
  // - simple text reading for TXT files

  const fileType = file.type;

  if (fileType === "application/pdf") {
    /* Uncomment when pdf-parse is installed:
    const pdfParse = require('pdf-parse');
    const buffer = Buffer.from(await file.arrayBuffer());
    const data = await pdfParse(buffer);
    return data.text;
    */
    return `[PDF Content] Mock resume/job description text from ${file.name}. This would contain the actual extracted text from the PDF file in production.`;
  } else if (
    fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileType === "application/msword"
  ) {
    /* Uncomment when mammoth is installed:
    const mammoth = require('mammoth');
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
    */
    return `[DOCX Content] Mock resume/job description text from ${file.name}. This would contain the actual extracted text from the DOCX file in production.`;
  } else if (fileType === "text/plain") {
    const text = await file.text();
    return text;
  }

  return `Mock text content from ${file.name}`;
}
