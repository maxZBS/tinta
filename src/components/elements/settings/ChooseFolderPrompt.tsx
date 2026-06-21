import { IconFolderPlus } from "@tabler/icons-solidjs";
import { createStorageFolder } from "@/composables/create-storage-folder";

/** First-run onboarding: until the writer picks where their notes live, there's
 *  nowhere to read or write, so we ask for a folder instead of an empty list. */
export function ChooseFolderPrompt() {
  const storage = createStorageFolder();

  return (
    <div class="flex h-full flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <IconFolderPlus
        size={48}
        stroke-width={1.5}
        class="text-text-muted"
      />

      <div class="flex flex-col gap-2">
        <h2 class="text-xl font-semibold text-text-primary">
          Choose where your notes live
        </h2>
        <p class="max-w-sm text-base text-text-secondary">
          Tinta keeps your writing as Markdown files in a folder you pick. Your
          texts stay on this device — no accounts, no cloud.
        </p>
      </div>

      <button
        type="button"
        onClick={() => void storage.chooseFolder()}
        class="tinta-action tinta-control-surface mt-2 flex items-center gap-2 rounded-lg px-4 py-2 text-base font-medium text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        <IconFolderPlus size={18} stroke-width={1.75} />
        Choose Folder
      </button>
    </div>
  );
}