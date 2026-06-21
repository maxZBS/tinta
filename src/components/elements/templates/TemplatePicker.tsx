import { For } from "solid-js";
import { useNotesStore } from "@/stores/notes.store";
import { DOCUMENT_TEMPLATES } from "@/lib/templates.const";

interface ITemplatePickerProps {
  onPicked?: () => void;
}

/** Smart starting structures. Picking one creates a new document pre-filled
 *  with its scaffold so the writer starts with shape, not a blank page. */
export function TemplatePicker(props: ITemplatePickerProps) {
  function onPick(body: string) {
    useNotesStore.getState().createNote(body);
    props.onPicked?.();
  }

  return (
    <div class="flex flex-col gap-2">
      <For each={DOCUMENT_TEMPLATES}>
        {template => (
          <button
            type="button"
            onClick={() => onPick(template.body)}
            class="tinta-row-action rounded-lg border border-border px-4 py-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            <p class="text-base font-medium text-text-primary">
              {template.label}
            </p>
            <p class="mt-1 text-sm text-text-muted">{template.description}</p>
          </button>
        )}
      </For>
    </div>
  );
}
