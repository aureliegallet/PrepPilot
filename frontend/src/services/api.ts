import axios from 'axios';
import { InterviewRequest, InterviewResponse } from '../types/interview';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const interviewService = {
  async generateInterview(request: InterviewRequest): Promise<InterviewResponse> {
    try {
      const response = await axios.post<InterviewResponse>(
        `${API_URL}/api/interview/generate`,
        request,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to generate interview');
      }
      throw new Error('An unexpected error occurred');
    }
  },

  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${API_URL}/api/interview/health`);
      return response.status === 200;
    } catch {
      return false;
    }
  },
};
