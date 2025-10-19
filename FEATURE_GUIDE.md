# PrepPilot Feature Guide

## File Upload and Review Process

### Overview
PrepPilot now includes a comprehensive file review and text editing workflow that ensures accurate text extraction before AI question generation.

### Workflow Steps

#### 1. Upload Documents
- Navigate to `/upload`
- Upload your resume/CV (PDF, DOCX, DOC, or TXT format)
- Upload the job description (PDF, DOCX, DOC, or TXT format)
- Both files are required to proceed
- Maximum file size: 10MB per file

#### 2. Review Extracted Content
After uploading, you'll be redirected to `/review` where you can:
- **View Extracted Text**: See the text extracted from both documents in separate tabs
- **Verify Accuracy**: Check if the text extraction captured all important information
- **Edit Content**: Make corrections or additions to the extracted text if needed

#### 3. Text Editing Features
- **Tab Navigation**: Switch between Resume/CV and Job Description tabs
- **Edit Mode**: Click the "Edit" button to enter editing mode
- **Save/Cancel**: Save your changes or cancel to revert
- **Inline Editing**: Edit text directly in a textarea with the original formatting preserved

#### 4. Generate Interview Questions
- Once you're satisfied with the extracted content, click "Generate Interview Questions"
- The AI will analyze both documents and create 7-10 personalized interview questions
- Questions are tailored to match:
  - Your experience and skills from the resume
  - Requirements and responsibilities from the job description
  - Technical and behavioral competencies
  - Problem-solving abilities

### AI Integration Requirements

**Important**: This application requires a valid Gemini API key to generate questions.

1. Obtain your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a `.env.local` file in the project root:
   ```bash
   GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Restart the development server

**No Default Questions**: The application will not fall back to generic questions. A valid API key is required for question generation.

### Supported File Formats

#### PDF Files
- Properly parsed using `pdf-parse` library
- Extracts text content from all pages
- Handles various PDF formats

#### DOCX Files
- Parsed using `mammoth` library
- Extracts formatted text content
- Preserves paragraph structure

#### DOC Files
- Limited support (binary format)
- Falls back to text extraction with cleanup

#### TXT Files
- Direct text extraction
- UTF-8 encoding

### Error Handling

The application provides clear error messages for:
- **Missing API Key**: "Gemini API key not configured. Please add GEMINI_API_KEY to your .env.local file."
- **Invalid API Key**: "Failed to generate questions using AI. Please check your API key and try again."
- **File Upload Errors**: "Failed to process files. Please ensure they are valid text-based documents."
- **File Size Errors**: "File size must be less than 10MB"

### Technical Details

#### API Endpoints

1. **POST /api/upload**
   - Accepts: FormData with `resume` and `jobDescription` files
   - Returns: Session ID and extracted text content
   - Processing: Uses appropriate parser based on file type

2. **POST /api/generate-questions**
   - Accepts: JSON with `sessionId`, `resumeText`, `jobDescriptionText`
   - Returns: Array of generated questions
   - Processing: Sends content to Gemini API for question generation

#### Security Features
- Session ID validation to prevent prototype pollution
- File size limits (10MB per file)
- Secure random session ID generation using `crypto.randomUUID()`
- No default questions fallback (ensures AI key is properly configured)

### Best Practices

1. **Review Before Generating**: Always review the extracted text before generating questions to ensure accuracy
2. **Edit If Needed**: Make corrections if the extraction missed important information
3. **Use Quality Files**: Upload clear, well-formatted documents for best extraction results
4. **Keep API Key Secure**: Never commit your `.env.local` file to version control

### Troubleshooting

**Q: The extracted text is incomplete or incorrect**
A: Use the Edit feature to make corrections before generating questions.

**Q: I get an API key error**
A: Ensure your `.env.local` file exists in the project root with a valid GEMINI_API_KEY.

**Q: PDF extraction is not working**
A: Make sure the PDF contains actual text (not just images). Scanned PDFs may not extract properly.

**Q: The review page doesn't load**
A: Clear your browser cache and session storage, then start the upload process again.
