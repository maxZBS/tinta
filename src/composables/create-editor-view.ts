import { useEditorViewStore } from "@/stores/editor-view.store";
import { createZustandSelector } from "@/composables/create-zustand-selector";
import { ViewModeEnum } from "@/types/note.types";

/** Reactive view of the editor-view store: the mode as an accessor (plus an
 *  `isSource` convenience) and its actions. */
export function createEditorView() {
  const store = useEditorViewStore;
  const viewMode = createZustandSelector(store, state => state.viewMode);

  return {
    viewMode,
    isSource: () => viewMode() === ViewModeEnum.Source,
    setViewMode: store.getState().setViewMode,
    toggleViewMode: store.getState().toggleViewMode,
  };
}
