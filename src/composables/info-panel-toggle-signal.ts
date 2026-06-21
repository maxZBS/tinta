import { createSignal } from "solid-js";

/** A transient "toggle the document info panel" pulse. This is local UI
 *  coordination, so a Solid signal keeps it out of persisted app state. */
const [infoPanelToggleRequest, setInfoPanelToggleRequest] = createSignal(0);

export { infoPanelToggleRequest };

export function requestInfoPanelToggle(): void {
  setInfoPanelToggleRequest(current => current + 1);
}
