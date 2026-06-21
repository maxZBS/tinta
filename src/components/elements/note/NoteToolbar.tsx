import {
	NoteActionsMenu,
	type TNoteMenuAction
} from '@/components/elements/menu/NoteActionsMenu'
import { NotePdfExportProgress } from '@/components/elements/note/NotePdfExportProgress'
import { createDismiss } from '@/composables/create-dismiss'
import { createEditorView } from '@/composables/create-editor-view'
import { ExportFormatEnum, exportNote, type TExportFormat } from '@/lib/note-export.util'
import { revealNote } from '@/lib/notes-fs.util'
import { useNotesStore } from '@/stores/notes.store'
import type { INote } from '@/types/note.types'
import { cn } from '@/utils/cn.util'
import { IconDots, IconInfoCircle } from '@tabler/icons-solidjs'
import { createSignal, Show } from 'solid-js'

const TOOLBAR_BUTTON_CLASS =
	'tinta-action flex h-10 w-10 items-center justify-center rounded-lg border border-transparent text-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent'

interface INoteToolbarProps {
	isEditorToolbarOpen: boolean
	isInfoOpen: boolean
	note: INote
	onToggleEditorToolbar: () => void
	onToggleInfo: () => void
}

export function NoteToolbar(props: INoteToolbarProps) {
	let toolbarRef: HTMLDivElement | undefined
	const [busyExportFormat, setBusyExportFormat] =
		createSignal<TExportFormat | null>(null)
	const [isMenuOpen, setIsMenuOpen] = createSignal(false)
	const view = createEditorView()

	createDismiss({
		isOpen: isMenuOpen,
		contains: target => Boolean(toolbarRef?.contains(target)),
		onDismiss: () => setIsMenuOpen(false)
	})

	function onMenuAction(action: TNoteMenuAction) {
		if (action === 'trash') {
			useNotesStore.getState().deleteNote(props.note.id)
		}
		if (action === 'reveal') {
			void revealNote(props.note.id)
		}
		setIsMenuOpen(false)
	}

	async function onExport(format: TExportFormat) {
		if (busyExportFormat()) {
			return
		}

		setIsMenuOpen(false)
		if (format === ExportFormatEnum.Pdf) {
			setBusyExportFormat(format)
		}

		try {
			await exportNote(props.note, format)
		} catch (error) {
			window.alert(`Could not export note.\n\n${String(error)}`)
		} finally {
			setBusyExportFormat(null)
		}
	}

	return (
		<div
			ref={toolbarRef}
			class="relative flex items-center gap-1"
		>
			<button
				type="button"
				aria-label="Open note settings"
				aria-expanded={isMenuOpen()}
				onClick={() => setIsMenuOpen(open => !open)}
				class={cn(
					TOOLBAR_BUTTON_CLASS,
					isMenuOpen() && 'tinta-segment-active text-text-primary'
				)}
			>
				<IconDots
					size={24}
					stroke-width={1.75}
				/>
			</button>

			<Show when={view.isSource()}>
				<button
					type="button"
					aria-label={
						props.isEditorToolbarOpen
							? 'Hide editor toolbar'
							: 'Show editor toolbar'
					}
					aria-pressed={props.isEditorToolbarOpen}
					onClick={() => props.onToggleEditorToolbar()}
					class={cn(
						TOOLBAR_BUTTON_CLASS,
						props.isEditorToolbarOpen &&
							'tinta-segment-active text-text-primary'
					)}
				>
					<span
						aria-hidden="true"
						class="flex items-baseline gap-0 text-base leading-none"
					>
						<span class="font-bold">B</span>
						<span class="italic">I</span>
						<span class="underline">U</span>
					</span>
				</button>
			</Show>

			<button
				type="button"
				aria-label="Document info"
				aria-pressed={props.isInfoOpen}
				onClick={() => props.onToggleInfo()}
				class={cn(
					TOOLBAR_BUTTON_CLASS,
					props.isInfoOpen && 'tinta-segment-active text-text-primary'
				)}
			>
				<IconInfoCircle
					size={24}
					stroke-width={1.75}
				/>
			</button>

			<Show when={isMenuOpen()}>
				<NoteActionsMenu
					busyExportFormat={busyExportFormat()}
					isPinned={props.note.pinned}
					onMenuAction={onMenuAction}
					onExport={onExport}
					onTogglePinned={() =>
						useNotesStore.getState().togglePin(props.note.id)
					}
				/>
			</Show>

			<Show when={busyExportFormat() === ExportFormatEnum.Pdf}>
				<NotePdfExportProgress title={props.note.title.trim() || 'Untitled'} />
			</Show>
		</div>
	)
}
