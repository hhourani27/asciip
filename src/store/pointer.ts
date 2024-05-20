import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";
import {
  getShapeObjAtCoords,
  hasResizePointAtCoords,
  isShapeAtCoords,
} from "../models/shapeInCanvas";

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
