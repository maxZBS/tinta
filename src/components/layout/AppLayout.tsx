import { createSignal, Show, type JSX } from "solid-js";
import { Sidebar } from "@/components/layout/Sidebar";
import { UpdateBanner } from "@/components/elements/updater/UpdateBanner";
import { createAppShortcuts } from "@/composables/create-app-shortcuts";
import { createThemeSync } from "@/composables/create-theme-sync";
import { createUpdater } from "@/composables/create-updater";
import { LayoutContext } from "@/composables/layout-context";

interface IAppLayoutProps {
  children?: JSX.Element;
}

/** App shell: persistent sidebar + the active section's content. Sidebar
 *  collapse is local UI (a signal) shared with sections via context. */
export function AppLayout(props: IAppLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = createSignal(false);
  const toggleSidebar = () => setIsSidebarCollapsed(collapsed => !collapsed);

  createAppShortcuts({ onToggleSidebar: toggleSidebar });
  createThemeSync();

  const updater = createUpdater();
  const [isUpdateDismissed, setIsUpdateDismissed] = createSignal(false);

  // A manual check (About page) re-shows the banner so a dismissed-then-found
  // update isn't swallowed.
  function checkForUpdate() {
    setIsUpdateDismissed(false);
    updater.checkForUpdate();
  }

  return (
    <LayoutContext.Provider
      value={{
        isSidebarCollapsed,
        toggleSidebar,
        updaterState: updater.state,
        checkForUpdate,
      }}
    >
      <div class="flex h-screen w-screen overflow-hidden bg-transparent">
        <Show when={!isSidebarCollapsed()}>
          <Sidebar />
        </Show>

        <main class="flex h-full flex-1 overflow-hidden">{props.children}</main>

        <Show when={!isUpdateDismissed()}>
          <UpdateBanner
            state={updater.state()}
            onInstall={updater.installAndRelaunch}
            onDismiss={() => setIsUpdateDismissed(true)}
          />
        </Show>
      </div>
    </LayoutContext.Provider>
  );
}
