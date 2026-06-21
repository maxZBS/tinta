import { createMemo, For, onMount, Show } from "solid-js";
import { IconTrash, IconTrashX } from "@tabler/icons-solidjs";
import { TrashListItem } from "@/components/elements/note/TrashListItem";
import { createZustandSelector } from "@/composables/create-zustand-selector";
import { useTrashStore } from "@/stores/trash.store";

/** The Trash view — deleted notes awaiting restore or permanent removal.
 *  Mirrors the All Notes layout: the list lives in the left panel, with the
 *  rest of the surface kept empty for a consistent app-wide shape. */
export function TrashPage() {
  const trashed = createZustandSelector(useTrashStore, state => state.trashed);

  const sorted = createMemo(() =>
    [...trashed()].sort((left, right) =>
      right.deleted.localeCompare(left.deleted),
    ),
  );

  onMount(() => void useTrashStore.getState().loadTrash());

  return (
    <section class="flex h-full flex-1 overflow-hidden">
      <div class="tinta-list-panel flex h-full w-list shrink-0 flex-col border-r border-border">
        <header class="flex h-12 shrink-0 items-center justify-between px-4">
          <div class="flex items-center gap-2 text-base font-semibold text-text-primary">
            <IconTrash size={20} stroke-width={1.75} />
            <span>Trash</span>
          </div>

          <Show when={sorted().length > 0}>
            <button
              type="button"
              aria-label="Empty Trash"
              onClick={() => useTrashStore.getState().emptyTrash()}
              class="tinta-action flex h-10 w-10 items-center justify-center rounded-lg border border-transparent text-danger focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              <IconTrashX size={20} stroke-width={1.75} />
            </button>
          </Show>
        </header>

        <div class="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
          <div class="mb-2 flex items-center justify-between px-1">
            <span class="text-xs font-semibold tracking-wide text-text-muted">
              DELETED
            </span>
            <span class="text-xs font-medium text-text-muted">
              {sorted().length}
            </span>
          </div>

          <Show
            when={sorted().length > 0}
            fallback={
              <p class="mt-16 px-1 text-center text-base text-text-muted">
                Trash is empty.
              </p>
            }
          >
            <div class="flex flex-col gap-2">
              <For each={sorted()}>{note => <TrashListItem note={note} />}</For>
            </div>
          </Show>
        </div>
      </div>

      <div class="flex min-h-0 flex-1 items-center justify-center px-8 text-center">
        <p class="max-w-sm text-base leading-relaxed text-text-muted">
          Right-click a note to restore it or delete it permanently.
        </p>
      </div>
    </section>
  );
}
