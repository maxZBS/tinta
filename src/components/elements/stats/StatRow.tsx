interface IStatRowProps {
  label: string;
  value: string;
}

export function StatRow(props: IStatRowProps) {
  return (
    <div class="flex items-baseline justify-between gap-3 text-sm">
      <span class="text-text-muted">{props.label}</span>
      <span class="font-medium text-text-secondary">{props.value}</span>
    </div>
  );
}
