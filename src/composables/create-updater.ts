import { createSignal, onMount } from "solid-js";
import { check, type Update } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import {
  fakeAvailableState,
  isFakeUpdateEnabled,
  runFakeInstall,
} from "@/composables/updater-fake.util";

/** Update lifecycle state the UI subscribes to. */
export type UpdaterState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "available"; update: Update }
  | { status: "downloading"; progress: number }
  | { status: "ready" }
  | { status: "upToDate" }
  | { status: "error"; message: string };

/** Checks for an update on startup and exposes handles to download, install,
 *  and relaunch the app. All updater-plugin work is encapsulated here — the UI
 *  only reads the signal and calls the two functions. */
export function createUpdater() {
  const [state, setState] = createSignal<UpdaterState>({ status: "idle" });

  async function checkForUpdate() {
    // Dev-only: skip the network and show a fake available update.
    if (isFakeUpdateEnabled()) {
      setState(fakeAvailableState());
      return;
    }

    setState({ status: "checking" });

    try {
      const update = await check();

      if (!update) {
        setState({ status: "upToDate" });
        return;
      }

      setState({ status: "available", update });
    } catch (error) {
      setState({ status: "error", message: messageOf(error) });
    }
  }

  /** Download and install the found update, then relaunch. */
  async function installAndRelaunch() {
    const current = state();

    if (current.status !== "available") {
      return;
    }

    // Dev-only: play a fake progress instead of downloading/relaunching.
    if (isFakeUpdateEnabled()) {
      await runFakeInstall(setState);
      return;
    }

    const { update } = current;

    let downloaded = 0;
    let total = 0;

    try {
      await update.downloadAndInstall(event => {
        if (event.event === "Started") {
          total = event.data.contentLength ?? 0;
          setState({ status: "downloading", progress: 0 });
        }

        if (event.event === "Progress") {
          downloaded += event.data.chunkLength;
          const progress = total > 0 ? downloaded / total : 0;
          setState({ status: "downloading", progress });
        }

        if (event.event === "Finished") {
          setState({ status: "ready" });
        }
      });

      await relaunch();
    } catch (error) {
      setState({ status: "error", message: messageOf(error) });
    }
  }

  onMount(checkForUpdate);

  return { state, checkForUpdate, installAndRelaunch };
}

function messageOf(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}