# Career Spark AI

Build an AI-powered career assistant web app called "CareerFit" (or suggest a better name).

Important: this app must be fully stateless. No user accounts, no login, no database persistence of user data. Everything (CV text, JD text, chat history, generated CV) lives only in the browser session (React state) and is cleared on refresh. Do not use Supabase or any backend database for storing user content — the only backend need is a lightweight edge function/serverless function to securely call the LLM API without exposing the API key client-side.

LLM provider: Use the Groq API (OpenAI-compatible chat completions endpoint) for all AI calls — parsing, analysis, chat, and CV rewriting. Use a fast Groq-hosted model (e.g. a Llama 3.1/3.3 instruct model) suitable for both quick chat responses and longer document rewriting. Store the Groq API key as a server-side secret used only inside the edge function, never exposed to the frontend.

Core flow:

User uploads their CV (PDF, DOCX, or plain text) and the job description (pasted as text or uploaded as a file).

The app extracts text from both files client-side or via the edge function (no storage — just parse and hold in memory/state).

The user interacts with an AI chat assistant to:

Get a match analysis (strengths, gaps, missing keywords, ATS compatibility)

Ask follow-up questions about positioning their experience

Get interview prep: likely questions based on the JD, STAR-method answer suggestions using their real CV content, and questions to ask the interviewer

Request a tailored CV rewritten to match the JD — same real experience, reordered/rephrased to emphasize relevant skills and keywords — downloadable as PDF or DOCX

Key screens:

Upload screen (CV + JD upload/paste, drag-and-drop)

Analysis dashboard: match score, matched/missing keywords, quick-win suggestions

Chat interface (in-session only, cleared on refresh) for interview prep and Q&A

Tailored CV preview with download button (PDF/DOCX), shown side-by-side with the original

Technical requirements:

No backend database — all state in-memory/client-side for the session

Edge/serverless function as a thin proxy to the Groq API (keeps the key server-side)

Client-side PDF/DOCX text extraction where possible; fall back to a lightweight server-side parse if needed

Clean, professional, trustworthy UI, mobile-responsive

Nice-to-haves if feasible:

Cover letter generator from the same inputs

Downloadable interview prep notes as PDF

Clear "your data isn't stored" messaging in the UI, since the app is stateless

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://job-mojo-bot.lovable.app
**Another Link**: https://job-mojo-h5brro81c-luyolo23s-projects.vercel.app/

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0eae4c2b-f199-4a00-87e3-035b5f61e839).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
