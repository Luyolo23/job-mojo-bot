import type { Analysis } from "@/lib/types";

export function AnalysisDashboard({
  analysis,
  onChat,
  onTailor,
}: {
  analysis: Analysis;
  onChat: () => void;
  onTailor: () => void;
}) {
  const deg = Math.round((analysis.score / 100) * 360);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
            Match analysis
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {analysis.roleTitle}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            vs. your CV{analysis.company ? ` · ${analysis.company}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="size-2 rounded-full bg-accent-green" />
          Parsed in-browser · nothing leaves your session
        </div>
      </div>

      <section className="mb-6 grid gap-4 lg:grid-cols-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-4">
          <p className="text-sm font-medium text-slate-500">Overall match</p>
          <div className="mt-4 flex items-center gap-5">
            <div
              className="relative grid size-28 shrink-0 place-items-center rounded-full"
              style={{
                background: `conic-gradient(var(--brand) 0deg ${deg}deg, #E2E8F0 ${deg}deg 360deg)`,
              }}
            >
              <div className="grid size-22 place-items-center rounded-full bg-white">
                <div className="text-center leading-none">
                  <p className="font-display text-3xl font-bold">
                    {analysis.score}
                    <span className="text-lg text-slate-400">%</span>
                  </p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-accent-green">
                    {analysis.verdict}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-accent-green" />
                {analysis.matched.length} keywords matched
              </p>
              <p className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-warn" />
                {analysis.missing.length} keywords missing
              </p>
              <p className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-brand" />
                {analysis.quickWins.length} quick wins
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">Keyword coverage</h2>
            <span className="text-xs text-slate-400">ATS-ready</span>
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-600">
            Matched
          </p>
          <div className="mb-4 flex flex-wrap gap-2">
            {analysis.matched.map((k) => (
              <span
                key={k}
                className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200"
              >
                {k}
              </span>
            ))}
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-600">
            Missing
          </p>
          <div className="flex flex-wrap gap-2">
            {analysis.missing.map((k) => (
              <span
                key={k}
                className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-200"
              >
                {k}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
          <h2 className="mb-4 font-display text-base font-semibold">Quick wins</h2>
          <ul className="space-y-3">
            {analysis.quickWins.map((w, i) => (
              <li key={w} className="flex gap-2.5 text-sm text-slate-600">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand/10 text-xs font-bold text-brand">
                  {i + 1}
                </span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-4">
          <h2 className="mb-4 font-display text-base font-semibold">Strengths</h2>
          <ul className="space-y-2.5">
            {analysis.strengths.map((s) => (
              <li key={s} className="flex gap-2.5 text-sm text-slate-600">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent-green" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-4">
          <h2 className="mb-4 font-display text-base font-semibold">Gaps to address</h2>
          <ul className="space-y-2.5">
            {analysis.gaps.map((s) => (
              <li key={s} className="flex gap-2.5 text-sm text-slate-600">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-warn" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-4">
          <h2 className="mb-4 font-display text-base font-semibold">ATS notes</h2>
          <ul className="space-y-2.5">
            {analysis.atsNotes.map((s) => (
              <li key={s} className="flex gap-2.5 text-sm text-slate-600">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={onChat}
          className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-deep"
        >
          Prep for the interview
        </button>
        <button
          onClick={onTailor}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink hover:bg-slate-50"
        >
          Tailor my CV
        </button>
      </div>
    </div>
  );
}
