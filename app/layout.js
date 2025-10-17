import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "AI Interviewer - Prepare Smarter with AI-Powered Mock Interviews",
  description:
    "Practice interviews with AI-powered mock interviews. Upload your resume and job description, get instant feedback, and improve your interview skills.",
  keywords: [
    "AI interview",
    "mock interview",
    "interview practice",
    "job preparation",
    "AI interviewer",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
