import { createMemo, createSignal, type Accessor } from "solid-js";
import { useNotesStore } from "@/stores/notes.store";
import { selectAllTags } from "@/stores/note-selectors.util";
import { createNotes } from "@/composables/create-notes";
import type { INote } from "@/types/note.types";

const MAX_SUGGESTIONS = 6;

/** All the tag-editing behaviour for one note: the draft input, shared-pool
 *  suggestions, and commit/remove against the store. The component just renders
 *  what this returns. */
export function createTagEditor(note: Accessor<INote>) {
  const notes = createNotes();
  const [draft, setDraft] = createSignal("");

  const suggestions = createMemo(() => {
    const query = draft().trim().toLowerCase();
    if (!query) {
      return [];
    }

    const used = new Set(note().tags.map(tag => tag.toLowerCase()));
    return selectAllTags(notes())
      .filter(tag => tag.toLowerCase().includes(query) && !used.has(tag.toLowerCase()))
      .slice(0, MAX_SUGGESTIONS);
  });

  function setTags(tags: string[]) {
    useNotesStore.getState().setNoteTags(note().id, tags);
  }

  function commitTag(value: string) {
    const tag = value.trim().replace(/^#/, "");
    const isDuplicate = note().tags.some(
      existing => existing.toLowerCase() === tag.toLowerCase(),
    );

    if (tag && !isDuplicate) {
      setTags([...note().tags, tag]);
    }
    setDraft("");
  }

  function removeTag(tag: string) {
    setTags(note().tags.filter(existing => existing !== tag));
  }

  function removeLastTag() {
    const tags = note().tags;
    if (tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  }

  return { draft, setDraft, suggestions, commitTag, removeTag, removeLastTag };
}
