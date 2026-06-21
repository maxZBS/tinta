export interface IDocumentTemplate {
  id: string;
  label: string;
  description: string;
  /** Markdown scaffolding inserted into a fresh document. */
  body: string;
}

/** Smart starting structures for long-form writing. Picking one creates a new
 *  document pre-filled with its scaffold so the writer starts with shape, not a
 *  blank page. */
export const DOCUMENT_TEMPLATES: IDocumentTemplate[] = [
  {
    id: "blank",
    label: "Blank",
    description: "An empty page.",
    body: "",
  },
  {
    id: "essay",
    label: "Essay",
    description: "Intro, body sections, conclusion.",
    body: [
      "# Title",
      "",
      "## Intro",
      "",
      "## Section 1",
      "",
      "## Section 2",
      "",
      "## Conclusion",
      "",
    ].join("\n"),
  },
  {
    id: "screenplay",
    label: "Screenplay",
    description: "Scene scaffold for a script.",
    body: [
      "# Working title",
      "",
      "## Logline",
      "",
      "## Act I",
      "",
      "### INT. LOCATION — DAY",
      "",
      "CHARACTER",
      "Dialogue line.",
      "",
      "## Act II",
      "",
      "## Act III",
      "",
    ].join("\n"),
  },
  {
    id: "chapter",
    label: "Chapter",
    description: "A book chapter outline.",
    body: ["# Chapter 1", "", "## Scene 1", "", "## Scene 2", ""].join("\n"),
  },
];
