import { DocumentOutline } from "@/components/elements/outline/DocumentOutline";
import { WritingStats } from "@/components/elements/stats/WritingStats";
import { requestEditorJump } from "@/composables/editor-jump-signal";
import type { INote } from "@/types/note.types";

interface IDocumentInfoPanelProps {
  note: INote;
}

/** Right rail for the open document: оглавление (jump-to-section), writing
 *  stats, and the personal reading-speed control. */
export function DocumentInfoPanel(props: IDocumentInfoPanelProps) {
  return (
    <aside class="tinta-info-panel flex h-full w-72 shrink-0 flex-col gap-6 overflow-y-auto px-5 py-6">
      <DocumentOutline body={() => props.note.body} onJump={requestEditorJump} />
      <WritingStats note={props.note} />
    </aside>
  );
}
