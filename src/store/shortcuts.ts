import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const isShortcutsEnabled = createSelector(
  [(state: RootState) => state],
  (state): boolean => {
    return (
      state.app.createDiagramInProgress === false &&
      state.app.renameDiagramInProgress == null &&
      state.app.deleteDiagramInProgress == null &&
      !(
        state.diagram.currentMode.mode === "CREATE" &&
        state.diagram.currentMode.shape.type === "TEXT"
      ) &&
      state.diagram.currentMode.mode !== "TEXT_EDIT"
    );
  }
);
