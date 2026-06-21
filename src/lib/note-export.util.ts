import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile } from "@tauri-apps/plugin-fs";
import { exportNotePdf } from "@/lib/note-pdf-export.util";
import { useSettingsStore } from "@/stores/settings.store";
import type { INote } from "@/types/note.types";

export const ExportFormatEnum = {
  Pdf: "pdf",
  Txt: "txt",
  Md: "md",
} as const;

export type TExportFormat =
  (typeof ExportFormatEnum)[keyof typeof ExportFormatEnum];

function exportFileName(note: INote, format: TExportFormat): string {
  const base = note.title.trim() || note.id;
  return `${base}.${format}`;
}

/** Export the open note. TXT/MD are written to a user-picked path via the save
 *  dialog; PDF uses a dedicated print template and the OS save-to-PDF flow. */
export async function exportNote(
  note: INote,
  format: TExportFormat,
): Promise<void> {
  const path = await save({
    defaultPath: exportFileName(note, format),
    filters: [{ name: format.toUpperCase(), extensions: [format] }],
  });
  if (!path) {
    return;
  }

  if (format === ExportFormatEnum.Pdf) {
    await exportNotePdf(path, note, {
      wordsPerMinute: useSettingsStore.getState().wordsPerMinute,
    });
    return;
  }

  const contents =
    format === ExportFormatEnum.Md ? toMarkdownDocument(note) : toPlainText(note);
  await writeTextFile(path, contents);
}

function toMarkdownDocument(note: INote): string {
  const title = note.title.trim();
  return title ? `# ${title}\n\n${note.body}` : note.body;
}

function toPlainText(note: INote): string {
  const title = note.title.trim();
  return title ? `${title}\n\n${note.body}` : note.body;
}
