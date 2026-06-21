import {
  Decoration,
  EditorView,
  ViewPlugin,
  type DecorationSet,
  type ViewUpdate,
} from "@codemirror/view";
import { RangeSetBuilder, type Range } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";
import type { SyntaxNodeRef } from "@lezer/common";

/** Syntax-marker node types whose glyphs we collapse when off the active line
 *  (the `#` of a heading, the `**`/`_`/`==` fences of emphasis, the `>` of a
 *  quote, list bullets, link brackets). Their content stays; only the marker
 *  characters are visually removed so prose reads clean, Bear-style. */
const MARKER_NODES = new Set([
  "HeaderMark",
  "QuoteMark",
  "EmphasisMark",
  "StrikethroughMark",
  "CodeMark",
  "LinkMark",
  "ListMark",
]);

const hiddenMark = Decoration.replace({});

/** Line-leading markers (`#`, `>`) are followed by a space that, left visible,
 *  reads as an indent before the prose. Hide that trailing space too so the
 *  heading/quote text sits flush left like Bear. */
const TRAILING_SPACE_NODES = new Set(["HeaderMark", "QuoteMark"]);

/** End of the range to hide for a marker: its own glyphs, plus the single
 *  trailing space for line-leading markers so the text isn't pushed right. */
function markerEnd(view: EditorView, node: SyntaxNodeRef): number {
  if (!TRAILING_SPACE_NODES.has(node.name)) {
    return node.to;
  }

  const next = view.state.doc.sliceString(node.to, node.to + 1);

  return next === " " ? node.to + 1 : node.to;
}

/** True when a marker's line touches any cursor/selection so the line stays
 *  fully editable — markers reappear the moment the caret enters their line. */
function isOnActiveLine(view: EditorView, pos: number): boolean {
  const line = view.state.doc.lineAt(pos);

  return view.state.selection.ranges.some(
    range => range.from <= line.to && range.to >= line.from,
  );
}

function buildDecorations(view: EditorView): DecorationSet {
  const marks: Range<Decoration>[] = [];

  for (const { from, to } of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from,
      to,
      enter(node) {
        if (!MARKER_NODES.has(node.name)) {
          return;
        }

        if (isOnActiveLine(view, node.from)) {
          return;
        }

        marks.push(hiddenMark.range(node.from, markerEnd(view, node)));
      },
    });
  }

  const builder = new RangeSetBuilder<Decoration>();
  for (const mark of marks.sort((a, b) => a.from - b.from)) {
    builder.add(mark.from, mark.to, mark.value);
  }

  return builder.finish();
}

/** The Bear-style live-preview core: rebuild marker-hiding decorations on every
 *  doc, viewport or selection change so syntax fades out as you leave a line
 *  and snaps back as you return. */
export const hideMarkersPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = buildDecorations(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged || update.viewportChanged || update.selectionSet) {
        this.decorations = buildDecorations(update.view);
      }
    }
  },
  {
    decorations: plugin => plugin.decorations,
  },
);