import { create } from "zustand";
import { ViewModeEnum, type TViewMode } from "@/types/note.types";

interface IEditorViewStore {
  /** Preview vs. Markdown-source view of the open note. */
  viewMode: TViewMode;
  setViewMode: (mode: TViewMode) => void;
  toggleViewMode: () => void;
}

/** How the open note is rendered — preview vs. markdown source. A user
 *  preference about the editor, deliberately separate from the list's
 *  selection/search state. */
export const useEditorViewStore = create<IEditorViewStore>(set => ({
  viewMode: ViewModeEnum.Source,

  setViewMode: mode => set({ viewMode: mode }),
  toggleViewMode: () =>
    set(state => ({
      viewMode:
        state.viewMode === ViewModeEnum.Preview
          ? ViewModeEnum.Source
          : ViewModeEnum.Preview,
    })),
}));
