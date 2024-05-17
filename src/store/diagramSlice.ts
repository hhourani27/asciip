import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  Coords,
  MultiSegment,
  Shape,
  TextShape,
  isShapeLegal,
  normalizeMultiSegmentLine,
} from "../models/shapes";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { getShapeAtCoords as getShapeObjAtCoords } from "../models/representation";
import {
  getResizePoints,
  mergeBoundingBoxes,
  resize,
  translate,
} from "../models/transformation";
import { createLineSegment, createZeroWidthSegment } from "../models/create";
import { capText, getLines } from "../models/text";
import { Style, StyleMode, defaultStyle } from "../models/style";

const DEFAULT_CANVAS_SIZE: CanvasSize = {
  rows: 75,
  cols: 250,
};

export type Tool =
  | "SELECT"
  | "RECTANGLE"
  | "LINE"
  | "MULTI_SEGMENT_LINE"
  | "TEXT";

export type ShapeObject = { id: string; shape: Shape; style?: Partial<Style> };
export type CanvasSize = {
  rows: number;
  cols: number;
};

export type DiagramData = {
  canvasSize: CanvasSize;
  shapes: ShapeObject[];
  styleMode: StyleMode;
  globalStyle: Style;
};

export type DiagramState = DiagramData & {
  /* Edition & Navigation State of the canvas */
  currentHoveredCell: Coords | null;

  selectedTool: Tool;
  creationProgress: null | {
    start: Coords;
    curr: Coords;
    checkpoint: Shape | null;
    shape: Shape;
  };

  // Properties set when selectedTool === SELECT
  selectedShapeId: null | string;
  nextActionOnClick: null | "CREATE" | "SELECT" | "MOVE" | "RESIZE";
  moveProgress: null | { start: Coords; startShape: Shape };
  resizeProgress: null | {
    resizePoint: Coords;
    startShape: Shape;
  };
  textEditProgress: null | { startShape: TextShape };

  /* Other state of the app */
  exportInProgress: boolean;
};

export const initDiagramData = (opt?: Partial<DiagramData>): DiagramData => {
  return {
    canvasSize: { ...DEFAULT_CANVAS_SIZE },
    shapes: [],
    styleMode: "ASCII",
    globalStyle: defaultStyle(),

    ...opt,
  };
};

export const initDiagramState = (opt?: Partial<DiagramData>): DiagramState => {
  return {
    ...initDiagramData(opt),

    currentHoveredCell: null,

    selectedTool: "SELECT",
    creationProgress: null,
    selectedShapeId: null,
    nextActionOnClick: "SELECT",
    moveProgress: null,
    resizeProgress: null,
    textEditProgress: null,

    exportInProgress: false,
  };
};

