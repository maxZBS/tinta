import { createEffect } from "solid-js";
import { createSettings } from "@/composables/create-settings";
import { ThemeModeEnum } from "@/stores/settings.store";

/** Apply the chosen theme to <html>. "system" leaves it to the CSS
 *  `prefers-color-scheme` default; "light"/"dark" set `data-theme` explicitly. */
export function createThemeSync() {
  const settings = createSettings();

  createEffect(() => {
    const mode = settings.themeMode();
    const root = document.documentElement;

    if (mode === ThemeModeEnum.System) {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", mode);
    }
  });
}
