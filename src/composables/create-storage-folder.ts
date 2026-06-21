import { open } from "@tauri-apps/plugin-dialog";
import { applyStorageScope } from "@/lib/storage-root.util";
import { createZustandSelector } from "@/composables/create-zustand-selector";
import { useNotesStore } from "@/stores/notes.store";
import { useSettingsStore } from "@/stores/settings.store";

/** The user-chosen storage folder: a reactive accessor plus the action to pick
 *  a new one. Picking grants the runtime fs scope, persists the path, and
 *  reloads the notes list from the new location. */
export function createStorageFolder() {
  const folder = createZustandSelector(
    useSettingsStore,
    state => state.storageFolder,
  );

  async function chooseFolder() {
    const picked = await open({
      directory: true,
      multiple: false,
      title: "Choose where your notes live",
    });

    if (typeof picked !== "string") {
      return;
    }

    await applyStorageScope(picked);
    useSettingsStore.getState().setStorageFolder(picked);

    await useNotesStore.getState().loadNotes();
  }

  return { folder, chooseFolder };
}

/** Re-grant the persisted folder's fs scope on boot (the static capability
 *  can't name it). Returns whether a folder is set, so the caller can decide
 *  whether to load notes. */
export async function bootStorageFolder(): Promise<boolean> {
  const folder = useSettingsStore.getState().storageFolder;

  if (!folder) {
    return false;
  }

  await applyStorageScope(folder);

  return true;
}