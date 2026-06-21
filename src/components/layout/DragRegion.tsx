import type { JSX } from "solid-js";
import { createWindowDrag } from "@/composables/create-window-drag";
import { cn } from "@/utils/cn.util";

interface IDragRegionProps {
  children?: JSX.Element;
  class?: string;
}

/** A window-drag zone for transparent + Overlay title bars (where the
 *  `data-tauri-drag-region` attribute is unreliable). Wraps the shared
 *  `createWindowDrag` handler; presses on interactive controls are ignored. */
export function DragRegion(props: IDragRegionProps) {
  const onMouseDown = createWindowDrag();

  return (
    <div onMouseDown={onMouseDown} class={cn(props.class)}>
      {props.children}
    </div>
  );
}
