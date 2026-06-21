import type { IWritingStats } from "@/lib/writing-stats.types";

/** Count words in a markdown body. Whitespace-delimited tokens, ignoring
 *  empty runs — good enough for a writing counter and stable while typing. */
export function countWords(body: string): number {
  const trimmed = body.trim();
  if (!trimmed) {
    return 0;
  }

  return trimmed.split(/\s+/).length;
}

/** Words, characters, and a personal reading-time estimate. `wordsPerMinute`
 *  is the writer's own measured speed, so the minutes reflect them. */
export function computeWritingStats(
  body: string,
  wordsPerMinute: number,
): IWritingStats {
  const words = countWords(body);
  const characters = body.length;

  const safeSpeed = Math.max(1, wordsPerMinute);
  const readingMinutes = words === 0 ? 0 : Math.max(1, Math.round(words / safeSpeed));

  return { words, characters, readingMinutes };
}

/** Thousands-separated number for the stats panel (e.g. 4,820). */
export function formatStatNumber(value: number): string {
  return value.toLocaleString();
}
