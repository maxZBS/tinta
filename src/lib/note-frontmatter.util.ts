import type { INote, ITrashedNote } from "@/types/note.types";
import { z } from "zod";

/** Frontmatter we control — flat keys only, so a hand-written parser is enough
 *  and we avoid pulling in a YAML library. Parsing is lenient: anything missing
 *  or malformed falls back to a default so a note file is never lost. */
const FrontmatterSchema = z.object({
  title: z.string().default(""),
  tags: z.array(z.string()).default([]),
  pinned: z.boolean().default(false),
  created: z.string().default(""),
  updated: z.string().default(""),
  deleted: z.string().default(""),
});

const FENCE = "---";

/** Build the on-disk file: a `---` frontmatter block followed by the body.
 *  A trashed note carries an extra `deleted:` line; live notes omit it. */
export function serializeNote(note: INote | ITrashedNote): string {
  const lines = [
    FENCE,
    `title: ${escapeScalar(note.title)}`,
    `tags: [${note.tags.map(escapeScalar).join(", ")}]`,
    `pinned: ${note.pinned}`,
    `created: ${note.created}`,
    `updated: ${note.updated}`,
  ];

  if ("deleted" in note && note.deleted) {
    lines.push(`deleted: ${note.deleted}`);
  }

  lines.push(FENCE, "");

  return `${lines.join("\n")}${note.body}`;
}

/** Parse a `.md` file back into a note. `id` is the file name without `.md`. */
export function parseNote(raw: string, id: string): INote {
  const { frontmatterText, body } = splitFrontmatter(raw);
  const parsed = FrontmatterSchema.parse(parseFlatYaml(frontmatterText));
  const nowIso = new Date().toISOString();

  return {
    id,
    title: parsed.title || id,
    body,
    tags: parsed.tags,
    pinned: parsed.pinned,
    created: parsed.created || nowIso,
    updated: parsed.updated || parsed.created || nowIso,
  };
}

/** Parse a trash-folder `.md` file, keeping the `deleted` timestamp. Falls back
 *  to the note's `updated` time if the field is missing. */
export function parseTrashedNote(raw: string, id: string): ITrashedNote {
  const { frontmatterText } = splitFrontmatter(raw);
  const parsed = FrontmatterSchema.parse(parseFlatYaml(frontmatterText));
  const note = parseNote(raw, id);

  return { ...note, deleted: parsed.deleted || note.updated };
}

function splitFrontmatter(raw: string): {
  frontmatterText: string;
  body: string;
} {
  if (!raw.startsWith(`${FENCE}\n`)) {
    return { frontmatterText: "", body: raw };
  }

  const closing = raw.indexOf(`\n${FENCE}`, FENCE.length);
  if (closing === -1) {
    return { frontmatterText: "", body: raw };
  }

  const frontmatterText = raw.slice(FENCE.length + 1, closing);
  const body = raw.slice(closing + FENCE.length + 1).replace(/^\n/, "");

  return { frontmatterText, body };
}

function parseFlatYaml(text: string): Record<string, unknown> {
  const out: Record<string, unknown> = {};

  for (const line of text.split("\n")) {
    const match = line.match(/^([a-zA-Z]+):\s*(.*)$/);
    if (!match) {
      continue;
    }

    const [, key, rawValue] = match;
    out[key] = coerceScalar(rawValue.trim());
  }

  return out;
}

function coerceScalar(value: string): unknown {
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }

  if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    if (!inner) {
      return [];
    }
    return inner.split(",").map(item => unescapeScalar(item.trim()));
  }

  return unescapeScalar(value);
}

/** Quote when the value could confuse the flat parser (commas, brackets,
 *  leading/trailing space, or a YAML-ish boolean). */
function escapeScalar(value: string): string {
  const needsQuote =
    value === "" || /[[\],:"]/.test(value) || value !== value.trim();
  if (!needsQuote) {
    return value;
  }

  return `"${value.replace(/"/g, '\\"')}"`;
}

function unescapeScalar(value: string): string {
  if (value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1).replace(/\\"/g, '"');
  }

  return value;
}
