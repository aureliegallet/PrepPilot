# Further Steps for AI Interviewer Implementation

This document outlines the complete steps needed to fully integrate and deploy the AI Interviewer application with Gemini API, Snowflake, and Auth0.

## 📋 Table of Contents
1. [API Integrations](#api-integrations)
2. [Environment Setup](#environment-setup)
3. [Feature Implementation](#feature-implementation)
4. [Testing](#testing)
5. [Deployment](#deployment)
6. [Security Considerations](#security-considerations)
7. [Monitoring and Analytics](#monitoring-and-analytics)

---

## 🔌 API Integrations

### 1. Gemini API Integration (✅ PARTIALLY COMPLETE)

**Current Status:**
- ✅ Gemini SDK installed (`@google/generative-ai`)
- ✅ Integration code written in `/lib/gemini.js`
- ✅ Three main functions implemented:
  - `generateInterviewQuestions()` - Generate questions from resume/job description
  - `analyzeAnswer()` - Analyze individual answers
  - `generateComprehensiveFeedback()` - Generate overall feedback
- ⚠️ Falls back to mock data if API key not configured

**Next Steps:**

1. **Get Gemini API Key:**
   ```bash
   # Visit https://makersuite.google.com/app/apikey
   # Sign in with Google account
   # Click "Create API Key"
   # Copy the generated key
   ```

2. **Configure Environment Variable:**
   ```bash
   # Create .env.local file in project root
   echo "GEMINI_API_KEY=your_actual_api_key_here" >> .env.local
   ```

3. **Test Gemini Integration:**
   ```bash
   # Upload resume and job description
   # Verify questions are AI-generated (not mock data)
   # Check browser console for "Gemini API key not configured" warnings
   # If you see warnings, API key is not set correctly
   ```

4. **Optimize Prompts:**
   - Review prompts in `/lib/gemini.js`
   - Adjust temperature and other model parameters for better results
   - Consider using `gemini-pro-vision` for document image analysis

5. **Handle Rate Limits:**
   ```javascript
   // Add to lib/gemini.js
   import { RateLimiter } from 'rate-limiter-flexible';
   
   const rateLimiter = new RateLimiter({
     points: 10, // 10 requests
     duration: 60, // per 60 seconds
   });
   ```

**Resources:**
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Pricing Information](https://ai.google.dev/pricing)
- [Best Practices](https://ai.google.dev/docs/best_practices)

---

### 2. Snowflake Integration (⚠️ NOT IMPLEMENTED)

**Current Status:**
- ✅ Integration structure written in `/lib/snowflake.js`
- ⚠️ Code is commented out (needs `snowflake-sdk` package)
- ⚠️ Database schema defined but not created

**Next Steps:**

1. **Install Snowflake SDK:**
   ```bash
   npm install snowflake-sdk
   ```

2. **Set Up Snowflake Account:**
   ```bash
   # Sign up at https://signup.snowflake.com/
   # Choose cloud provider (AWS, Azure, or GCP)
   # Note your account identifier (e.g., xy12345.us-east-1)
   ```

3. **Create Database and Schema:**
   ```sql
   -- Run in Snowflake web UI
   
   -- Create database
   CREATE DATABASE ai_interviewer_db;
   USE DATABASE ai_interviewer_db;
   
   -- Create schema
   CREATE SCHEMA public;
   USE SCHEMA public;
   
   -- Create tables (see lib/snowflake.js for complete schema)
   CREATE TABLE users (
     user_id VARCHAR(100) PRIMARY KEY,
     email VARCHAR(255) UNIQUE,
     name VARCHAR(255),
     created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
     last_login TIMESTAMP_NTZ
   );
   
   CREATE TABLE interview_sessions (
     session_id VARCHAR(100) PRIMARY KEY,
     user_id VARCHAR(100),
     resume_data VARIANT,
     job_description TEXT,
     questions_generated INTEGER,
     created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP()
   );
   
   CREATE TABLE interview_feedback (
     feedback_id VARCHAR(100) PRIMARY KEY,
     session_id VARCHAR(100),
     user_id VARCHAR(100),
     overall_score INTEGER,
     performance_level VARCHAR(50),
     strengths VARIANT,
     weaknesses VARIANT,
     skills_assessment VARIANT,
     recommendations VARIANT,
     detailed_feedback VARIANT,
     created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
     FOREIGN KEY (session_id) REFERENCES interview_sessions(session_id)
   );
   
   -- Create indexes
   CREATE INDEX idx_user_sessions ON interview_sessions(user_id);
   CREATE INDEX idx_user_feedback ON interview_feedback(user_id);
   ```

4. **Configure Environment Variables:**
   ```bash
   # Add to .env.local
   SNOWFLAKE_ACCOUNT=xy12345.us-east-1
   SNOWFLAKE_USERNAME=your_username
   SNOWFLAKE_PASSWORD=your_password
   SNOWFLAKE_DATABASE=ai_interviewer_db
   SNOWFLAKE_SCHEMA=public
   SNOWFLAKE_WAREHOUSE=compute_wh
   ```

5. **Uncomment Integration Code:**
   - Open `/lib/snowflake.js`
   - Uncomment all the commented code sections
   - Import at the top: `import snowflake from 'snowflake-sdk';`

6. **Initialize Connection:**
   ```javascript
   // In your API routes, add:
   import { initSnowflake } from '@/lib/snowflake';
   
   // Initialize once when server starts
   await initSnowflake();
   ```

7. **Test Data Storage:**
   - Upload files and complete interview
   - Check Snowflake tables for data
   - Query to verify: `SELECT * FROM interview_sessions;`

**Advanced Features:**
- Set up Snowpipe for real-time data ingestion
- Create materialized views for analytics
- Implement data retention policies
- Set up user roles and permissions

**Resources:**
- [Snowflake Documentation](https://docs.snowflake.com/)
- [Node.js SDK Guide](https://docs.snowflake.com/en/user-guide/nodejs-driver)
- [Free Trial](https://signup.snowflake.com/)

---

### 3. Auth0 Integration (⚠️ NOT IMPLEMENTED)

**Current Status:**
- ✅ Integration structure written in `/lib/auth0.js`
- ⚠️ Code is commented out (needs `@auth0/nextjs-auth0` package)
- ⚠️ Mock user session used when not configured

**Next Steps:**

1. **Install Auth0 SDK:**
   ```bash
   npm install @auth0/nextjs-auth0
   ```

2. **Create Auth0 Account and Application:**
   ```bash
   # 1. Go to https://auth0.com/ and sign up
   # 2. Create a new tenant (e.g., "ai-interviewer")
   # 3. Go to Applications → Create Application
   # 4. Choose "Regular Web Application"
   # 5. Select "Next.js" as the technology
   ```

3. **Configure Application Settings in Auth0:**
   ```
   Allowed Callback URLs:
   http://localhost:3000/api/auth/callback
   https://your-production-domain.com/api/auth/callback
   
   Allowed Logout URLs:
   http://localhost:3000
   https://your-production-domain.com
   
   Allowed Web Origins:
   http://localhost:3000
   https://your-production-domain.com
   ```

4. **Set Environment Variables:**
   ```bash
   # Generate a secret (32+ characters)
   openssl rand -base64 32
   
   # Add to .env.local
   AUTH0_SECRET='use_generated_secret_here'
   AUTH0_BASE_URL='http://localhost:3000'
   AUTH0_ISSUER_BASE_URL='https://your-tenant.auth0.com'
   AUTH0_CLIENT_ID='your_client_id'
   AUTH0_CLIENT_SECRET='your_client_secret'
   ```

5. **Create Auth API Route:**
   ```bash
   mkdir -p app/api/auth/\[auth0\]
   ```
   
   Create `app/api/auth/[auth0]/route.js`:
   ```javascript
   import { handleAuth } from '@auth0/nextjs-auth0';
   
   export const GET = handleAuth();
   ```

6. **Wrap App with UserProvider:**
   
   Update `app/layout.js`:
   ```javascript
   import { UserProvider } from '@auth0/nextjs-auth0/client';
   import { Toaster } from "@/components/ui/sonner";
   import "./globals.css";
   
   export default function RootLayout({ children }) {
     return (
       <html lang="en">
         <body className="antialiased">
           <UserProvider>
             {children}
           </UserProvider>
           <Toaster />
         </body>
       </html>
     );
   }
   ```

7. **Add Login/Logout UI:**
   
   Create `components/AuthButton.jsx`:
   ```javascript
   'use client';
   import { useUser } from '@auth0/nextjs-auth0/client';
   import { Button } from '@/components/ui/button';
   import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
   
   export default function AuthButton() {
     const { user, error, isLoading } = useUser();
     
     if (isLoading) return <div>Loading...</div>;
     if (error) return <div>{error.message}</div>;
     
     if (user) {
       return (
         <div className="flex items-center gap-3">
           <Avatar>
             <AvatarImage src={user.picture} alt={user.name} />
             <AvatarFallback>{user.name?.[0]}</AvatarFallback>
           </Avatar>
           <span>{user.name}</span>
           <Button asChild variant="outline">
             <a href="/api/auth/logout">Logout</a>
           </Button>
         </div>
       );
     }
     
     return (
       <Button asChild>
         <a href="/api/auth/login">Login</a>
       </Button>
     );
   }
   ```

8. **Protect Routes:**
   
   For pages (server-side):
   ```javascript
   import { withPageAuthRequired } from '@auth0/nextjs-auth0';
   
   export default withPageAuthRequired(function ProtectedPage() {
     return <div>This page is protected</div>;
   });
   ```
   
   For API routes:
   ```javascript
   import { withApiAuthRequired } from '@auth0/nextjs-auth0';
   
   export const GET = withApiAuthRequired(async (req) => {
     // Your API logic
   });
   ```

9. **Uncomment Integration Code:**
   - Open `/lib/auth0.js`
   - Uncomment all import statements and function implementations

10. **Update API Routes:**
    - Uncomment auth checks in `/app/api/upload/route.js`
    - Uncomment auth checks in `/app/api/interview/route.js`
    - Uncomment auth checks in `/app/api/feedback/route.js`

**Advanced Auth0 Features:**
- Add social login (Google, GitHub, LinkedIn)
- Implement role-based access control (RBAC)
- Add multi-factor authentication (MFA)
- Customize login/signup pages
- Set up email verification

**Resources:**
- [Auth0 Next.js SDK](https://auth0.com/docs/quickstart/webapp/nextjs)
- [Auth0 Documentation](https://auth0.com/docs)
- [Free Tier](https://auth0.com/pricing) - 7,000 active users

---

## ⚙️ Environment Setup

### Development Environment

1. **Create `.env.local` file:**
   ```bash
   # Copy from example
   cp .env.example .env.local
   ```

2. **Fill in all required values:**
   ```env
   # Gemini API
   GEMINI_API_KEY=your_gemini_api_key
   
   # Snowflake
   SNOWFLAKE_ACCOUNT=your_account
   SNOWFLAKE_USERNAME=your_username
   SNOWFLAKE_PASSWORD=your_password
   SNOWFLAKE_DATABASE=ai_interviewer_db
   SNOWFLAKE_SCHEMA=public
   SNOWFLAKE_WAREHOUSE=compute_wh
   
   # Auth0
   AUTH0_SECRET=your_long_random_secret
   AUTH0_BASE_URL=http://localhost:3000
   AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
   AUTH0_CLIENT_ID=your_client_id
   AUTH0_CLIENT_SECRET=your_client_secret
   
   # App
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   NODE_ENV=development
   ```

3. **Install all dependencies:**
   ```bash
   npm install
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

### Production Environment

1. **Set up environment variables in your hosting platform:**
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Build & Deploy → Environment
   - AWS/DigitalOcean: Use secrets manager

2. **Update `.env.example` with production values:**
   ```env
   AUTH0_BASE_URL=https://your-production-domain.com
   NEXT_PUBLIC_BASE_URL=https://your-production-domain.com
   NODE_ENV=production
   ```

3. **Never commit `.env.local` to Git:**
   ```bash
   # Verify it's in .gitignore
   grep -q "^\.env\*" .gitignore && echo "✓ .env files are ignored"
   ```

---

## 🚀 Feature Implementation

### 1. File Processing (PDF/DOCX)

**Current Status:** Mock text extraction

**Implementation Steps:**

1. **Install Required Packages:**
   ```bash
   npm install pdf-parse mammoth
   ```

2. **Update `extractTextFromFile` in `/app/api/upload/route.js`:**
   ```javascript
   import pdfParse from 'pdf-parse';
   import mammoth from 'mammoth';
   
   async function extractTextFromFile(file) {
     const buffer = Buffer.from(await file.arrayBuffer());
     const fileType = file.type;
     
     if (fileType === 'application/pdf') {
       const data = await pdfParse(buffer);
       return data.text;
     } else if (fileType.includes('wordprocessing')) {
       const result = await mammoth.extractRawText({ buffer });
       return result.value;
     } else if (fileType === 'text/plain') {
       return await file.text();
     }
     
     throw new Error('Unsupported file type');
   }
   ```

### 2. Audio Recording and Transcription

**Current Status:** Not implemented

**Implementation Steps:**

1. **Client-Side Recording (Browser API):**
   
   Create `lib/audio.js`:
   ```javascript
   export class AudioRecorder {
     constructor() {
       this.mediaRecorder = null;
       this.audioChunks = [];
     }
     
     async start() {
       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
       this.mediaRecorder = new MediaRecorder(stream);
       
       this.mediaRecorder.ondataavailable = (event) => {
         this.audioChunks.push(event.data);
       };
       
       this.mediaRecorder.start();
     }
     
     async stop() {
       return new Promise((resolve) => {
         this.mediaRecorder.onstop = () => {
           const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
           this.audioChunks = [];
           resolve(audioBlob);
         };
         this.mediaRecorder.stop();
       });
     }
   }
   ```

2. **Server-Side Transcription:**
   
   Option A: OpenAI Whisper
   ```bash
   npm install openai
   ```
   
   ```javascript
   import OpenAI from 'openai';
   
   const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
   
   async function transcribeAudio(audioBlob) {
     const transcription = await openai.audio.transcriptions.create({
       file: audioBlob,
       model: 'whisper-1',
     });
     return transcription.text;
   }
   ```
   
   Option B: Google Speech-to-Text
   ```bash
   npm install @google-cloud/speech
   ```
   
   ```javascript
   import speech from '@google-cloud/speech';
   
   const client = new speech.SpeechClient();
   
   async function transcribeAudio(audioBuffer) {
     const [response] = await client.recognize({
       audio: { content: audioBuffer.toString('base64') },
       config: {
         encoding: 'WEBM_OPUS',
         sampleRateHertz: 48000,
         languageCode: 'en-US',
       },
     });
     return response.results
       .map(result => result.alternatives[0].transcript)
       .join('\n');
   }
   ```

3. **Update Interview Page:**
   - Import AudioRecorder in `app/interview/page.js`
   - Implement start/stop recording
   - Send audio blob to API for transcription

### 3. File Storage (Digital Ocean Spaces)

**Implementation Steps:**

1. **Install AWS SDK (S3-compatible):**
   ```bash
   npm install @aws-sdk/client-s3
   ```

2. **Create Digital Ocean Spaces:**
   - Go to DigitalOcean → Spaces
   - Create new Space (select region)
   - Generate API keys (Access Key & Secret Key)

3. **Create Storage Utility (`lib/storage.js`):**
   ```javascript
   import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
   
   const s3Client = new S3Client({
     endpoint: process.env.DO_SPACES_ENDPOINT,
     region: 'us-east-1',
     credentials: {
       accessKeyId: process.env.DO_SPACES_KEY,
       secretAccessKey: process.env.DO_SPACES_SECRET,
     },
   });
   
   export async function uploadFile(file, key) {
     const buffer = Buffer.from(await file.arrayBuffer());
     
     const command = new PutObjectCommand({
       Bucket: process.env.DO_SPACES_BUCKET,
       Key: key,
       Body: buffer,
       ContentType: file.type,
       ACL: 'private',
     });
     
     await s3Client.send(command);
     
     return `${process.env.DO_SPACES_ENDPOINT}/${process.env.DO_SPACES_BUCKET}/${key}`;
   }
   ```

4. **Update Upload Route:**
   ```javascript
   import { uploadFile } from '@/lib/storage';
   
   // In POST handler
   const resumeUrl = await uploadFile(resume, `resumes/${sessionId}_resume.pdf`);
   const jobDescUrl = await uploadFile(jobDescription, `jobs/${sessionId}_job.pdf`);
   ```

### 4. Report Generation (PDF)

**Implementation Steps:**

1. **Install PDF Library:**
   ```bash
   npm install jspdf jspdf-autotable
   ```

2. **Create Report Generator (`lib/pdf-report.js`):**
   ```javascript
   import jsPDF from 'jspdf';
   import 'jspdf-autotable';
   
   export function generateFeedbackReport(feedback) {
     const doc = new jsPDF();
     
     // Title
     doc.setFontSize(20);
     doc.text('Interview Feedback Report', 20, 20);
     
     // Overall Score
     doc.setFontSize(14);
     doc.text(`Overall Score: ${feedback.overallScore}/100`, 20, 35);
     doc.text(`Performance Level: ${feedback.performanceLevel}`, 20, 45);
     
     // Strengths
     doc.text('Strengths:', 20, 60);
     doc.setFontSize(10);
     feedback.strengths.forEach((strength, i) => {
       doc.text(`• ${strength}`, 25, 68 + i * 7);
     });
     
     // Weaknesses
     doc.setFontSize(14);
     doc.text('Areas for Improvement:', 20, 100);
     doc.setFontSize(10);
     feedback.weaknesses.forEach((weakness, i) => {
       doc.text(`• ${weakness}`, 25, 108 + i * 7);
     });
     
     // Detailed Feedback Table
     doc.addPage();
     doc.setFontSize(14);
     doc.text('Question-by-Question Analysis', 20, 20);
     
     const tableData = feedback.detailedFeedback.map(item => [
       `Q${item.questionNumber}`,
       item.score,
       item.feedback.substring(0, 50) + '...',
     ]);
     
     doc.autoTable({
       startY: 30,
       head: [['Question', 'Score', 'Feedback']],
       body: tableData,
     });
     
     return doc.output('blob');
   }
   ```

3. **Update Feedback API:**
   ```javascript
   import { generateFeedbackReport } from '@/lib/pdf-report';
   
   case 'download':
     const report = generateFeedbackReport(feedback);
     // Store in temporary location or return as data URL
     return NextResponse.json({
       success: true,
       reportData: report, // Or save to storage and return URL
     });
   ```

---

## 🧪 Testing

### Unit Tests

1. **Install Testing Libraries:**
   ```bash
   npm install --save-dev jest @testing-library/react @testing-library/jest-dom
   ```

2. **Create Test Files:**
   ```javascript
   // __tests__/lib/gemini.test.js
   import { generateInterviewQuestions } from '@/lib/gemini';
   
   describe('Gemini Integration', () => {
     test('generates questions from resume and job description', async () => {
       const questions = await generateInterviewQuestions(
         'Sample resume text',
         'Sample job description'
       );
       expect(questions).toHaveLength(10);
       expect(questions[0]).toHaveProperty('question');
     });
   });
   ```

### Integration Tests

1. **Test API Routes:**
   ```javascript
   // __tests__/api/upload.test.js
   describe('/api/upload', () => {
     test('uploads files and returns session ID', async () => {
       const formData = new FormData();
       formData.append('resume', mockPdfFile);
       formData.append('jobDescription', mockTextFile);
       
       const response = await fetch('/api/upload', {
         method: 'POST',
         body: formData,
       });
       
       const data = await response.json();
       expect(data.success).toBe(true);
       expect(data.sessionId).toBeDefined();
     });
   });
   ```

### End-to-End Tests

1. **Install Playwright:**
   ```bash
   npm install --save-dev @playwright/test
   ```

2. **Create E2E Tests:**
   ```javascript
   // e2e/interview-flow.spec.js
   import { test, expect } from '@playwright/test';
   
   test('complete interview flow', async ({ page }) => {
     // Go to upload page
     await page.goto('/upload');
     
     // Upload files
     await page.setInputFiles('[data-testid="resume-upload"]', 'test-resume.pdf');
     await page.setInputFiles('[data-testid="job-upload"]', 'test-job.txt');
     
     // Start interview
     await page.click('text=Start Interview');
     
     // Answer questions
     await page.click('text=Start Recording');
     await page.waitForTimeout(2000);
     await page.click('text=Stop Answering');
     
     // View feedback
     await expect(page.locator('text=Overall Score')).toBeVisible();
   });
   ```

---

## 🚀 Deployment

### Option 1: Vercel (Recommended for Next.js)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set Environment Variables:**
   ```bash
   vercel env add GEMINI_API_KEY
   vercel env add SNOWFLAKE_ACCOUNT
   vercel env add AUTH0_SECRET
   # ... add all other env vars
   ```

4. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

### Option 2: Docker + DigitalOcean

1. **Create Dockerfile:**
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   RUN npm run build
   
   EXPOSE 3000
   
   CMD ["npm", "start"]
   ```

2. **Build and Push:**
   ```bash
   docker build -t ai-interviewer .
   docker tag ai-interviewer registry.digitalocean.com/your-registry/ai-interviewer
   docker push registry.digitalocean.com/your-registry/ai-interviewer
   ```

3. **Deploy to DigitalOcean App Platform:**
   - Go to DigitalOcean → App Platform
   - Create New App
   - Connect to Docker registry
   - Set environment variables
   - Deploy

### Option 3: AWS (EC2 + RDS)

1. **Set up EC2 instance**
2. **Install Node.js and dependencies**
3. **Use PM2 for process management:**
   ```bash
   npm install -g pm2
   pm2 start npm --name "ai-interviewer" -- start
   pm2 save
   pm2 startup
   ```

---

## 🔒 Security Considerations

### 1. API Keys and Secrets

- ✅ Never commit `.env` files to Git
- ✅ Use environment variables for all secrets
- ✅ Rotate API keys regularly
- ✅ Use different keys for dev/staging/production

### 2. Authentication and Authorization

- ✅ Implement proper authentication (Auth0)
- ✅ Protect all sensitive API routes
- ✅ Validate user permissions before data access
- ✅ Implement CSRF protection

### 3. Input Validation

```javascript
// Example: Validate file uploads
function validateFile(file) {
  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type');
  }
  
  if (file.size > maxSize) {
    throw new Error('File too large');
  }
}
```

### 4. Rate Limiting

```bash
npm install rate-limiter-flexible
```

```javascript
import { RateLimiterMemory } from 'rate-limiter-flexible';

const rateLimiter = new RateLimiterMemory({
  points: 10, // 10 requests
  duration: 60, // per 60 seconds
});

export async function middleware(request) {
  const ip = request.ip;
  
  try {
    await rateLimiter.consume(ip);
  } catch {
    return new Response('Too Many Requests', { status: 429 });
  }
}
```

### 5. Data Encryption

- ✅ Use HTTPS in production
- ✅ Encrypt sensitive data at rest (Snowflake encryption)
- ✅ Encrypt file uploads
- ✅ Use secure session cookies

---

## 📊 Monitoring and Analytics

### 1. Error Tracking

**Install Sentry:**
```bash
npm install @sentry/nextjs
```

**Configure:**
```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### 2. Performance Monitoring

**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

```javascript
// app/layout.js
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 3. Usage Analytics

**Snowflake Queries:**
```sql
-- Daily active users
SELECT DATE(created_at) as date, COUNT(DISTINCT user_id) as dau
FROM interview_sessions
WHERE created_at >= DATEADD(day, -30, CURRENT_DATE())
GROUP BY date
ORDER BY date;

-- Average interview score by date
SELECT DATE(created_at) as date, AVG(overall_score) as avg_score
FROM interview_feedback
WHERE created_at >= DATEADD(day, -30, CURRENT_DATE())
GROUP BY date
ORDER BY date;

-- Most common skills assessed
SELECT 
  key,
  AVG(value::NUMBER) as avg_score
FROM interview_feedback,
LATERAL FLATTEN(input => PARSE_JSON(skills_assessment))
GROUP BY key
ORDER BY avg_score DESC;
```

### 4. Logging

**Create Logger Utility:**
```javascript
// lib/logger.js
export const logger = {
  info: (message, meta) => {
    console.log(JSON.stringify({ level: 'info', message, ...meta, timestamp: new Date().toISOString() }));
  },
  error: (message, error, meta) => {
    console.error(JSON.stringify({ level: 'error', message, error: error.message, stack: error.stack, ...meta, timestamp: new Date().toISOString() }));
  },
  warn: (message, meta) => {
    console.warn(JSON.stringify({ level: 'warn', message, ...meta, timestamp: new Date().toISOString() }));
  },
};
```

---

## 📝 Summary Checklist

### Phase 1: Core API Integration
- [ ] Set up Gemini API key and test question generation
- [ ] Install and configure Snowflake database
- [ ] Set up Auth0 authentication
- [ ] Test all three integrations together

### Phase 2: Feature Completion
- [ ] Implement PDF/DOCX text extraction
- [ ] Add audio recording and transcription
- [ ] Set up file storage (Digital Ocean Spaces)
- [ ] Implement PDF report generation

### Phase 3: Testing
- [ ] Write unit tests for all utility functions
- [ ] Create integration tests for API routes
- [ ] Perform end-to-end testing
- [ ] Load testing with realistic data

### Phase 4: Security & Performance
- [ ] Implement rate limiting
- [ ] Add input validation everywhere
- [ ] Set up error tracking (Sentry)
- [ ] Optimize database queries
- [ ] Enable caching where appropriate

### Phase 5: Deployment
- [ ] Choose hosting platform
- [ ] Set up CI/CD pipeline
- [ ] Configure production environment variables
- [ ] Deploy and test in production
- [ ] Set up monitoring and alerts

### Phase 6: Documentation
- [ ] Update README with deployment instructions
- [ ] Document API endpoints
- [ ] Create user guide
- [ ] Write developer onboarding docs

---

## 🎯 Quick Start Priorities

If you're short on time, prioritize in this order:

1. **Gemini API** - Core feature, easy to set up, provides immediate value
2. **Auth0** - Important for user management and security
3. **File Processing** - Enhances user experience significantly
4. **Snowflake** - Can use local storage initially, add later for scale
5. **Audio Transcription** - Can start with text input, add voice later

---

## 📞 Support Resources

- **Gemini API Support:** https://ai.google.dev/support
- **Snowflake Support:** https://docs.snowflake.com/support
- **Auth0 Community:** https://community.auth0.com/
- **Next.js Discussions:** https://github.com/vercel/next.js/discussions

---

**Last Updated:** 2025-10-17

**Version:** 1.0.0
