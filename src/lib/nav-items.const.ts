import { PAGE_LIST, type IPageDef } from '@/lib/pages.const'

/** A page with an icon, guaranteed by the `nav` filter below. */
export type INavItem = IPageDef & { icon: NonNullable<IPageDef['icon']> }

/** Sidebar sections — every nav-flagged page from the registry, in order. */
export const NAV_ITEMS = PAGE_LIST.filter(
	(page): page is INavItem => Boolean(page.nav && page.icon)
)