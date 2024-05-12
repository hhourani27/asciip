import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  Coords,
  Line,
  Shape,
  isShapeLegal,
  normalizeLine,
} from "../models/shapes";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { getShapeAtCoords } from "../models/representation";
import { getResizePoints, resize, translate } from "../models/transformation";
import { createLineSegment, createZeroWidthSegment } from "../models/create";

export type Tool = "SELECT" | "RECTANGLE" | "LINE";

export type ShapeObject = { id: string; shape: Shape };
export type CanvasSize = {
  rows: number;
  cols: number;
};

export type AppState = {
  canvasSize: CanvasSize;

  shapes: ShapeObject[];

  ctrlPressed: boolean;

  selectedTool: Tool;
  creationProgress: null | {
    start: Coords;
    curr: Coords;
    checkpoint: Shape | null;
    shape: Shape;
  };

  // Properties set when selectedTool === SELECT
  selectedShapeId: null | string;
  nextActionOnClick: null | "SELECT" | "MOVE" | "RESIZE";
  moveProgress: null | { start: Coords; startShape: Shape };
  resizeProgress: null | { resizePoint: Coords; startShape: Shape };
};

export type StateInitOptions = {
  shapes?: ShapeObject[];
  canvasSize?: CanvasSize;
};
export const initState = (opt?: StateInitOptions): AppState => {
  return {
    canvasSize: opt?.canvasSize ?? {
      rows: 100,
      cols: 150,
    },
    shapes: opt?.shapes ?? [],

    selectedTool: "SELECT",
    ctrlPressed: false,
    creationProgress: null,
    selectedShapeId: null,
    nextActionOnClick: null,
    moveProgress: null,
    resizeProgress: null,
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
    onCtrlKey: (state, action: PayloadAction<boolean>) => {
      state.ctrlPressed = action.payload;
    },
    onCellDoubleClick: (state, action: PayloadAction<Coords>) => {
      if (state.creationProgress?.shape.type === "LINE") {
        const newShape: Line | null = isShapeLegal(state.creationProgress.shape)
          ? state.creationProgress.shape
          : (state.creationProgress.checkpoint as Line);

        if (newShape) {
          const newShapeObj: ShapeObject = {
            id: uuidv4(),
            shape: normalizeLine(newShape),
          };
          state.shapes.push(newShapeObj);
        }
        state.creationProgress = null;
      }
    },
    onCellClick: (state, action: PayloadAction<Coords>) => {
      if (state.selectedTool === "SELECT") {
        const shape = getShapeAtCoords(state.shapes, action.payload);
        if (shape) {
          state.selectedShapeId = shape.id;
          state.nextActionOnClick = "MOVE";
        } else {
          state.selectedShapeId = null;
          state.nextActionOnClick = "SELECT";
        }
      } else if (state.selectedTool === "LINE") {
        if (state.creationProgress == null) {
          state.creationProgress = {
            start: action.payload,
            curr: action.payload,
            checkpoint: null,
            shape: {
              type: "LINE",
              segments: [createZeroWidthSegment(action.payload)],
            },
          };
        } else if (state.creationProgress.shape.type === "LINE") {
          if (isShapeLegal(state.creationProgress.shape)) {
            state.creationProgress.shape = normalizeLine(
              state.creationProgress.shape
            );
            state.creationProgress.checkpoint = _.cloneDeep(
              state.creationProgress.shape
            );

            const lastPoint =
              state.creationProgress.shape.segments[
                state.creationProgress.shape.segments.length - 1
              ].end;
            state.creationProgress.start = lastPoint;
            state.creationProgress.shape.segments.push(
              createZeroWidthSegment(lastPoint)
            );
          }
        }
      }
    },
    onCellMouseDown: (state, action: PayloadAction<Coords>) => {
      if (state.selectedTool === "SELECT") {
        if (state.nextActionOnClick === "MOVE" && state.moveProgress == null) {
          const selectedShapeObj = state.shapes.find(
            (s) => s.id === state.selectedShapeId
          )!;
          state.moveProgress = {
            start: action.payload,
            startShape: { ...selectedShapeObj.shape },
          };
        } else if (
          state.nextActionOnClick === "RESIZE" &&
          state.resizeProgress == null
        ) {
          const selectedShapeObj = state.shapes.find(
            (s) => s.id === state.selectedShapeId
          )!;
          state.resizeProgress = {
            resizePoint: action.payload,
            startShape: { ...selectedShapeObj.shape },
          };
        }
      } else if (state.selectedTool === "RECTANGLE") {
        state.creationProgress = {
          start: action.payload,
          curr: action.payload,
          checkpoint: null,
          shape: {
            type: "RECTANGLE",
            tl: action.payload,
            br: action.payload,
          },
        };
      }
    },
    onCellMouseUp: (state, action: PayloadAction<Coords>) => {
      if (state.moveProgress) {
        state.moveProgress = null;
      } else if (state.resizeProgress) {
        state.resizeProgress = null;
      } else if (state.creationProgress) {
        if (state.creationProgress.shape.type === "RECTANGLE") {
          // Else, I finished creating a shape

          const newShape: Shape | null = isShapeLegal(
            state.creationProgress.shape
          )
            ? state.creationProgress.shape
            : null;

          if (newShape) {
            const newShapeObj: ShapeObject = {
              id: uuidv4(),
              shape: newShape,
            };
            state.shapes.push(newShapeObj);
          }
          state.creationProgress = null;
        }
      }
    },
    onCellHover: (state, action: PayloadAction<Coords>) => {
      if (state.selectedTool === "SELECT") {
        if (state.moveProgress) {
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
        } else if (state.resizeProgress) {
          // Get selected shape
          const selectedShapeIdx: number = state.shapes.findIndex(
            (s) => s.id === state.selectedShapeId
          )!;
          // Resize shape
          const resizePoint = state.resizeProgress.resizePoint;
          const to = action.payload;
          const delta = { r: to.r - resizePoint.r, c: to.c - resizePoint.c };
          const resizedShape: Shape = resize(
            state.resizeProgress.startShape,
            resizePoint,
            delta,
            state.canvasSize
          );
          // Replace resized shape
          state.shapes[selectedShapeIdx].shape = resizedShape;
        } else if (!state.moveProgress && !state.resizeProgress) {
          const shapeObj = getShapeAtCoords(
            state.shapes,
            action.payload,
            state.selectedShapeId ?? undefined
          );
          if (shapeObj) {
            if (shapeObj.id === state.selectedShapeId) {
              const resizePoints = getResizePoints(shapeObj.shape);
              if (resizePoints.find((rp) => _.isEqual(rp, action.payload)))
                state.nextActionOnClick = "RESIZE";
              else state.nextActionOnClick = "MOVE";
            } else {
              state.nextActionOnClick = "SELECT";
            }
          } else {
            state.nextActionOnClick = null;
          }
        }
      } else if (
        (state.selectedTool === "RECTANGLE" || state.selectedTool === "LINE") &&
        state.creationProgress != null
      ) {
        if (!_.isEqual(state.creationProgress.curr, action.payload)) {
          const curr = action.payload;
          switch (state.creationProgress.shape.type) {
            case "RECTANGLE": {
              const tl: Coords = {
                r: Math.min(state.creationProgress.start.r, curr.r),
                c: Math.min(state.creationProgress.start.c, curr.c),
              };

              const br: Coords = {
                r: Math.max(state.creationProgress.start.r, curr.r),
                c: Math.max(state.creationProgress.start.c, curr.c),
              };
              state.creationProgress = {
                ...state.creationProgress,
                curr,
                shape: {
                  ...state.creationProgress.shape,
                  tl,
                  br,
                },
              };
              break;
            }
            case "LINE": {
              const newSegment = createLineSegment(
                state.creationProgress.start,
                curr
              );
              state.creationProgress.shape.segments.pop();
              state.creationProgress.shape.segments.push(newSegment);
              break;
            }
          }
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
