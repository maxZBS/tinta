import type { EditorView } from "@codemirror/view";
import { applyMarkdownFormat } from "@/utils/markdown-format.util";
import type { TMarkdownFormat } from "@/utils/markdown-format.types";

/** Bridge the existing string-based markdown formatter onto a CodeMirror view:
 *  read the current selection, run the same `applyMarkdownFormat` logic the old
 *  textarea used, then write the result back as one dispatch and restore the
 *  selection. Keeps a single source of truth for formatting behaviour. */
export function applyFormatToView(
  view: EditorView,
  format: TMarkdownFormat,
): void {
  const main = view.state.selection.main;
  const value = view.state.doc.toString();

  const result = applyMarkdownFormat(
    { selectionStart: main.from, selectionEnd: main.to, value },
    format,
  );

  view.dispatch({
    changes: { from: 0, to: value.length, insert: result.value },
    selection: { anchor: result.selectionStart, head: result.selectionEnd },
  });
  view.focus();
}