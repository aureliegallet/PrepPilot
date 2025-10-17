# AI Interviewer App

A modern, professional AI-powered mock interview platform built with Next.js 15 and shadcn/ui components.

## 🎯 Features

### Core Functionality
- **Smart Document Upload**: Drag-and-drop interface for resume and job description uploads (PDF, DOCX, TXT)
- **AI-Powered Interviews**: Real-time voice interaction with adaptive AI interviewer
- **Detailed Feedback**: Comprehensive performance analytics with actionable insights
- **Audio Playback**: Review your answers with integrated audio controls
- **Performance Visualization**: Interactive charts showing question scores and skills assessment

### UI/UX Highlights
- 🎨 Modern, minimal design with soft gradients and rounded corners
- 📱 Fully responsive across mobile, tablet, and desktop
- ✨ Smooth animations powered by Framer Motion
- 🎯 Clear visual hierarchy with shadcn/ui components
- 🔄 Multi-step flow indicator (Upload → Interview → Feedback)
- 🎭 Skeleton loading states for optimal UX
- ♿ Full keyboard accessibility and ARIA compliance
- 🔔 Toast notifications for user feedback

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.6 (App Router)
- **UI Components**: shadcn/ui (New York style)
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Form Validation**: React Hook Form + Zod
- **File Upload**: React Dropzone
- **Notifications**: Sonner
- **Icons**: Lucide React

### 🔌 AI & Backend Integrations

- **Gemini API**: AI-powered question generation and answer analysis
  - Generates personalized interview questions from resume and job description
  - Analyzes candidate answers in real-time
  - Provides comprehensive feedback and scoring
- **Snowflake** (Optional): Data warehouse for analytics
  - Stores interview sessions and feedback
  - Enables historical performance tracking
  - Powers analytics dashboards
- **Auth0** (Optional): Authentication and user management
  - Secure user authentication
  - Session management
  - Protected routes and API endpoints

> **Note**: All integrations gracefully fall back to mock data when API keys are not configured, allowing you to test the UI without setting up external services.

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── upload/route.js          # File upload API with Gemini integration
│   │   ├── interview/route.js       # Interview session API with answer analysis
│   │   └── feedback/route.js        # Feedback generation API
│   ├── upload/page.js               # Document upload page
│   ├── interview/page.js            # Interview interface
│   ├── feedback/page.js             # Feedback & analytics page
│   ├── layout.js                    # Root layout with Toaster
│   ├── page.js                      # Landing page
│   └── globals.css                  # Global styles
├── components/
│   ├── ui/                          # shadcn/ui components
│   ├── StepIndicator.jsx            # Multi-step progress indicator
│   ├── FileUpload.jsx               # Drag-and-drop file uploader
│   └── AudioVisualizer.jsx          # Audio recording visualizer
├── lib/
│   ├── utils.js                     # Utility functions
│   ├── gemini.js                    # Gemini API integration
│   ├── snowflake.js                 # Snowflake data warehouse integration
│   └── auth0.js                     # Auth0 authentication integration
├── .env.example                     # Environment variables template
└── FURTHER_STEPS.md                 # Detailed implementation guide

```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- (Optional) Gemini API key for AI features
- (Optional) Snowflake account for data persistence
- (Optional) Auth0 account for authentication

### Quick Start (UI Testing)

1. Clone the repository:
```bash
git clone <repository-url>
cd mlh_hackfest
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

The app will work with mock data, allowing you to test all UI flows without configuring external services.

### Full Setup (with AI Integration)

1. **Copy environment template:**
```bash
cp .env.example .env.local
```

2. **Get Gemini API Key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create an API key
   - Add to `.env.local`: `GEMINI_API_KEY=your_key_here`

