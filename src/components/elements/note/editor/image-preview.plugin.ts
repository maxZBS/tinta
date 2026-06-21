import { Decoration, EditorView, WidgetType } from "@codemirror/view";
import {
  StateField,
  RangeSetBuilder,
  type EditorState,
  type Extension,
} from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";

/** Resolves a raw markdown image source (e.g. `noteId/attachments/x.png`) to a
 *  loadable URL — the same resolution the read-only preview uses, injected so
 *  this field stays free of Tauri/store knowledge. */
export type TResolveImageSrc = (source: string) => string;

const IMAGE_SOURCE = /!\[[^\]]*\]\(([^)\s]+)/;

const hiddenSource = Decoration.replace({});

/** True when a position's line holds any cursor/selection, so its markdown
 *  source stays visible and editable instead of being collapsed. */
function isOnActiveLine(state: EditorState, pos: number): boolean {
  const line = state.doc.lineAt(pos);

  return state.selection.ranges.some(
    range => range.from <= line.to && range.to >= line.from,
  );
}

/** A rendered image shown on its own line beneath the markdown that produced
 *  it, so the `![alt](src)` text stays editable while the picture is visible —
 *  Bear-style inline media. */
class ImageWidget extends WidgetType {
  constructor(readonly url: string) {
    super();
  }

  eq(other: ImageWidget) {
    return other.url === this.url;
  }

  toDOM() {
    const wrap = document.createElement("div");
    wrap.className = "tinta-cm-image";

    const img = document.createElement("img");
    img.src = this.url;
    img.loading = "lazy";
    wrap.appendChild(img);

    return wrap;
  }

  ignoreEvent() {
    return false;
  }
}

function buildDecorations(state: EditorState, resolve: TResolveImageSrc) {
  const builder = new RangeSetBuilder<Decoration>();

  syntaxTree(state).iterate({
    enter(node) {
      if (node.name !== "Image") {
        return;
      }

      const raw = state.doc.sliceString(node.from, node.to);
      const match = raw.match(IMAGE_SOURCE);
      if (!match) {
        return;
      }

      // Off the active line, collapse the `![alt](src)` source so only the
      // picture shows; on it, leave the markdown visible for editing.
      if (!isOnActiveLine(state, node.from)) {
        builder.add(node.from, node.to, hiddenSource);
      }

      const line = state.doc.lineAt(node.to);
      builder.add(
        line.to,
        line.to,
        Decoration.widget({
          widget: new ImageWidget(resolve(match[1])),
          side: 1,
          block: true,
        }),
      );
    },
  });

  return builder.finish();
}

/** Inline image rendering for the live editor. A StateField (not a ViewPlugin)
 *  because CodeMirror forbids block decorations from plugins; the field
 *  recomputes whenever the document or selection changes so the source
 *  collapses as the caret leaves the image's line. */
export function imagePreviewPlugin(resolve: TResolveImageSrc): Extension {
  const field = StateField.define({
    create: state => buildDecorations(state, resolve),
    update(value, tr) {
      if (tr.docChanged || tr.selection) {
        return buildDecorations(tr.state, resolve);
      }

      return value;
    },
    provide: self => EditorView.decorations.from(self),
  });

  return field;
}
