import { Dynamic } from "solid-js/web";
import { A } from "@solidjs/router";
import type { INavItem } from "@/lib/nav-items.const";
import { PAGES } from "@/lib/pages.const";

interface ISidebarNavItemProps {
  item: INavItem;
}

export function SidebarNavItem(props: ISidebarNavItemProps) {
  return (
    <A
      href={props.item.path}
      end={props.item.path === PAGES.ALL_NOTES}
      class="tinta-row-action flex min-h-10 items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-base font-medium text-text-secondary"
      activeClass="border-sidebar-active-border bg-bg-selected text-text-primary shadow-sm"
    >
      <Dynamic component={props.item.icon} size={20} stroke-width={1.75} />
      <span>{props.item.label}</span>
    </A>
  );
}
