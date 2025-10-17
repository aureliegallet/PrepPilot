import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

/**
 * Generate interview questions based on resume and job description
 * @param {string} resumeText - Extracted text from resume
 * @param {string} jobDescriptionText - Job description text
 * @returns {Promise<Array>} Array of interview questions
 */
export async function generateInterviewQuestions(
  resumeText,
  jobDescriptionText
) {
  if (!genAI) {
    console.warn("Gemini API key not configured, using mock questions");
    return getMockQuestions();
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are an expert AI interviewer. Based on the following resume and job description, generate 10 relevant interview questions that would help assess the candidate's fit for this role.

Resume:
${resumeText}

Job Description:
${jobDescriptionText}

Generate 10 interview questions in JSON format as an array of objects with "id", "question", and "category" fields. Categories should be: "behavioral", "technical", "experience", or "situational".

Return only valid JSON, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback to mock questions if parsing fails
    console.warn("Failed to parse Gemini response, using mock questions");
    return getMockQuestions();
  } catch (error) {
    console.error("Error generating questions with Gemini:", error);
    return getMockQuestions();
  }
}

/**
 * Analyze interview answer and provide feedback
 * @param {string} question - The interview question
 * @param {string} answer - The candidate's answer
 * @returns {Promise<Object>} Feedback with score and suggestions
 */
export async function analyzeAnswer(question, answer) {
  if (!genAI) {
    console.warn("Gemini API key not configured, using mock analysis");
    return getMockAnalysis();
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `You are an expert interview coach. Analyze the following interview question and answer:

Question: ${question}

Answer: ${answer}

Provide a detailed analysis in JSON format with the following fields:
- score: number from 0-100
- strengths: array of specific strengths (2-3 items)
- weaknesses: array of areas for improvement (1-2 items)
- feedback: detailed constructive feedback (2-3 sentences)
- suggestions: array of actionable suggestions (2-3 items)

Return only valid JSON, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback to mock analysis
    console.warn("Failed to parse Gemini response, using mock analysis");
    return getMockAnalysis();
  } catch (error) {
    console.error("Error analyzing answer with Gemini:", error);
    return getMockAnalysis();
  }
}

/**
 * Generate comprehensive interview feedback
 * @param {Array} questionsAndAnswers - Array of {question, answer, analysis}
 * @returns {Promise<Object>} Comprehensive feedback report
 */
export async function generateComprehensiveFeedback(questionsAndAnswers) {
  if (!genAI) {
    console.warn("Gemini API key not configured, using mock feedback");
    return getMockFeedback(questionsAndAnswers);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const interviewSummary = questionsAndAnswers
      .map(
        (qa, idx) =>
          `Q${idx + 1}: ${qa.question}\nA${idx + 1}: ${qa.answer}\nScore: ${qa.analysis.score}/100`
      )
      .join("\n\n");

    const prompt = `You are an expert interview coach. Based on this complete interview session, provide comprehensive feedback:

${interviewSummary}

Generate a comprehensive feedback report in JSON format with:
- overallScore: average score (0-100)
- performanceLevel: "excellent", "good", "fair", or "needs_improvement"
- strengths: array of top 4-5 overall strengths
- weaknesses: array of top 3-4 areas for improvement
- skillsAssessment: object with scores (0-100) for: communication, technicalKnowledge, problemSolving, confidence, clarity, examples
- recommendations: array of 3-5 actionable recommendations

Return only valid JSON, no additional text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback to mock feedback
    console.warn("Failed to parse Gemini response, using mock feedback");
    return getMockFeedback(questionsAndAnswers);
  } catch (error) {
    console.error("Error generating feedback with Gemini:", error);
    return getMockFeedback(questionsAndAnswers);
  }
}

// Mock data functions for fallback
function getMockQuestions() {
  return [
    {
      id: 1,
      question: "Tell me about yourself and your background.",
      category: "behavioral",
    },
    {
      id: 2,
      question: "What interests you about this position?",
      category: "behavioral",
    },
    {
      id: 3,
      question:
        "Describe a challenging project you've worked on and how you handled it.",
      category: "experience",
    },
    {
      id: 4,
      question: "What are your greatest strengths and weaknesses?",
      category: "behavioral",
    },
    {
      id: 5,
      question:
        "How do you stay updated with the latest trends in your field?",
      category: "technical",
    },
    {
      id: 6,
      question: "Tell me about a time you had to work with a difficult team member.",
      category: "situational",
    },
    {
      id: 7,
      question: "Where do you see yourself in 5 years?",
      category: "behavioral",
    },
    {
      id: 8,
      question: "Describe your ideal work environment.",
      category: "behavioral",
    },
    {
      id: 9,
      question: "How do you handle tight deadlines and pressure?",
      category: "situational",
    },
    {
      id: 10,
      question: "Why should we hire you?",
      category: "behavioral",
    },
  ];
}

function getMockAnalysis() {
  return {
    score: Math.floor(Math.random() * 30) + 65, // 65-95
    strengths: [
      "Clear and structured response",
      "Good use of specific examples",
      "Professional communication style",
    ],
    weaknesses: [
      "Could provide more quantifiable metrics",
      "Answer could be more concise",
    ],
    feedback:
      "Your answer demonstrates good understanding and experience. Consider adding specific numbers or metrics to strengthen your response. Overall, well-articulated and relevant to the question.",
    suggestions: [
      "Use the STAR method (Situation, Task, Action, Result) for more structure",
      "Include specific metrics or outcomes where possible",
      "Practice being more concise while maintaining detail",
    ],
  };
}

function getMockFeedback(questionsAndAnswers) {
  const avgScore =
    questionsAndAnswers.reduce((sum, qa) => sum + (qa.analysis?.score || 75), 0) /
    questionsAndAnswers.length;

  return {
    overallScore: Math.round(avgScore),
    performanceLevel:
      avgScore >= 85
        ? "excellent"
        : avgScore >= 70
          ? "good"
          : avgScore >= 60
            ? "fair"
            : "needs_improvement",
    strengths: [
      "Clear and confident communication",
      "Good examples of past experience",
      "Strong technical knowledge",
      "Professional demeanor throughout the interview",
    ],
    weaknesses: [
      "Could provide more specific metrics in answers",
      "Some answers were too brief",
      "Missed opportunity to discuss team collaboration in depth",
    ],
    skillsAssessment: {
      communication: Math.round(avgScore + Math.random() * 10 - 5),
      technicalKnowledge: Math.round(avgScore + Math.random() * 10 - 5),
      problemSolving: Math.round(avgScore + Math.random() * 10 - 5),
      confidence: Math.round(avgScore + Math.random() * 10 - 5),
      clarity: Math.round(avgScore + Math.random() * 10 - 5),
      examples: Math.round(avgScore + Math.random() * 10 - 5),
    },
    recommendations: [
      "Practice using the STAR method for behavioral questions",
      "Research the company more thoroughly before interviews",
      "Prepare specific metrics and numbers to back up your achievements",
      "Work on being more concise while maintaining substance",
      "Develop more compelling stories about team collaboration",
    ],
  };
}
