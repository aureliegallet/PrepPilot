# Gemini API Integration Setup

## Getting Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy your API key

## Setting Up the Environment

1. Create a `.env.local` file in the root directory of the project:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and replace `your_gemini_api_key_here` with your actual API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

3. Restart your development server:
   ```bash
   npm run dev
   ```

## How It Works

The Gemini API is integrated into PrepPilot to provide:

1. **Question Generation** (`/api/upload`):
   - Analyzes uploaded resume and job description
   - Generates 7-10 personalized interview questions
   - Falls back to default questions if API is unavailable

2. **Answer Analysis** (`/api/feedback`):
   - Evaluates user responses to interview questions
   - Provides detailed feedback and scores
   - Generates strengths and improvement areas

## Testing Without API Key

The application works without a Gemini API key by using fallback mock data:
- Default interview questions are provided
- Mock feedback is generated based on simulated scores
- All UI features remain functional

## API Usage

### Upload Endpoint
```javascript
POST /api/upload
Content-Type: multipart/form-data

Body:
- resume: File
- jobDescription: File

Response:
{
  "success": true,
  "sessionId": "session_xxx",
  "questionCount": 7,
  "message": "Files uploaded and processed successfully"
}
```

### Interview Endpoint
```javascript
POST /api/interview
Content-Type: application/json

Body:
{
  "action": "start|submit_answer|pause|resume|end",
  "sessionId": "session_xxx",
  "questionId": 1,  // for submit_answer
  "answer": "text"  // for submit_answer
}
```

### Feedback Endpoint
```javascript
GET /api/feedback?sessionId=session_xxx

Response:
{
  "success": true,
  "overallScore": 78,
  "questionScores": [...],
  "skillsData": [...],
  "strengths": [...],
  "weaknesses": [...],
  "detailedFeedback": [...]
}
```

## Security Notes

- Never commit `.env.local` to version control (it's already in `.gitignore`)
- Keep your API key secure and don't share it publicly
- In production, use environment variables provided by your hosting platform
- Consider implementing rate limiting for API calls

## Troubleshooting

### "Failed to upload files"
- Check that your `.env.local` file exists and has the correct API key
- Verify the API key is valid at Google AI Studio
- Check the browser console for detailed error messages

### Questions not being generated
- The app will use default questions if the API fails
- Check your internet connection
- Verify the API key has not exceeded quota limits

### Slow response times
- Initial Gemini API calls may take 3-5 seconds
- Consider implementing caching for frequently used responses
- Monitor your API usage in Google Cloud Console

## Support

For issues related to:
- **Gemini API**: Visit [Google AI Documentation](https://ai.google.dev/docs)
- **PrepPilot App**: Open an issue on the GitHub repository
