import { formatStatNumber } from "@/lib/writing-stats.util";
import type { IOutlineSection } from "@/lib/outline.types";

interface IOutlineSectionRowProps {
  section: IOutlineSection;
  onJump: (offset: number) => void;
}

export function OutlineSectionRow(props: IOutlineSectionRowProps) {
  return (
    <button
      type="button"
      onClick={() => props.onJump(props.section.offset)}
      style={{ "padding-left": `${(props.section.level - 1) * 12}px` }}
      class="tinta-text-action flex w-full items-baseline justify-between gap-3 rounded-md px-2 py-1 text-left text-sm text-text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
    >
      <span class="truncate">{props.section.title}</span>
      <span class="shrink-0 text-xs text-text-muted">
        {formatStatNumber(props.section.words)} words
      </span>
    </button>
  );
}
