import type { EditorView } from "@codemirror/view";

/** The selection surface the attachment picker reads — a textarea-shaped subset
 *  satisfied by both a real `<textarea>` and the CodeMirror adapter below. */
export type TSelectionTarget = Pick<
  HTMLTextAreaElement,
  "selectionStart" | "selectionEnd" | "value" | "setSelectionRange" | "focus"
>;

/** A minimal textarea-shaped facade over a CodeMirror view. Lets the attachment
 *  picker stay untouched while the underlying editor is CodeMirror, not a real
 *  `<textarea>`. */
export function viewSelectionAdapter(view: EditorView): TSelectionTarget {
  return {
    get selectionStart() {
      return view.state.selection.main.from;
    },
    get selectionEnd() {
      return view.state.selection.main.to;
    },
    get value() {
      return view.state.doc.toString();
    },
    setSelectionRange(start: number | null, end: number | null) {
      const length = view.state.doc.length;
      const anchor = Math.min(start ?? 0, length);
      const head = Math.min(end ?? anchor, length);
      view.dispatch({ selection: { anchor, head }, scrollIntoView: true });
    },
    focus() {
      view.focus();
    },
  };
}