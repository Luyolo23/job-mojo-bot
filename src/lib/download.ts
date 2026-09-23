// Generates files in the browser from in-memory text. Nothing is uploaded.

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const isHeading = (line: string) =>
  line.trim().length > 0 && line.trim() === line.trim().toUpperCase() && line.trim().length < 60;

export async function downloadPdf(text: string, filename: string) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const width = doc.internal.pageSize.getWidth() - margin * 2;
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = margin;

  for (const rawLine of text.split("\n")) {
    const line = rawLine.trimEnd();
    if (!line) {
      y += 8;
      continue;
    }
    const heading = isHeading(line);
    doc.setFont("helvetica", heading ? "bold" : "normal");
    doc.setFontSize(heading ? 12 : 10.5);
    const chunks = doc.splitTextToSize(line, width) as string[];
    for (const chunk of chunks) {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(chunk, margin, y);
      y += heading ? 18 : 14;
    }
    if (heading) y += 4;
  }

  doc.save(filename);
}

export async function downloadDocx(text: string, filename: string) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import("docx");
  const paragraphs = text.split("\n").map((rawLine) => {
    const line = rawLine.trim();
    if (!line) return new Paragraph({ text: "" });
    if (isHeading(line)) {
      return new Paragraph({ text: line, heading: HeadingLevel.HEADING_2, spacing: { before: 220, after: 90 } });
    }
    if (line.startsWith("- ")) {
      return new Paragraph({ text: line.slice(2), bullet: { level: 0 }, spacing: { after: 60 } });
    }
    return new Paragraph({ children: [new TextRun(line)], spacing: { after: 90 } });
  });

  const doc = new Document({ sections: [{ children: paragraphs }] });
  triggerDownload(await Packer.toBlob(doc), filename);
}
