import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Coords, Shape } from "../models/shapes";
import _ from "lodash";

export type Tool = "SELECT" | "RECTANGLE";

type AppState = {
  canvasSize: {
    rows: number;
    cols: number;
  };

  shapes: Shape[];

  selectedTool: Tool;
  creationProgress: null | { start: Coords; curr: Coords; shape: Shape };
};

const initialState: AppState = {
  canvasSize: {
    rows: 100,
    cols: 100,
  },
  shapes: [{ type: "RECTANGLE", tl: { x: 0, y: 0 }, br: { x: 2, y: 2 } }],
  selectedTool: "SELECT",
  creationProgress: null,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setTool: (state, action: PayloadAction<Tool>) => {
      state.selectedTool = action.payload;
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
        state.shapes.push(state.creationProgress.shape);
        state.creationProgress = null;
      }
    },
    onCellHover: (state, action: PayloadAction<Coords>) => {
      if (
        state.selectedTool === "RECTANGLE" &&
        state.creationProgress != null
      ) {
        if (!_.isEqual(state.creationProgress.curr, action.payload)) {
          const curr = action.payload;
          const tl = {
            x: Math.min(state.creationProgress.start.x, curr.x),
            y: Math.min(state.creationProgress.start.y, curr.y),
          };

          const br = {
            x: Math.max(state.creationProgress.start.x, curr.x),
            y: Math.max(state.creationProgress.start.y, curr.y),
          };
          state.creationProgress = {
            start: state.creationProgress.start,
            curr,
            shape: { type: "RECTANGLE", tl, br },
          };
        }
      }
    },
  },
});

export const appReducer = appSlice.reducer;
export const appActions = appSlice.actions;
