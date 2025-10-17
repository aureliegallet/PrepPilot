import React from 'react';
import { InterviewMetrics } from '../types/interview';

interface MetricsSelectorProps {
  metrics: InterviewMetrics;
  onMetricsChange: (metrics: InterviewMetrics) => void;
}

export const MetricsSelector: React.FC<MetricsSelectorProps> = ({
  metrics,
  onMetricsChange,
}) => {
  const handleToggle = (key: keyof InterviewMetrics) => {
    onMetricsChange({
      ...metrics,
      [key]: !metrics[key],
    });
  };

  return (
    <div className="card">
      <h2>Interview Focus Areas</h2>
      <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
        Select the areas you want to focus on during the interview:
      </p>
      <div className="checkbox-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={metrics.communicationSkills}
            onChange={() => handleToggle('communicationSkills')}
          />
          <span>Communication Skills</span>
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={metrics.technicalSkills}
            onChange={() => handleToggle('technicalSkills')}
          />
          <span>Technical Skills</span>
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={metrics.culturalFit}
            onChange={() => handleToggle('culturalFit')}
          />
          <span>Cultural Fit</span>
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={metrics.experienceLevel}
            onChange={() => handleToggle('experienceLevel')}
          />
          <span>Experience Level</span>
        </label>
      </div>
    </div>
  );
};
