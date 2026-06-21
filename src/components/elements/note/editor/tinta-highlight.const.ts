import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import type { Extension } from "@codemirror/state";

/** Syntax-token styling for the markdown tree. Headings get real size + weight
 *  (CodeMirror owns the DOM, so no caret drift); emphasis, code, links and
 *  quotes read the Tinta palette. Marker tokens (the `#`, `**`, `>` glyphs)
 *  are dimmed here and additionally hidden off the active line by the
 *  decoration plugin. */
const tintaHighlightStyle = HighlightStyle.define([
  {
    tag: tags.heading1,
    color: "var(--color-text-primary)",
    fontWeight: "700",
    fontSize: "1.6rem",
    lineHeight: "2.4rem",
    letterSpacing: "-0.01em",
  },
  {
    tag: tags.heading2,
    color: "var(--color-text-primary)",
    fontWeight: "700",
    fontSize: "1.35rem",
    lineHeight: "2.1rem",
  },
  {
    tag: tags.heading3,
    color: "var(--color-text-primary)",
    fontWeight: "700",
    fontSize: "1.15rem",
    lineHeight: "1.9rem",
  },
  {
    tag: [tags.heading4, tags.heading5, tags.heading6],
    color: "var(--color-text-primary)",
    fontWeight: "700",
  },
  { tag: tags.strong, color: "var(--color-text-primary)", fontWeight: "700" },
  { tag: tags.emphasis, fontStyle: "italic" },
  { tag: tags.strikethrough, textDecoration: "line-through" },
  {
    tag: [tags.monospace, tags.labelName],
    color: "var(--color-accent-soft)",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  },
  {
    tag: [tags.link, tags.url],
    color: "var(--color-accent)",
    textDecoration: "underline",
    textUnderlineOffset: "2px",
  },
  { tag: tags.quote, color: "var(--color-text-muted)", fontStyle: "italic" },
  { tag: tags.list, color: "var(--color-text-secondary)" },
  { tag: tags.processingInstruction, color: "var(--color-text-muted)" },
]);

export const tintaSyntaxHighlighting: Extension =
  syntaxHighlighting(tintaHighlightStyle);