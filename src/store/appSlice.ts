import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Coords, Shape } from "../models/shapes";
import _ from "lodash";
import { Grid, getCanvasGridRepresentation } from "../models/representation";

export type Tool = "SELECT" | "RECTANGLE";

type AppState = {
  canvasSize: {
    rows: number;
    cols: number;
  };

  shapes: Shape[];
  // Although this is a derived state variable, but I'm adding it to the App state to optimize the rendering of the grid
  gridRepr: Grid;

  selectedTool: Tool;
  creationProgress: null | { start: Coords; curr: Coords; shape: Shape };
};

const initState = (): AppState => {
  const [rows, cols] = [200, 200];

  return {
    canvasSize: {
      rows,
      cols,
    },
    shapes: [],
    gridRepr: _.times(rows, () => _.fill(Array(cols), "\u00A0")),

    selectedTool: "SELECT",
    creationProgress: null,
  };
};

export const appSlice = createSlice({
  name: "app",
  initialState: initState(),
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

        updateGrid(state);
      }
    },
    onCellMouseUp: (state, action: PayloadAction<Coords>) => {
      if (state.creationProgress != null) {
        state.shapes.push(state.creationProgress.shape);
        state.creationProgress = null;

        updateGrid(state);
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

        updateGrid(state);
      }
    },
  },
});

const updateGrid = (state: AppState): void => {
  const allShapes = state.creationProgress
    ? [...state.shapes, state.creationProgress.shape]
    : state.shapes;

  state.gridRepr = getCanvasGridRepresentation(
    state.canvasSize.rows,
    state.canvasSize.cols,
    allShapes
  );
};

export const appReducer = appSlice.reducer;
export const appActions = appSlice.actions;
