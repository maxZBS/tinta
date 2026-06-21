import { PAGES } from '@/lib/pages.const'
import { A } from '@solidjs/router'

const FOOTER_LINK_CLASS =
	'tinta-text-action rounded-md px-2 py-1 text-left text-base text-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent'

export function SidebarFooter() {
	return (
		<div class="mt-4 px-6 pb-8">
			<div class="flex flex-col gap-3 border-t border-border pt-4">
				<A
					href={PAGES.KEYBOARD_SHORTCUTS}
					class={FOOTER_LINK_CLASS}
					activeClass="bg-bg-selected text-text-primary"
				>
					Keyboard Shortcuts
				</A>
				<A
					href={PAGES.ABOUT}
					class={FOOTER_LINK_CLASS}
					activeClass="bg-bg-selected text-text-primary"
				>
					About & Contact
				</A>
			</div>
		</div>
	)
}
