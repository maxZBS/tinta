import { countWords } from "@/lib/writing-stats.util";
import type { IOutlineSection } from "@/lib/outline.types";

const HEADING_PATTERN = /^(#{1,6})\s+(.*\S)\s*$/;

interface IRawHeading {
  title: string;
  level: number;
  offset: number;
  lineEnd: number;
}

/** Build the table of contents from the body's markdown headings, with a word
 *  count per section (words between this heading and the next one of any
 *  level). Headings inside fenced code blocks are skipped. */
export function buildOutline(body: string): IOutlineSection[] {
  const headings = collectHeadings(body);

  return headings.map((heading, index) => {
    const sectionStart = heading.lineEnd;
    const sectionEnd = headings[index + 1]?.offset ?? body.length;
    const sectionBody = body.slice(sectionStart, sectionEnd);

    return {
      id: `${heading.offset}-${index}`,
      title: heading.title,
      level: heading.level,
      offset: heading.offset,
      words: countWords(sectionBody),
    };
  });
}

function collectHeadings(body: string): IRawHeading[] {
  const headings: IRawHeading[] = [];
  const lines = body.split("\n");

  let offset = 0;
  let isInFence = false;

  for (const line of lines) {
    if (line.trimStart().startsWith("```")) {
      isInFence = !isInFence;
    } else if (!isInFence) {
      const match = line.match(HEADING_PATTERN);
      if (match) {
        headings.push({
          title: match[2],
          level: match[1].length,
          offset,
          lineEnd: offset + line.length,
        });
      }
    }

    // +1 for the newline that `split` removed.
    offset += line.length + 1;
  }

  return headings;
}
