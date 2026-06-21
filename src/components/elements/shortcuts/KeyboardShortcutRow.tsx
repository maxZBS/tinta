import { For } from "solid-js";
import { ShortcutKey } from "@/components/elements/shortcuts/ShortcutKey";
import type { IKeyboardShortcut } from "@/lib/keyboard-shortcuts.const";

interface IKeyboardShortcutRowProps {
  shortcut: IKeyboardShortcut;
}

export function KeyboardShortcutRow(props: IKeyboardShortcutRowProps) {
  return (
    <div class="flex min-h-16 items-center justify-between gap-4 border-t border-border py-3 first:border-t-0">
      <div class="min-w-0">
        <p class="text-base font-medium text-text-primary">
          {props.shortcut.title}
        </p>
        <p class="mt-1 text-sm text-text-muted">{props.shortcut.description}</p>
      </div>

      <div class="flex shrink-0 items-center gap-1">
        <For each={props.shortcut.keys}>
          {key => <ShortcutKey value={key} />}
        </For>
      </div>
    </div>
  );
}
