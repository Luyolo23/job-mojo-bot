import { useState } from "react";
import { downloadDocx, downloadPdf } from "@/lib/download";

export function TailoredCvPanel({
  originalCv,
  tailored,
  coverLetter,
  busy,
  coverBusy,
  onGenerate,
  onCoverLetter,
}: {
  originalCv: string;
  tailored: string | null;
  coverLetter: string | null;
  busy: boolean;
  coverBusy: boolean;
  onGenerate: () => void;
  onCoverLetter: () => void;
}) {
  const [mobileView, setMobileView] = useState<"original" | "tailored">("tailored");

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">Step 4</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">Tailored CV</h1>
          <p className="mt-1 text-sm text-slate-500">
            Same real experience, reordered and rephrased for this job.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onGenerate}
            disabled={busy}
            className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-deep disabled:bg-slate-300"
          >
            {busy ? "Rewriting…" : tailored ? "Regenerate" : "Generate tailored CV"}
          </button>
          <button
            onClick={onCoverLetter}
            disabled={coverBusy}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-slate-50 disabled:text-slate-400"
          >
            {coverBusy ? "Writing…" : "Write cover letter"}
          </button>
        </div>
      </div>

      <div className="mb-4 flex gap-1 rounded-lg bg-slate-100 p-0.5 text-xs font-medium md:hidden">
        {(["original", "tailored"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setMobileView(v)}
            className={`flex-1 rounded-md px-2.5 py-1.5 capitalize ${
              mobileView === v ? "bg-white text-ink shadow-sm" : "text-slate-500"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div
          className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${mobileView === "original" ? "" : "hidden md:block"}`}
        >
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-display text-base font-semibold">Original</h2>
            <p className="text-xs text-slate-400">As you uploaded it</p>
          </div>
          <pre className="max-h-[60vh] overflow-y-auto whitespace-pre-wrap px-5 py-5 font-sans text-xs leading-relaxed text-slate-600">
            {originalCv}
          </pre>
        </div>

        <div
          className={`flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm ${mobileView === "tailored" ? "" : "hidden md:flex"}`}
        >
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-display text-base font-semibold">Tailored</h2>
            <p className="text-xs text-slate-400">Reordered to match the job description</p>
          </div>
          <pre className="max-h-[60vh] flex-1 overflow-y-auto whitespace-pre-wrap px-5 py-5 font-sans text-xs leading-relaxed text-slate-700">
            {tailored ?? "Generate a tailored CV to see it here, side by side with your original."}
          </pre>
          {tailored && (
            <div className="flex gap-2 border-t border-slate-100 px-5 py-4">
              <button
                onClick={() => downloadPdf(tailored, "tailored-cv.pdf")}
                className="flex-1 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-deep"
              >
                Download PDF
              </button>
              <button
                onClick={() => downloadDocx(tailored, "tailored-cv.docx")}
                className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-slate-50"
              >
                Download DOCX
              </button>
            </div>
          )}
        </div>
      </div>

      {coverLetter && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-4">
            <h2 className="font-display text-base font-semibold">Cover letter</h2>
            <div className="flex gap-2">
              <button
                onClick={() => downloadPdf(coverLetter, "cover-letter.pdf")}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-slate-50"
              >
                PDF
              </button>
              <button
                onClick={() => downloadDocx(coverLetter, "cover-letter.docx")}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-slate-50"
              >
                DOCX
              </button>
            </div>
          </div>
          <pre className="whitespace-pre-wrap px-5 py-5 font-sans text-xs leading-relaxed text-slate-700">
            {coverLetter}
          </pre>
        </div>
      )}
    </div>
  );
}
