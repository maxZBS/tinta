import { create } from "zustand";

interface IListUiStore {
  /** Which note is open in the view column. */
  selectedNoteId: string | null;
  /** Live query for filtering the notes list. */
  searchQuery: string;
  /** Tag selected in the sidebar to narrow the list; null means all notes. */
  activeTag: string | null;
  selectNote: (noteId: string | null) => void;
  setSearchQuery: (query: string) => void;
  setActiveTag: (tag: string | null) => void;
  toggleActiveTag: (tag: string) => void;
}

/** Selection, search and tag filter for the notes list. This is the list's
 *  navigation state — kept apart from the editor-view store so toggling the
 *  view doesn't touch selection, and apart from the notes data so list edits
 *  and selection don't invalidate each other. */
export const useListUiStore = create<IListUiStore>((set, get) => ({
  selectedNoteId: null,
  searchQuery: "",
  activeTag: null,

  selectNote: noteId => {
    // Re-clicking the open note must not churn the store: an identical set still
    // notifies subscribers and re-runs the editor's reactive work for nothing.
    if (get().selectedNoteId === noteId) {
      return;
    }
    set({ selectedNoteId: noteId });
  },
  setSearchQuery: query => set({ searchQuery: query }),
  setActiveTag: tag => set({ activeTag: tag }),
  toggleActiveTag: tag =>
    set(state => ({ activeTag: state.activeTag === tag ? null : tag })),
}));
