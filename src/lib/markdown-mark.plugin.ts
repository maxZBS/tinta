import type MarkdownIt from "markdown-it";
import type StateInline from "markdown-it/lib/rules_inline/state_inline.mjs";

const MARKER = 0x3d; // "="

/** Minimal `==highlight==` inline rule for markdown-it (the CommonMark spec has
 *  no highlight, and we don't want a dependency for one token). Emits a <mark>,
 *  which DOMPurify allows and the .prose styles colour with the accent. */
function markRule(state: StateInline, silent: boolean): boolean {
  const start = state.pos;

  if (state.src.charCodeAt(start) !== MARKER) {
    return false;
  }

  if (state.src.charCodeAt(start + 1) !== MARKER) {
    return false;
  }

  const closeIndex = state.src.indexOf("==", start + 2);
  if (closeIndex === -1) {
    return false;
  }

  const content = state.src.slice(start + 2, closeIndex);
  if (content.length === 0) {
    return false;
  }

  if (!silent) {
    state.push("mark_open", "mark", 1);

    const text = state.push("text", "", 0);
    text.content = content;

    state.push("mark_close", "mark", -1);
  }

  state.pos = closeIndex + 2;

  return true;
}

export function markdownMark(md: MarkdownIt): void {
  md.inline.ruler.before("emphasis", "mark", markRule);
}