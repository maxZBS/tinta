import { createEffect, onCleanup } from "solid-js";

interface ICreateDismissParams {
  isOpen: () => boolean;
  contains: (target: Node) => boolean;
  onDismiss: () => void;
}

/** Close a transient surface (menu, popover) on outside-click or Escape, only
 *  while it's open. Listeners attach/detach with the open state. */
export function createDismiss(params: ICreateDismissParams) {
  function onPointerDown(event: MouseEvent) {
    if (!params.contains(event.target as Node)) {
      params.onDismiss();
    }
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      params.onDismiss();
    }
  }

  createEffect(() => {
    if (!params.isOpen()) {
      return;
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    onCleanup(() => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    });
  });
}
