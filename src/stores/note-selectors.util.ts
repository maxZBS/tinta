import type { INote } from "@/types/note.types";

/** The notes the list should show: narrowed by the active tag, then filtered by
 *  the query (title + body, case-insensitive), then pinned-first, then
 *  newest-updated first. */
export function selectVisibleNotes(
  notes: INote[],
  searchQuery: string,
  activeTag: string | null,
): INote[] {
  const tagged = activeTag
    ? notes.filter(note =>
        note.tags.some(tag => tag.toLowerCase() === activeTag.toLowerCase()),
      )
    : notes;

  const query = searchQuery.trim().toLowerCase();
  const filtered = query
    ? tagged.filter(
        note =>
          note.title.toLowerCase().includes(query) ||
          note.body.toLowerCase().includes(query),
      )
    : tagged;

  return [...filtered].sort((left, right) => {
    if (left.pinned !== right.pinned) {
      return left.pinned ? -1 : 1;
    }
    return right.updated.localeCompare(left.updated);
  });
}

/** Every distinct tag across all notes, sorted — the shared pool Bear-style
 *  autocomplete draws from. Case-insensitive de-dup, keeping first spelling. */
export function selectAllTags(notes: INote[]): string[] {
  const seen = new Map<string, string>();

  for (const note of notes) {
    for (const tag of note.tags) {
      const key = tag.toLowerCase();
      if (!seen.has(key)) {
        seen.set(key, tag);
      }
    }
  }

  return [...seen.values()].sort((left, right) => left.localeCompare(right));
}

/** A short, single-line preview derived from the body — computed, not stored. */
export function notePreview(body: string): string {
  const preview = body.replace(/\s+/g, " ").trim();
  return preview || "Start writing to build this note.";
}
