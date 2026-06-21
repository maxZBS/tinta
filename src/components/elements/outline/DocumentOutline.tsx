import { For, Show } from "solid-js";
import { OutlineSectionRow } from "@/components/elements/outline/OutlineSectionRow";
import { createOutline } from "@/composables/create-outline";

interface IDocumentOutlineProps {
  body: () => string;
  onJump: (offset: number) => void;
}

/** Оглавление — the table of contents built from the document's headings, with
 *  a word count per section and click-to-jump. */
export function DocumentOutline(props: IDocumentOutlineProps) {
  const sections = createOutline(props.body);

  return (
    <section>
      <h2 class="mb-2 text-xs font-semibold tracking-wide text-text-muted">
        OUTLINE
      </h2>

      <Show
        when={sections().length > 0}
        fallback={
          <p class="text-sm text-text-muted">
            Add headings to build an outline.
          </p>
        }
      >
        <div class="flex flex-col gap-1">
          <For each={sections()}>
            {section => (
              <OutlineSectionRow section={section} onJump={props.onJump} />
            )}
          </For>
        </div>
      </Show>
    </section>
  );
}
