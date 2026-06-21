interface INotePdfExportProgressProps {
  title: string;
}

export function NotePdfExportProgress(props: INotePdfExportProgressProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      class="tinta-pdf-export-progress absolute right-0 top-12 z-20 w-72 rounded-lg border px-3 py-2"
    >
      <div class="flex items-center justify-between gap-4">
        <span class="truncate text-sm font-medium text-text-primary">
          Preparing PDF
        </span>
        <span class="shrink-0 text-xs text-text-muted">Local export</span>
      </div>

      <div class="mt-2 h-1.5 overflow-hidden rounded-full bg-bg-selected">
        <div class="tinta-pdf-export-progress-bar h-full rounded-full" />
      </div>

      <p class="mt-2 truncate text-xs text-text-muted">{props.title}</p>
    </div>
  );
}
