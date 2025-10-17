import React from 'react';
import { InterviewQuestion } from '../types/interview';

interface InterviewQuestionsProps {
  questions: InterviewQuestion[];
}

export const InterviewQuestions: React.FC<InterviewQuestionsProps> = ({ questions }) => {
  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'badge-easy';
      case 'medium':
        return 'badge-medium';
      case 'hard':
        return 'badge-hard';
      default:
        return 'badge-medium';
    }
  };

  return (
    <div className="card">
      <h2>Interview Questions</h2>
      <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
        {questions.length} questions generated based on the job description and candidate profile.
      </p>
      <div>
        {questions.map((question, index) => (
          <div key={question.id} className="question-card">
            <h3>
              {index + 1}. {question.question}
            </h3>
            <div>
              <span className={`badge ${getDifficultyClass(question.difficulty)}`}>
                {question.difficulty}
              </span>
              <span className="badge badge-category">{question.category}</span>
              <span className="badge" style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>
                {question.skillArea}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
