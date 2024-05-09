import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Coords, Shape } from "../models/shapes";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { getShapeAtCoords } from "../models/representation";
import { translate } from "../models/transformation";

export type Tool = "SELECT" | "RECTANGLE";

export type ShapeObject = { id: string; shape: Shape };

export type AppState = {
  canvasSize: {
    rows: number;
    cols: number;
  };

  shapes: ShapeObject[];

  selectedTool: Tool;
  creationProgress: null | { start: Coords; curr: Coords; shape: Shape };

  // Properties set when selectedTool === SELECT
  selectedShapeId: null | string;
  nextActionOnClick: null | "SELECT" | "MOVE";
  moveProgress: null | { start: Coords; startShape: Shape };
};

export const initState = (shapes?: ShapeObject[]): AppState => {
  const [rows, cols] = [100, 800];

  return {
    canvasSize: {
      rows,
      cols,
    },
    shapes: shapes ?? [],

    selectedTool: "SELECT",
    creationProgress: null,
    selectedShapeId: null,
    nextActionOnClick: null,
    moveProgress: null,
  };
};

export const appSlice = createSlice({
  name: "app",
  initialState: initState(),
  reducers: {
    setTool: (state, action: PayloadAction<Tool>) => {
      state.selectedTool = action.payload;
      if (action.payload !== "SELECT") {
        state.selectedShapeId = null;
        state.nextActionOnClick = null;
      }
    },
    onCellClick: (state, action: PayloadAction<Coords>) => {
      if (state.selectedTool === "SELECT") {
        const shape = getShapeAtCoords(state.shapes, action.payload);
        if (shape) {
          state.selectedShapeId = shape.id;
          state.nextActionOnClick = "MOVE";
        }
      }
    },
    onCellMouseDown: (state, action: PayloadAction<Coords>) => {
      if (state.selectedTool === "SELECT") {
        if (state.moveProgress == null && state.nextActionOnClick === "MOVE") {
          const selectedShapeObj = state.shapes.find(
            (s) => s.id === state.selectedShapeId
          )!;
          state.moveProgress = {
            start: action.payload,
            startShape: { ...selectedShapeObj.shape },
          };
        }
      }

      if (state.selectedTool === "RECTANGLE") {
        state.creationProgress = {
          start: action.payload,
          curr: action.payload,
          shape: {
            type: "RECTANGLE",
            tl: action.payload,
            br: action.payload,
          },
        };
      }
    },
    onCellMouseUp: (state, action: PayloadAction<Coords>) => {
      if (state.moveProgress != null) {
        state.moveProgress = null;
      }
      if (state.creationProgress != null) {
        const newShape: ShapeObject = {
          id: uuidv4(),
          shape: state.creationProgress.shape,
        };
        state.shapes.push(newShape);
        state.creationProgress = null;
      }
    },
    onCellHover: (state, action: PayloadAction<Coords>) => {
      if (state.selectedTool === "SELECT") {
        if (state.moveProgress != null) {
          // Get selected shape
          const selectedShapeIdx: number = state.shapes.findIndex(
            (s) => s.id === state.selectedShapeId
          )!;
          // Translate shape
          const from = state.moveProgress.start;
          const to = action.payload;
          const delta = { r: to.r - from.r, c: to.c - from.c };
          const translatedShape: Shape = translate(
            state.moveProgress.startShape,
            delta,
            state.canvasSize
          );
          // Replace translated shape
          state.shapes[selectedShapeIdx].shape = translatedShape;
        } else {
          const shape = getShapeAtCoords(state.shapes, action.payload);
          if (shape) {
            if (shape.id === state.selectedShapeId) {
              state.nextActionOnClick = "MOVE";
            } else {
              state.nextActionOnClick = "SELECT";
            }
          } else {
            state.nextActionOnClick = null;
          }
        }
      }

      if (
        state.selectedTool === "RECTANGLE" &&
        state.creationProgress != null
      ) {
        if (!_.isEqual(state.creationProgress.curr, action.payload)) {
          const curr = action.payload;
          const tl: Coords = {
            r: Math.min(state.creationProgress.start.r, curr.r),
            c: Math.min(state.creationProgress.start.c, curr.c),
          };

          const br: Coords = {
            r: Math.max(state.creationProgress.start.r, curr.r),
            c: Math.max(state.creationProgress.start.c, curr.c),
          };
          state.creationProgress = {
            start: state.creationProgress.start,
            curr,
            shape: { ...state.creationProgress.shape, tl, br },
          };
        }
      }
    },
  },
  selectors: {
    selectedShapeObj: (state) => {
      return state.shapes.find((shape) => shape.id === state.selectedShapeId);
    },
  },
});

export const appReducer = appSlice.reducer;
export const appActions = appSlice.actions;
export const appSelectors = appSlice.selectors;
