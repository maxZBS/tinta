import type { UpdaterState } from "@/composables/create-updater";

/** Short, friendly status shown under the "Check for updates" button on the
 *  About page. Returns null when there's nothing to say yet (idle), so the
 *  line only appears once the user has acted. */
export function aboutUpdateStatus(state: UpdaterState): string | null {
  if (state.status === "checking") {
    return "Checking for updates…";
  }

  if (state.status === "upToDate") {
    return "You're on the latest version.";
  }

  if (state.status === "available") {
    return `Version ${state.update.version} is available.`;
  }

  if (state.status === "downloading" || state.status === "ready") {
    return "Update in progress…";
  }

  if (state.status === "error") {
    return "Couldn't check for updates. Try again later.";
  }

  return null;
}

/** The button is disabled while a check or install is in flight. */
export function isAboutUpdateBusy(state: UpdaterState): boolean {
  return (
    state.status === "checking" ||
    state.status === "downloading" ||
    state.status === "ready"
  );
}
