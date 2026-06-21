import { IconX } from "@tabler/icons-solidjs";

interface ITagChipProps {
  tag: string;
  onRemove: () => void;
}

export function TagChip(props: ITagChipProps) {
  return (
    <span class="flex items-center gap-1 rounded-md bg-bg-elevated px-2 py-1 text-sm font-medium text-accent-soft">
      #{props.tag}
      <button
        type="button"
        aria-label={`Remove tag ${props.tag}`}
        onClick={() => props.onRemove()}
        class="tinta-text-action text-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        <IconX size={14} stroke-width={2} />
      </button>
    </span>
  );
}
