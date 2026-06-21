import { createSignal, type Accessor } from "solid-js";
import {
  pickAndStoreAttachment,
  type TAttachmentKind,
} from "@/lib/note-attachments.util";
import type { INote } from "@/types/note.types";
import { insertMarkdownBlock } from "@/utils/markdown-insert.util";
import type { TSelectionTarget } from "@/composables/view-selection-adapter";

interface ICreateNoteAttachmentPickerParams {
  note: Accessor<INote>;
  getTextarea: () => TSelectionTarget | undefined;
  updateNoteBody: (noteId: string, body: string) => void;
}

/** Pick a file/image, copy it into the note's attachment folder, and insert
 *  its markdown at the cursor. Local, transient UI state (which kind is busy,
 *  any error) lives in Solid signals. */
export function createNoteAttachmentPicker({
  note,
  getTextarea,
  updateNoteBody,
}: ICreateNoteAttachmentPickerParams) {
  const [activeAttachmentKind, setActiveAttachmentKind] =
    createSignal<TAttachmentKind | null>(null);
  const [attachmentError, setAttachmentError] = createSignal<string | null>(
    null,
  );

  async function onPickAttachment(kind: TAttachmentKind) {
    if (activeAttachmentKind() !== null) {
      return;
    }

    setActiveAttachmentKind(kind);
    setAttachmentError(null);

    try {
      const attachment = await pickAndStoreAttachment(note().id, kind);
      if (attachment) {
        insertAttachmentMarkdown(attachment.markdown);
      }
    } catch (error) {
      console.error(error);
      setAttachmentError("Could not attach this file.");
    } finally {
      setActiveAttachmentKind(null);
    }
  }

  function insertAttachmentMarkdown(markdown: string) {
    const textarea = getTextarea();
    const currentNote = note();

    const result = insertMarkdownBlock(
      {
        selectionEnd: textarea?.selectionEnd ?? currentNote.body.length,
        selectionStart: textarea?.selectionStart ?? currentNote.body.length,
        value: currentNote.body,
      },
      markdown,
    );

    updateNoteBody(currentNote.id, result.value);
    requestAnimationFrame(() => {
      const next = getTextarea();
      next?.focus();
      next?.setSelectionRange(result.selectionStart, result.selectionEnd);
    });
  }

  return { activeAttachmentKind, attachmentError, onPickAttachment };
}
