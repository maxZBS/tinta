import { createResource } from "solid-js";
import { getVersion } from "@tauri-apps/api/app";

/** Reads the app version from Tauri (sourced from tauri.conf.json — the single
 *  version of truth). Returns a resource accessor the UI can render directly. */
export function createAppVersion() {
  const [version] = createResource(getVersion);
  return version;
}
