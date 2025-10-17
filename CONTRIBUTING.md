# Contributing to AI Interviewer

Thank you for your interest in contributing to AI Interviewer! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

This project follows the standard open-source code of conduct. Please be respectful and constructive in all interactions.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- A clear title and description
- Steps to reproduce the issue
- Expected vs actual behavior
- Screenshots if applicable
- Your environment (OS, Node version, browser)

### Suggesting Enhancements

We welcome feature suggestions! Please open an issue with:
- A clear description of the feature
- Use cases and benefits
- Any implementation ideas you have

### Pull Requests

1. **Fork the repository** and create a branch from `main`
2. **Install dependencies**: `npm run install:all`
3. **Make your changes** following our coding standards
4. **Test your changes**: Ensure builds work (`npm run build:all`)
5. **Commit your changes** with clear, descriptive messages
6. **Push to your fork** and submit a pull request

## Development Setup

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- A Google Gemini API key for testing

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/MLH-hackfest.git
cd MLH-hackfest

# Install all dependencies
npm run install:all

# Set up environment variables
cd backend
cp .env.example .env
# Edit .env and add your Gemini API key

cd ../frontend
cp .env.example .env
```

### Running Locally

```bash
# Terminal 1 - Start backend
npm run dev:backend

# Terminal 2 - Start frontend
npm run dev:frontend
```

## Project Structure

- `backend/` - Node.js/Express API
  - `src/config/` - Configuration files
  - `src/controllers/` - Request handlers
  - `src/services/` - Business logic
  - `src/routes/` - API routes
  - `src/middleware/` - Express middleware
  - `src/types/` - TypeScript types

- `frontend/` - React application
  - `src/components/` - React components
  - `src/services/` - API integration
  - `src/types/` - TypeScript types
  - `src/utils/` - Utility functions

## Coding Standards

### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` types when possible

### React
- Use functional components with hooks
- Keep components focused and reusable
- Use meaningful prop names

### Code Style
- Use 2 spaces for indentation
- Use meaningful variable and function names
- Add comments for complex logic
- Follow existing code patterns

### Commits
- Use clear, descriptive commit messages
- Start with a verb (Add, Fix, Update, Remove, etc.)
- Keep commits focused on a single change

## Testing

Before submitting a PR:
1. Test the full application flow
2. Verify both frontend and backend build successfully
3. Check for console errors
4. Test on different browsers if changing UI

## Areas for Contribution

We especially welcome contributions in these areas:
- Auth0 integration for user authentication
- Enhanced visualization with DigitalOcean Gradient AI
- PDF export functionality
- Email sharing capabilities
- Internationalization (i18n)
- Accessibility improvements
- Performance optimizations
- Additional test coverage
- Documentation improvements

## Getting Help

- Open a discussion in GitHub Discussions
- Comment on existing issues
- Join our community channels (if available)

## License

By contributing to AI Interviewer, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🎉
