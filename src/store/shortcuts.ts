import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const isShortcutsEnabled = createSelector(
  [(state: RootState) => state],
  (state): boolean => {
    return (
      state.app.createDiagramInProgress === false &&
      state.app.renameDiagramInProgress == null &&
      state.app.deleteDiagramInProgress == null &&
      state.diagram.textEditProgress == null &&
      state.diagram.creationProgress?.shape.type !== "TEXT"
    );
  }
);
