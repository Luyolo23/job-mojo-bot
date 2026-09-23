# CareerFit

CareerFit is an AI-powered career assistant that helps job seekers understand how well their CV matches a specific job description — and helps them improve that match. Users upload their CV and a job posting, then chat with an AI assistant to get a match analysis, interview preparation, and a tailored version of their CV rewritten for that specific role.

The app is fully **stateless** — no accounts, no stored user data. Everything lives in the browser session and is cleared on refresh.

## Features

- 📄 **Upload your CV** (PDF, DOCX, or plain text) and a job description (upload or paste)
- 🔍 **Match analysis** — see your match score, matched keywords, missing keywords, and quick-win suggestions
- 💬 **AI chat assistant** — ask follow-up questions about how to position your experience for the role
- 🎯 **Interview preparation** — likely interview questions based on the job description, with STAR-method answer suggestions drawn from your actual CV
- ✍️ **Tailored CV generation** — get a rewritten version of your CV that emphasizes the skills and keywords the job description is looking for, downloadable as PDF or DOCX
- 🔒 **Privacy-first** — nothing is stored server-side; your CV and job description only exist for the duration of your session

## Tech Stack

- **Frontend:** React + TypeScript
- **AI:** [Groq API](https://groq.com) for chat, analysis, and CV rewriting
- **Backend:** Lightweight edge function as a secure proxy to the Groq API (no database, no persistent storage)

## Getting Started

```bash
# Clone the repository
git clone <repo-url>
cd careerfit

# Install dependencies
npm install

# Start the development server
npm run dev
```

You'll need a Groq API key set as a `GROQ_API_KEY` secret for the AI features to work. See the project's Lovable Cloud Secrets panel or your local `.env` setup for configuration.

## How It Works

1. Upload your CV and the job description you're applying for
2. The app parses both documents and generates a match analysis
3. Chat with the AI assistant about your match, get interview prep, or ask for a tailored CV
4. Download your tailored CV once you're happy with it

## Collaborators

- Luyolo Tuta
- Mbali Mazibuko
- Geneva Mokoena
- Moleboheng Hlalele
- Adriyell Lopis

## Disclaimer

CareerFit is a tool to assist with job applications, not a guarantee of interview or hiring outcomes. Always review AI-generated content before submitting it as part of a real application.
