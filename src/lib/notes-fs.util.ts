import {
  parseNote,
  parseTrashedNote,
  serializeNote,
} from "@/lib/note-frontmatter.util";
import { getStorageRoot } from "@/lib/storage-root.util";
import type { INote, ITrashedNote } from "@/types/note.types";
import { join } from "@tauri-apps/api/path";
import {
  mkdir,
  readDir,
  readTextFile,
  remove,
  writeTextFile,
} from "@tauri-apps/plugin-fs";
import { revealItemInDir } from "@tauri-apps/plugin-opener";

/** Disk access for notes. Every path is absolute, resolved from the user-chosen
 *  storage folder (`getStorageRoot`). Notes live at the folder root; deleted
 *  notes move into a `.trash` subfolder. This module is the only place that
 *  knows the on-disk layout. */
const TRASH_DIR = "trash";

function trashRoot(): Promise<string> {
  return join(getStorageRoot(), TRASH_DIR);
}

function filePath(id: string): Promise<string> {
  return join(getStorageRoot(), `${id}.md`);
}

async function trashPath(id: string): Promise<string> {
  return join(await trashRoot(), `${id}.md`);
}

/** Create the storage folder and its trash subfolder if missing. Safe to call
 *  repeatedly. */
export async function ensureNotesDir(): Promise<void> {
  await mkdir(getStorageRoot(), { recursive: true });
  await mkdir(await trashRoot(), { recursive: true });
}

/** Read every `.md` file at the storage root and parse it into a note. */
export async function listNotes(): Promise<INote[]> {
  const entries = await readDir(getStorageRoot());
  const notes: INote[] = [];

  for (const entry of entries) {
    if (!entry.isFile || !entry.name.endsWith(".md")) {
      continue;
    }

    const id = entry.name.slice(0, -".md".length);
    const raw = await readTextFile(await filePath(id));
    notes.push(parseNote(raw, id));
  }

  return notes;
}

export async function writeNote(note: INote): Promise<void> {
  await writeTextFile(await filePath(note.id), serializeNote(note));
}

/** Move a note into the trash folder, stamping when it was deleted. The body
 *  and frontmatter are preserved so a restore is lossless. */
export async function trashNoteFile(note: INote): Promise<void> {
  const trashed: ITrashedNote = { ...note, deleted: new Date().toISOString() };

  await writeTextFile(await trashPath(note.id), serializeNote(trashed));
  await remove(await filePath(note.id));
}

/** Read every note currently in the trash folder. */
export async function listTrash(): Promise<ITrashedNote[]> {
  const entries = await readDir(await trashRoot());
  const notes: ITrashedNote[] = [];

  for (const entry of entries) {
    if (!entry.isFile || !entry.name.endsWith(".md")) {
      continue;
    }

    const id = entry.name.slice(0, -".md".length);
    const raw = await readTextFile(await trashPath(id));
    notes.push(parseTrashedNote(raw, id));
  }

  return notes;
}

/** Move a trashed note back to the storage root, dropping the trash stamp. */
export async function restoreNoteFile(note: ITrashedNote): Promise<void> {
  const { deleted: _deleted, ...restored } = note;

  await writeNote(restored);
  await remove(await trashPath(note.id));
}

/** Delete a single trashed note from disk for good. */
export async function deleteTrashedFile(id: string): Promise<void> {
  await remove(await trashPath(id));
}

/** Empty the trash — delete every note in it permanently. */
export async function emptyTrashFiles(ids: string[]): Promise<void> {
  await Promise.all(ids.map(async id => remove(await trashPath(id))));
}

/** Reveal a note's `.md` file in the OS file manager (Finder/Explorer). */
export async function revealNote(id: string): Promise<void> {
  await revealItemInDir(await filePath(id));
}

/** Derive a file-safe, unique slug from a title (or a timestamp fallback),
 *  avoiding collisions with ids already in use. */
export function makeNoteId(title: string, existingIds: string[]): string {
  const base = slugify(title) || `note-${new Date().toISOString().slice(0, 10)}`;
  if (!existingIds.includes(base)) {
    return base;
  }

  let suffix = 2;
  while (existingIds.includes(`${base}-${suffix}`)) {
    suffix += 1;
  }

  return `${base}-${suffix}`;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}