import { createMemo, createSignal, onMount, Show } from "solid-js";
import { isTauri } from "@tauri-apps/api/core";
import { sep } from "@tauri-apps/api/path";
import { getStorageRoot } from "@/lib/storage-root.util";
import { resolveNoteImageSrc } from "@/lib/note-asset-src.util";
import { renderMarkdown } from "@/lib/markdown.util";

interface INotePreviewProps {
  body: string;
  noteId: string;
  /** Switch to the source editor — fired on a click that isn't a link. */
  onActivate: () => void;
}

interface INotePreviewAssetContext {
  notesDir: string;
  pathSeparator: string;
}

/** Read-only rendered view of a note's markdown body. The source is parsed and
 *  sanitized once per body change; styling lives in the `.prose` rules in
 *  globals.css so the output stays theme-aware. Clicking the text drops into
 *  the source editor; links still navigate. */
export function NotePreview(props: INotePreviewProps) {
  const [assetContext, setAssetContext] =
    createSignal<INotePreviewAssetContext | null>(null);

  const html = createMemo(() => {
    const context = assetContext();
    return renderMarkdown(props.body, {
      resolveImageSrc: source =>
        context
          ? resolveNoteImageSrc({ ...context, noteId: props.noteId, source })
          : source,
    });
  });

  onMount(async () => {
    if (!isTauri()) {
      return;
    }

    const notesDir = getStorageRoot();
    const pathSeparator = sep();
    setAssetContext({ notesDir, pathSeparator });
  });

  function onClick(event: MouseEvent) {
    if ((event.target as HTMLElement).closest("a")) {
      return;
    }
    props.onActivate();
  }

  return (
    <Show
      when={!!props.body.trim()}
      fallback={
        <button
          type="button"
          onClick={() => props.onActivate()}
          class="tinta-text-action mt-6 flex-1 text-left text-base text-text-muted"
        >
          Nothing to preview yet — click to start writing.
        </button>
      }
    >
      <div
        onClick={onClick}
        class="prose mt-6 min-h-0 flex-1 overflow-y-auto text-base leading-7 text-text-secondary"
        innerHTML={html()}
      />
    </Show>
  );
}
