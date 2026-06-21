export interface INote {
  /** Slug — the file name without the `.md` extension. Stable, unique. */
  id: string;
  title: string;
  body: string;
  tags: string[];
  pinned: boolean;
  /** ISO timestamps stored in the file frontmatter. */
  created: string;
  updated: string;
}

/** A note living in the trash folder — the note plus when it was deleted. */
export interface ITrashedNote extends INote {
  /** ISO timestamp of when the note was moved to trash. */
  deleted: string;
}

export const ViewModeEnum = {
  Preview: "preview",
  Source: "source",
} as const;

export type TViewMode = (typeof ViewModeEnum)[keyof typeof ViewModeEnum];