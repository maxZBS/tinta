import { onCleanup } from "solid-js";
import { EditorView, keymap, placeholder } from "@codemirror/view";
import { Annotation, EditorState, type Extension } from "@codemirror/state";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { markdown } from "@codemirror/lang-markdown";
import { tintaEditorTheme } from "@/components/elements/note/editor/editor-theme.const";
import { tintaSyntaxHighlighting } from "@/components/elements/note/editor/tinta-highlight.const";
import { hideMarkersPlugin } from "@/components/elements/note/editor/hide-markers.plugin";
import {
  imagePreviewPlugin,
  type TResolveImageSrc,
} from "@/components/elements/note/editor/image-preview.plugin";

interface ICodeMirrorOptions {
  onChange: (value: string) => void;
  resolveImageSrc: TResolveImageSrc;
}

/** Marks a document change as a programmatic sync (note switch, outline jump)
 *  rather than a user edit, so the update listener can ignore it and not stamp
 *  the note as edited just for being opened. */
const externalSync = Annotation.define<boolean>();

/** Owns a single CodeMirror 6 instance: builds it on mount into the given host,
 *  pushes user edits out through `onChange`, and exposes the view for selection
 *  reads and external content syncs. CodeMirror owns its own DOM, so Solid must
 *  not reactively render inside the host. */
export function createCodeMirror(options: ICodeMirrorOptions) {
  let view: EditorView | undefined;

  const extensions: Extension[] = [
    history(),
    keymap.of([...defaultKeymap, ...historyKeymap]),
    markdown(),
    tintaSyntaxHighlighting,
    hideMarkersPlugin,
    imagePreviewPlugin(options.resolveImageSrc),
    tintaEditorTheme,
    EditorView.lineWrapping,
    placeholder("Start writing in Markdown..."),
    EditorView.updateListener.of(update => {
      // Ignore programmatic syncs (note switch / outline jump): only real user
      // edits should report a change and bump the note's "updated" time.
      const isExternal = update.transactions.some(tr =>
        tr.annotation(externalSync),
      );

      if (update.docChanged && !isExternal) {
        options.onChange(update.state.doc.toString());
      }
    }),
  ];

  function mount(host: HTMLElement, initialValue: string) {
    view = new EditorView({
      parent: host,
      state: EditorState.create({ doc: initialValue, extensions }),
    });
  }

  /** Replace the document when the open note changes externally (note switch,
   *  outline jump). No-op when the text already matches so typing never causes
   *  a self-inflicted reset. */
  function setValue(value: string) {
    if (!view || value === view.state.doc.toString()) {
      return;
    }

    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: value },
      annotations: externalSync.of(true),
    });
  }

  function focus() {
    view?.focus();
  }

  function setCaret(offset: number) {
    if (!view) {
      return;
    }

    const safe = Math.min(offset, view.state.doc.length);
    view.dispatch({ selection: { anchor: safe }, scrollIntoView: true });
    view.focus();
  }

  const getView = () => view;

  onCleanup(() => view?.destroy());

  return { mount, setValue, focus, setCaret, getView };
}