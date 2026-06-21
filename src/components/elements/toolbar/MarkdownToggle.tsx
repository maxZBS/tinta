import { For } from "solid-js";
import { createEditorView } from "@/composables/create-editor-view";
import { ViewModeEnum } from "@/types/note.types";
import { cn } from "@/utils/cn.util";

const MODES = [
  { mode: ViewModeEnum.Preview, label: "Preview" },
  { mode: ViewModeEnum.Source, label: "Markdown" },
] as const;

/** Toggle between the rendered preview and the raw markdown source editor. */
export function MarkdownToggle() {
  const view = createEditorView();

  return (
    <div class="tinta-toolbar-surface flex items-center gap-1 rounded-lg p-1">
      <For each={MODES}>
        {entry => (
          <button
            type="button"
            onClick={() => view.setViewMode(entry.mode)}
            class={cn(
              "tinta-action rounded-md border border-transparent px-3 py-1 text-sm",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent",
              view.viewMode() === entry.mode
                ? "tinta-segment-active text-text-primary"
                : "text-text-secondary",
            )}
          >
            {entry.label}
          </button>
        )}
      </For>
    </div>
  );
}
