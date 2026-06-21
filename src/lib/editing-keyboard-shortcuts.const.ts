import type { IKeyboardShortcut } from "@/lib/keyboard-shortcuts.const";

export const EDITING_KEYBOARD_SHORTCUTS = [
  {
    id: "format-heading",
    group: "Editing",
    title: "Heading",
    description: "Toggle heading formatting for the current line.",
    keys: ["Cmd/Ctrl", "Alt", "1"],
  },
  {
    id: "format-bold",
    group: "Editing",
    title: "Bold",
    description: "Toggle bold formatting for the selection.",
    keys: ["Cmd/Ctrl", "B"],
  },
  {
    id: "format-italic",
    group: "Editing",
    title: "Italic",
    description: "Toggle italic formatting for the selection.",
    keys: ["Cmd/Ctrl", "I"],
  },
  {
    id: "format-list",
    group: "Editing",
    title: "Bulleted list",
    description: "Toggle list formatting for the current line.",
    keys: ["Cmd/Ctrl", "Shift", "8"],
  },
  {
    id: "format-quote",
    group: "Editing",
    title: "Quote",
    description: "Toggle quote formatting for the current line.",
    keys: ["Cmd/Ctrl", "Shift", "."],
  },
  {
    id: "format-link",
    group: "Editing",
    title: "Link",
    description: "Wrap the selection in a Markdown link.",
    keys: ["Cmd/Ctrl", "K"],
  },
  {
    id: "format-code",
    group: "Editing",
    title: "Inline code",
    description: "Toggle inline code formatting for the selection.",
    keys: ["Cmd/Ctrl", "E"],
  },
] satisfies IKeyboardShortcut[];
