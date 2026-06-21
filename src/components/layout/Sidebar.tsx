import { For } from "solid-js";
import { NAV_ITEMS } from "@/lib/nav-items.const";
import { SidebarNavItem } from "@/components/layout/sidebar/SidebarNavItem";
import { SidebarTags } from "@/components/layout/sidebar/SidebarTags";
import { SidebarFooter } from "@/components/layout/sidebar/SidebarFooter";
import { DragRegion } from "@/components/layout/DragRegion";

/** Left column. Nav items keep their own inner padding, while tags and footer
 *  use the full section gutter so visible content aligns across the sidebar. */
export function Sidebar() {
  return (
    <aside class="tinta-sidebar flex h-full w-sidebar shrink-0 flex-col">
      {/* drag region under the macOS traffic lights */}
      <DragRegion class="h-12 shrink-0" />

      <nav class="flex flex-col gap-1 px-3 pt-1">
        <For each={NAV_ITEMS}>{item => <SidebarNavItem item={item} />}</For>
      </nav>

      <div class="mt-8 min-h-0 flex-1 overflow-y-auto px-6">
        <SidebarTags />
      </div>

      <SidebarFooter />
    </aside>
  );
}
