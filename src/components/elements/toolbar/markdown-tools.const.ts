import {
  IconBold,
  IconCode,
  IconH1,
  IconH2,
  IconH3,
  IconH4,
  IconH5,
  IconH6,
  IconHighlight,
  IconItalic,
  IconLink,
  IconList,
  IconListCheck,
  IconListNumbers,
  IconQuote,
  type IconProps,
} from "@tabler/icons-solidjs";
import type { Component } from "solid-js";
import type { TMarkdownFormat } from "@/utils/markdown-format.types";

export interface IMarkdownTool {
  format: TMarkdownFormat;
  icon: Component<IconProps>;
  label: string;
  shortcut?: string;
}

/** Inline buttons that live directly on the bar. */
export const INLINE_TOOLS: IMarkdownTool[] = [
  { format: "bold", label: "Bold", shortcut: "Cmd/Ctrl+B", icon: IconBold },
  { format: "italic", label: "Italic", shortcut: "Cmd/Ctrl+I", icon: IconItalic },
  {
    format: "highlight",
    label: "Highlight",
    shortcut: "Cmd/Ctrl+Shift+H",
    icon: IconHighlight,
  },
  { format: "code", label: "Code", shortcut: "Cmd/Ctrl+E", icon: IconCode },
];

/** Single buttons for block formats that don't need a menu. */
export const BLOCK_TOOLS: IMarkdownTool[] = [
  { format: "quote", label: "Quote", shortcut: "Cmd/Ctrl+Shift+.", icon: IconQuote },
  { format: "link", label: "Link", shortcut: "Cmd/Ctrl+K", icon: IconLink },
];

/** The six heading levels for the heading dropdown. */
export const HEADING_TOOLS: IMarkdownTool[] = [
  { format: "heading-1", label: "Heading 1", shortcut: "Cmd/Ctrl+Alt+1", icon: IconH1 },
  { format: "heading-2", label: "Heading 2", shortcut: "Cmd/Ctrl+Alt+2", icon: IconH2 },
  { format: "heading-3", label: "Heading 3", shortcut: "Cmd/Ctrl+Alt+3", icon: IconH3 },
  { format: "heading-4", label: "Heading 4", icon: IconH4 },
  { format: "heading-5", label: "Heading 5", icon: IconH5 },
  { format: "heading-6", label: "Heading 6", icon: IconH6 },
];

/** The list flavours for the list dropdown. */
export const LIST_TOOLS: IMarkdownTool[] = [
  {
    format: "checklist",
    label: "Checklist",
    shortcut: "Cmd/Ctrl+Shift+9",
    icon: IconListCheck,
  },
  {
    format: "bullet-list",
    label: "Bullet list",
    shortcut: "Cmd/Ctrl+Shift+8",
    icon: IconList,
  },
  {
    format: "ordered-list",
    label: "Numbered list",
    shortcut: "Cmd/Ctrl+Shift+7",
    icon: IconListNumbers,
  },
];