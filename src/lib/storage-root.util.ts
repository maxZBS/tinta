import { invoke } from "@tauri-apps/api/core";
import { useSettingsStore } from "@/stores/settings.store";

/** Single source of truth for the on-disk storage root: the folder the user
 *  picked. Every fs call resolves its absolute paths from here, so the chosen
 *  folder is the one place that knows where notes live. */
export function getStorageRoot(): string {
  const root = useSettingsStore.getState().storageFolder;

  if (!root) {
    throw new Error("No storage folder chosen yet.");
  }

  return root;
}

/** Whether the user has chosen a storage folder. Gates the notes UI. */
export function hasStorageRoot(): boolean {
  return useSettingsStore.getState().storageFolder !== null;
}

/** Grant the fs plugin runtime access to the chosen folder (the static
 *  `fs:scope` can't name a runtime path). Call after picking, and on boot. */
export function applyStorageScope(path: string): Promise<void> {
  return invoke("allow_storage_dir", { path });
}