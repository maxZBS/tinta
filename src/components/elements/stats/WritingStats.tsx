import { StatRow } from "@/components/elements/stats/StatRow";
import { createWritingStats } from "@/composables/create-writing-stats";
import { formatStatNumber } from "@/lib/writing-stats.util";
import { formatCreatedLabel, formatUpdatedLabel } from "@/lib/format-date.util";
import type { INote } from "@/types/note.types";

interface IWritingStatsProps {
  note: INote;
}

/** Words / characters / personal reading time / edited / created for the open
 *  document. Reading time uses the writer's own words-per-minute (settings). */
export function WritingStats(props: IWritingStatsProps) {
  const stats = createWritingStats(() => props.note.body);

  return (
    <section>
      <h2 class="mb-2 text-xs font-semibold tracking-wide text-text-muted">
        STATS
      </h2>

      <div class="flex flex-col gap-2">
        <StatRow label="Words" value={formatStatNumber(stats().words)} />
        <StatRow
          label="Characters"
          value={formatStatNumber(stats().characters)}
        />
        <StatRow
          label="Reading time"
          value={`${stats().readingMinutes} min`}
        />
        <StatRow
          label="Last edited"
          value={formatUpdatedLabel(props.note.updated)}
        />
        <StatRow
          label="Created"
          value={formatCreatedLabel(props.note.created)}
        />
      </div>
    </section>
  );
}
