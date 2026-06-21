import { IconSettings } from "@tabler/icons-solidjs";
import { StorageFolderField } from "@/components/elements/settings/StorageFolderField";
import { ReadingSpeedField } from "@/components/elements/stats/ReadingSpeedField";

/** App settings — where notes live and personal writing preferences. */
export function SettingsPage() {
  return (
    <section class="flex h-full flex-1 flex-col overflow-hidden">
      <header class="flex h-12 shrink-0 items-center gap-2 px-6 text-base font-semibold text-text-primary">
        <IconSettings size={20} stroke-width={1.75} />
        <span>Settings</span>
      </header>

      <div class="mx-auto w-full max-w-2xl min-h-0 flex-1 overflow-y-auto px-6 pb-8">
        <div class="flex flex-col gap-8">
          <StorageFolderField />
          <ReadingSpeedField />
        </div>
      </div>
    </section>
  );
}