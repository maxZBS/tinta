import { For } from "solid-js";
import { KeyboardShortcutRow } from "@/components/elements/shortcuts/KeyboardShortcutRow";
import {
  KEYBOARD_SHORTCUT_GROUPS,
  KEYBOARD_SHORTCUTS,
  type TKeyboardShortcutGroup,
} from "@/lib/keyboard-shortcuts.const";

function shortcutsForGroup(group: TKeyboardShortcutGroup) {
  return KEYBOARD_SHORTCUTS.filter(shortcut => shortcut.group === group);
}

export function KeyboardShortcutsPage() {
  return (
    <section class="h-full flex-1 overflow-y-auto bg-bg-view px-8 py-8 text-text-primary">
      <div class="mx-auto w-full max-w-3xl">
        <p class="text-sm font-semibold tracking-wide text-accent-soft">
          Help & Support
        </p>
        <h1 class="mt-2 text-2xl font-semibold">Keyboard Shortcuts</h1>

        <div class="mt-8 flex flex-col gap-8">
          <For each={KEYBOARD_SHORTCUT_GROUPS}>
            {group => (
              <section>
                <h2 class="text-sm font-semibold tracking-wide text-text-muted">
                  {group}
                </h2>
                <div class="mt-3 rounded-lg border border-border px-4">
                  <For each={shortcutsForGroup(group)}>
                    {shortcut => <KeyboardShortcutRow shortcut={shortcut} />}
                  </For>
                </div>
              </section>
            )}
          </For>
        </div>
      </div>
    </section>
  );
}
