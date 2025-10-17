import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';
import {
  InterviewRequest,
  InterviewQuestion,
  CandidateEvaluation,
  SkillMatch,
} from '../types/interview.types';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model;

  constructor() {
    this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  async generateInterviewQuestions(
    request: InterviewRequest
  ): Promise<InterviewQuestion[]> {
    const prompt = this.buildQuestionsPrompt(request);

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseQuestionsFromResponse(text);
    } catch (error) {
      console.error('Error generating interview questions:', error);
      throw new Error('Failed to generate interview questions');
    }
  }

  async generateCandidateEvaluation(
    request: InterviewRequest
  ): Promise<CandidateEvaluation> {
    const prompt = this.buildEvaluationPrompt(request);

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseEvaluationFromResponse(text);
    } catch (error) {
      console.error('Error generating candidate evaluation:', error);
      throw new Error('Failed to generate candidate evaluation');
    }
  }

  private buildQuestionsPrompt(request: InterviewRequest): string {
    const { jobDescription, resume, metrics } = request;

    const metricsText = this.buildMetricsText(metrics);

    return `You are an expert HR professional and technical interviewer. Based on the following job description and candidate resume, generate a comprehensive set of interview questions.

Job Description:
${jobDescription}

Candidate Resume:
${resume}

Focus Areas:
${metricsText}

Please generate 8-12 relevant interview questions covering the selected focus areas. For each question, provide:
1. The question text
2. Category (e.g., Technical, Behavioral, Cultural)
3. Skill area it assesses
4. Difficulty level (easy, medium, or hard)

Format your response as a JSON array with this structure:
[
  {
    "question": "question text",
    "category": "category name",
    "skillArea": "skill area",
    "difficulty": "easy|medium|hard"
  }
]

Only return the JSON array, no additional text.`;
  }

  private buildEvaluationPrompt(request: InterviewRequest): string {
    const { jobDescription, resume, metrics } = request;

    const metricsText = this.buildMetricsText(metrics);

    return `You are an expert HR professional evaluating a candidate's resume against a job description.

Job Description:
${jobDescription}

Candidate Resume:
${resume}

Evaluation Criteria:
${metricsText}

Please provide a comprehensive evaluation including:
1. Overall match score (0-100)
2. Skill matches with required vs candidate levels (0-100 for each skill)
3. Top 3-5 strengths
4. Top 3-5 weaknesses or gaps
5. Recommendations for the hiring decision
6. A brief summary

Format your response as JSON with this structure:
{
  "overallScore": 85,
  "skillMatch": [
    {"skill": "JavaScript", "required": 90, "candidate": 85}
  ],
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "summary": "Brief summary of the evaluation"
}

Only return the JSON object, no additional text.`;
  }

  private buildMetricsText(metrics: any): string {
    const selected = [];
    if (metrics.communicationSkills) selected.push('Communication Skills');
    if (metrics.technicalSkills) selected.push('Technical Skills');
    if (metrics.culturalFit) selected.push('Cultural Fit');
    if (metrics.experienceLevel) selected.push('Experience Level');

    return selected.length > 0
      ? selected.join(', ')
      : 'General competency assessment';
  }

  private parseQuestionsFromResponse(text: string): InterviewQuestion[] {
    try {
      // Remove markdown code blocks if present
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const questions = JSON.parse(cleanedText);

      return questions.map((q: any, index: number) => ({
        id: `q-${index + 1}`,
        question: q.question,
        category: q.category,
        skillArea: q.skillArea,
        difficulty: q.difficulty,
      }));
    } catch (error) {
      console.error('Error parsing questions response:', error);
      // Return fallback questions
      return this.getFallbackQuestions();
    }
  }

  private parseEvaluationFromResponse(text: string): CandidateEvaluation {
    try {
      // Remove markdown code blocks if present
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const evaluation = JSON.parse(cleanedText);

      return {
        overallScore: evaluation.overallScore || 0,
        skillMatch: evaluation.skillMatch || [],
        strengths: evaluation.strengths || [],
        weaknesses: evaluation.weaknesses || [],
        recommendations: evaluation.recommendations || [],
        summary: evaluation.summary || '',
      };
    } catch (error) {
      console.error('Error parsing evaluation response:', error);
      return this.getFallbackEvaluation();
    }
  }

  private getFallbackQuestions(): InterviewQuestion[] {
    return [
      {
        id: 'q-1',
        question: 'Tell me about your most challenging project and how you overcame obstacles.',
        category: 'Behavioral',
        skillArea: 'Problem Solving',
        difficulty: 'medium',
      },
      {
        id: 'q-2',
        question: 'How do you stay updated with the latest technologies in your field?',
        category: 'Technical',
        skillArea: 'Continuous Learning',
        difficulty: 'easy',
      },
      {
        id: 'q-3',
        question: 'Describe a situation where you had to work with a difficult team member.',
        category: 'Behavioral',
        skillArea: 'Communication',
        difficulty: 'medium',
      },
    ];
  }

  private getFallbackEvaluation(): CandidateEvaluation {
    return {
      overallScore: 0,
      skillMatch: [],
      strengths: ['Unable to evaluate at this time'],
      weaknesses: ['Unable to evaluate at this time'],
      recommendations: ['Please try again with valid API credentials'],
      summary: 'Evaluation could not be completed due to an error.',
    };
  }
}
