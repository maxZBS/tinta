import { IconFolderOpen, IconTrash } from "@tabler/icons-solidjs";
import { NoteActionsMenuItem } from "@/components/elements/menu/NoteActionsMenuItem";
import { NoteExportMenu } from "@/components/elements/note/NoteExportMenu";
import { createEditorView } from "@/composables/create-editor-view";
import type { TExportFormat } from "@/lib/note-export.util";

export type TNoteMenuAction = "reveal" | "trash";

interface INoteActionsMenuProps {
  busyExportFormat?: TExportFormat | null;
  isPinned: boolean;
  onMenuAction: (action: TNoteMenuAction) => void;
  onTogglePinned: () => void;
  onExport: (format: TExportFormat) => void;
}

/** The ⋯ dropdown over the editor — only the actions that actually work:
 *  pin, Markdown toggle, reveal in Finder, export, and trash. */
export function NoteActionsMenu(props: INoteActionsMenuProps) {
  const view = createEditorView();

  return (
    <div
      role="menu"
      aria-label="Note settings"
      class="tinta-menu-surface absolute right-16 top-11 z-10 w-56 overflow-hidden rounded-lg border"
    >
      <div class="py-1">
        <NoteActionsMenuItem
          label="Pin to top"
          hasCheckbox
          isChecked={props.isPinned}
          onSelect={() => props.onTogglePinned()}
        />
        <NoteActionsMenuItem
          label="Markdown"
          hasCheckbox
          isChecked={view.isSource()}
          onSelect={view.toggleViewMode}
        />
        <NoteActionsMenuItem
          label="Reveal in Finder"
          icon={IconFolderOpen}
          onSelect={() => props.onMenuAction("reveal")}
        />
      </div>

      <NoteExportMenu
        busyFormat={props.busyExportFormat}
        onExport={props.onExport}
      />

      <div class="border-t border-border py-1">
        <NoteActionsMenuItem
          label="Move to Trash"
          icon={IconTrash}
          isDanger
          onSelect={() => props.onMenuAction("trash")}
        />
      </div>
    </div>
  );
}
