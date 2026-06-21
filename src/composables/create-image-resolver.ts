import { isTauri } from "@tauri-apps/api/core";
import { sep } from "@tauri-apps/api/path";
import { getStorageRoot } from "@/lib/storage-root.util";
import { resolveNoteImageSrc } from "@/lib/note-asset-src.util";

/** Builds the inline-image source resolver for the editor: the same path the
 *  read-only preview uses, turning `noteId/attachments/x.png` into a loadable
 *  `asset:` URL. Resolution is fully synchronous (a zustand read plus the
 *  platform separator), so widgets can render on first paint. */
export function createImageResolver(noteId: () => string) {
  return (source: string) => {
    if (!isTauri()) {
      return source;
    }

    return resolveNoteImageSrc({
      notesDir: getStorageRoot(),
      pathSeparator: sep(),
      noteId: noteId(),
      source,
    });
  };
}
