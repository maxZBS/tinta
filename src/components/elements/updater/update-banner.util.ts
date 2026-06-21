import type { UpdaterState } from "@/composables/create-updater";

export interface IUpdateNoteSection {
  title: string;
  items: string[];
}

const NOTE_TITLE_BY_RELEASE_HEADING: Record<string, string> = {
  "bug fixes": "Stability fixes",
  fixes: "Stability fixes",
  features: "Writing improvements",
};

/** The banner only shows when there's something actionable for the user. */
export function isBannerShown(state: UpdaterState): boolean {
  return (
    state.status === "available" ||
    state.status === "downloading" ||
    state.status === "ready"
  );
}

/** While downloading or relaunching, the banner can't be dismissed. */
export function isBannerBusy(state: UpdaterState): boolean {
  return state.status === "downloading" || state.status === "ready";
}

export function bannerTitle(state: UpdaterState): string {
  if (state.status === "available") {
    return `Tinta ${state.update.version} is ready`;
  }

  if (state.status === "downloading") {
    return "Installing update...";
  }

  return "Restarting Tinta...";
}

/** Release notes from the GitHub release (the update's body field). */
export function bannerNotes(state: UpdaterState): string | undefined {
  if (state.status === "available") {
    return state.update.body?.trim() || undefined;
  }

  return undefined;
}

export function bannerNoteSections(
  state: UpdaterState,
): IUpdateNoteSection[] {
  const notes = bannerNotes(state);

  if (!notes) {
    return [];
  }

  return parseReleaseNotes(notes);
}

export function bannerProgressPct(state: UpdaterState): number {
  if (state.status === "downloading") {
    return Math.round(state.progress * 100);
  }

  return 0;
}

function parseReleaseNotes(notes: string): IUpdateNoteSection[] {
  const sections: IUpdateNoteSection[] = [];
  let current: IUpdateNoteSection | undefined;

  for (const rawLine of notes.split("\n")) {
    const line = cleanReleaseLine(rawLine);

    if (!line) {
      continue;
    }

    if (isHeading(rawLine)) {
      current = { title: displayHeading(line), items: [] };
      sections.push(current);
      continue;
    }

    current ??= { title: "Included in this update", items: [] };

    if (!sections.includes(current)) {
      sections.push(current);
    }

    current.items.push(line);
  }

  return sections.filter(section => section.items.length > 0);
}

function cleanReleaseLine(line: string): string {
  return line
    .replace(/^#+\s*/, "")
    .replace(/^[-*]\s+/, "")
    .replace(/^[^\w\s]+\s*/u, "")
    .trim();
}

function isHeading(line: string): boolean {
  return (
    /^#+\s+/.test(line) ||
    /^[^\w\s]*\s*(Features|Fixes|Bug Fixes)$/iu.test(line)
  );
}

function displayHeading(heading: string): string {
  return NOTE_TITLE_BY_RELEASE_HEADING[heading.toLowerCase()] ?? heading;
}
