import { convertFileSrc, isTauri } from "@tauri-apps/api/core";

interface INoteAssetSrcParams {
  noteId: string;
  notesDir: string;
  pathSeparator: string;
  source: string;
}

export function resolveNoteImageSrc({
  noteId,
  notesDir,
  pathSeparator,
  source,
}: INoteAssetSrcParams): string {
  if (!isTauri()) {
    return source;
  }
  if (!isNoteAttachmentSource(noteId, source)) {
    return source;
  }

  const filePath = [notesDir, ...source.split("/").filter(Boolean)].join(
    pathSeparator,
  );

  return convertFileSrc(filePath);
}

function isNoteAttachmentSource(noteId: string, source: string) {
  if (source.startsWith("http://") || source.startsWith("https://")) {
    return false;
  }
  if (source.startsWith("asset:") || source.startsWith("file:")) {
    return false;
  }

  return source.startsWith(`${noteId}/attachments/`);
}
