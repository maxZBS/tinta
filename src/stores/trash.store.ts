import { create } from "zustand";
import type { ITrashedNote } from "@/types/note.types";
import {
  deleteTrashedFile,
  emptyTrashFiles,
  listTrash,
  restoreNoteFile,
} from "@/lib/notes-fs.util";
import { useNotesStore } from "@/stores/notes.store";

type TStatus = "idle" | "loading" | "ready";

interface ITrashStore {
  trashed: ITrashedNote[];
  status: TStatus;
  loadTrash: () => Promise<void>;
  restoreNote: (noteId: string) => void;
  deleteForever: (noteId: string) => void;
  emptyTrash: () => void;
}

/** Deleted notes, mirrored from the trash folder on disk. Mutations are
 *  optimistic: state updates first, the file move/remove follows. Restoring a
 *  note also re-loads the live notes list so it reappears immediately. */
export const useTrashStore = create<ITrashStore>((set, get) => ({
  trashed: [],
  status: "idle",

  loadTrash: async () => {
    set({ status: "loading" });
    const trashed = await listTrash();
    set({ trashed, status: "ready" });
  },

  restoreNote: noteId => {
    const note = get().trashed.find(item => item.id === noteId);

    set(state => ({
      trashed: state.trashed.filter(item => item.id !== noteId),
    }));

    if (note) {
      void restoreNoteFile(note).then(() =>
        useNotesStore.getState().loadNotes(),
      );
    }
  },

  deleteForever: noteId => {
    set(state => ({
      trashed: state.trashed.filter(item => item.id !== noteId),
    }));

    void deleteTrashedFile(noteId);
  },

  emptyTrash: () => {
    const ids = get().trashed.map(note => note.id);

    set({ trashed: [] });

    void emptyTrashFiles(ids);
  },
}));