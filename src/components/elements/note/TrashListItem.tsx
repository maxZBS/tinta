import { createSignal, Show } from "solid-js";
import {
  NoteContextMenu,
  type IMenuPosition,
} from "@/components/elements/menu/NoteContextMenu";
import { formatUpdatedLabel } from "@/lib/format-date.util";
import { notePreview } from "@/stores/note-selectors.util";
import { useTrashStore } from "@/stores/trash.store";
import type { ITrashedNote } from "@/types/note.types";
import { cn } from "@/utils/cn.util";

interface ITrashListItemProps {
  note: ITrashedNote;
}

/** A deleted note in the trash list. Read-only — its only actions live in the
 *  right-click menu: restore, or delete permanently. */
export function TrashListItem(props: ITrashListItemProps) {
  const [menuPosition, setMenuPosition] = createSignal<IMenuPosition | null>(
    null,
  );

  const title = () => props.note.title || "Untitled Note";

  function onContextMenu(event: MouseEvent) {
    event.preventDefault();
    setMenuPosition({ x: event.clientX, y: event.clientY });
  }

  return (
    <>
      <div
        onContextMenu={onContextMenu}
        class={cn(
          "tinta-row-action group relative w-full overflow-hidden rounded-lg",
          "border border-transparent px-4 py-3 text-left",
        )}
      >
        <div class="min-w-0">
          <div class="truncate text-base font-semibold text-text-primary">
            {title()}
          </div>
          <p class="mt-1 line-clamp-2 text-base leading-6 text-text-secondary">
            {notePreview(props.note.body)}
          </p>
        </div>

        <div class="mt-3 flex items-center gap-2 text-xs font-medium text-text-muted">
          <span>Deleted {formatUpdatedLabel(props.note.deleted)}</span>
        </div>
      </div>

      <Show when={menuPosition()}>
        {position => (
          <NoteContextMenu
            position={position()}
            onRestore={() => useTrashStore.getState().restoreNote(props.note.id)}
            onDeleteForever={() =>
              useTrashStore.getState().deleteForever(props.note.id)
            }
            onClose={() => setMenuPosition(null)}
          />
        )}
      </Show>
    </>
  );
}
