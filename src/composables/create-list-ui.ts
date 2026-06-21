import { useListUiStore } from "@/stores/list-ui.store";
import { createZustandSelector } from "@/composables/create-zustand-selector";

/** Reactive view of the list UI store: selection, search, and tag filter as
 *  accessors, plus the actions. One call per component instead of a selector
 *  per slice. */
export function createListUi() {
  const store = useListUiStore;

  return {
    selectedNoteId: createZustandSelector(store, state => state.selectedNoteId),
    searchQuery: createZustandSelector(store, state => state.searchQuery),
    activeTag: createZustandSelector(store, state => state.activeTag),
    selectNote: store.getState().selectNote,
    setSearchQuery: store.getState().setSearchQuery,
    setActiveTag: store.getState().setActiveTag,
    toggleActiveTag: store.getState().toggleActiveTag,
  };
}
