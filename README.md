# AI Interviewer — README

A modern mock interview web app built with Next.js (App Router), Tailwind CSS, shadcn/ui components and Framer Motion. This README covers how to install, run, build, and contribute.

## Table of Contents

- Project overview
- Requirements
- Quick start (PowerShell)
- Scripts
- Project structure
- API routes
- Testing & verification
- Troubleshooting
- Contribution guide
- License

## Project overview

This project simulates an AI interviewer flow: upload resume & job description, run a short interview (mocked), and view detailed feedback with charts and audio playback. The UI uses shadcn/ui components and mock APIs under `app/api/`.

## Requirements

- Node.js 18 or later (recommended)
- npm (bundled with Node) or an alternative package manager (pnpm, yarn)
- Modern browser for testing (Chrome, Edge, Firefox)

Verify versions in PowerShell:

```powershell
node -v
npm -v
```

## Quick start (PowerShell)

1. Open PowerShell and cd into the project root (where `package.json` is):

```powershell
cd "C:\Users\charr\OneDrive\Desktop\Main Projects\AI Interviewer"
```

2. Install dependencies:

```powershell
npm install
```

3. Start the development server (hot reload):

```powershell
npm run dev
```

4. Open your browser to:

```
http://localhost:3000
```

## Scripts

Available npm scripts (from `package.json`):

- `npm run dev` — Start Next.js in development mode (uses turbopack here).
- `npm run build` — Build production assets.
- `npm run start` — Start the production server (after `npm run build`).
- `npm run lint` — Run ESLint.

If you want to run Next without turbopack for debugging, run:

```powershell
npx next dev
```

## Project structure (key files)

Top-level:

- `app/` — Next.js App Router pages and server actions
	- `app/page.js` — Landing page
	- `app/upload/page.js` — Upload workflow
	- `app/interview/page.js` — Interview UI
	- `app/feedback/page.js` — Feedback and charts
	- `app/api/` — Mock server route handlers (upload, interview, feedback)
- `components/` — Reusable components (FileUpload, AudioVisualizer, StepIndicator)
- `lib/utils.js` — Utilities used across app
- `public/` — Static assets
- `package.json` — Scripts and dependencies

## API routes (mocked)

This app relies on local API routes in `app/api/` for demo data. Important endpoints:

- `POST /api/upload` — Accepts form data (`resume`, `jobDescription`) and returns `sessionId` + generated question count.
- `POST /api/interview` — Actions for `start`, `submit_answer`, `pause`, `resume`, `end`. Responds with next question or transcription.
- `GET /api/feedback?sessionId={id}` — Returns mock feedback (scores, radar data, per-question details).

These are intentionally mocked to make the app self-contained for demos.

## Testing & verification

- After `npm run dev` you'll see logs in the terminal; successful build messages contain the local URL.
- Visit `http://localhost:3000` to manually exercise the flow: Upload -> Interview -> Feedback.
- Use browser DevTools to inspect API responses from `/api/*` endpoints for debugging.

## Troubleshooting

- "npm install" fails with native module or permission errors:
	- Ensure Node 18+ installed.
	- Try removing `node_modules` and lockfile and reinstalling:

```powershell
rm -r node_modules; rm package-lock.json; npm install
```

- Port 3000 already in use:
	- Kill the process using the port or start Next on a different port: `PORT=3001 npm run dev` (on PowerShell use `$env:PORT=3001; npm run dev`).

- Turbopack issues in dev:
	- Try running without turbopack: `npx next dev` or temporarily change `dev` script.

- ESLint errors:
	- Run `npm run lint` to view and fix issues.

If you hit an error you don't understand, copy the terminal output and open an issue or paste it here and I can help debug.

## Contribution guide

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Install deps and run locally
4. Open a PR describing your changes

Coding style and notes:

- The project uses Tailwind and shadcn/ui components. Keep UI additions consistent with existing components in `components/ui/`.
- Keep server route behavior in `app/api` simple and mocked unless adding real integrations.

## Adding real integrations (notes)

If you plan to connect to real AI or speech services, consider:

- Storing API keys in environment variables (`.env.local`) and reading them server-side only.
- Using a robust file parsing service for DOCX/PDF parsing before sending text to any LLM.
- Adding rate-limits and authentication before enabling production AI calls.

## License

This repository contains demo code produced for the MLH hackfest. See `LICENSE` for details.

---

If you'd like, I can also:
- Run `npm install` and `npm run dev` in the workspace terminal and report the output.
- Add a short `GETTING_STARTED.md` with step-by-step PowerShell screenshots or commands.

Tell me which of the above you'd like me to do next.

