import axios from 'axios';
import { config } from '../config';
import { CandidateEvaluation, VisualizationData } from '../types/interview.types';

export class VisualizationService {
  /**
   * Generate visualization data from candidate evaluation
   * Note: This is a mock implementation. In production, you would integrate
   * with DigitalOcean Gradient AI API or another visualization service.
   */
  async generateVisualizationData(
    evaluation: CandidateEvaluation
  ): Promise<VisualizationData> {
    try {
      // Extract skill data
      const skillLabels = evaluation.skillMatch.map((s) => s.skill);
      const requiredValues = evaluation.skillMatch.map((s) => s.required);
      const candidateValues = evaluation.skillMatch.map((s) => s.candidate);

      // Generate scorecard data (mock implementation)
      const scorecard = this.generateScorecard(evaluation);

      return {
        skillMatchChart: {
          labels: skillLabels,
          requiredValues,
          candidateValues,
        },
        scorecard,
      };
    } catch (error) {
      console.error('Error generating visualization data:', error);
      throw new Error('Failed to generate visualization data');
    }
  }

  /**
   * Generate a scorecard with category scores
   * In production, this could use AI to analyze the evaluation more deeply
   */
  private generateScorecard(evaluation: CandidateEvaluation): {
    communication: number;
    technical: number;
    cultural: number;
    experience: number;
  } {
    // Calculate scores based on overall score and available data
    const baseScore = evaluation.overallScore;

    // Mock calculation - in production, this would be more sophisticated
    return {
      communication: Math.min(100, baseScore + Math.floor(Math.random() * 10 - 5)),
      technical: Math.min(100, baseScore + Math.floor(Math.random() * 10 - 5)),
      cultural: Math.min(100, baseScore + Math.floor(Math.random() * 10 - 5)),
      experience: Math.min(100, baseScore + Math.floor(Math.random() * 10 - 5)),
    };
  }

  /**
   * Optional: Integration with DigitalOcean Gradient AI
   * Uncomment and implement when API is available
   */
  private async callDigitalOceanGradientAI(data: any): Promise<any> {
    if (!config.digitalOcean.apiKey || !config.digitalOcean.endpoint) {
      console.warn('DigitalOcean Gradient AI not configured, using mock data');
      return null;
    }

    try {
      const response = await axios.post(
        config.digitalOcean.endpoint,
        data,
        {
          headers: {
            'Authorization': `Bearer ${config.digitalOcean.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error calling DigitalOcean Gradient AI:', error);
      return null;
    }
  }
}
