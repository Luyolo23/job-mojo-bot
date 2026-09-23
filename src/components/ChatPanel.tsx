import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/types";

const SUGGESTIONS = [
  "What interview questions should I expect?",
  "Draft a STAR answer for my strongest project",
  "How do I explain my career gap?",
  "What should I ask the interviewer?",
];

export function ChatPanel({
  messages,
  busy,
  onSend,
  onDownloadNotes,
  notesBusy,
}: {
  messages: ChatMessage[];
  busy: boolean;
  onSend: (text: string) => void;
  onDownloadNotes: () => void;
  notesBusy: boolean;
}) {
  const [value, setValue] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    onSend(trimmed);
    setValue("");
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="font-display text-base font-semibold">Interview prep &amp; Q&amp;A</h2>
          <p className="text-xs text-slate-400">In-session only · cleared on refresh</p>
        </div>
        <button
          onClick={onDownloadNotes}
          disabled={notesBusy}
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink hover:bg-slate-50 disabled:text-slate-400"
        >
          {notesBusy ? "Preparing…" : "Download prep notes (PDF)"}
        </button>
      </div>

      <div className="max-h-[52vh] flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {messages.length === 0 && (
          <p className="text-sm text-slate-500">
            Ask anything about this role — likely questions, how to position your experience, or
            what to ask them.
          </p>
        )}
        {messages.map((m) =>
          m.role === "assistant" ? (
            <div key={m.id} className="flex gap-3">
              <div className="grid size-8 shrink-0 place-items-center rounded-full bg-brand font-display text-sm font-bold text-white">
                C
              </div>
              <div className="max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3 text-sm text-slate-700">
                {m.content}
              </div>
            </div>
          ) : (
            <div key={m.id} className="flex flex-row-reverse gap-3">
              <div className="grid size-8 shrink-0 place-items-center rounded-full bg-ink font-display text-[11px] font-bold text-white">
                You
              </div>
              <div className="max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-brand px-4 py-3 text-sm text-white">
                {m.content}
              </div>
            </div>
          ),
        )}
        {busy && (
          <div className="flex gap-3">
            <div className="grid size-8 shrink-0 place-items-center rounded-full bg-brand font-display text-sm font-bold text-white">
              C
            </div>
            <div className="rounded-2xl rounded-tl-sm bg-slate-100 px-4 py-3 text-sm text-slate-400">
              Thinking…
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="border-t border-slate-100 px-5 py-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-brand/40 hover:text-ink"
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send(value);
            }}
            placeholder="Ask about positioning your experience…"
            className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-slate-400"
          />
          <button
            onClick={() => send(value)}
            disabled={busy}
            className="grid size-8 place-items-center rounded-lg bg-brand text-white disabled:bg-slate-300"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
