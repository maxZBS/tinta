import { createListUi } from '@/composables/create-list-ui'
import { createNote } from '@/composables/create-notes'
import { Show } from 'solid-js'

export function NotesBreadcrumbs() {
	const ui = createListUi()
	const note = createNote(ui.selectedNoteId)

	return (
		<footer class="flex py-3 shrink-0 items-center gap-3 border-t border-border bg-bg-breadcrumbs px-5 text-sm">
			<Show
				when={note()}
				fallback={
					<span class="font-semibold text-text-primary">All Notes</span>
				}
			>
				{selected => (
					<>
						<button
							type="button"
							onClick={() => ui.selectNote(null)}
							class="tinta-text-action font-semibold text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
						>
							All Notes
						</button>
						<span
							aria-hidden="true"
							class="text-text-muted"
						>
							&gt;
						</span>
						<span class="truncate text-text-secondary">{selected().title}</span>
					</>
				)}
			</Show>
		</footer>
	)
}
