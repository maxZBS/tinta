import { createMemo, type Accessor } from "solid-js";
import { useNotesStore } from "@/stores/notes.store";
import type { INote } from "@/types/note.types";
import { createZustandSelector } from "@/composables/create-zustand-selector";

/** Reactive accessor for the full notes list. */
export function createNotes(): Accessor<INote[]> {
  return createZustandSelector(useNotesStore, state => state.notes);
}

/** Reactive accessor for a single note by id (undefined if it's gone). The id
 *  is read first so an unrelated note's edit (which replaces the array on
 *  autosave) doesn't re-scan the list when the selected id is unchanged. */
export function createNote(id: Accessor<string | null>): Accessor<INote | undefined> {
  const notes = createNotes();
  return createMemo(() => {
    const noteId = id();
    if (!noteId) {
      return undefined;
    }
    return notes().find(note => note.id === noteId);
  });
}
