import { For, type Accessor, type Component } from "solid-js";
import { Dynamic } from "solid-js/web";
import {
  IconPhotoPlus,
  IconPaperclip,
  type IconProps,
} from "@tabler/icons-solidjs";
import {
  AttachmentKindEnum,
  type TAttachmentKind,
} from "@/lib/note-attachments.util";
import { cn } from "@/utils/cn.util";

interface INoteAttachmentTool {
  icon: Component<IconProps>;
  kind: TAttachmentKind;
  label: string;
}

interface INoteAttachmentToolbarProps {
  activeKind: Accessor<TAttachmentKind | null>;
  onPickAttachment: (kind: TAttachmentKind) => void;
}

const ATTACHMENT_TOOLS: INoteAttachmentTool[] = [
  { icon: IconPhotoPlus, kind: AttachmentKindEnum.Image, label: "Upload image" },
  { icon: IconPaperclip, kind: AttachmentKindEnum.File, label: "Attach file" },
];

export function NoteAttachmentToolbar(props: INoteAttachmentToolbarProps) {
  return (
    <div class="flex items-center gap-1">
      <For each={ATTACHMENT_TOOLS}>
        {tool => {
          const isActive = () => props.activeKind() === tool.kind;
          const isDisabled = () => props.activeKind() !== null;

          return (
            <button
              type="button"
              aria-label={tool.label}
              disabled={isDisabled()}
              title={tool.label}
              onClick={() => props.onPickAttachment(tool.kind)}
              class={cn(
                "tinta-action flex h-9 w-9 items-center justify-center rounded-md border border-transparent text-text-secondary",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent",
                isActive() && "tinta-segment-active text-text-primary",
                isDisabled() && !isActive() && "cursor-not-allowed text-text-muted",
              )}
            >
              <Dynamic component={tool.icon} size={20} stroke-width={1.75} />
            </button>
          );
        }}
      </For>
    </div>
  );
}
