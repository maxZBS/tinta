import { createEffect, createMemo, createSignal, Show } from "solid-js";
import { NoteEditor } from "@/components/elements/note/NoteEditor";
import { NoteToolbar } from "@/components/elements/note/NoteToolbar";
import { DocumentInfoPanel } from "@/components/elements/panel/DocumentInfoPanel";
import { TemplatePicker } from "@/components/elements/templates/TemplatePicker";
import { createWindowDrag } from "@/composables/create-window-drag";
import { createNote } from "@/composables/create-notes";
import { createListUi } from "@/composables/create-list-ui";
import { infoPanelToggleRequest } from "@/composables/info-panel-toggle-signal";

/** Right column — the document view. Empty until a note is selected; then the
 *  editor renders with an optional info rail (outline + stats). */
export function NoteViewColumn() {
  const onDragWindow = createWindowDrag();
  let lastInfoPanelToggleRequest = infoPanelToggleRequest();

  const ui = createListUi();
  const note = createNote(ui.selectedNoteId);
  const [isInfoOpen, setIsInfoOpen] = createSignal(true);
  const [isEditorToolbarOpen, setIsEditorToolbarOpen] = createSignal(true);

  // Gate on identity, not the note object: while *some* note stays open the
  // editor subtree must persist and let its props update in place. Keying Show
  // on `note()` itself would tear down and rebuild the whole editor on every
  // switch — the remount we saw in the profiler.
  const hasNote = createMemo(() => Boolean(note()));

  createEffect(() => {
    const request = infoPanelToggleRequest();
    if (request === lastInfoPanelToggleRequest) {
      return;
    }

    lastInfoPanelToggleRequest = request;
    setIsInfoOpen(isOpen => !isOpen);
  });

  return (
    <Show
      when={hasNote()}
      fallback={
        <section class="relative flex h-full flex-1 flex-col items-center justify-center bg-bg-view px-8 text-text-muted">
          <div class="absolute inset-x-0 top-0 h-16" onMouseDown={onDragWindow} />
          <div class="w-full max-w-sm">
            <p class="mb-1 text-lg font-semibold text-text-primary">
              Start a new draft
            </p>
            <p class="mb-4 text-sm">Pick a template, or ⌘N for a blank page.</p>
            <TemplatePicker />
          </div>
        </section>
      }
    >
      <section class="flex h-full flex-1 bg-bg-view">
        <div class="flex min-w-0 flex-1 flex-col">
          <header
            class="flex h-16 shrink-0 items-center justify-end border-b border-border px-6"
            onMouseDown={onDragWindow}
          >
            <NoteToolbar
              note={note()!}
              isEditorToolbarOpen={isEditorToolbarOpen()}
              isInfoOpen={isInfoOpen()}
              onToggleEditorToolbar={() =>
                setIsEditorToolbarOpen(isOpen => !isOpen)
              }
              onToggleInfo={() => setIsInfoOpen(open => !open)}
            />
          </header>

          <div class="min-h-0 flex-1 px-8 py-8 text-text-secondary">
            <NoteEditor
              note={note()!}
              isToolbarOpen={isEditorToolbarOpen()}
            />
          </div>
        </div>

        <Show when={isInfoOpen()}>
          <DocumentInfoPanel note={note()!} />
        </Show>
      </section>
    </Show>
  );
}
