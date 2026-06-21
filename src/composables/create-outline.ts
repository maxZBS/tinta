import { createMemo, type Accessor } from "solid-js";
import { buildOutline } from "@/lib/outline.util";
import type { IOutlineSection } from "@/lib/outline.types";

/** Reactive table of contents for a body. Rebuilds only when the text
 *  changes — a genuinely derived value worth memoizing. */
export function createOutline(
  body: Accessor<string>,
): Accessor<IOutlineSection[]> {
  return createMemo(() => buildOutline(body()));
}
