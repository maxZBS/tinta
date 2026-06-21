import { createSignal, Show } from "solid-js";
import { IconPinnedFilled } from "@tabler/icons-solidjs";
import {
  NoteContextMenu,
  type IMenuPosition,
} from "@/components/elements/menu/NoteContextMenu";
import { formatUpdatedLabel } from "@/lib/format-date.util";
import { revealNote } from "@/lib/notes-fs.util";
import { notePreview } from "@/stores/note-selectors.util";
import { useNotesStore } from "@/stores/notes.store";
import type { INote } from "@/types/note.types";
import { cn } from "@/utils/cn.util";

interface INoteListItemProps {
  note: INote;
  isActive: boolean;
  onSelectNote: (noteId: string) => void;
}

export function NoteListItem(props: INoteListItemProps) {
  const [menuPosition, setMenuPosition] = createSignal<IMenuPosition | null>(
    null,
  );

  const primaryTag = () => props.note.tags[0] ?? "No tag";
  const title = () => props.note.title || "Untitled Note";

  function onContextMenu(event: MouseEvent) {
    event.preventDefault();
    setMenuPosition({ x: event.clientX, y: event.clientY });
  }

  return (
    <>
      <button
        type="button"
        aria-pressed={props.isActive}
        onClick={() => props.onSelectNote(props.note.id)}
        onContextMenu={onContextMenu}
        class={cn(
          "tinta-row-action group relative w-full overflow-hidden rounded-lg border border-transparent px-4 py-3 text-left",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent",
          props.isActive && "tinta-active-surface",
        )}
      >
        <div class="flex min-w-0 items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="truncate text-base font-semibold text-text-primary">
              {title()}
            </div>
            <p class="mt-1 line-clamp-2 text-base leading-6 text-text-secondary">
              {notePreview(props.note.body)}
            </p>
          </div>

          <Show when={props.note.pinned}>
            <IconPinnedFilled
              aria-label="Pinned note"
              size={20}
              class="mt-1 shrink-0 text-accent-soft"
            />
          </Show>
        </div>

        <div class="mt-3 flex items-center gap-2 text-xs font-medium text-text-muted">
          <span>{formatUpdatedLabel(props.note.updated)}</span>
          <span aria-hidden="true">/</span>
          <span class="truncate">{primaryTag()}</span>
        </div>
      </button>

      <Show when={menuPosition()}>
        {position => (
          <NoteContextMenu
            position={position()}
            isPinned={props.note.pinned}
            onTogglePin={() => useNotesStore.getState().togglePin(props.note.id)}
            onReveal={() => void revealNote(props.note.id)}
            onDelete={() => useNotesStore.getState().deleteNote(props.note.id)}
            onClose={() => setMenuPosition(null)}
          />
        )}
      </Show>
    </>
  );
}
