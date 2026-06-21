import { IconMinus, IconPlus } from "@tabler/icons-solidjs";
import { createSettings } from "@/composables/create-settings";
import {
  WORDS_PER_MINUTE_MAX,
  WORDS_PER_MINUTE_MIN,
} from "@/stores/settings.store";

const STEP = 10;

/** Lets the writer set their personal reading/speaking speed (words/minute),
 *  which drives the reading-time estimate. A −/+ stepper flanks the input for
 *  quick adjustment; the store clamps to the shared min/max. */
export function ReadingSpeedField() {
  const settings = createSettings();

  const value = () => settings.wordsPerMinute();
  const nudge = (delta: number) =>
    settings.setWordsPerMinute(value() + delta);

  return (
    <section>
      <h2 class="mb-2 text-xs font-semibold tracking-wide text-text-muted">
        READING SPEED
      </h2>

      <div class="flex items-center justify-between gap-3 text-sm text-text-secondary">
        <span>Words / minute</span>

        <div class="flex items-center gap-1">
          <button
            type="button"
            aria-label="Decrease words per minute"
            disabled={value() <= WORDS_PER_MINUTE_MIN}
            onClick={() => nudge(-STEP)}
            class="tinta-action tinta-control-surface flex h-8 w-8 items-center justify-center rounded-md text-text-secondary disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            <IconMinus size={16} stroke-width={2} />
          </button>

          <input
            type="number"
            inputmode="numeric"
            min={WORDS_PER_MINUTE_MIN}
            max={WORDS_PER_MINUTE_MAX}
            step={STEP}
            value={value()}
            onInput={event =>
              settings.setWordsPerMinute(Number(event.currentTarget.value))
            }
            class="tinta-no-spinner tinta-control-surface w-16 rounded-md px-2 py-1 text-center text-text-primary outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          />

          <button
            type="button"
            aria-label="Increase words per minute"
            disabled={value() >= WORDS_PER_MINUTE_MAX}
            onClick={() => nudge(STEP)}
            class="tinta-action tinta-control-surface flex h-8 w-8 items-center justify-center rounded-md text-text-secondary disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            <IconPlus size={16} stroke-width={2} />
          </button>
        </div>
      </div>
    </section>
  );
}