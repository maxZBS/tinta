import { createMemo, type Accessor } from "solid-js";
import { computeWritingStats } from "@/lib/writing-stats.util";
import type { IWritingStats } from "@/lib/writing-stats.types";
import { createSettings } from "@/composables/create-settings";

/** Reactive words / characters / personal reading-time for a body. Reading
 *  time tracks the writer's own words-per-minute from settings. */
export function createWritingStats(
  body: Accessor<string>,
): Accessor<IWritingStats> {
  const settings = createSettings();

  return createMemo(() =>
    computeWritingStats(body(), settings.wordsPerMinute()),
  );
}
