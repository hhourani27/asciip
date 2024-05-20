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
        state.diagram.mode.M === "CREATE" &&
        state.diagram.mode.shape.type === "TEXT"
      ) &&
      state.diagram.mode.M !== "TEXT_EDIT"
    );
  }
);
