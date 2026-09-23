import type { Analysis, ChatMessage } from "./types";

type Msg = { role: "system" | "user" | "assistant"; content: string };

async function callGroq(options: {
  messages: Msg[];
  json?: boolean;
  temperature?: number;
  maxTokens?: number;
}): Promise<string> {
  const res = await fetch("/api/groq", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options),
  });
  const data = (await res.json()) as { content?: string; error?: string };
  if (!res.ok) throw new Error(data.error ?? "Something went wrong talking to the AI.");
  return data.content ?? "";
}

const clip = (text: string, max = 16000) => text.slice(0, max);

function docsBlock(cv: string, jd: string) {
  return `--- CANDIDATE CV ---\n${clip(cv)}\n\n--- JOB DESCRIPTION ---\n${clip(jd)}`;
}

export async function runAnalysis(cv: string, jd: string): Promise<Analysis> {
  const content = await callGroq({
    json: true,
    temperature: 0.2,
    messages: [
      {
        role: "system",
        content:
          "You are an expert recruiter and ATS specialist. Reply with a single JSON object only, with keys: score (integer 0-100), verdict (one of Weak, Moderate, Strong, Excellent), roleTitle (string), company (string, empty if unknown), matched (array of short keyword strings), missing (array of short keyword strings), quickWins (array of short actionable sentences), atsNotes (array of short sentences), strengths (array of short sentences), gaps (array of short sentences). Keep each array to at most 10 items and each sentence under 140 characters. Base everything strictly on the documents given.",
      },
      { role: "user", content: docsBlock(cv, jd) },
    ],
  });

  const raw = JSON.parse(content) as Partial<Analysis>;
  const arr = (v: unknown) =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").slice(0, 10) : [];
  return {
    score: Math.max(0, Math.min(100, Math.round(Number(raw.score) || 0))),
    verdict: typeof raw.verdict === "string" ? raw.verdict : "Moderate",
    roleTitle: typeof raw.roleTitle === "string" ? raw.roleTitle : "This role",
    company: typeof raw.company === "string" ? raw.company : "",
    matched: arr(raw.matched),
    missing: arr(raw.missing),
    quickWins: arr(raw.quickWins),
    atsNotes: arr(raw.atsNotes),
    strengths: arr(raw.strengths),
    gaps: arr(raw.gaps),
  };
}

export async function chatReply(
  cv: string,
  jd: string,
  history: ChatMessage[],
  question: string,
): Promise<string> {
  return callGroq({
    temperature: 0.6,
    messages: [
      {
        role: "system",
        content:
          "You are CareerFit, a sharp, practical career coach. You have the candidate's real CV and the job description below. Give concrete, specific advice grounded only in their real experience — never invent jobs, employers, or achievements. For interview questions, offer STAR-structured answers built from their actual CV content. Keep answers tight and skimmable with short paragraphs or bullets in plain markdown-free text.\n\n" +
          docsBlock(cv, jd),
      },
      ...history.slice(-12).map((m) => ({ role: m.role, content: m.content }) as Msg),
      { role: "user", content: question },
    ],
  });
}

export async function tailorCv(cv: string, jd: string): Promise<string> {
  return callGroq({
    temperature: 0.3,
    maxTokens: 6000,
    messages: [
      {
        role: "system",
        content:
          "Rewrite the candidate's CV so it targets the job description. Rules: use only real experience, employers, dates and achievements from the original CV — never invent anything. Reorder and rephrase to lead with the most relevant experience, mirror the job description's terminology where it honestly applies, and keep it ATS-friendly. Output plain text only, with section headings in capitals (SUMMARY, EXPERIENCE, SKILLS, EDUCATION) and bullets starting with '- '. No commentary before or after.",
      },
      { role: "user", content: docsBlock(cv, jd) },
    ],
  });
}

export async function writeCoverLetter(cv: string, jd: string): Promise<string> {
  return callGroq({
    temperature: 0.5,
    messages: [
      {
        role: "system",
        content:
          "Write a focused cover letter (max 350 words) for this job, using only the candidate's real experience from their CV. Warm but professional, no clichés, no invented facts. Plain text only.",
      },
      { role: "user", content: docsBlock(cv, jd) },
    ],
  });
}

export async function interviewPrepNotes(cv: string, jd: string): Promise<string> {
  return callGroq({
    temperature: 0.5,
    maxTokens: 5000,
    messages: [
      {
        role: "system",
        content:
          "Produce interview prep notes in plain text with capitalised section headings: LIKELY QUESTIONS, STAR ANSWERS (built from the candidate's real CV content), QUESTIONS TO ASK THE INTERVIEWER, THINGS TO REHEARSE. Bullets start with '- '. Never invent experience.",
      },
      { role: "user", content: docsBlock(cv, jd) },
    ],
  });
}
