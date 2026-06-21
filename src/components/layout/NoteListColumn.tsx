import { createEffect, createMemo, For, onMount } from "solid-js";
import { IconMenu2, IconPencilPlus, IconSearch } from "@tabler/icons-solidjs";
import { NoteListItem } from "@/components/elements/note/NoteListItem";
import { createWindowDrag } from "@/composables/create-window-drag";
import { createNotes } from "@/composables/create-notes";
import { createListUi } from "@/composables/create-list-ui";
import { bootStorageFolder } from "@/composables/create-storage-folder";
import { useLayout } from "@/composables/layout-context";
import { searchFocusRequest } from "@/composables/search-focus-signal";
import { selectVisibleNotes } from "@/stores/note-selectors.util";
import { useNotesStore } from "@/stores/notes.store";
import { cn } from "@/utils/cn.util";

/** Middle column — the notes catalog: search, create, and the file-backed list. */
export function NoteListColumn() {
  const onDragWindow = createWindowDrag();
  let searchInput: HTMLInputElement | undefined;

  const notes = createNotes();
  const ui = createListUi();
  const layout = useLayout();

  const visibleNotes = createMemo(() =>
    selectVisibleNotes(notes(), ui.searchQuery(), ui.activeTag()),
  );

  onMount(async () => {
    try {
      const hasFolder = await bootStorageFolder();
      if (hasFolder) {
        await useNotesStore.getState().loadNotes();
      }
    } catch (error) {
      console.error("Failed to load notes from the storage folder:", error);
    }
  });

  // React to ⌘F focus-search pulses.
  createEffect(() => {
    if (searchFocusRequest() > 0) {
      searchInput?.focus();
    }
  });

  return (
    <section class="tinta-list-panel flex h-full w-list shrink-0 flex-col border-r border-border">
      <header
        class={cn(
          "relative flex h-12 shrink-0 items-center justify-between pr-4",
          layout.isSidebarCollapsed() ? "pl-20" : "pl-4",
        )}
        onMouseDown={onDragWindow}
      >
        <button
          type="button"
          aria-label="Toggle sidebar"
          onClick={() => layout.toggleSidebar()}
          class="tinta-action flex h-10 w-10 items-center justify-center rounded-lg border border-transparent text-text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          <IconMenu2 size={20} stroke-width={1.75} />
        </button>

        <span class="absolute left-1/2 -translate-x-1/2 text-base font-semibold text-text-primary">
          {ui.activeTag() ? `#${ui.activeTag()}` : "All Notes"}
        </span>

        <button
          type="button"
          aria-label="Create note"
          onClick={() => useNotesStore.getState().createNote()}
          class="tinta-action flex h-10 w-10 items-center justify-center rounded-lg border border-transparent text-text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          <IconPencilPlus size={20} stroke-width={1.75} />
        </button>
      </header>

      <div class="px-4 pb-3">
        <div class="tinta-control-surface flex min-h-10 items-center gap-2 rounded-lg px-3 py-2">
          <IconSearch size={18} stroke-width={1.75} class="text-text-muted" />
          <input
            ref={searchInput}
            type="text"
            value={ui.searchQuery()}
            onInput={event => ui.setSearchQuery(event.currentTarget.value)}
            placeholder="Search all notes and tags"
            class="w-full bg-transparent text-base text-text-primary outline-none placeholder:text-text-muted"
          />
        </div>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
        <div class="mb-2 flex items-center justify-between px-1">
          <span class="text-xs font-semibold tracking-wide text-text-muted">
            NOTES
          </span>
          <span class="text-xs font-medium text-text-muted">
            {visibleNotes().length}
          </span>
        </div>

        <div class="flex flex-col gap-2">
          <For each={visibleNotes()}>
            {note => (
              <NoteListItem
                note={note}
                isActive={note.id === ui.selectedNoteId()}
                onSelectNote={ui.selectNote}
              />
            )}
          </For>
        </div>
      </div>
    </section>
  );
}
