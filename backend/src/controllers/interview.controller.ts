import { Request, Response } from 'express';
import { GeminiService } from '../services/gemini.service';
import { VisualizationService } from '../services/visualization.service';
import { InterviewRequest, InterviewResponse } from '../types/interview.types';

export class InterviewController {
  private geminiService: GeminiService;
  private visualizationService: VisualizationService;

  constructor() {
    this.geminiService = new GeminiService();
    this.visualizationService = new VisualizationService();
  }

  /**
   * Generate interview questions and candidate evaluation
   */
  generateInterview = async (req: Request, res: Response): Promise<void> => {
    try {
      const interviewRequest: InterviewRequest = req.body;

      // Validate request
      if (!this.validateRequest(interviewRequest)) {
        res.status(400).json({
          message: 'Invalid request. Please provide jobDescription, resume, and metrics.',
          status: 400,
        });
        return;
      }

      // Generate questions and evaluation in parallel
      const [questions, evaluation] = await Promise.all([
        this.geminiService.generateInterviewQuestions(interviewRequest),
        this.geminiService.generateCandidateEvaluation(interviewRequest),
      ]);

      // Generate visualization data
      const visualData = await this.visualizationService.generateVisualizationData(
        evaluation
      );

      const response: InterviewResponse = {
        questions,
        evaluation,
        visualData,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error in generateInterview:', error);
      res.status(500).json({
        message: 'Failed to generate interview. Please try again.',
        status: 500,
      });
    }
  };

  /**
   * Health check endpoint
   */
  healthCheck = async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  };

  /**
   * Validate interview request
   */
  private validateRequest(request: InterviewRequest): boolean {
    return !!(
      request.jobDescription &&
      request.resume &&
      request.metrics &&
      typeof request.jobDescription === 'string' &&
      typeof request.resume === 'string' &&
      request.jobDescription.trim().length > 0 &&
      request.resume.trim().length > 0
    );
  }
}
