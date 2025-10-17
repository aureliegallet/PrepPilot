export interface InterviewRequest {
  jobDescription: string;
  resume: string;
  metrics: InterviewMetrics;
}

export interface InterviewMetrics {
  communicationSkills: boolean;
  technicalSkills: boolean;
  culturalFit: boolean;
  experienceLevel: boolean;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  skillArea: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface CandidateEvaluation {
  overallScore: number;
  skillMatch: SkillMatch[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  summary: string;
}

export interface SkillMatch {
  skill: string;
  required: number;
  candidate: number;
}

export interface InterviewResponse {
  questions: InterviewQuestion[];
  evaluation: CandidateEvaluation;
  visualData?: VisualizationData;
}

export interface VisualizationData {
  skillMatchChart: {
    labels: string[];
    requiredValues: number[];
    candidateValues: number[];
  };
  scorecard: {
    communication: number;
    technical: number;
    cultural: number;
    experience: number;
  };
}
