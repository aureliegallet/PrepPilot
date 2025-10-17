import { useState } from 'react';
import { JobInput } from './components/JobInput';
import { MetricsSelector } from './components/MetricsSelector';
import { InterviewQuestions } from './components/InterviewQuestions';
import { CandidateEvaluationComponent } from './components/CandidateEvaluation';
import { interviewService } from './services/api';
import { InterviewMetrics, InterviewResponse } from './types/interview';
import './index.css';

function App() {
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState('');
  const [metrics, setMetrics] = useState<InterviewMetrics>({
    communicationSkills: true,
    technicalSkills: true,
    culturalFit: true,
    experienceLevel: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<InterviewResponse | null>(null);

  const handleGenerate = async () => {
    if (!jobDescription.trim() || !resume.trim()) {
      setError('Please provide both job description and resume');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await interviewService.generateInterview({
        jobDescription,
        resume,
        metrics,
      });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;

    const content = generateReportContent(result);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-report-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateReportContent = (data: InterviewResponse): string => {
    let content = 'AI INTERVIEWER REPORT\n';
    content += '='.repeat(50) + '\n\n';
    
    content += `Generated: ${new Date().toLocaleString()}\n\n`;
    
    content += 'CANDIDATE EVALUATION\n';
    content += '-'.repeat(50) + '\n';
    content += `Overall Score: ${data.evaluation.overallScore}%\n\n`;
    
    content += 'Strengths:\n';
    data.evaluation.strengths.forEach((s, i) => {
      content += `  ${i + 1}. ${s}\n`;
    });
    content += '\n';
    
    content += 'Areas for Improvement:\n';
    data.evaluation.weaknesses.forEach((w, i) => {
      content += `  ${i + 1}. ${w}\n`;
    });
    content += '\n';
    
    content += 'Recommendations:\n';
    data.evaluation.recommendations.forEach((r, i) => {
      content += `  ${i + 1}. ${r}\n`;
    });
    content += '\n';
    
    content += 'Summary:\n';
    content += data.evaluation.summary + '\n\n';
    
    content += 'INTERVIEW QUESTIONS\n';
    content += '-'.repeat(50) + '\n';
    data.questions.forEach((q, i) => {
      content += `\n${i + 1}. ${q.question}\n`;
      content += `   Category: ${q.category}\n`;
      content += `   Skill Area: ${q.skillArea}\n`;
      content += `   Difficulty: ${q.difficulty}\n`;
    });
    
    return content;
  };

  const handleReset = () => {
    setJobDescription('');
    setResume('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>🤖 AI Interviewer</h1>
          <p>Generate tailored interview questions and candidate evaluations powered by AI</p>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {error && (
            <div className="error">
              <strong>Error:</strong> {error}
            </div>
          )}

          {!result && (
            <>
              <JobInput
                jobDescription={jobDescription}
                resume={resume}
                onJobDescriptionChange={setJobDescription}
                onResumeChange={setResume}
              />

              <MetricsSelector metrics={metrics} onMetricsChange={setMetrics} />

              <div className="card">
                <button
                  className="button button-primary"
                  onClick={handleGenerate}
                  disabled={loading || !jobDescription.trim() || !resume.trim()}
                  style={{ width: '100%' }}
                >
                  {loading ? 'Generating...' : 'Generate Interview'}
                </button>
              </div>
            </>
          )}

          {loading && (
            <div className="card loading">
              <div className="spinner"></div>
              <p>Analyzing resume and generating interview questions...</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                This may take a few moments
              </p>
            </div>
          )}

          {result && !loading && (
            <>
              <InterviewQuestions questions={result.questions} />
              <CandidateEvaluationComponent
                evaluation={result.evaluation}
                visualData={result.visualData}
                onDownload={handleDownload}
              />
              <div className="card">
                <button
                  className="button button-primary"
                  onClick={handleReset}
                  style={{ width: '100%' }}
                >
                  Start New Interview
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
