import { createSelector } from "@reduxjs/toolkit";
import {
  getShapeObjAtCoords,
  hasResizePointAtCoords,
  isShapeAtCoords,
} from "../models/shapeInCanvas";

import { RootState } from "./store";
import { DiagramState, ShapeObject } from "./diagramSlice";
import { Shape, TextShape } from "../models/shapes";

//#region diagramSlice selectors
const hasSelectedShape = createSelector(
  [(state: DiagramState) => state],
  (state): boolean => {
    if (state.mode.M === "SELECT") {
      return state.mode.selectedShapeIds.length > 0;
    } else if (state.mode.M === "MOVE") {
      return state.mode.shapeIds.length > 0;
    } else if (state.mode.M === "RESIZE") {
      return true;
    }

    return false;
  }
);

const hasSingleSelectedShape = createSelector(
  [(state: DiagramState) => state],
  (state): boolean => {
    if (state.mode.M === "SELECT") {
      return state.mode.selectedShapeIds.length === 1;
    } else if (state.mode.M === "MOVE") {
      return state.mode.shapeIds.length === 1;
    } else if (state.mode.M === "RESIZE") {
      return true;
    }

    return false;
  }
);

const selectedShapeObjs = createSelector(
  [(state: DiagramState) => state],
  (state): ShapeObject[] => {
    if (state.mode.M === "SELECT") {
      return state.mode.selectedShapeIds.map(
        (shapeId) => state.shapes.find((shape) => shape.id === shapeId)!
      );
    } else if (state.mode.M === "MOVE") {
      return state.mode.shapeIds.map(
        (shapeId) => state.shapes.find((shape) => shape.id === shapeId)!
      );
    } else if (state.mode.M === "RESIZE") {
      const resizeMode = state.mode;
      return [state.shapes.find((shape) => shape.id === resizeMode.shapeId)!];
    } else {
      return [];
    }
  }
);

const selectedShapeObj = createSelector(
  [(state: DiagramState) => state],
  (state): ShapeObject | undefined => {
    if (state.mode.M === "SELECT" && hasSelectedShape(state)) {
      if (state.mode.selectedShapeIds.length === 1) {
        const selectedShapeId = state.mode.selectedShapeIds[0];
        return state.shapes.find((shape) => shape.id === selectedShapeId)!;
      } else {
        throw new Error("There's more than 1 selected shape");
      }
    } else {
      return undefined;
    }
  }
);

const currentCreatedShape = createSelector(
  [(state: DiagramState) => state],
  (state): Shape | undefined => {
    if (state.mode.M === "CREATE") return state.mode.shape;
    else return undefined;
  }
);

const currentEditedText = createSelector(
  [(state: DiagramState) => state],
  (state): TextShape | undefined => {
    if (state.mode.M === "CREATE" && state.mode.shape.type === "TEXT") {
      return state.mode.shape;
    } else if (state.mode.M === "TEXT_EDIT") {
      const selectedShapeId = state.mode.shapeId;
      const selectedTextShapeObj = state.shapes.find(
        (s) => s.id === selectedShapeId
      );

      return selectedTextShapeObj
        ? (selectedTextShapeObj.shape as TextShape)
        : undefined;
    } else {
      return undefined;
    }
  }
);

export type Pointer = "SELECT" | "MOVE" | "RESIZE" | "CREATE" | "NONE";
const getPointer = createSelector(
  [(state: DiagramState) => state],
  (state): Pointer => {
    if (state.mode.M === "BEFORE_CREATING" || state.mode.M === "CREATE")
      return "CREATE";

    if (state.mode.M === "MOVE") return "MOVE";
    if (state.mode.M === "RESIZE") return "RESIZE";

    if (state.mode.M === "SELECT" && state.currentHoveredCell) {
      if (!hasSelectedShape(state)) {
        if (getShapeObjAtCoords(state.shapes, state.currentHoveredCell))
          return "SELECT";
      } else if (hasSingleSelectedShape(state)) {
        const shapeObj = selectedShapeObj(state)!;

        if (hasResizePointAtCoords(shapeObj.shape, state.currentHoveredCell)) {
          return "RESIZE";
        } else if (isShapeAtCoords(shapeObj.shape, state.currentHoveredCell)) {
          return "MOVE";
        }
      }
    }

    return "NONE";
  }
);

//#endregion

//#region Root state selectors
const isShortcutsEnabled = createSelector(
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

//#endregion
export const selectors = {
  hasSelectedShape,
  hasSingleSelectedShape,
  selectedShapeObjs,
  selectedShapeObj,
  getPointer,
  isShortcutsEnabled,
  currentCreatedShape,
  currentEditedText,
};
