import type { TMarkdownFormat } from "@/utils/markdown-format.types";

interface IMarkdownShortcut {
  alt?: boolean;
  code: string;
  format: TMarkdownFormat;
  shift?: boolean;
}

const MARKDOWN_SHORTCUTS: IMarkdownShortcut[] = [
  { code: "Digit1", format: "heading-1", alt: true },
  { code: "Digit2", format: "heading-2", alt: true },
  { code: "Digit3", format: "heading-3", alt: true },
  { code: "KeyB", format: "bold" },
  { code: "KeyI", format: "italic" },
  { code: "KeyH", format: "highlight", shift: true },
  { code: "Digit8", format: "bullet-list", shift: true },
  { code: "Digit7", format: "ordered-list", shift: true },
  { code: "Digit9", format: "checklist", shift: true },
  { code: "Period", format: "quote", shift: true },
  { code: "KeyK", format: "link" },
  { code: "KeyE", format: "code" },
];

function isCommandShortcut(event: KeyboardEvent) {
  return event.metaKey || event.ctrlKey;
}

function matchesModifiers(
  event: KeyboardEvent,
  shortcut: IMarkdownShortcut,
) {
  return (
    event.altKey === Boolean(shortcut.alt) &&
    event.shiftKey === Boolean(shortcut.shift)
  );
}

export function resolveMarkdownShortcut(
  event: KeyboardEvent,
): TMarkdownFormat | null {
  if (!isCommandShortcut(event)) {
    return null;
  }

  const shortcut = MARKDOWN_SHORTCUTS.find(candidate => {
    if (!matchesModifiers(event, candidate)) {
      return false;
    }

    return event.code === candidate.code;
  });

  return shortcut?.format ?? null;
}
