import { EditorView } from "@codemirror/view";

/** Visual shell of the editor: type metrics, spacing (4-pt grid), caret and
 *  selection colours. All colours read Tinta CSS variables so light/dark and
 *  the violet ink palette come for free. Unlike the old overlay, CodeMirror
 *  owns its DOM, so headings can be genuinely larger without caret drift. */
export const tintaEditorTheme = EditorView.theme({
  "&": {
    color: "var(--color-text-secondary)",
    backgroundColor: "transparent",
    fontSize: "1rem",
    height: "100%",
  },

  ".cm-scroller": {
    fontFamily: "inherit",
    lineHeight: "1.75rem",
    paddingBottom: "80px",
    overflow: "auto",
  },

  ".cm-content": {
    padding: "0",
    caretColor: "var(--color-accent)",
  },

  "&.cm-focused": {
    outline: "none",
  },

  ".cm-line": {
    padding: "0",
  },

  ".cm-cursor, .cm-dropCursor": {
    borderLeftColor: "var(--color-accent)",
  },

  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection": {
    backgroundColor: "var(--color-bg-selected)",
  },

  ".cm-placeholder": {
    color: "var(--color-text-muted)",
  },
});