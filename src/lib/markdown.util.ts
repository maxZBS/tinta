import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";
import type { Options } from "markdown-it/lib/index.mjs";
import type Renderer from "markdown-it/lib/renderer.mjs";
import type Token from "markdown-it/lib/token.mjs";
import { markdownMark } from "@/lib/markdown-mark.plugin";

interface IMarkdownRenderOptions {
  resolveImageSrc?: (source: string) => string;
}

interface IMarkdownEnv {
  resolveImageSrc?: (source: string) => string;
}

/** One shared markdown-it instance. GFM-ish defaults: autolink URLs, render
 *  source newlines as <br>, typographic replacements. HTML in the source is
 *  disabled — notes are markdown, and it keeps the output simpler to sanitize. */
const md = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
  typographer: true,
});

md.use(markdownMark);

const defaultImageRenderer =
  md.renderer.rules.image ??
  ((
    tokens: Token[],
    index: number,
    options: Options,
    _env: IMarkdownEnv,
    self: Renderer,
  ) => self.renderToken(tokens, index, options));

md.renderer.rules.image = (
  tokens: Token[],
  index: number,
  options: Options,
  env: IMarkdownEnv,
  self: Renderer,
) => {
  const token = tokens[index];
  const sourceIndex = token.attrIndex("src");
  const source = sourceIndex >= 0 ? token.attrs?.[sourceIndex][1] : null;

  if (source && env.resolveImageSrc) {
    token.attrSet("src", env.resolveImageSrc(source));
  }

  return defaultImageRenderer(tokens, index, options, env, self);
};

/** Render markdown to a sanitized HTML string ready for the preview pane.
 *  markdown-it output is trusted, but DOMPurify is a cheap guard against any
 *  edge cases in user-authored notes (e.g. javascript: URLs). */
export function renderMarkdown(
  source: string,
  options: IMarkdownRenderOptions = {},
): string {
  return DOMPurify.sanitize(md.render(source, options), {
    ALLOWED_URI_REGEXP:
      /^(?:(?:https?|mailto|tel|blob|asset):|(?:https?:\/\/asset\.localhost)|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  });
}
