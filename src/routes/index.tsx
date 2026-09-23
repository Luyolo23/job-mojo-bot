import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { UploadScreen } from "@/components/UploadScreen";
import { AnalysisDashboard } from "@/components/AnalysisDashboard";
import { ChatPanel } from "@/components/ChatPanel";
import { TailoredCvPanel } from "@/components/TailoredCvPanel";
import { chatReply, interviewPrepNotes, runAnalysis, tailorCv, writeCoverLetter } from "@/lib/ai";
import { downloadPdf } from "@/lib/download";
import { newId, type Analysis, type ChatMessage } from "@/lib/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CareerFit — match your CV to any job, then prep for the interview" },
      {
        name: "description",
        content:
          "Upload your CV and a job description to get a match score, missing keywords, interview prep and a tailored CV. Nothing is stored — it all clears on refresh.",
      },
      { property: "og:title", content: "CareerFit — AI career assistant" },
      {
        property: "og:description",
        content:
          "Match score, ATS keywords, interview prep and a tailored CV you can download. Fully stateless.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CareerFit,
});

type Doc = { name: string; text: string };
type View = "upload" | "analysis" | "chat" | "cv";

function CareerFit() {
  const [cv, setCv] = useState<Doc | null>(null);
  const [jd, setJd] = useState<Doc | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [tailored, setTailored] = useState<string | null>(null);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [view, setView] = useState<View>("upload");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<null | "analysis" | "chat" | "cv" | "cover" | "notes">(null);

  const fail = (e: unknown) =>
    setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");

  const analyse = async () => {
    if (!cv || !jd) return;
    setBusy("analysis");
    setError(null);
    try {
      setAnalysis(await runAnalysis(cv.text, jd.text));
      setView("analysis");
    } catch (e) {
      fail(e);
    } finally {
      setBusy(null);
    }
  };

  const send = async (text: string) => {
    if (!cv || !jd) return;
    const history = messages;
    setMessages([...history, { id: newId(), role: "user", content: text }]);
    setBusy("chat");
    setError(null);
    try {
      const reply = await chatReply(cv.text, jd.text, history, text);
      setMessages((prev) => [...prev, { id: newId(), role: "assistant", content: reply }]);
    } catch (e) {
      fail(e);
    } finally {
      setBusy(null);
    }
  };

  const generateCv = async () => {
    if (!cv || !jd) return;
    setBusy("cv");
    setError(null);
    try {
      setTailored(await tailorCv(cv.text, jd.text));
    } catch (e) {
      fail(e);
    } finally {
      setBusy(null);
    }
  };

  const generateCover = async () => {
    if (!cv || !jd) return;
    setBusy("cover");
    setError(null);
    try {
      setCoverLetter(await writeCoverLetter(cv.text, jd.text));
    } catch (e) {
      fail(e);
    } finally {
      setBusy(null);
    }
  };

  const downloadNotes = async () => {
    if (!cv || !jd) return;
    setBusy("notes");
    setError(null);
    try {
      const notes = await interviewPrepNotes(cv.text, jd.text);
      await downloadPdf(notes, "interview-prep-notes.pdf");
    } catch (e) {
      fail(e);
    } finally {
      setBusy(null);
    }
  };

  const clearSession = () => {
    setCv(null);
    setJd(null);
    setAnalysis(null);
    setMessages([]);
    setTailored(null);
    setCoverLetter(null);
    setError(null);
    setView("upload");
  };

  const tabs: { id: View; label: string; enabled: boolean }[] = [
    { id: "upload", label: "Upload", enabled: true },
    { id: "analysis", label: "Analysis", enabled: Boolean(analysis) },
    { id: "chat", label: "Chat", enabled: Boolean(analysis) },
    { id: "cv", label: "Tailored CV", enabled: Boolean(analysis) },
  ];

  return (
    <div className="min-h-screen bg-surface font-sans text-ink antialiased">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-lg bg-brand font-display text-lg font-bold text-white">
              C
            </div>
            <div className="leading-tight">
              <p className="font-display text-[17px] font-bold tracking-tight">CareerFit</p>
              <p className="text-[11px] font-medium text-slate-400">AI career assistant</p>
            </div>
          </div>
          <nav className="hidden items-center gap-1 md:flex">
            {tabs.map((t) => (
              <button
                key={t.id}
                disabled={!t.enabled}
                onClick={() => setView(t.id)}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  view === t.id
                    ? "bg-slate-100 font-semibold text-ink"
                    : "font-medium text-slate-500 hover:bg-slate-100 hover:text-ink disabled:text-slate-300 disabled:hover:bg-transparent"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:flex">
              <span className="size-1.5 rounded-full bg-accent-green" />
              Your data isn&apos;t stored
            </span>
            <button
              onClick={clearSession}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-deep"
            >
              Clear session
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        {error && (
          <p className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {error}
          </p>
        )}

        {view === "upload" && (
          <UploadScreen
            cv={cv}
            jd={jd}
            setCv={setCv}
            setJd={setJd}
            onAnalyse={analyse}
            busy={busy === "analysis"}
          />
        )}

        {view === "analysis" && analysis && (
          <AnalysisDashboard
            analysis={analysis}
            onChat={() => setView("chat")}
            onTailor={() => setView("cv")}
          />
        )}

        {view === "chat" && (
          <ChatPanel
            messages={messages}
            busy={busy === "chat"}
            onSend={send}
            onDownloadNotes={downloadNotes}
            notesBusy={busy === "notes"}
          />
        )}

        {view === "cv" && cv && (
          <TailoredCvPanel
            originalCv={cv.text}
            tailored={tailored}
            coverLetter={coverLetter}
            busy={busy === "cv"}
            coverBusy={busy === "cover"}
            onGenerate={generateCv}
            onCoverLetter={generateCover}
          />
        )}

        <p className="mt-8 text-center text-xs text-slate-400">
          CareerFit is fully stateless — your CV, job description and chat live only in this browser
          tab and vanish on refresh.
        </p>
      </main>
    </div>
  );
}
