import { createEffect, type Accessor } from "solid-js";
import type { EditorView } from "@codemirror/view";
import { createNoteAttachmentPicker } from "@/composables/create-note-attachment-picker";
import { createEditorView } from "@/composables/create-editor-view";
import { createImageResolver } from "@/composables/create-image-resolver";
import { jumpRequest } from "@/composables/editor-jump-signal";
import { applyFormatToView } from "@/composables/apply-format-to-view";
import { viewSelectionAdapter } from "@/composables/view-selection-adapter";
import { useNotesStore } from "@/stores/notes.store";
import { ViewModeEnum, type INote } from "@/types/note.types";
import { resolveMarkdownShortcut } from "@/utils/markdown-shortcuts.util";
import type { TMarkdownFormat } from "@/utils/markdown-format.types";

/** Everything the note editor does: view mode (the CodeMirror live editor vs.
 *  the read-only rendered preview), body/title edits, markdown formatting
 *  against the CodeMirror selection, attachment picking, and outline jumps.
 *  Editing itself is a single Bear-style live-preview surface. */
export function createNoteEditor(note: Accessor<INote>) {
  let view: EditorView | undefined;
  const setView = (next: EditorView | undefined) => (view = next);

  const mode = createEditorView();
  const isSource = mode.isSource;
  const openSource = () => mode.setViewMode(ViewModeEnum.Source);

  const resolveImageSrc = createImageResolver(() => note().id);

  const updateBody = (body: string) =>
    useNotesStore.getState().updateNoteBody(note().id, body);
  const updateTitle = (title: string) =>
    useNotesStore.getState().updateNoteTitle(note().id, title);

  const picker = createNoteAttachmentPicker({
    note,
    getTextarea: () => (view ? viewSelectionAdapter(view) : undefined),
    updateNoteBody: (_id, body) => updateBody(body),
  });

  // Outline jumps: switch to the live editor, then move the caret to the
  // section and reveal it once CodeMirror has mounted into source view.
  createEffect(() => {
    const request = jumpRequest();
    if (!request) {
      return;
    }

    openSource();
    requestAnimationFrame(() => {
      if (!view) {
        return;
      }

      const length = view.state.doc.length;
      view.dispatch({
        selection: { anchor: Math.min(request.offset, length) },
        scrollIntoView: true,
      });
      view.focus();
    });
  });

  function applyFormat(format: TMarkdownFormat) {
    if (!view) {
      return;
    }

    applyFormatToView(view, format);
  }

  function focus() {
    view?.focus();
  }

  function applyShortcut(event: KeyboardEvent) {
    const format = resolveMarkdownShortcut(event);
    if (!format || !view) {
      return false;
    }

    event.preventDefault();
    event.stopPropagation();
    applyFormat(format);

    return true;
  }

  return {
    isSource,
    openSource,
    resolveImageSrc,
    setView,
    focus,
    updateBody,
    updateTitle,
    applyFormat,
    applyShortcut,
    picker,
  };
}