export interface IOutlineSection {
  id: string;
  /** Heading text without the leading `#`s. */
  title: string;
  /** Heading depth, 1–6. */
  level: number;
  /** Character offset of the heading line in the body — used to jump there. */
  offset: number;
  /** Words in this section, up to the next heading of any level. */
  words: number;
}
