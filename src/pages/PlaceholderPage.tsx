interface IPlaceholderPageProps {
  title: string;
}

/** Temporary stub for sections not built yet (Settings, Trash, …). */
export function PlaceholderPage(props: IPlaceholderPageProps) {
  return (
    <section class="flex h-full flex-1 flex-col items-center justify-center bg-bg-view text-text-muted">
      <p class="text-xl font-medium text-text-secondary">{props.title}</p>
      <p class="mt-2 text-base">Coming soon</p>
    </section>
  );
}
