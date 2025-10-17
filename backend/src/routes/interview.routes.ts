import { Router } from 'express';
import { InterviewController } from '../controllers/interview.controller';

const router = Router();
const interviewController = new InterviewController();

/**
 * POST /api/interview/generate
 * Generate interview questions and evaluation
 */
router.post('/generate', interviewController.generateInterview);

/**
 * GET /api/interview/health
 * Health check endpoint
 */
router.get('/health', interviewController.healthCheck);

export default router;
