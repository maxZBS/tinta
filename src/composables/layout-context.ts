import { createContext, useContext, type Accessor } from "solid-js";
import type { UpdaterState } from "@/composables/create-updater";

interface ILayoutContext {
  isSidebarCollapsed: Accessor<boolean>;
  toggleSidebar: () => void;
  /** Live updater state, so a section (the About page) can reflect a manual
   *  check's result inline. */
  updaterState: Accessor<UpdaterState>;
  /** Re-run the update check on demand (e.g. the About page button) and
   *  re-surface the banner if the user had dismissed it. */
  checkForUpdate: () => void;
}

export const LayoutContext = createContext<ILayoutContext>();

/** Read the app-shell layout state (sidebar collapse) from any section. */
export function useLayout(): ILayoutContext {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within an AppLayout");
  }

  return context;
}
