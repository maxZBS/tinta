import { For } from "solid-js";
import { Dynamic } from "solid-js/web";
import type { IMarkdownTool } from "@/components/elements/toolbar/markdown-tools.const";
import type { TMarkdownFormat } from "@/utils/markdown-format.types";

interface IToolbarMenuItemsProps {
  onApplyFormat: (format: TMarkdownFormat) => void;
  onClose: () => void;
  tools: IMarkdownTool[];
}

/** The option rows shared by the heading and list dropdowns: an icon, a label,
 *  and an optional shortcut hint. Applying a format also closes the menu. */
export function ToolbarMenuItems(props: IToolbarMenuItemsProps) {
  function onSelect(format: TMarkdownFormat) {
    props.onApplyFormat(format);
    props.onClose();
  }

  return (
    <For each={props.tools}>
      {tool => (
        <button
          type="button"
          role="menuitem"
          onClick={() => onSelect(tool.format)}
          class="tinta-menu-action flex min-h-9 w-full items-center gap-3 px-3 py-1.5 text-left text-sm font-medium text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
        >
          <Dynamic
            component={tool.icon}
            size={18}
            stroke-width={1.75}
            class="text-text-secondary"
          />
          <span class="flex-1">{tool.label}</span>
        </button>
      )}
    </For>
  );
}