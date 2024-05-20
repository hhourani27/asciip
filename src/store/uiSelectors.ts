import { createSelector } from "@reduxjs/toolkit";
import {
  getShapeObjAtCoords,
  hasResizePointAtCoords,
  isShapeAtCoords,
} from "../models/shapeInCanvas";

import { RootState } from "./store";

/* Selectors that are used for extract state data into specific UI data */
export type Pointer = "SELECT" | "MOVE" | "CREATE" | "RESIZE" | "NONE";
export const getPointer = createSelector(
  [(state: RootState) => state],
  (state): Pointer => {
    if (
      state.diagram.mode.M === "BEFORE_CREATING" ||
      state.diagram.mode.M === "CREATE"
    )
      return "CREATE";

    if (state.diagram.mode.M === "MOVE") return "MOVE";
    if (state.diagram.mode.M === "RESIZE") return "RESIZE";

    if (state.diagram.mode.M === "SELECT" && state.diagram.currentHoveredCell) {
      const selectMode = state.diagram.mode;

      if (selectMode.selectedShapeId == null) {
        if (
          getShapeObjAtCoords(
            state.diagram.shapes,
            state.diagram.currentHoveredCell
          )
        )
          return "SELECT";
      } else {
        const selectedShapeObj = state.diagram.shapes.find(
          (s) => s.id === selectMode.selectedShapeId
        )!;

        if (
          hasResizePointAtCoords(
            selectedShapeObj.shape,
            state.diagram.currentHoveredCell
          )
        ) {
          return "RESIZE";
        } else if (
          isShapeAtCoords(
            selectedShapeObj.shape,
            state.diagram.currentHoveredCell
          )
        ) {
          return "MOVE";
        }
      }
    }

    return "NONE";
  }
);
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
