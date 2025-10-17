import { FC } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from 'chart.js';
import { Bar, Radar } from 'react-chartjs-2';
import { CandidateEvaluation, VisualizationData } from '../types/interview';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

interface CandidateEvaluationProps {
  evaluation: CandidateEvaluation;
  visualData?: VisualizationData;
  onDownload: () => void;
}

export const CandidateEvaluationComponent: FC<CandidateEvaluationProps> = ({
  evaluation,
  visualData,
  onDownload,
}) => {
  const skillMatchData = visualData?.skillMatchChart
    ? {
        labels: visualData.skillMatchChart.labels,
        datasets: [
          {
            label: 'Required',
            data: visualData.skillMatchChart.requiredValues,
            backgroundColor: 'rgba(79, 70, 229, 0.5)',
            borderColor: 'rgba(79, 70, 229, 1)',
            borderWidth: 1,
          },
          {
            label: 'Candidate',
            data: visualData.skillMatchChart.candidateValues,
            backgroundColor: 'rgba(16, 185, 129, 0.5)',
            borderColor: 'rgba(16, 185, 129, 1)',
            borderWidth: 1,
          },
        ],
      }
    : null;

  const scorecardData = visualData?.scorecard
    ? {
        labels: ['Communication', 'Technical', 'Cultural Fit', 'Experience'],
        datasets: [
          {
            label: 'Scores',
            data: [
              visualData.scorecard.communication,
              visualData.scorecard.technical,
              visualData.scorecard.cultural,
              visualData.scorecard.experience,
            ],
            backgroundColor: 'rgba(79, 70, 229, 0.2)',
            borderColor: 'rgba(79, 70, 229, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(79, 70, 229, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(79, 70, 229, 1)',
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="card">
      <h2>Candidate Evaluation</h2>

      <div className="score-display">
        <h3>{evaluation.overallScore}%</h3>
        <p>Overall Match Score</p>
      </div>

      {scorecardData && (
        <div className="chart-container">
          <h3 style={{ marginBottom: '1rem' }}>Scorecard</h3>
          <Radar data={scorecardData} options={radarOptions} />
        </div>
      )}

      {skillMatchData && skillMatchData.labels.length > 0 && (
        <div className="chart-container">
          <h3 style={{ marginBottom: '1rem' }}>Skill Match Analysis</h3>
          <Bar data={skillMatchData} options={chartOptions} />
        </div>
      )}

      <div className="grid grid-2" style={{ marginTop: '1.5rem' }}>
        <div className="list-section">
          <h3 style={{ color: 'var(--secondary-color)' }}>Strengths</h3>
          <ul>
            {evaluation.strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>

        <div className="list-section">
          <h3 style={{ color: 'var(--danger-color)' }}>Areas for Improvement</h3>
          <ul>
            {evaluation.weaknesses.map((weakness, index) => (
              <li key={index}>{weakness}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="list-section">
        <h3>Recommendations</h3>
        <ul>
          {evaluation.recommendations.map((recommendation, index) => (
            <li key={index}>{recommendation}</li>
          ))}
        </ul>
      </div>

      <div className="list-section">
        <h3>Summary</h3>
        <p>{evaluation.summary}</p>
      </div>

      <div className="button-group" style={{ marginTop: '1.5rem' }}>
        <button className="button button-primary" onClick={onDownload}>
          Download Report
        </button>
        <button
          className="button button-secondary"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Interview Evaluation',
                text: `Candidate scored ${evaluation.overallScore}% overall match`,
              });
            }
          }}
        >
          Share
        </button>
      </div>
    </div>
  );
};
