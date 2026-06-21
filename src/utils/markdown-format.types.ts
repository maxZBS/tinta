export type THeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type TMarkdownFormat =
  | "heading"
  | "heading-1"
  | "heading-2"
  | "heading-3"
  | "heading-4"
  | "heading-5"
  | "heading-6"
  | "bold"
  | "italic"
  | "highlight"
  | "checklist"
  | "bullet-list"
  | "ordered-list"
  | "quote"
  | "link"
  | "code";

export interface IMarkdownRange {
  selectionEnd: number;
  selectionStart: number;
  value: string;
}

export type IMarkdownFormatResult = IMarkdownRange;