import { createEffect, onMount } from "solid-js";
import type { EditorView } from "@codemirror/view";
import { createCodeMirror } from "@/composables/create-codemirror";
import type { TResolveImageSrc } from "@/components/elements/note/editor/image-preview.plugin";

interface ICodeMirrorEditorProps {
  value: string;
  onInput: (value: string) => void;
  resolveImageSrc: TResolveImageSrc;
  setView: (view: EditorView | undefined) => void;
}

/** Thin Solid shell around the CodeMirror instance. Mounts once into a host the
 *  framework never re-renders, keeps the document in sync when the open note
 *  changes externally, and hands the live view up to the editor composable for
 *  selection reads, formatting and caret control. */
export function CodeMirrorEditor(props: ICodeMirrorEditorProps) {
  let host: HTMLDivElement | undefined;

  const editor = createCodeMirror({
    onChange: props.onInput,
    resolveImageSrc: props.resolveImageSrc,
  });

  onMount(() => {
    if (!host) {
      return;
    }

    editor.mount(host, props.value);
    props.setView(editor.getView());
  });

  // Pull external content changes (note switch, outline jump) into the view
  // without clobbering in-progress typing — setValue no-ops on equal text.
  createEffect(() => {
    editor.setValue(props.value);
  });

  return <div ref={host} class="mt-6 min-h-0 flex-1 overflow-hidden" />;
}