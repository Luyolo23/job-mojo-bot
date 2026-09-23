import { useState } from "react";
import { FileDrop } from "./FileDrop";
import { extractText } from "@/lib/extract";

export function UploadScreen({
  cv,
  jd,
  setCv,
  setJd,
  onAnalyse,
  busy,
}: {
  cv: { name: string; text: string } | null;
  jd: { name: string; text: string } | null;
  setCv: (d: { name: string; text: string } | null) => void;
  setJd: (d: { name: string; text: string } | null) => void;
  onAnalyse: () => void;
  busy: boolean;
}) {
  const [jdPaste, setJdPaste] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handle = async (file: File, target: "cv" | "jd") => {
    setError(null);
    try {
      const text = (await extractText(file)).trim();
      if (text.length < 40) {
        setError(
          "We couldn't read much text from that file. If it's a scanned PDF, paste the text instead.",
        );
        return;
      }
      const doc = { name: file.name, text };
      if (target === "cv") setCv(doc);
      else {
        setJd(doc);
        setJdPaste("");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "That file couldn't be read.");
    }
  };

  const ready = Boolean(cv?.text && (jd?.text || jdPaste.trim().length > 40));

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">Step 1</p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Add your CV and the job
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Everything is read in your browser and kept only in this tab — nothing is saved anywhere.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-base font-semibold">Your CV</h2>
          <p className="mb-4 text-xs text-slate-400">PDF, DOCX or plain text</p>
          <FileDrop
            label="Drop your CV here"
            hint="or click to choose a file"
            fileName={cv?.name}
            onFile={(f) => handle(f, "cv")}
          />
          {cv && (
            <p className="mt-3 text-xs text-slate-500">
              {cv.text.length.toLocaleString()} characters read
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-display text-base font-semibold">Job description</h2>
          <p className="mb-4 text-xs text-slate-400">Upload a file or paste the text</p>
          <FileDrop
            label="Drop the job description"
            hint="or click to choose a file"
            fileName={jd?.name}
            onFile={(f) => handle(f, "jd")}
          />
          <textarea
            value={jdPaste}
            onChange={(e) => {
              setJdPaste(e.target.value);
              if (e.target.value.trim().length > 40)
                setJd({ name: "Pasted job description", text: e.target.value.trim() });
              else setJd(null);
            }}
            placeholder="…or paste the job description here"
            className="mt-3 h-28 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-ink outline-none placeholder:text-slate-400 focus:border-brand"
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col items-center gap-3">
        <button
          disabled={!ready || busy}
          onClick={onAnalyse}
          className="rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {busy ? "Analysing…" : "Analyse match"}
        </button>
        <p className="text-xs text-slate-400">
          CareerFit is fully stateless — refresh the page and everything is gone.
        </p>
      </div>
    </div>
  );
}
