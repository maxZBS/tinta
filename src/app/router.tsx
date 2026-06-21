import { For, type Component } from 'solid-js'
import { AppLayout } from '@/components/layout/AppLayout'
import { PAGE_LIST, PAGES } from '@/lib/pages.const'
import { AboutPage } from '@/pages/AboutPage'
import { AllNotesPage } from '@/pages/AllNotesPage'
import { KeyboardShortcutsPage } from '@/pages/KeyboardShortcutsPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { TrashPage } from '@/pages/TrashPage'
import { HashRouter, Route } from '@solidjs/router'

/** Route components by path. Pages absent here fall back to a "coming soon"
 *  placeholder titled by their registry label. */
const PAGE_COMPONENTS: Record<string, Component> = {
	[PAGES.ALL_NOTES]: AllNotesPage,
	[PAGES.ABOUT]: AboutPage,
	[PAGES.KEYBOARD_SHORTCUTS]: KeyboardShortcutsPage,
	[PAGES.SETTINGS]: SettingsPage,
	[PAGES.TRASH]: TrashPage
}

/** App routes, all derived from the page registry so the sidebar and router
 *  can't drift. `AppLayout` is the shared shell (`root`). */
export function AppRouter() {
	return (
		<HashRouter root={AppLayout}>
			<For each={PAGE_LIST}>
				{page => (
					<Route
						path={page.path}
						component={
							PAGE_COMPONENTS[page.path] ??
							(() => <PlaceholderPage title={page.label} />)
						}
					/>
				)}
			</For>
		</HashRouter>
	)
}
