import { create } from "zustand";
import { persist } from "zustand/middleware";

export const ThemeModeEnum = {
  System: "system",
  Light: "light",
  Dark: "dark",
} as const;

export type TThemeMode = (typeof ThemeModeEnum)[keyof typeof ThemeModeEnum];

interface ISettingsStore {
  /** Absolute path to the folder where the writer's notes live. Chosen by the
   *  user; `null` until they pick one (no notes UI is shown before then). */
  storageFolder: string | null;
  /** The writer's personal reading/speaking speed, in words per minute.
   *  Reading time is derived from this so the estimate matches them, rather
   *  than a fixed 200wpm constant. */
  wordsPerMinute: number;
  themeMode: TThemeMode;
  setStorageFolder: (storageFolder: string | null) => void;
  setWordsPerMinute: (wordsPerMinute: number) => void;
  setThemeMode: (themeMode: TThemeMode) => void;
}

const DEFAULT_WORDS_PER_MINUTE = 200;

/** Bounds for the reading-speed setting, shared with the stepper UI. */
export const WORDS_PER_MINUTE_MIN = 60;
export const WORDS_PER_MINUTE_MAX = 1000;

/** Persisted app/user preferences — global memory, so Zustand. Persisted to the
 *  WebView's localStorage (on-device only — privacy held) so the chosen folder
 *  and preferences survive restarts. */
export const useSettingsStore = create<ISettingsStore>()(
  persist(
    set => ({
      storageFolder: null,
      wordsPerMinute: DEFAULT_WORDS_PER_MINUTE,
      themeMode: ThemeModeEnum.System,

      setStorageFolder: storageFolder => set({ storageFolder }),

      setWordsPerMinute: wordsPerMinute =>
        set({
          wordsPerMinute: Math.min(
            WORDS_PER_MINUTE_MAX,
            Math.max(WORDS_PER_MINUTE_MIN, Math.round(wordsPerMinute || 0)),
          ),
        }),
      setThemeMode: themeMode => set({ themeMode }),
    }),
    { name: "tinta-settings" },
  ),
);