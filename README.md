# AI Interviewer 🤖

A modern web application that uses AI to generate tailored interview questions and candidate evaluations. Built with React, Node.js, and powered by Google's Gemini API.

## Features

- 📝 **Job Description & Resume Analysis**: Paste job descriptions and resumes to get AI-powered insights
- 🎯 **Customizable Metrics**: Select focus areas like communication skills, technical skills, cultural fit, and experience level
- 💡 **Smart Question Generation**: AI generates relevant interview questions based on the job and candidate profile
- 📊 **Candidate Evaluation**: Comprehensive evaluation with scores, strengths, weaknesses, and recommendations
- 📈 **Visual Analytics**: Interactive charts and graphs showing skill matches and scorecards
- 💾 **Download & Share**: Export interview reports and share evaluations
- 🔒 **Secure & Scalable**: Built with modern security practices and rate limiting

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Chart.js** & **react-chartjs-2** for data visualization
- **Axios** for API communication
- Modern CSS with responsive design

### Backend
- **Node.js** with **Express**
- **TypeScript** for type safety
- **Google Gemini AI** for question generation and evaluation
- **Helmet** for security headers
- **CORS** for cross-origin resource sharing
- **Rate limiting** for API protection

## Project Structure

```
MLH-hackfest/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   ├── types/          # TypeScript type definitions
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Application entry point
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                 # Node.js backend API
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript type definitions
│   │   └── index.ts        # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- A Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aureliegallet/MLH-hackfest.git
   cd MLH-hackfest
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure backend environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your Gemini API key
   ```

4. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Configure frontend environment** (optional)
   ```bash
   cp .env.example .env
   # Edit if you need to change the API URL
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:3001`

2. **Start the frontend development server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Open your browser** and navigate to `http://localhost:5173`

## Usage

1. **Enter Job Details**: Paste the job description and candidate's resume
2. **Select Metrics**: Choose which areas to focus on during the interview
3. **Generate Interview**: Click the button to generate questions and evaluation
4. **Review Results**: View the generated interview questions and candidate evaluation
5. **Download/Share**: Export the report or share the evaluation

## API Documentation

### Endpoints

#### `POST /api/interview/generate`
Generate interview questions and candidate evaluation.

**Request Body:**
```json
{
  "jobDescription": "string",
  "resume": "string",
  "metrics": {
    "communicationSkills": boolean,
    "technicalSkills": boolean,
    "culturalFit": boolean,
    "experienceLevel": boolean
  }
}
```

**Response:**
```json
{
  "questions": [
    {
      "id": "string",
      "question": "string",
      "category": "string",
      "skillArea": "string",
      "difficulty": "easy|medium|hard"
    }
  ],
  "evaluation": {
    "overallScore": number,
    "skillMatch": [
      {
        "skill": "string",
        "required": number,
        "candidate": number
      }
    ],
    "strengths": ["string"],
    "weaknesses": ["string"],
    "recommendations": ["string"],
    "summary": "string"
  },
  "visualData": {
    "skillMatchChart": {...},
    "scorecard": {...}
  }
}
```

#### `GET /api/interview/health`
Health check endpoint.

## Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=3001
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3001
```

## Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Future Enhancements

- [ ] **Auth0 Integration**: Add user authentication for session management
- [ ] **DigitalOcean Gradient AI**: Enhanced visualizations with AI-generated charts
- [ ] **Database Integration**: Save and retrieve interview sessions
- [ ] **PDF Export**: Export reports as formatted PDFs
- [ ] **Email Sharing**: Send evaluation reports via email
- [ ] **Multi-language Support**: Internationalization for global use
- [ ] **Interview Scheduler**: Schedule and track interviews
- [ ] **Candidate Comparison**: Compare multiple candidates side-by-side

## Contributing

Contributions are welcome! This project is designed with modular, maintainable code to encourage open-source contributions.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Powered by [Google Gemini AI](https://ai.google.dev/)
- Built for the MLH Hackfest
- Created with ❤️ by Aurélie Gallet

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/aureliegallet/MLH-hackfest/issues) on GitHub.