import type {
  IMarkdownFormatResult,
  IMarkdownRange,
  THeadingLevel,
} from "@/utils/markdown-format.types";

interface ISelectedLines {
  lineEnd: number;
  lines: string[];
  lineStart: number;
}

/** Expand a selection to the full lines it touches, so line-level formats apply
 *  to whole lines regardless of where the caret sits within them. */
function selectLines(range: IMarkdownRange, fallback: string): ISelectedLines {
  const { selectionEnd, selectionStart, value } = range;

  const lineBreakIndex =
    selectionStart === 0 ? -1 : value.lastIndexOf("\n", selectionStart - 1);
  const lineStart = lineBreakIndex + 1;

  const nextBreakIndex = value.indexOf("\n", selectionEnd);
  const lineEnd = nextBreakIndex === -1 ? value.length : nextBreakIndex;

  const selectedLines = value.slice(lineStart, lineEnd) || fallback;

  return { lineStart, lineEnd, lines: selectedLines.split("\n") };
}

function replaceLines(
  range: IMarkdownRange,
  selection: ISelectedLines,
  nextLines: string[],
): IMarkdownFormatResult {
  const replacement = nextLines.join("\n");

  return {
    value:
      range.value.slice(0, selection.lineStart) +
      replacement +
      range.value.slice(selection.lineEnd),
    selectionStart: selection.lineStart,
    selectionEnd: selection.lineStart + replacement.length,
  };
}

/** Toggle a plain line prefix (bullet list, quote) on every selected line. */
export function toggleLinePrefix(
  range: IMarkdownRange,
  prefix: string,
  fallback: string,
): IMarkdownFormatResult {
  const selection = selectLines(range, fallback);

  const shouldRemove = selection.lines.every(line => line.startsWith(prefix));
  const nextLines = selection.lines.map(line =>
    shouldRemove ? line.slice(prefix.length) : `${prefix}${line}`,
  );

  return replaceLines(range, selection, nextLines);
}

const CHECKLIST_PATTERN = /^- \[[ x]\] /;

/** Toggle a GitHub-style task list (`- [ ] `) on every selected line. */
export function toggleChecklist(range: IMarkdownRange): IMarkdownFormatResult {
  const selection = selectLines(range, "Task");

  const shouldRemove = selection.lines.every(line =>
    CHECKLIST_PATTERN.test(line),
  );
  const nextLines = selection.lines.map(line =>
    shouldRemove ? line.replace(CHECKLIST_PATTERN, "") : `- [ ] ${line}`,
  );

  return replaceLines(range, selection, nextLines);
}

const ORDERED_PATTERN = /^\d+\. /;

/** Toggle a numbered list, renumbering each selected line from 1. */
export function toggleOrderedList(range: IMarkdownRange): IMarkdownFormatResult {
  const selection = selectLines(range, "List item");

  const shouldRemove = selection.lines.every(line =>
    ORDERED_PATTERN.test(line),
  );
  const nextLines = selection.lines.map((line, index) =>
    shouldRemove ? line.replace(ORDERED_PATTERN, "") : `${index + 1}. ${line}`,
  );

  return replaceLines(range, selection, nextLines);
}

/** Set every selected line to a heading of `level`; selecting the same level
 *  again strips the heading so the button toggles. */
export function toggleHeading(
  range: IMarkdownRange,
  level: THeadingLevel,
): IMarkdownFormatResult {
  const selection = selectLines(range, "Heading");

  const prefix = `${"#".repeat(level)} `;
  const shouldRemove = selection.lines.every(line => line.startsWith(prefix));
  const nextLines = selection.lines.map(line =>
    shouldRemove ? line.replace(prefix, "") : `${prefix}${line.replace(/^#{1,6}\s/, "")}`,
  );

  return replaceLines(range, selection, nextLines);
}