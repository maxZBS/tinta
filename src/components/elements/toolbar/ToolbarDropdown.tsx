import { createSignal, Show, type Component, type JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import { IconChevronDown, type IconProps } from "@tabler/icons-solidjs";
import { createDismiss } from "@/composables/create-dismiss";
import { cn } from "@/utils/cn.util";

interface IToolbarDropdownProps {
  children: (close: () => void) => JSX.Element;
  icon: Component<IconProps>;
  isActive?: boolean;
  label: string;
}

/** A toolbar trigger that opens a small menu *above* the bar (the toolbar floats
 *  at the bottom of the editor). Closes on outside-click, Escape, or selection. */
export function ToolbarDropdown(props: IToolbarDropdownProps) {
  const [isOpen, setIsOpen] = createSignal(false);
  let root: HTMLDivElement | undefined;

  const close = () => setIsOpen(false);

  createDismiss({
    isOpen,
    contains: target => !!root?.contains(target),
    onDismiss: close,
  });

  return (
    <div ref={root} class="relative">
      <button
        type="button"
        aria-label={props.label}
        aria-expanded={isOpen()}
        title={props.label}
        onClick={() => setIsOpen(open => !open)}
        class={cn(
          "tinta-action flex h-9 items-center gap-0.5 rounded-md px-1.5",
          "border border-transparent text-text-secondary",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent",
          (isOpen() || props.isActive) && "tinta-segment-active text-text-primary",
        )}
      >
        <Dynamic component={props.icon} size={20} stroke-width={1.75} />
        <IconChevronDown size={14} stroke-width={1.75} />
      </button>

      <Show when={isOpen()}>
        <div
          role="menu"
          class="tinta-menu-surface absolute bottom-11 left-1/2 z-20 w-44 -translate-x-1/2 overflow-hidden rounded-lg border py-1"
        >
          {props.children(close)}
        </div>
      </Show>
    </div>
  );
}