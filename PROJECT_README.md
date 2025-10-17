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

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── upload/route.js          # File upload API
│   │   ├── interview/route.js       # Interview session API
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
└── lib/
    └── utils.js                     # Utility functions

```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

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
Upload resume and job description files.
```javascript
FormData:
- resume: File (PDF/DOCX)
- jobDescription: File (PDF/DOCX/TXT)

Response:
- sessionId: string
- questionsGenerated: number
```

### POST `/api/interview`
Handle interview actions (start, submit_answer, pause, resume, end).
```javascript
Body:
- sessionId: string
- action: 'start' | 'submit_answer' | 'pause' | 'resume' | 'end'
- audioData?: Blob
- currentQuestion?: number

Response:
- question: string (for start/submit_answer)
- questionIndex: number
- transcription: string (for submit_answer)
```

### GET `/api/interview?sessionId={id}`
Retrieve current interview session state.

### GET `/api/feedback?sessionId={id}`
Get comprehensive interview feedback and analytics.

### POST `/api/feedback`
Handle feedback actions (download, share, regenerate).

## 🎯 Future Enhancements

### Backend Integration
- [ ] Implement actual file parsing (PDF/DOCX extraction)
- [ ] Integrate Speech-to-Text API (e.g., OpenAI Whisper, Google Speech-to-Text)
- [ ] Integrate AI for question generation (e.g., OpenAI GPT-4, Claude)
- [ ] Implement audio recording and storage
- [ ] Add database for session and user management
- [ ] Implement authentication and user accounts

### Features
- [ ] Multi-language support
- [ ] Different interview types (technical, behavioral, case study)
- [ ] Interview history and progress tracking
- [ ] Customizable interview duration and difficulty
- [ ] Video recording option
- [ ] Real-time interviewer avatar
- [ ] Practice mode with hints
- [ ] Community-shared job descriptions

### Analytics
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

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Next.js](https://nextjs.org/) for the React framework
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Recharts](https://recharts.org/) for data visualization
- [Lucide](https://lucide.dev/) for icons

---

Built with ❤️ using Next.js and shadcn/ui
