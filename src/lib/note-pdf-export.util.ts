import { invoke, isTauri } from "@tauri-apps/api/core";
import { sep } from "@tauri-apps/api/path";
import { formatCreatedLabel } from "@/lib/format-date.util";
import { renderMarkdown } from "@/lib/markdown.util";
import { NOTE_PDF_STYLE } from "@/lib/note-pdf-style.const";
import { getStorageRoot } from "@/lib/storage-root.util";
import {
  computeWritingStats,
  formatStatNumber,
} from "@/lib/writing-stats.util";
import type { INote } from "@/types/note.types";

interface INotePdfExportOptions {
  wordsPerMinute: number;
}

interface INotePdfAssetContext {
  notesDir: string;
  pathSeparator: string;
}

export function exportNotePdf(
  path: string,
  note: INote,
  options: INotePdfExportOptions,
): Promise<void> {
  return invoke("export_pdf_from_html", {
    path,
    html: buildNotePdfHtml(note, options),
  });
}

function buildNotePdfHtml(
  note: INote,
  options: INotePdfExportOptions,
) {
  const title = note.title.trim() || "Untitled";
  const assetContext = getPdfAssetContext();
  const stats = computeWritingStats(note.body, options.wordsPerMinute);
  const body = renderMarkdown(note.body, {
    resolveImageSrc: source =>
      assetContext
        ? resolvePdfImageSrc({ ...assetContext, noteId: note.id, source })
        : source,
  });

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>${escapeHtml(title)}</title>
    <style>${NOTE_PDF_STYLE}</style>
  </head>
  <body>
    <main class="pdf-shell">
      <section class="cover">
        <div class="brand">Tinta Notes</div>
        <h1 class="title">${escapeHtml(title)}</h1>
        ${renderTags(note.tags)}
        ${renderMeta([
          ["Created", formatCreatedLabel(note.created)],
          ["Updated", formatCreatedLabel(note.updated)],
          ["Words", formatStatNumber(stats.words)],
          ["Read", `${stats.readingMinutes} min`],
        ])}
      </section>
      <article class="content">${body || "<p>Empty note.</p>"}</article>
    </main>
  </body>
</html>`;
}

function getPdfAssetContext(): INotePdfAssetContext | null {
  if (!isTauri()) {
    return null;
  }

  try {
    return {
      notesDir: getStorageRoot(),
      pathSeparator: sep(),
    };
  } catch {
    return null;
  }
}

function resolvePdfImageSrc({
  noteId,
  notesDir,
  pathSeparator,
  source,
}: INotePdfAssetContext & { noteId: string; source: string }) {
  if (source.startsWith("http://") || source.startsWith("https://")) {
    return source;
  }
  if (!source.startsWith(`${noteId}/attachments/`)) {
    return source;
  }

  const filePath = [notesDir, ...source.split("/").filter(Boolean)].join(
    pathSeparator,
  );

  return pathToFileUrl(filePath);
}

function pathToFileUrl(path: string) {
  const normalizedPath = path.replace(/\\/g, "/");
  const encodedPath = normalizedPath
    .split("/")
    .map(part => encodeURIComponent(part))
    .join("/");

  return `file://${encodedPath}`;
}

function renderTags(tags: string[]) {
  if (tags.length === 0) {
    return "";
  }

  return `<div class="tags">${tags
    .map(tag => `<span class="tag">#${escapeHtml(tag)}</span>`)
    .join("")}</div>`;
}

/** A <table> row, not inline-blocks: printpdf's HTML engine mislays multiple
 *  inline-blocks on a line, collapsing them onto the same position. */
function renderMeta(items: Array<[label: string, value: string]>) {
  const cells = items
    .map(
      ([label, value]) => `<td class="meta-cell">
        <div class="meta-label">${escapeHtml(label)}</div>
        <div class="meta-value">${escapeHtml(value)}</div>
      </td>`,
    )
    .join("");

  return `<table class="meta-grid"><tr>${cells}</tr></table>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
