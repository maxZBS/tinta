import type { UpdaterState } from "@/composables/create-updater";

/** Dev-only: simulate an available update so the banner UI can be tested
 *  locally without a real release. Enabled by `VITE_FAKE_UPDATE=1`. The fake
 *  "update" object only carries the fields the banner reads (version, body). */
export function isFakeUpdateEnabled(): boolean {
  return import.meta.env.DEV && import.meta.env.VITE_FAKE_UPDATE === "1";
}

export function fakeAvailableState(): UpdaterState {
  return {
    status: "available",
    // Cast: the banner only reads `version` and `body`; this stands in for the
    // real plugin Update object in dev.
    update: {
      version: "9.9.9",
      currentVersion: "0.1.0",
      body: [
        "## Features",
        "- Live outline with word counts for each section.",
        "- New screenplay template for scenes and dialogue.",
        "- Long drafts reopen at the same scroll position.",
        "",
        "## Bug Fixes",
        "- More reliable autosave while typing fast.",
        "- PDF export progress stays visible until the file is ready.",
      ].join("\n"),
    } as never,
  };
}

/** Plays a fake download progress, then a brief "ready" state, calling back
 *  into the updater's setState. Returns when the fake install finishes. */
export async function runFakeInstall(
  setState: (state: UpdaterState) => void,
): Promise<void> {
  for (let step = 0; step <= 10; step++) {
    setState({ status: "downloading", progress: step / 10 });
    await delay(120);
  }

  setState({ status: "ready" });
  await delay(800);
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
