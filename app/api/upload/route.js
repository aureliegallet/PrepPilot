import { NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

// Helper function to extract text from file buffer
async function extractTextFromFile(file) {
  const buffer = await file.arrayBuffer();
  const nodeBuffer = Buffer.from(buffer);
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  try {
    // Handle PDF files
    if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
      const pdfParse = new PDFParse();
      const data = await pdfParse.parse(nodeBuffer);
      return data.text;
    }
    
    // Handle DOCX files
    if (
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileName.endsWith(".docx")
    ) {
      const result = await mammoth.extractRawText({ buffer: nodeBuffer });
      return result.value;
    }
    
    // Handle DOC files (limited support, try as text)
    if (fileType === "application/msword" || fileName.endsWith(".doc")) {
      // DOC files are binary format, mammoth doesn't support them well
      // Fall back to text extraction
      const text = nodeBuffer.toString("utf-8");
      // Clean up binary characters
      return text.replace(/[\x00-\x1F\x7F-\x9F]/g, " ").trim();
    }
    
    // Handle plain text files
    if (fileType === "text/plain" || fileName.endsWith(".txt")) {
      return nodeBuffer.toString("utf-8");
    }
    
    // Default: try to extract as text
    return nodeBuffer.toString("utf-8");
  } catch (error) {
    console.error("Error in extractTextFromFile:", error);
    // Fall back to plain text extraction
    return nodeBuffer.toString("utf-8");
  }
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

    // Use crypto.randomUUID() for secure random session ID generation
    let sessionId = `session_${Date.now()}_${crypto.randomUUID()}`;

    // Store session data (in production, use a database)
    // For now, we'll use in-memory storage or rely on client-side sessionStorage
    const sessionData = {
      sessionId,
      resumeText: resumeText.substring(0, 5000),
      jobDescriptionText: jobDescriptionText.substring(0, 3000),
      createdAt: new Date().toISOString(),
    };

    // In production, store this in a database
    // For demo purposes, we'll use in-memory storage with Object.create(null) to prevent prototype pollution
    if (typeof global.sessions === "undefined") {
      global.sessions = Object.create(null);
    }
    global.sessions[sessionId] = sessionData;

    return NextResponse.json({
      success: true,
      sessionId,
      resumeText: resumeText.substring(0, 5000),
      jobDescriptionText: jobDescriptionText.substring(0, 3000),
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

