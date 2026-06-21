import { EDITING_KEYBOARD_SHORTCUTS } from '@/lib/editing-keyboard-shortcuts.const'
import { PAGES, type TPage } from '@/lib/pages.const'

export const KeyboardShortcutGroupEnum = {
	Navigation: 'Navigation',
	Notes: 'Notes',
	Editing: 'Editing',
	View: 'View',
	Help: 'Help'
} as const

export type TKeyboardShortcutGroup =
	(typeof KeyboardShortcutGroupEnum)[keyof typeof KeyboardShortcutGroupEnum]

export interface IKeyboardShortcut {
	id: string
	group: TKeyboardShortcutGroup
	title: string
	description: string
	keys: string[]
}

export interface IRouteKeyboardShortcut {
	key: string
	path: TPage
}

export const ROUTE_KEYBOARD_SHORTCUTS: IRouteKeyboardShortcut[] = [
	{ key: '1', path: PAGES.ALL_NOTES },
	{ key: '2', path: PAGES.SETTINGS },
	{ key: '3', path: PAGES.TRASH }
]

export const KEYBOARD_SHORTCUT_GROUPS: TKeyboardShortcutGroup[] = [
	KeyboardShortcutGroupEnum.Navigation,
	KeyboardShortcutGroupEnum.Notes,
	KeyboardShortcutGroupEnum.Editing,
	KeyboardShortcutGroupEnum.View,
	KeyboardShortcutGroupEnum.Help
]

export const KEYBOARD_SHORTCUTS: IKeyboardShortcut[] = [
	{
		id: 'page-all-notes',
		group: KeyboardShortcutGroupEnum.Navigation,
		title: 'All Notes',
		description: 'Open the notes workspace.',
		keys: ['Cmd/Ctrl', '1']
	},
	{
		id: 'page-settings',
		group: KeyboardShortcutGroupEnum.Navigation,
		title: 'Settings',
		description: 'Open app settings.',
		keys: ['Cmd/Ctrl', '2']
	},
	{
		id: 'page-trash',
		group: KeyboardShortcutGroupEnum.Navigation,
		title: 'Trash',
		description: 'Open deleted notes.',
		keys: ['Cmd/Ctrl', '3']
	},
	{
		id: 'toggle-sidebar',
		group: KeyboardShortcutGroupEnum.Navigation,
		title: 'Toggle sidebar',
		description: 'Show or hide the left sidebar.',
		keys: ['Cmd/Ctrl', '\\']
	},
	{
		id: 'toggle-info-panel',
		group: KeyboardShortcutGroupEnum.View,
		title: 'Document info',
		description: 'Show or hide the right document sidebar.',
		keys: ['Cmd/Ctrl', 'Shift', '\\']
	},
	{
		id: 'create-note',
		group: KeyboardShortcutGroupEnum.Notes,
		title: 'New note',
		description: 'Create a blank note and open it.',
		keys: ['Cmd/Ctrl', 'N']
	},
	{
		id: 'focus-search',
		group: KeyboardShortcutGroupEnum.Notes,
		title: 'Search notes',
		description: 'Focus the notes search field.',
		keys: ['Cmd/Ctrl', 'F']
	},
	{
		id: 'next-note',
		group: KeyboardShortcutGroupEnum.Notes,
		title: 'Next note',
		description: 'Select the next visible note.',
		keys: ['Arrow Down']
	},
	{
		id: 'previous-note',
		group: KeyboardShortcutGroupEnum.Notes,
		title: 'Previous note',
		description: 'Select the previous visible note.',
		keys: ['Arrow Up']
	},
	{
		id: 'close-note',
		group: KeyboardShortcutGroupEnum.Notes,
		title: 'Close note',
		description: 'Return to the note list empty state.',
		keys: ['Esc']
	},
	...EDITING_KEYBOARD_SHORTCUTS,
	{
		id: 'toggle-markdown',
		group: KeyboardShortcutGroupEnum.View,
		title: 'Markdown mode',
		description: 'Switch between preview and source.',
		keys: ['Cmd/Ctrl', 'M']
	},
	{
		id: 'open-shortcuts',
		group: KeyboardShortcutGroupEnum.Help,
		title: 'Keyboard shortcuts',
		description: 'Open this shortcuts reference.',
		keys: ['Cmd/Ctrl', '/']
	}
]