export const diagramSlice = createSlice({
  name: "diagram",
  initialState: initDiagramState(),
  reducers: {
    loadDiagram: (state, action: PayloadAction<DiagramData>) => {
      return initDiagramState(action.payload);
    },

    //#region Canvas actions
    expandCanvas: (state) => {
      const { rows, cols } = state.canvasSize;
      state.canvasSize = {
        rows: rows + 40,
        cols: cols + 125,
      };
    },
    shrinkCanvasToFit: (state) => {
      if (state.shapes.length === 0) {
        state.canvasSize = {
          rows: Math.min(state.canvasSize.rows, DEFAULT_CANVAS_SIZE.rows),
          cols: Math.min(state.canvasSize.cols, DEFAULT_CANVAS_SIZE.cols),
        };
      } else {
        const bb = mergeBoundingBoxes(state.shapes.map((so) => so.shape))!;
        state.canvasSize = {
          rows: bb.bottom + 1,
          cols: bb.right + 1,
        };
      }
    },
    setTool: (state, action: PayloadAction<Tool>) => {
      if (state.selectedTool !== action.payload) {
        state.creationProgress = null;
        state.moveProgress = null;
        state.resizeProgress = null;
        state.textEditProgress = null;
      }

      state.selectedTool = action.payload;
      if (action.payload !== "SELECT") {
        state.selectedShapeId = null;
        state.nextActionOnClick = "CREATE";
      }
    },
    onCellDoubleClick: (state, action: PayloadAction<Coords>) => {
      if (state.selectedTool === "SELECT") {
        //* I select the SELECT tool, I double-click on a Text => Start editing Text
        const shapeObj = getShapeObjAtCoords(state.shapes, action.payload);
        if (shapeObj?.shape.type === "TEXT") {
          state.selectedShapeId = shapeObj.id;
          state.textEditProgress = { startShape: { ...shapeObj.shape } };
        }
      } else if (state.creationProgress?.shape.type === "MULTI_SEGMENT_LINE") {
        const newShape: MultiSegment | null = isShapeLegal(
          state.creationProgress.shape
        )
          ? state.creationProgress.shape
          : (state.creationProgress.checkpoint as MultiSegment);

        if (newShape) {
          addNewShape(state, normalizeMultiSegmentLine(newShape));
        }
        state.creationProgress = null;
      }
    },
    onCellClick: (state, action: PayloadAction<Coords>) => {
      if (state.selectedTool === "SELECT") {
        const shape = getShapeObjAtCoords(state.shapes, action.payload);
        if (shape) {
          state.selectedShapeId = shape.id;
          state.nextActionOnClick = "MOVE";
        } else {
          state.selectedShapeId = null;
          state.nextActionOnClick = "SELECT";
        }

        //* I am editing a text, and I click on the canvas =>  I complete editing text (since editing a text is progressively saved, I don't need to save it here)
        state.textEditProgress = null;
      } else if (state.selectedTool === "MULTI_SEGMENT_LINE") {
        if (state.creationProgress == null) {
          state.creationProgress = {
            start: action.payload,
            curr: action.payload,
            checkpoint: null,
            shape: {
              type: "MULTI_SEGMENT_LINE",
              segments: [createZeroWidthSegment(action.payload)],
            },
          };
        } else if (state.creationProgress.shape.type === "MULTI_SEGMENT_LINE") {
          if (isShapeLegal(state.creationProgress.shape)) {
            state.creationProgress.shape = normalizeMultiSegmentLine(
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
      } else if (state.selectedTool === "TEXT") {
        if (state.creationProgress == null) {
          state.creationProgress = {
            start: action.payload,
            curr: action.payload,
            checkpoint: null,
            shape: { type: "TEXT", start: action.payload, lines: [] },
          };
        } else if (state.creationProgress) {
          addNewShape(state, state.creationProgress.shape);
          state.creationProgress = {
            start: action.payload,
            curr: action.payload,
            checkpoint: null,
            shape: { type: "TEXT", start: action.payload, lines: [] },
          };
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
      } else if (state.selectedTool === "LINE") {
        state.creationProgress = {
          start: action.payload,
          curr: action.payload,
          checkpoint: null,
          shape: { type: "LINE", ...createZeroWidthSegment(action.payload) },
        };
      }
    },
    onCellMouseUp: (state, action: PayloadAction<Coords>) => {
      if (state.moveProgress) {
        state.moveProgress = null;
      } else if (state.resizeProgress) {
        state.resizeProgress = null;
      } else if (state.creationProgress) {
        if (
          state.creationProgress.shape.type === "RECTANGLE" ||
          state.creationProgress.shape.type === "LINE"
        ) {
          // Else, I finished creating a shape

          const newShape: Shape | null = isShapeLegal(
            state.creationProgress.shape
          )
            ? state.creationProgress.shape
            : null;

          if (newShape) {
            addNewShape(state, newShape);
          }
          state.creationProgress = null;
        }
      }
    },
    onCellHover: (state, action: PayloadAction<Coords>) => {
      state.currentHoveredCell = action.payload;

      if (state.selectedTool === "SELECT") {
        if (state.moveProgress) {
          //* I'm currently moving a Shape and I change mouse position => Update shape position
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
          //* I'm currently resizing a Shape and I change mouse position => Update shape

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
          if (isShapeLegal(resizedShape)) {
            // Replace resized shape
            state.shapes[selectedShapeIdx].shape = resizedShape;
          }
        } else if (!state.moveProgress && !state.resizeProgress) {
          const shapeObj = getShapeObjAtCoords(
            state.shapes,
            action.payload,
            state.selectedShapeId ?? undefined
          );
          if (shapeObj) {
            //* I'm hovering above a shape
            if (shapeObj.id === state.selectedShapeId) {
              const resizePoints = getResizePoints(shapeObj.shape);
              if (
                resizePoints.find((rp) => _.isEqual(rp.coords, action.payload))
              )
                state.nextActionOnClick = "RESIZE";
              else state.nextActionOnClick = "MOVE";
            } else {
              state.nextActionOnClick = "SELECT";
            }
          } else {
            //* I'm not hovering above a shape
            state.nextActionOnClick = null;
          }
        }
      } else if (
        (state.selectedTool === "RECTANGLE" ||
          state.selectedTool === "LINE" ||
          state.selectedTool === "MULTI_SEGMENT_LINE") &&
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
              state.creationProgress = {
                ...state.creationProgress,
                curr,
                shape: {
                  type: "LINE",
                  ...createLineSegment(state.creationProgress.start, curr),
                },
              };
              break;
            }
            case "MULTI_SEGMENT_LINE": {
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
    onCanvasMouseLeave: (state) => {
      state.currentHoveredCell = null;
    },
    onCtrlEnterPress: (state) => {
      if (state.creationProgress?.shape.type === "TEXT") {
        addNewShape(state, state.creationProgress.shape);
        state.creationProgress = null;
      } else if (state.textEditProgress) {
        //* I am editing a text, I press Ctlr+Enter => I complete editing text (since editing a text is progressively saved, I don't need to save it here)
        state.textEditProgress = null;
      }
    },
    onDeletePress: (state) => {
      if (
        state.selectedTool === "SELECT" &&
        state.selectedShapeId != null &&
        !state.moveProgress &&
        !state.resizeProgress &&
        !state.textEditProgress
      ) {
        //* I selected shape, I'm not currently editing it, I press delete => Delete shape
        const shapeObjIdx = state.shapes.findIndex(
          (s) => s.id === state.selectedShapeId
        );
        state.shapes.splice(shapeObjIdx, 1);
        state.selectedShapeId = null;
        state.nextActionOnClick = null;
      }
    },
    updateText: (state, action: PayloadAction<string>) => {
      if (state.creationProgress?.shape.type === "TEXT") {
        state.creationProgress.shape.lines = getLines(action.payload);
        state.creationProgress.shape.lines = capText(
          state.creationProgress.shape.start,
          state.creationProgress.shape.lines,
          state.canvasSize
        );
      } else if (state.textEditProgress) {
        const selectedTextShapeObjIdx = state.shapes.findIndex(
          (s) => s.id === state.selectedShapeId
        );
        if (
          selectedTextShapeObjIdx >= 0 &&
          state.shapes[selectedTextShapeObjIdx].shape.type === "TEXT"
        ) {
          const selectTextShape = state.shapes[selectedTextShapeObjIdx]
            .shape as TextShape;

          selectTextShape.lines = capText(
            selectTextShape.start,
            getLines(action.payload),
            state.canvasSize
          );
        }
      }
    },
    //#endregion
    //#region Styling actions
    setStyleMode: (state, action: PayloadAction<StyleMode>) => {
      state.styleMode = action.payload;

      /*
        If the user switched to ASCII, styles won't matter anymore, but for simplicity, we will still save
        style information with each new shape.

        To prevent surprises, if the user goes back to Unicode, in ASCII mode, all new shapes will have default styles
      */
      if (action.payload === "ASCII") {
        state.globalStyle = defaultStyle();
      }
    },
    setStyle: (
      state,
      action: PayloadAction<{ style: Partial<Style>; shapeId?: string }>
    ) => {
      if (!action.payload.shapeId) {
        _.merge(state.globalStyle, action.payload.style);
      } else {
        const shapeObj = state.shapes.find(
          (s) => s.id === action.payload.shapeId
        );
        if (shapeObj) {
          if ("style" in shapeObj) {
            _.merge(shapeObj.style, action.payload.style);
          } else {
            shapeObj.style = action.payload.style;
          }
        }
      }
    },
    //#endregion
    //#region Other App actions
    openExport: (state) => {
      state.exportInProgress = true;
    },
    closeExport: (state) => {
      state.exportInProgress = false;
    }, //#endregion
  },
  selectors: {
    selectedShapeObj: (state) => {
      return state.shapes.find((shape) => shape.id === state.selectedShapeId);
    },
    currentEditedText: (state): TextShape | null => {
      if (state.creationProgress?.shape.type === "TEXT") {
        return state.creationProgress.shape;
      } else if (state.textEditProgress) {
        const selectedTextShapeObj = state.shapes.find(
          (s) => s.id === state.selectedShapeId
        );

        return selectedTextShapeObj
          ? (selectedTextShapeObj.shape as TextShape)
          : null;
      } else {
        return null;
      }
    },
  },
});

//#region Helper state function that mutate directly the state
function addNewShape(state: DiagramState, shape: Shape) {
  const newShapeObj: ShapeObject = {
    id: uuidv4(),
    shape: shape,
    style: state.globalStyle,
  };

  // If shape is a text, alwyas add it on top
  if (shape.type === "TEXT") {
    state.shapes.push(newShapeObj);
  } else {
    // Else, add it below the first text shape (Text shapes are always on top of other shapes)
    const bottomTextShapeIdx = state.shapes.findIndex(
      (s) => s.shape.type === "TEXT"
    );
    if (bottomTextShapeIdx < 0) {
      // If there's no text shapes, just add it on top
      state.shapes.push(newShapeObj);
    } else {
      // Add it below the bottom text shape
      state.shapes.splice(bottomTextShapeIdx, 0, newShapeObj);
    }
  }
}

export const diagramReducer = diagramSlice.reducer;
export const diagramActions = diagramSlice.actions;
export const diagramSelectors = diagramSlice.selectors;
