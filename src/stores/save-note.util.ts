import type { INote } from "@/types/note.types";
import { writeNote } from "@/lib/notes-fs.util";
import { debounce } from "@/utils/debounce.util";

/** Persist a note to disk, debounced per id so fast typing coalesces into one
 *  write. Each note keeps its own timer, created lazily on first save. */
const savers = new Map<string, (note: INote) => void>();

export function saveNoteDebounced(note: INote): void {
  let save = savers.get(note.id);
  if (!save) {
    save = debounce((next: INote) => void writeNote(next), 400);
    savers.set(note.id, save);
  }

  save(note);
}

/** Drop a note's pending-save timer — call when the note is deleted. */
export function forgetSaver(noteId: string): void {
  savers.delete(noteId);
}
