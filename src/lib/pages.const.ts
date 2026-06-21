import type { Component } from 'solid-js'
import {
	IconNotes,
	IconSettings,
	IconTrash,
	type IconProps
} from '@tabler/icons-solidjs'

export interface IPageDef {
	path: string
	label: string
	/** Sidebar icon — present only for pages shown in the main nav. */
	icon?: Component<IconProps>
	/** Show in the sidebar nav list. */
	nav?: boolean
}

/** Single source of truth for every page: path, label, and nav icon.
 *  The router, sidebar nav, and footer all derive from this — nothing can
 *  drift, and adding a page means adding one entry here.
 *  Note: route components are wired in `router.tsx`, not here, so this module
 *  stays free of component imports and can't form an import cycle. */
export const PAGE_REGISTRY = {
	ALL_NOTES: {
		path: '/',
		label: 'All Notes',
		icon: IconNotes,
		nav: true
	},
	SETTINGS: {
		path: '/settings',
		label: 'Settings',
		icon: IconSettings,
		nav: true
	},
	KEYBOARD_SHORTCUTS: {
		path: '/keyboard-shortcuts',
		label: 'Keyboard Shortcuts'
	},
	TRASH: {
		path: '/trash',
		label: 'Trash',
		icon: IconTrash,
		nav: true
	},
	ABOUT: {
		path: '/about',
		label: 'About'
	}
} as const satisfies Record<string, IPageDef>

type TPageKey = keyof typeof PAGE_REGISTRY

/** Path-only map for call sites that just navigate or compare paths. */
export const PAGES = Object.fromEntries(
	Object.entries(PAGE_REGISTRY).map(([key, def]) => [key, def.path])
) as { [K in TPageKey]: (typeof PAGE_REGISTRY)[K]['path'] }

export type TPage = (typeof PAGES)[keyof typeof PAGES]

export const PAGE_LIST: IPageDef[] = Object.values(PAGE_REGISTRY)
