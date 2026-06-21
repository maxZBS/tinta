/** Turn a stored ISO timestamp into the calm relative label the list and
 *  editor show — "Today" / "Yesterday" / a short month-day date. */
export function formatUpdatedLabel(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const dayMs = 24 * 60 * 60 * 1000;
  const diffDays = Math.round(
    (startOfToday.getTime() - new Date(date).setHours(0, 0, 0, 0)) / dayMs,
  );

  if (diffDays <= 0) {
    return "Today";
  }
  if (diffDays === 1) {
    return "Yesterday";
  }
  if (diffDays < 7) {
    return date.toLocaleDateString(undefined, { weekday: "short" });
  }

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/** Absolute, human "Created" date for the writing-stats panel. */
export function formatCreatedLabel(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
