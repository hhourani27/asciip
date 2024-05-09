import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Coords, Shape } from "../models/shapes";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { getShapesAtCoords } from "../models/representation";

export type Tool = "SELECT" | "RECTANGLE";

export type ShapeWithId = { id: string } & Shape;

type AppState = {
  canvasSize: {
    rows: number;
    cols: number;
  };

  shapes: ShapeWithId[];

  selectedTool: Tool;
  creationProgress: null | { start: Coords; curr: Coords; shape: Shape };

  // Properties set when selectedTool === SELECT
  selectedShape: null | string;
  nextActionOnClick: null | "SELECT" | "MOVE";
};

const initState = (): AppState => {
  const [rows, cols] = [100, 800];

  return {
    canvasSize: {
      rows,
      cols,
    },
    shapes: [],

    selectedTool: "SELECT",
    creationProgress: null,
    selectedShape: null,
    nextActionOnClick: null,
  };
};

export const appSlice = createSlice({
  name: "app",
  initialState: initState(),
  reducers: {
    setTool: (state, action: PayloadAction<Tool>) => {
      state.selectedTool = action.payload;
      if (action.payload !== "SELECT") {
        state.selectedShape = null;
        state.nextActionOnClick = null;
      }
    },
    onCellClick: (state, action: PayloadAction<Coords>) => {
      if (state.selectedTool === "SELECT") {
        const shapes = getShapesAtCoords(state.shapes, action.payload);
        if (shapes.length > 0) {
          state.selectedShape = shapes[shapes.length - 1].id;
        } else {
          state.selectedShape = null;
        }
      }
    },
    onCellMouseDown: (state, action: PayloadAction<Coords>) => {
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
      if (state.creationProgress != null) {
        const newShape: ShapeWithId = {
          id: uuidv4(),
          ...state.creationProgress.shape,
        };
        state.shapes.push(newShape);
        state.creationProgress = null;
      }
    },
    onCellHover: (state, action: PayloadAction<Coords>) => {
      if (state.selectedTool === "SELECT") {
        const shapes = getShapesAtCoords(state.shapes, action.payload);
        if (shapes.length > 0) {
          state.nextActionOnClick = "SELECT";
        } else {
          state.nextActionOnClick = null;
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
    selectedShape: (state) => {
      return state.shapes.find((shape) => shape.id === state.selectedShape);
    },
  },
});

export const appReducer = appSlice.reducer;
export const appActions = appSlice.actions;
export const appSelectors = appSlice.selectors;
