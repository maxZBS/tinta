import { createSignal } from "solid-js";

/** A "jump the editor caret to this body offset" request — fired by the
 *  outline, consumed by the editor. Hot, transient UI, so a Solid signal. */
const [jumpRequest, setJumpRequest] = createSignal<{ offset: number } | null>(
  null,
);

export { jumpRequest };

export function requestEditorJump(offset: number): void {
  setJumpRequest({ offset });
}
