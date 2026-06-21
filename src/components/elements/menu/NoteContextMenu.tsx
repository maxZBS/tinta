import { Show } from "solid-js";
import {
  IconArrowBackUp,
  IconFolderOpen,
  IconPin,
  IconPinnedFilled,
  IconTrash,
  IconTrashX,
} from "@tabler/icons-solidjs";
import { NoteActionsMenuItem } from "@/components/elements/menu/NoteActionsMenuItem";
import { createDismiss } from "@/composables/create-dismiss";

export interface IMenuPosition {
  x: number;
  y: number;
}

interface INoteContextMenuProps {
  position: IMenuPosition;
  /** Live-note actions — present for notes in the main list. */
  isPinned?: boolean;
  onTogglePin?: () => void;
  onReveal?: () => void;
  /** Move to trash (live notes). */
  onDelete?: () => void;
  /** Restore from trash (trash view). */
  onRestore?: () => void;
  /** Delete permanently (trash view). */
  onDeleteForever?: () => void;
  onClose: () => void;
}

/** Right-click menu for a note row, anchored at the cursor. The shown actions
 *  depend on which handlers are passed: live notes get pin/reveal/trash; trashed
 *  notes get restore and permanent delete. Closes on outside-click or Escape;
 *  every action closes it too. */
export function NoteContextMenu(props: INoteContextMenuProps) {
  let menuRef: HTMLDivElement | undefined;

  createDismiss({
    isOpen: () => true,
    contains: target => Boolean(menuRef?.contains(target)),
    onDismiss: () => props.onClose(),
  });

  function runAndClose(action: () => void) {
    action();
    props.onClose();
  }

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label="Note actions"
      style={{ left: `${props.position.x}px`, top: `${props.position.y}px` }}
      class="tinta-menu-surface fixed z-50 w-48 overflow-hidden rounded-lg border py-1"
    >
      <Show when={props.onTogglePin}>
        {togglePin => (
          <NoteActionsMenuItem
            label={props.isPinned ? "Unpin" : "Pin to top"}
            icon={props.isPinned ? IconPinnedFilled : IconPin}
            onSelect={() => runAndClose(togglePin())}
          />
        )}
      </Show>

      <Show when={props.onReveal}>
        {reveal => (
          <NoteActionsMenuItem
            label="Reveal in Finder"
            icon={IconFolderOpen}
            onSelect={() => runAndClose(reveal())}
          />
        )}
      </Show>

      <Show when={props.onRestore}>
        {restore => (
          <NoteActionsMenuItem
            label="Restore"
            icon={IconArrowBackUp}
            onSelect={() => runAndClose(restore())}
          />
        )}
      </Show>

      <Show when={props.onDelete}>
        {del => (
          <NoteActionsMenuItem
            label="Move to Trash"
            icon={IconTrash}
            isDanger
            onSelect={() => runAndClose(del())}
          />
        )}
      </Show>

      <Show when={props.onDeleteForever}>
        {deleteForever => (
          <NoteActionsMenuItem
            label="Delete permanently"
            icon={IconTrashX}
            isDanger
            onSelect={() => runAndClose(deleteForever())}
          />
        )}
      </Show>
    </div>
  );
}
