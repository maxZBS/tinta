import { Show } from "solid-js";
import { IconFolder, IconFolderOpen } from "@tabler/icons-solidjs";
import { revealItemInDir } from "@tauri-apps/plugin-opener";
import { createStorageFolder } from "@/composables/create-storage-folder";

/** Settings control for the storage folder: shows where notes live and lets the
 *  writer pick a different folder. Switching just changes where the app reads
 *  and writes — existing files are left where they are. */
export function StorageFolderField() {
  const storage = createStorageFolder();

  function onReveal() {
    const folder = storage.folder();
    if (folder) {
      void revealItemInDir(folder);
    }
  }

  return (
    <section>
      <h2 class="mb-2 text-xs font-semibold tracking-wide text-text-muted">
        STORAGE FOLDER
      </h2>

      <div class="tinta-control-surface flex items-center gap-3 rounded-lg px-3 py-2">
        <IconFolder size={20} stroke-width={1.75} class="text-text-muted" />

        <span class="min-w-0 flex-1 truncate text-base text-text-primary">
          <Show when={storage.folder()} fallback="No folder chosen">
            {folder => folder()}
          </Show>
        </span>

        <Show when={storage.folder()}>
          <button
            type="button"
            aria-label="Reveal folder in file manager"
            onClick={onReveal}
            class="tinta-action flex h-8 w-8 items-center justify-center rounded-md text-text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            <IconFolderOpen size={18} stroke-width={1.75} />
          </button>
        </Show>
      </div>

      <button
        type="button"
        onClick={() => void storage.chooseFolder()}
        class="tinta-action tinta-control-surface mt-2 rounded-lg px-3 py-1.5 text-base font-medium text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        Choose Folder…
      </button>
    </section>
  );
}