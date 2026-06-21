import { TagChip } from '@/components/elements/note/TagChip'
import { TagSuggestions } from '@/components/elements/note/TagSuggestions'
import { createTagEditor } from '@/composables/create-tag-editor'
import type { INote } from '@/types/note.types'
import { For, Show } from 'solid-js'

interface INoteTagsFieldProps {
	inputRef?: (element: HTMLInputElement) => void
	note: INote
	onArrowDown?: () => void
	onArrowUp?: () => void
}

/** Chips + input under the title. Enter/comma commits a tag; Backspace on an
 *  empty input removes the last chip. Suggestions come from the shared tag pool
 *  (Bear-style). All behaviour lives in `createTagEditor`. */
export function NoteTagsField(props: INoteTagsFieldProps) {
	const tags = createTagEditor(() => props.note)

	function hasNavigationModifier(event: KeyboardEvent) {
		return event.altKey || event.ctrlKey || event.metaKey || event.shiftKey
	}

	function onKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ',') {
			event.preventDefault()
			tags.commitTag(tags.draft())
			return
		}

		if (
			event.key === 'ArrowDown' &&
			!hasNavigationModifier(event) &&
			props.onArrowDown
		) {
			event.preventDefault()
			props.onArrowDown()
			return
		}

		if (
			event.key === 'ArrowUp' &&
			!hasNavigationModifier(event) &&
			props.onArrowUp
		) {
			event.preventDefault()
			props.onArrowUp()
			return
		}

		if (event.key === 'Backspace' && tags.draft() === '') {
			tags.removeLastTag()
		}
	}

	return (
		<div class="relative mt-3">
			<div class="flex flex-wrap items-center gap-2">
				<For each={props.note.tags}>
					{tag => (
						<TagChip
							tag={tag}
							onRemove={() => tags.removeTag(tag)}
						/>
					)}
				</For>

				<input
					ref={props.inputRef}
					aria-label="Add tag"
					value={tags.draft()}
					onInput={event => tags.setDraft(event.currentTarget.value)}
					onKeyDown={onKeyDown}
					onBlur={() => tags.commitTag(tags.draft())}
					spellcheck={false}
					placeholder={props.note.tags.length === 0 ? 'Add tags…' : ''}
					class="min-h-8 min-w-32 flex-1 bg-transparent text-base leading-8 text-text-primary outline-none placeholder:text-text-muted"
				/>
			</div>

			<Show when={tags.suggestions().length > 0}>
				<TagSuggestions
					suggestions={tags.suggestions()}
					onPick={tags.commitTag}
				/>
			</Show>
		</div>
	)
}
