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
      state.diagram.currentMode.mode === "BEFORE_CREATING" ||
      state.diagram.currentMode.mode === "CREATE"
    )
      return "CREATE";

    if (state.diagram.currentMode.mode === "MOVE") return "MOVE";
    if (state.diagram.currentMode.mode === "RESIZE") return "RESIZE";

    if (
      state.diagram.currentMode.mode === "SELECT" &&
      state.diagram.currentHoveredCell
    ) {
      const selectMode = state.diagram.currentMode;

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
