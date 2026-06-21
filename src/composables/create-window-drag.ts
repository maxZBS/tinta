import { getCurrentWindow } from "@tauri-apps/api/window";

/** Returns an `onMouseDown` handler that drags the window natively — reliable
 *  with transparent + Overlay title bars where `data-tauri-drag-region` is
 *  flaky. A press that starts on an interactive control is ignored so buttons,
 *  links and inputs keep working. Double-click toggles maximize.
 *
 *  Requires the `core:window:allow-start-dragging` and
 *  `core:window:allow-toggle-maximize` capabilities (see capabilities/default.json).
 */
export function createWindowDrag() {
  function onMouseDown(event: MouseEvent) {
    if (event.button !== 0) {
      return;
    }
    if ((event.target as HTMLElement).closest("button, a, input, textarea")) {
      return;
    }

    const appWindow = getCurrentWindow();
    if (event.detail === 2) {
      appWindow.toggleMaximize().catch(console.error);
      return;
    }

    // Called synchronously in the mousedown handler so the OS hands off the
    // drag in the same gesture; surface any permission error instead of
    // swallowing it.
    appWindow.startDragging().catch(console.error);
  }

  return onMouseDown;
}
