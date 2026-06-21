import { For } from "solid-js";
import { NoteActionsMenuItem } from "@/components/elements/menu/NoteActionsMenuItem";
import { ExportFormatEnum, type TExportFormat } from "@/lib/note-export.util";

interface INoteExportMenuProps {
  busyFormat?: TExportFormat | null;
  onExport: (format: TExportFormat) => void;
}

const EXPORT_OPTIONS: { format: TExportFormat; label: string }[] = [
  { format: ExportFormatEnum.Pdf, label: "Export as PDF" },
  { format: ExportFormatEnum.Md, label: "Export as Markdown" },
  { format: ExportFormatEnum.Txt, label: "Export as Text" },
];

export function NoteExportMenu(props: INoteExportMenuProps) {
  return (
    <div class="border-t border-border py-1">
      <For each={EXPORT_OPTIONS}>
        {option => (
          <NoteActionsMenuItem
            label={
              props.busyFormat === option.format
                ? "Preparing PDF"
                : option.label
            }
            isDisabled={Boolean(props.busyFormat)}
            onSelect={() => props.onExport(option.format)}
          />
        )}
      </For>
    </div>
  );
}