3. **(Optional) Configure Snowflake:**
   - Sign up at [Snowflake](https://signup.snowflake.com/)
   - Create database and tables (see `lib/snowflake.js` for schema)
   - Add credentials to `.env.local`

4. **(Optional) Configure Auth0:**
   - Create account at [Auth0](https://auth0.com/)
   - Set up application
   - Add credentials to `.env.local`

5. **Run the application:**
```bash
npm run dev
```

For detailed setup instructions, see [FURTHER_STEPS.md](FURTHER_STEPS.md).

## 📄 Pages Overview

### 1. Landing Page (`/`)
- Hero section with value proposition
- Feature highlights (3-step process)
- Benefits showcase
- Call-to-action sections
- Professional navigation and footer

### 2. Upload Page (`/upload`)
- Drag-and-drop file upload zones
- Support for PDF, DOCX, DOC, and TXT files
- File validation and preview
- Visual feedback during upload
- Step 1 of the interview flow

### 3. Interview Interface (`/interview`)
- Two-column layout:
  - **Left**: Audio controls with animated visualizer
  - **Right**: Real-time chat interface showing Q&A
- Recording controls (Start, Pause, Resume, Stop, End)
- Live question counter
- Step 2 of the interview flow

### 4. Feedback Page (`/feedback`)
- Overall score and performance summary
- Interactive charts:
  - Bar chart: Question-by-question scores
  - Radar chart: Skills assessment
- Strengths and weaknesses breakdown
- Detailed per-question feedback with audio playback
- Download and share options
- Step 3 of the interview flow

## 🎨 Design System

### Colors
- Primary: Neutral base with customizable accent
- Background: Gradient from background to muted
- Text: High contrast for readability
- Charts: Curated palette for data visualization

### Components Used
- Button, Card, Input, Label
- Alert, Badge, Progress
- Tabs, Avatar, Separator
- Scroll Area, Alert Dialog
- Chart (Bar & Radar)
- Sonner (Toast notifications)

### Typography
- Headings: Bold, clear hierarchy
- Body: Readable font sizes with proper line height
- Mono: Used for technical elements

## 🔌 API Routes

### POST `/api/upload`
Upload resume and job description files. Uses **Gemini API** to generate personalized interview questions.

```javascript
FormData:
- resume: File (PDF/DOCX/TXT)
- jobDescription: File (PDF/DOCX/TXT)

Response:
- success: boolean
- sessionId: string
- questionsGenerated: number
- questions: Array<{id, question, category}>

AI Features:
- Analyzes resume content
- Matches with job requirements
- Generates 10 relevant questions
- Categorizes by type (behavioral, technical, experience, situational)
```

### POST `/api/interview`
Handle interview actions. Uses **Gemini API** to analyze answers in real-time.

```javascript
Body:
- sessionId: string
- action: 'start' | 'submit_answer' | 'pause' | 'resume' | 'end'
- audioData?: Blob (future: for transcription)
- answer?: string
- currentQuestion?: number

Response (for submit_answer):
- success: boolean
- transcription: string
- analysis: {score, quickFeedback}
- nextQuestion: string
- questionIndex: number

AI Features:
- Analyzes answer quality and relevance
- Provides real-time scoring (0-100)
- Generates constructive feedback
- Suggests improvements
```

### GET `/api/interview?sessionId={id}`
Retrieve current interview session state.

```javascript
Response:
- success: boolean
- sessionId: string
- currentQuestion: number
- totalQuestions: number
- status: 'pending' | 'in_progress' | 'paused' | 'completed'
```

### GET `/api/feedback?sessionId={id}`
Get comprehensive interview feedback. Uses **Gemini API** to generate detailed analysis.

```javascript
Response:
- success: boolean
- feedback: {
    overallScore: number,
    performanceLevel: string,
    duration: string,
    questionsAnswered: number,
    strengths: Array<string>,
    weaknesses: Array<string>,
    detailedFeedback: Array<{question, answer, score, feedback, suggestions}>,
    skillsAssessment: {communication, technical, problemSolving, etc.},
    recommendations: Array<string>
  }

AI Features:
- Comprehensive analysis of all answers
- Overall performance scoring
- Skills assessment across multiple dimensions
- Personalized recommendations
- Actionable improvement suggestions
```

### POST `/api/feedback`
Handle feedback actions (download, share, regenerate).

## 🎯 Implementation Status

### ✅ Completed Features

#### AI Integration
- ✅ Gemini API integration for question generation
- ✅ Gemini API integration for answer analysis
- ✅ Comprehensive feedback generation with AI
- ✅ Real-time scoring and suggestions
- ✅ Graceful fallback to mock data when API not configured

#### Backend Integration Structure
- ✅ Snowflake integration module (ready to enable)
- ✅ Auth0 authentication module (ready to enable)
- ✅ Environment variable configuration (.env.example)
- ✅ Session management in API routes
- ✅ Data storage interfaces

#### UI/UX
- ✅ Complete interview flow (Upload → Interview → Feedback)
- ✅ Responsive design
- ✅ Smooth animations
- ✅ Interactive charts and visualizations
- ✅ Toast notifications

### 🔨 Future Enhancements

#### File Processing
- [ ] Implement actual PDF parsing (pdf-parse)
- [ ] Implement DOCX parsing (mammoth)
- [ ] File storage in cloud (Digital Ocean Spaces or S3)

#### Audio Features
- [ ] Browser audio recording (MediaRecorder API)
- [ ] Speech-to-Text API integration (OpenAI Whisper or Google Speech-to-Text)
- [ ] Audio storage and playback

#### Authentication & Data
- [ ] Enable Auth0 (uncomment code, add credentials)
- [ ] Enable Snowflake (uncomment code, set up database)
- [ ] Implement user dashboards
- [ ] Interview history tracking

#### Advanced Features
- [ ] Multi-language support
- [ ] Different interview types (technical, behavioral, case study)
- [ ] Customizable interview duration and difficulty
- [ ] Video recording option
- [ ] Real-time interviewer avatar
- [ ] Practice mode with hints
- [ ] Community-shared job descriptions
- [ ] PDF report generation
- [ ] Share links for feedback

#### Analytics
- [ ] Historical performance trends
- [ ] Comparison with industry benchmarks
- [ ] Detailed speech analysis (pace, filler words, confidence)
- [ ] Eye contact and body language analysis (if video enabled)

## 📝 Development Notes

### Adding New shadcn/ui Components
```bash
npx shadcn@latest add <component-name>
```

### Building for Production
```bash
npm run build
npm run start
```

### Linting
```bash
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is built for educational purposes during the MLH Hackfest.

## 📚 Documentation

- **[FURTHER_STEPS.md](FURTHER_STEPS.md)** - Comprehensive guide for implementing and deploying all integrations
  - Detailed API setup instructions (Gemini, Snowflake, Auth0)
  - Environment configuration
  - Feature implementation steps
  - Testing strategies
  - Deployment guides
  - Security best practices
  - Monitoring and analytics setup

## 🙏 Acknowledgments

- [Google Gemini](https://ai.google.dev/) for AI-powered interview capabilities
- [Snowflake](https://www.snowflake.com/) for data warehousing support
- [Auth0](https://auth0.com/) for authentication infrastructure
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Next.js](https://nextjs.org/) for the React framework
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Recharts](https://recharts.org/) for data visualization
- [Lucide](https://lucide.dev/) for icons

---

Built with ❤️ using Next.js, shadcn/ui, and Google Gemini AI
