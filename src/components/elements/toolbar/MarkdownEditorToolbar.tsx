import { For } from "solid-js";
import { IconHeading, IconListCheck } from "@tabler/icons-solidjs";
import { ToolbarButton } from "@/components/elements/toolbar/ToolbarButton";
import { ToolbarDropdown } from "@/components/elements/toolbar/ToolbarDropdown";
import { ToolbarMenuItems } from "@/components/elements/toolbar/ToolbarMenuItems";
import {
  BLOCK_TOOLS,
  HEADING_TOOLS,
  INLINE_TOOLS,
  LIST_TOOLS,
} from "@/components/elements/toolbar/markdown-tools.const";
import type { TMarkdownFormat } from "@/utils/markdown-format.types";

interface IMarkdownEditorToolbarProps {
  onApplyFormat: (format: TMarkdownFormat) => void;
}

/** The full formatting bar: a heading-level dropdown, inline marks, a list-type
 *  dropdown, and the remaining block actions, split by thin dividers. */
export function MarkdownEditorToolbar(props: IMarkdownEditorToolbarProps) {
  const divider = () => (
    <div aria-hidden="true" class="mx-0.5 h-6 w-px bg-border" />
  );

  return (
    <div class="flex items-center gap-1">
      <ToolbarDropdown icon={IconHeading} label="Heading level">
        {close => (
          <ToolbarMenuItems
            tools={HEADING_TOOLS}
            onApplyFormat={props.onApplyFormat}
            onClose={close}
          />
        )}
      </ToolbarDropdown>

      {divider()}

      <For each={INLINE_TOOLS}>
        {tool => (
          <ToolbarButton
            icon={tool.icon}
            label={tool.label}
            shortcut={tool.shortcut}
            onClick={() => props.onApplyFormat(tool.format)}
          />
        )}
      </For>

      {divider()}

      <ToolbarDropdown icon={IconListCheck} label="List type">
        {close => (
          <ToolbarMenuItems
            tools={LIST_TOOLS}
            onApplyFormat={props.onApplyFormat}
            onClose={close}
          />
        )}
      </ToolbarDropdown>

      <For each={BLOCK_TOOLS}>
        {tool => (
          <ToolbarButton
            icon={tool.icon}
            label={tool.label}
            shortcut={tool.shortcut}
            onClick={() => props.onApplyFormat(tool.format)}
          />
        )}
      </For>
    </div>
  );
}