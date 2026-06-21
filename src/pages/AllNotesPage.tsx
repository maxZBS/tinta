import { Show } from "solid-js";
import { NoteListColumn } from "@/components/layout/NoteListColumn";
import { NoteViewColumn } from "@/components/layout/NoteViewColumn";
import { NotesBreadcrumbs } from "@/components/layout/NotesBreadcrumbs";
import { ChooseFolderPrompt } from "@/components/elements/settings/ChooseFolderPrompt";
import { createStorageFolder } from "@/composables/create-storage-folder";

export function AllNotesPage() {
  const storage = createStorageFolder();

  return (
    <section class="flex h-full flex-1 flex-col overflow-hidden">
      <Show when={storage.folder()} fallback={<ChooseFolderPrompt />}>
        <div class="flex min-h-0 flex-1 overflow-hidden">
          <NoteListColumn />
          <NoteViewColumn />
        </div>
        <NotesBreadcrumbs />
      </Show>
    </section>
  );
}