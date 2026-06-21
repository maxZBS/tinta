import { useSettingsStore } from "@/stores/settings.store";
import { createZustandSelector } from "@/composables/create-zustand-selector";

/** Reactive view of the settings store: preferences as accessors + actions. */
export function createSettings() {
  const store = useSettingsStore;

  return {
    wordsPerMinute: createZustandSelector(store, state => state.wordsPerMinute),
    themeMode: createZustandSelector(store, state => state.themeMode),
    setWordsPerMinute: store.getState().setWordsPerMinute,
    setThemeMode: store.getState().setThemeMode,
  };
}
