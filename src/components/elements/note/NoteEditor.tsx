import { CodeMirrorEditor } from '@/components/elements/note/editor/CodeMirrorEditor'
import { NotePreview } from '@/components/elements/note/NotePreview'
import { NoteTagsField } from '@/components/elements/note/NoteTagsField'
import { MarkdownEditorToolbar } from '@/components/elements/toolbar/MarkdownEditorToolbar'
import { NoteAttachmentToolbar } from '@/components/elements/toolbar/NoteAttachmentToolbar'
import { createNoteEditor } from '@/composables/create-note-editor'
import { formatUpdatedLabel } from '@/lib/format-date.util'
import type { INote } from '@/types/note.types'
import { Show } from 'solid-js'

interface INoteEditorProps {
	isToolbarOpen: boolean
	note: INote
}

export function NoteEditor(props: INoteEditorProps) {
	let tagsInput: HTMLInputElement | undefined
	let titleInput: HTMLInputElement | undefined
	const editor = createNoteEditor(() => props.note)

	function focusInput(input: HTMLInputElement | undefined) {
		if (!input) {
			return
		}

		input.focus()
		input.setSelectionRange(input.value.length, input.value.length)
	}

	function hasNavigationModifier(event: KeyboardEvent) {
		return event.altKey || event.ctrlKey || event.metaKey || event.shiftKey
	}

	function onTitleKeyDown(event: KeyboardEvent) {
		if (event.key !== 'ArrowDown' || hasNavigationModifier(event)) {
			return
		}

		event.preventDefault()
		focusInput(tagsInput)
	}

	// Markdown shortcuts run on capture so they win before CodeMirror's keymap.
	function onBodyKeyDown(event: KeyboardEvent) {
		editor.applyShortcut(event)
	}

	return (
		<article class="relative mx-auto flex h-full w-full max-w-3xl flex-col">
			<div class="mb-4 flex items-center gap-4">
				<p class="text-sm font-medium text-accent-soft">
					{formatUpdatedLabel(props.note.updated)}
				</p>
			</div>

			<input
				ref={titleInput}
				aria-label="Note title"
				value={props.note.title}
				onInput={event => editor.updateTitle(event.currentTarget.value)}
				onKeyDown={onTitleKeyDown}
				class="w-full bg-transparent text-2xl font-semibold text-text-primary outline-none placeholder:text-text-muted"
				placeholder="Untitled Note"
			/>

			<NoteTagsField
				inputRef={element => (tagsInput = element)}
				note={props.note}
				onArrowDown={editor.focus}
				onArrowUp={() => focusInput(titleInput)}
			/>

			<Show when={editor.picker.attachmentError()}>
				<p class="mt-3 text-sm font-medium text-danger">
					{editor.picker.attachmentError()}
				</p>
			</Show>

			<Show
				when={editor.isSource()}
				fallback={
					<NotePreview
						body={props.note.body}
						noteId={props.note.id}
						onActivate={editor.openSource}
					/>
				}
			>
				<div
					class="flex min-h-0 flex-1 flex-col"
					onKeyDown={onBodyKeyDown}
				>
					<CodeMirrorEditor
						value={props.note.body}
						onInput={editor.updateBody}
						resolveImageSrc={editor.resolveImageSrc}
						setView={editor.setView}
					/>
				</div>
			</Show>

			<Show when={editor.isSource() && props.isToolbarOpen}>
				<div class="pointer-events-none absolute inset-x-0 -bottom-1.5 z-10 flex justify-center">
					<div class="tinta-toolbar-surface pointer-events-auto flex items-center gap-1 rounded-lg p-1">
						<NoteAttachmentToolbar
							activeKind={editor.picker.activeAttachmentKind}
							onPickAttachment={editor.picker.onPickAttachment}
						/>

						<div
							aria-hidden="true"
							class="h-6 w-px bg-border"
						/>

						<MarkdownEditorToolbar onApplyFormat={editor.applyFormat} />
					</div>
				</div>
			</Show>
		</article>
	)
}
