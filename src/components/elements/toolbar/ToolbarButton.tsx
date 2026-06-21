import { type Component } from "solid-js";
import { Dynamic } from "solid-js/web";
import type { IconProps } from "@tabler/icons-solidjs";
import { cn } from "@/utils/cn.util";

interface IToolbarButtonProps {
  icon: Component<IconProps>;
  isActive?: boolean;
  label: string;
  onClick: () => void;
  shortcut?: string;
}

/** One square icon action in the editor toolbar. Visual feedback comes from the
 *  active state and the focus ring only — no hover styling (native, not web). */
export function ToolbarButton(props: IToolbarButtonProps) {
  const hint = () =>
    props.shortcut ? `${props.label} (${props.shortcut})` : props.label;

  return (
    <button
      type="button"
      aria-label={hint()}
      title={hint()}
      onClick={() => props.onClick()}
      class={cn(
        "tinta-action flex h-9 w-9 items-center justify-center rounded-md",
        "border border-transparent text-text-secondary",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent",
        props.isActive && "tinta-segment-active text-text-primary",
      )}
    >
      <Dynamic component={props.icon} size={20} stroke-width={1.75} />
    </button>
  );
}