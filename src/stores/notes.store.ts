import { create } from "zustand";
import type { INote } from "@/types/note.types";
import {
  ensureNotesDir,
  listNotes,
  makeNoteId,
  trashNoteFile,
  writeNote,
} from "@/lib/notes-fs.util";
import { forgetSaver, saveNoteDebounced } from "@/stores/save-note.util";
import { useListUiStore } from "@/stores/list-ui.store";

type TStatus = "loading" | "ready";

interface INotesStore {
  notes: INote[];
  status: TStatus;
  loadNotes: () => Promise<void>;
  createNote: (body?: string) => string;
  updateNoteBody: (noteId: string, body: string) => void;
  updateNoteTitle: (noteId: string, title: string) => void;
  setNoteTags: (noteId: string, tags: string[]) => void;
  togglePin: (noteId: string) => void;
  deleteNote: (noteId: string) => void;
}

function patchNote(notes: INote[], noteId: string, patch: Partial<INote>) {
  return notes.map(note =>
    note.id === noteId
      ? { ...note, ...patch, updated: new Date().toISOString() }
      : note,
  );
}

/** The notes data and everything that mutates it. Writes to disk are
 *  optimistic: state updates immediately, the file write follows (debounced
 *  for edits, immediate for create/pin/delete). */
export const useNotesStore = create<INotesStore>((set, get) => ({
  notes: [],
  status: "loading",

  loadNotes: async () => {
    await ensureNotesDir();
    const notes = await listNotes();
    set({ notes, status: "ready" });
  },

  createNote: (body = "") => {
    const nowIso = new Date().toISOString();
    const id = makeNoteId(
      "",
      get().notes.map(note => note.id),
    );
    const note: INote = {
      id,
      title: "",
      body,
      tags: [],
      pinned: false,
      created: nowIso,
      updated: nowIso,
    };

    set(state => ({ notes: [note, ...state.notes] }));
    useListUiStore.getState().selectNote(id);
    void writeNote(note);

    return id;
  },

  updateNoteBody: (noteId, body) =>
    set(state => {
      const notes = patchNote(state.notes, noteId, { body });
      const updated = notes.find(note => note.id === noteId);
      if (updated) {
        saveNoteDebounced(updated);
      }
      return { notes };
    }),

  updateNoteTitle: (noteId, title) =>
    set(state => {
      const notes = patchNote(state.notes, noteId, { title });
      const updated = notes.find(note => note.id === noteId);
      if (updated) {
        saveNoteDebounced(updated);
      }
      return { notes };
    }),

  setNoteTags: (noteId, tags) =>
    set(state => {
      const notes = patchNote(state.notes, noteId, { tags });
      const updated = notes.find(note => note.id === noteId);
      if (updated) {
        void writeNote(updated);
      }
      return { notes };
    }),

  togglePin: noteId =>
    set(state => {
      const current = state.notes.find(note => note.id === noteId);
      if (!current) {
        return state;
      }

      const notes = patchNote(state.notes, noteId, { pinned: !current.pinned });
      const updated = notes.find(note => note.id === noteId);
      if (updated) {
        void writeNote(updated);
      }
      return { notes };
    }),

  deleteNote: noteId => {
    const note = get().notes.find(item => item.id === noteId);

    set(state => ({
      notes: state.notes.filter(item => item.id !== noteId),
    }));

    const listUi = useListUiStore.getState();
    if (listUi.selectedNoteId === noteId) {
      listUi.selectNote(null);
    }

    forgetSaver(noteId);
    if (note) {
      void trashNoteFile(note);
    }
  },
}));
