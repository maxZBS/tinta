import { onCleanup, onMount } from "solid-js";
import { useLocation, useNavigate } from "@solidjs/router";
import {
  ROUTE_KEYBOARD_SHORTCUTS,
  type IRouteKeyboardShortcut,
} from "@/lib/keyboard-shortcuts.const";
import { PAGES } from "@/lib/pages.const";
import { selectVisibleNotes } from "@/stores/note-selectors.util";
import { useNotesStore } from "@/stores/notes.store";
import { useListUiStore } from "@/stores/list-ui.store";
import { useEditorViewStore } from "@/stores/editor-view.store";
import { requestSearchFocus } from "@/composables/search-focus-signal";
import { requestInfoPanelToggle } from "@/composables/info-panel-toggle-signal";

interface ICreateAppShortcutsParams {
  onToggleSidebar: () => void;
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  return Boolean(
    target.closest("input, textarea, select, [contenteditable='true']"),
  );
}

function isCommandShortcut(event: KeyboardEvent) {
  return event.metaKey || event.ctrlKey;
}

function routeForKey(key: string): IRouteKeyboardShortcut | undefined {
  return ROUTE_KEYBOARD_SHORTCUTS.find(shortcut => shortcut.key === key);
}

function selectAdjacentNote(offset: number) {
  const notesState = useNotesStore.getState();
  const listUiState = useListUiStore.getState();

  const visibleNotes = selectVisibleNotes(
    notesState.notes,
    listUiState.searchQuery,
    listUiState.activeTag,
  );
  if (visibleNotes.length === 0) {
    return;
  }

  const currentIndex = visibleNotes.findIndex(
    note => note.id === listUiState.selectedNoteId,
  );
  const fallbackIndex = offset > 0 ? 0 : visibleNotes.length - 1;
  const nextIndex =
    currentIndex === -1
      ? fallbackIndex
      : Math.min(Math.max(currentIndex + offset, 0), visibleNotes.length - 1);

  listUiState.selectNote(visibleNotes[nextIndex].id);
}

/** App-wide keyboard shortcuts: section navigation, new note, search focus,
 *  sidebar toggle, view-mode toggle, and arrow/escape list navigation. Reads
 *  store state imperatively inside the handler — no reactive subscription is
 *  needed for a one-shot key press. */
export function createAppShortcuts({
  onToggleSidebar,
}: ICreateAppShortcutsParams) {
  const location = useLocation();
  const navigate = useNavigate();

  function onKeyDown(event: KeyboardEvent) {
    if (isCommandShortcut(event)) {
      const routeShortcut = routeForKey(event.key);
      if (routeShortcut) {
        event.preventDefault();
        navigate(routeShortcut.path);
        return;
      }

      const key = event.key.toLowerCase();
      if (key === "n") {
        event.preventDefault();
        navigate(PAGES.ALL_NOTES);
        useNotesStore.getState().createNote();
        return;
      }
      if (key === "f") {
        event.preventDefault();
        navigate(PAGES.ALL_NOTES);
        requestSearchFocus();
        return;
      }
      if (event.shiftKey && (event.key === "\\" || event.key === "|")) {
        event.preventDefault();
        requestInfoPanelToggle();
        return;
      }
      if (!event.shiftKey && event.key === "\\") {
        event.preventDefault();
        onToggleSidebar();
        return;
      }
      if (key === "m") {
        event.preventDefault();
        useEditorViewStore.getState().toggleViewMode();
        return;
      }
      if (event.key === "/" || event.key === "?") {
        event.preventDefault();
        navigate(PAGES.KEYBOARD_SHORTCUTS);
        return;
      }
    }

    if (isEditableTarget(event.target)) {
      return;
    }
    if (location.pathname !== PAGES.ALL_NOTES) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      selectAdjacentNote(1);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      selectAdjacentNote(-1);
    }
    if (event.key === "Escape") {
      event.preventDefault();
      useListUiStore.getState().selectNote(null);
    }
  }

  onMount(() => {
    window.addEventListener("keydown", onKeyDown);
  });
  onCleanup(() => {
    window.removeEventListener("keydown", onKeyDown);
  });
}
