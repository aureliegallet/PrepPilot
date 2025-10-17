# Quick Start Guide - AI Interviewer

Get the AI Interviewer up and running in 5 minutes!

## Prerequisites

- Node.js 18 or higher ([Download here](https://nodejs.org/))
- A Google Gemini API key ([Get one free here](https://makersuite.google.com/app/apikey))

## Step 1: Install Dependencies

```bash
npm run install:all
```

This installs dependencies for both frontend and backend.

## Step 2: Configure Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

## Step 3: Start the Application

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

## Step 4: Open the Application

Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

## Using the Application

1. **Paste Job Description**: Copy and paste a job description into the first text area
2. **Paste Resume**: Copy and paste the candidate's resume into the second text area
3. **Select Focus Areas**: Check the metrics you want to evaluate (all selected by default)
4. **Generate**: Click "Generate Interview" button
5. **Review Results**: View AI-generated interview questions and candidate evaluation
6. **Download/Share**: Use the buttons to download the report or share it

## Sample Data

If you want to test the application, use this sample data:

**Job Description:**
```
Senior Software Engineer

Requirements:
- 5+ years of experience in full-stack development
- Strong expertise in React, Node.js, and TypeScript
- Experience with cloud platforms (AWS, Azure, or GCP)
- Excellent problem-solving and communication skills
```

**Resume:**
```
John Doe
Software Engineer

Experience:
- Senior Software Developer at Tech Corp (2020-2024)
  * Led development using React and Node.js
  * Implemented CI/CD pipelines
  
Skills:
- Frontend: React, TypeScript
- Backend: Node.js, Express
- Cloud: AWS
```

## Troubleshooting

### "GEMINI_API_KEY is not set"
Make sure you've created a `.env` file in the `backend` directory with your API key.

### Port already in use
If ports 3001 or 5173 are in use, you can change them:
- Backend: Edit `PORT` in `backend/.env`
- Frontend: Edit `server.port` in `frontend/vite.config.ts`

### Build errors
Make sure you're using Node.js 18 or higher:
```bash
node --version
```

## Production Deployment

For production deployment:

```bash
# Build both applications
npm run build:all

# Start backend in production mode
cd backend
npm start

# Serve frontend (use a service like nginx or Vercel)
cd frontend
# The built files are in frontend/dist
```

## Need Help?

- Check the [README.md](README.md) for detailed documentation
- Review [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines
- Open an issue on GitHub if you encounter problems

## Next Steps

- Explore the codebase
- Try different job descriptions and resumes
- Contribute new features (see CONTRIBUTING.md)
- Share with your team!

Happy interviewing! 🚀
