import type {
  IMarkdownFormatResult,
  IMarkdownRange,
  THeadingLevel,
  TMarkdownFormat,
} from "@/utils/markdown-format.types";
import {
  toggleChecklist,
  toggleHeading,
  toggleLinePrefix,
  toggleOrderedList,
} from "@/utils/markdown-line-format.util";

const INLINE_FORMATS = {
  bold: { fallback: "bold text", prefix: "**", suffix: "**" },
  italic: { fallback: "italic text", prefix: "_", suffix: "_" },
  highlight: { fallback: "highlight", prefix: "==", suffix: "==" },
  code: { fallback: "code", prefix: "`", suffix: "`" },
} as const;

function toggleInlineFormat(
  range: IMarkdownRange,
  format: keyof typeof INLINE_FORMATS,
): IMarkdownFormatResult {
  const { fallback, prefix, suffix } = INLINE_FORMATS[format];
  const { selectionEnd, selectionStart, value } = range;

  const selectedText = value.slice(selectionStart, selectionEnd);
  const before = value.slice(selectionStart - prefix.length, selectionStart);
  const after = value.slice(selectionEnd, selectionEnd + suffix.length);

  if (before === prefix && after === suffix) {
    return {
      value:
        value.slice(0, selectionStart - prefix.length) +
        selectedText +
        value.slice(selectionEnd + suffix.length),
      selectionStart: selectionStart - prefix.length,
      selectionEnd: selectionEnd - prefix.length,
    };
  }

  if (selectedText.startsWith(prefix) && selectedText.endsWith(suffix)) {
    const nextText = selectedText.slice(prefix.length, -suffix.length);
    return replaceSelection(range, nextText);
  }

  return replaceSelection(range, `${prefix}${selectedText || fallback}${suffix}`);
}

function replaceSelection(
  range: IMarkdownRange,
  replacement: string,
): IMarkdownFormatResult {
  const { selectionEnd, selectionStart, value } = range;

  return {
    value:
      value.slice(0, selectionStart) +
      replacement +
      value.slice(selectionEnd),
    selectionStart,
    selectionEnd: selectionStart + replacement.length,
  };
}

function toggleLink(range: IMarkdownRange): IMarkdownFormatResult {
  const selectedText = range.value.slice(range.selectionStart, range.selectionEnd);
  const linkMatch = selectedText.match(/^\[(.+)\]\((.*)\)$/);

  if (linkMatch) {
    return replaceSelection(range, linkMatch[1]);
  }

  return replaceSelection(range, `[${selectedText || "Link text"}](https://)`);
}

const HEADING_LEVELS: Record<string, THeadingLevel> = {
  heading: 2,
  "heading-1": 1,
  "heading-2": 2,
  "heading-3": 3,
  "heading-4": 4,
  "heading-5": 5,
  "heading-6": 6,
};

export function applyMarkdownFormat(
  range: IMarkdownRange,
  format: TMarkdownFormat,
): IMarkdownFormatResult {
  const headingLevel = HEADING_LEVELS[format];
  if (headingLevel) {
    return toggleHeading(range, headingLevel);
  }

  switch (format) {
    case "bold":
    case "italic":
    case "highlight":
    case "code":
      return toggleInlineFormat(range, format);
    case "checklist":
      return toggleChecklist(range);
    case "bullet-list":
      return toggleLinePrefix(range, "- ", "List item");
    case "ordered-list":
      return toggleOrderedList(range);
    case "quote":
      return toggleLinePrefix(range, "> ", "Quote");
    case "link":
      return toggleLink(range);
    default:
      return range;
  }
}