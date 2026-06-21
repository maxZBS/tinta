import { Show, type Component } from "solid-js";
import { Dynamic } from "solid-js/web";
import { IconCheckbox, IconSquare, type IconProps } from "@tabler/icons-solidjs";
import { cn } from "@/utils/cn.util";

interface INoteActionsMenuItemProps {
  label: string;
  icon?: Component<IconProps>;
  hasCheckbox?: boolean;
  isActive?: boolean;
  isChecked?: boolean;
  isDanger?: boolean;
  isDisabled?: boolean;
  onSelect?: () => void;
}

export function NoteActionsMenuItem(props: INoteActionsMenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={props.isDisabled}
      onClick={() => props.onSelect?.()}
      class={cn(
        "tinta-menu-action flex min-h-9 w-full items-center justify-between gap-3 px-3 py-1.5",
        "text-left text-sm font-medium",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent",
        props.isActive && "bg-bg-selected",
        props.isDanger ? "text-danger" : "text-text-primary",
        props.isDisabled && "cursor-not-allowed text-text-muted",
      )}
    >
      <span>{props.label}</span>

      <Show when={props.icon}>
        {icon => <Dynamic component={icon()} size={18} stroke-width={1.75} />}
      </Show>

      <Show when={!props.icon && props.hasCheckbox}>
        <Show
          when={props.isChecked}
          fallback={
            <IconSquare size={18} stroke-width={1.75} class="text-text-muted" />
          }
        >
          <IconCheckbox size={18} stroke-width={1.75} class="text-accent-soft" />
        </Show>
      </Show>
    </button>
  );
}
