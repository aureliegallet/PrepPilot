import { FC } from 'react';

interface JobInputProps {
  jobDescription: string;
  resume: string;
  onJobDescriptionChange: (value: string) => void;
  onResumeChange: (value: string) => void;
}

export const JobInput: FC<JobInputProps> = ({
  jobDescription,
  resume,
  onJobDescriptionChange,
  onResumeChange,
}) => {
  return (
    <div className="card">
      <h2>Job Details</h2>
      <div className="form-group">
        <label htmlFor="jobDescription">Job Description</label>
        <textarea
          id="jobDescription"
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          placeholder="Paste the job description here..."
        />
      </div>
      <div className="form-group">
        <label htmlFor="resume">Candidate Resume</label>
        <textarea
          id="resume"
          value={resume}
          onChange={(e) => onResumeChange(e.target.value)}
          placeholder="Paste the candidate's resume here..."
        />
      </div>
    </div>
  );
};
