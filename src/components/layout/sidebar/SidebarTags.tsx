import { createMemo, For, Show } from "solid-js";
import { createNotes } from "@/composables/create-notes";
import { createListUi } from "@/composables/create-list-ui";
import { selectAllTags } from "@/stores/note-selectors.util";
import { cn } from "@/utils/cn.util";

/** Tags block. Lists every tag used across all notes (the shared pool) and
 *  filters the list when one is picked. */
export function SidebarTags() {
  const notes = createNotes();
  const ui = createListUi();
  const tags = createMemo(() => selectAllTags(notes()));

  return (
    <Show when={tags().length > 0}>
      <div class="flex flex-col gap-4">
        <span class="text-xs font-medium tracking-wide text-text-muted">
          TAGS
        </span>

        <div class="flex flex-col gap-3">
          <For each={tags()}>
            {tag => (
              <button
                type="button"
                aria-pressed={tag === ui.activeTag()}
                onClick={() => ui.toggleActiveTag(tag)}
                class={cn(
                  "tinta-text-action rounded-md px-2 py-1 text-left text-base font-medium",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent",
                  tag === ui.activeTag()
                    ? "bg-bg-selected text-accent-soft shadow-sm"
                    : "text-text-primary",
                )}
              >
                #{tag}
              </button>
            )}
          </For>
        </div>
      </div>
    </Show>
  );
}
