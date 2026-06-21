import { createSignal } from "solid-js";

/** A transient "focus the search field" pulse. This is hot, throwaway UI
 *  state — a Solid signal, not Zustand. Bumping the counter is the request;
 *  the search field reacts to the change. */
const [searchFocusRequest, setSearchFocusRequest] = createSignal(0);

export { searchFocusRequest };

export function requestSearchFocus(): void {
  setSearchFocusRequest(current => current + 1);
}
