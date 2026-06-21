interface IShortcutKeyProps {
  value: string;
}

export function ShortcutKey(props: IShortcutKeyProps) {
  return (
    <kbd class="min-w-8 rounded-md border border-border bg-bg-elevated px-2 py-1 text-center text-xs font-semibold text-text-secondary">
      {props.value}
    </kbd>
  );
}
