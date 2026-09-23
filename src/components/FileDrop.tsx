import { useRef, useState } from "react";

export function FileDrop({
  label,
  hint,
  fileName,
  onFile,
}: {
  label: string;
  hint: string;
  fileName?: string | undefined;
  onFile: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) onFile(file);
      }}
      onClick={() => inputRef.current?.click()}
      className={`cursor-pointer rounded-xl border-2 border-dashed px-5 py-8 text-center transition-colors ${
        over ? "border-brand bg-brand/5" : "border-slate-200 bg-slate-50 hover:border-brand/40"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt,.md"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
      <p className="font-display text-sm font-semibold text-ink">{fileName ?? label}</p>
      <p className="mt-1 text-xs text-slate-500">{fileName ? "Click to replace" : hint}</p>
    </div>
  );
}
