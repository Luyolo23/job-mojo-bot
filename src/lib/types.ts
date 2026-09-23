export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type Analysis = {
  score: number;
  verdict: string;
  roleTitle: string;
  company: string;
  matched: string[];
  missing: string[];
  quickWins: string[];
  atsNotes: string[];
  strengths: string[];
  gaps: string[];
};

export type DocSource = {
  name: string;
  text: string;
};

export function newId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
