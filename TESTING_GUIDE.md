# Testing Guide for New File Review Feature

## Quick Start

### 1. Set Up Your Environment

First, create a `.env.local` file in the project root with your Gemini API key:

```bash
# In the PrepPilot root directory
cat > .env.local << EOF
GEMINI_API_KEY=your_actual_api_key_here
EOF
```

**Get Your API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey) and create a free API key.

### 2. Install Dependencies

```bash
npm install
```

This will install the new dependencies:
- `pdf-parse` - For PDF text extraction
- `mammoth` - For DOCX text extraction

### 3. Start the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Testing the New Feature

### Test Case 1: Basic Upload and Review Flow

1. Navigate to `http://localhost:3000`
2. Click "Get Started" or "Start Practicing"
3. Upload a resume/CV file (PDF, DOCX, DOC, or TXT)
4. Upload a job description file (PDF, DOCX, DOC, or TXT)
5. Click "Start Interview"
6. **Expected**: You should be redirected to the review page (`/review`)
7. **Expected**: You should see the extracted text from your resume in the Resume/CV tab
8. Click the "Job Description" tab
9. **Expected**: You should see the extracted text from the job description

### Test Case 2: Text Editing

1. On the review page, click the "Edit" button on either tab
2. **Expected**: The text should become editable in a textarea
3. **Expected**: Save and Cancel buttons should appear
4. **Expected**: "Generate Interview Questions" button should be disabled
5. Make some changes to the text
6. Click "Save"
7. **Expected**: Success notification "Resume text updated" or "Job description text updated"
8. **Expected**: Text should be saved and display the updated content
9. **Expected**: "Generate Interview Questions" button should be enabled again

### Test Case 3: Cancel Editing

1. Click "Edit" button
2. Make some changes to the text
3. Click "Cancel"
4. **Expected**: Changes should be discarded
5. **Expected**: Original text should be displayed

### Test Case 4: AI Question Generation (with valid API key)

1. On the review page, ensure both documents have been reviewed
2. Click "Generate Interview Questions"
3. **Expected**: Button shows loading state "Generating Questions with AI..."
4. **Expected**: After 5-10 seconds, success notification appears
5. **Expected**: Redirected to the interview page with AI-generated questions

### Test Case 5: Missing API Key Error

1. Remove or rename your `.env.local` file
2. Restart the development server
3. Upload files and navigate to review page
4. Click "Generate Interview Questions"
5. **Expected**: Error notification: "Gemini API key not configured. Please add GEMINI_API_KEY to your .env.local file."

### Test Case 6: Invalid API Key Error

1. Set `GEMINI_API_KEY=invalid_key` in `.env.local`
2. Restart the development server
3. Upload files and navigate to review page
4. Click "Generate Interview Questions"
5. **Expected**: Error notification: "Failed to generate questions using AI. Please check your API key and try again."

## Test Files

You can use these sample files for testing:

### Sample Resume (save as `resume.txt`)
```
John Doe
Senior Software Engineer

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years of expertise in full-stack development, cloud architecture, and team leadership. Proficient in JavaScript, Python, React, Node.js, and AWS.

EXPERIENCE
Senior Software Engineer - Tech Corp (2020-Present)
- Led development of microservices architecture serving 1M+ users
- Implemented CI/CD pipelines reducing deployment time by 60%
- Mentored team of 5 junior developers

SKILLS
Languages: JavaScript, Python, TypeScript, Java
Frameworks: React, Node.js, Express, Django
Cloud: AWS (EC2, S3, Lambda), Docker, Kubernetes
```

### Sample Job Description (save as `job.txt`)
```
Senior Full Stack Developer

REQUIREMENTS
- 5+ years of experience in full-stack development
- Strong proficiency in JavaScript/TypeScript
- Experience with Node.js and backend frameworks
- Knowledge of cloud platforms (AWS, Azure, or GCP)
- Experience with SQL and NoSQL databases

RESPONSIBILITIES
- Design and develop full-stack web applications
- Build RESTful APIs and microservices
- Collaborate with product managers and designers
- Write clean, maintainable code
- Mentor junior developers
```

## Troubleshooting

### Issue: "Export default doesn't exist in target module"

If you see this error, the development server may have cached the old code. Solution:
1. Stop the dev server (Ctrl+C)
2. Delete `.next` folder: `rm -rf .next`
3. Restart: `npm run dev`

### Issue: Text extraction shows garbled characters

This can happen with DOC files (older Microsoft Word format):
1. Try converting the file to DOCX or PDF format
2. Or save as plain text (.txt)

### Issue: "Session not found" error

Clear your browser's local storage and session storage:
1. Open DevTools (F12)
2. Go to Application tab
3. Clear Storage
4. Refresh the page and start over

### Issue: Questions take too long to generate

The Gemini API can take 5-15 seconds to respond:
1. This is normal for the first request
2. Ensure you have a stable internet connection
3. Check the browser console for any errors

## Verification Checklist

After implementing the feature, verify:

- [ ] Files upload successfully
- [ ] Review page loads with extracted text
- [ ] Both tabs (Resume and Job Description) work correctly
- [ ] Edit mode can be entered and exited
- [ ] Text changes can be saved
- [ ] Cancel button discards changes
- [ ] Generate button is disabled during editing
- [ ] API key error messages are clear and helpful
- [ ] Questions are generated successfully with valid API key
- [ ] Navigation flow: Upload → Review → Interview works smoothly
- [ ] No console errors during normal operation
- [ ] UI is responsive and user-friendly

## API Key Quotas

Free Gemini API tier includes:
- 60 requests per minute
- Generous monthly quota

If you hit rate limits:
1. Wait a minute and try again
2. Or upgrade to a paid tier for higher limits

## Need Help?

See `GEMINI_SETUP.md` for detailed API key setup instructions and `FEATURE_GUIDE.md` for feature documentation.
