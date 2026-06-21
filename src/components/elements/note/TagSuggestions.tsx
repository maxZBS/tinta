import { For } from "solid-js";

interface ITagSuggestionsProps {
  suggestions: string[];
  onPick: (tag: string) => void;
}

export function TagSuggestions(props: ITagSuggestionsProps) {
  return (
    <ul
      role="listbox"
      aria-label="Tag suggestions"
      class="absolute left-0 top-full z-20 mt-1 w-56 overflow-hidden rounded-lg border border-border bg-bg-menu py-1 shadow-xl"
    >
      <For each={props.suggestions}>
        {tag => (
          <li>
            <button
              type="button"
              role="option"
              aria-selected={false}
              onMouseDown={event => {
                event.preventDefault();
                props.onPick(tag);
              }}
              class="tinta-menu-action flex w-full items-center px-3 py-2 text-left text-sm text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            >
              #{tag}
            </button>
          </li>
        )}
      </For>
    </ul>
  );
}
