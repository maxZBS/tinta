import type {
  IMarkdownInsertionRange,
  IMarkdownInsertionResult,
} from "@/utils/markdown-insert.types";

export function insertMarkdownBlock(
  range: IMarkdownInsertionRange,
  markdown: string,
): IMarkdownInsertionResult {
  const before = range.value.slice(0, range.selectionStart);
  const after = range.value.slice(range.selectionEnd);

  const prefix = before.length > 0 && !before.endsWith("\n") ? "\n\n" : "";
  const suffix = after.length > 0 && !after.startsWith("\n") ? "\n\n" : "\n";

  const insertion = `${prefix}${markdown}${suffix}`;
  const cursor = before.length + prefix.length + markdown.length;

  return {
    value: `${before}${insertion}${after}`,
    selectionStart: cursor,
    selectionEnd: cursor,
  };
}
