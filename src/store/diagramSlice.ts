import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  Coords,
  MultiSegment,
  Shape,
  TextShape,
  isShapeLegal,
  normalizeMultiSegmentLine,
} from "../models/shapes";
import {
  getShapeObjAtCoords,
  hasResizePointAtCoords,
  isShapeAtCoords,
  moveShapeToBack,
  moveShapeToFront,
} from "../models/shapeInCanvas";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { resize, translate } from "../models/transformation";
import { getBoundingBoxOfAll } from "../models/shapeInCanvas";
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

export type ActionMode =
  | { M: "BEFORE_CREATING" }
  | {
      M: "CREATE";
      start: Coords;
      curr: Coords;
      checkpoint: Shape | null;
      shape: Shape;
    }
  | { M: "SELECT"; selectedShapeId: string | null }
  | { M: "MOVE"; start: Coords; shapeId: string; startShape: Shape }
  | { M: "RESIZE"; resizePoint: Coords; shapeId: string; startShape: Shape }
  | { M: "TEXT_EDIT"; shapeId: string; startShape: TextShape };

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
  mode: ActionMode;

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
    mode: { M: "SELECT", selectedShapeId: null },

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
        const bb = getBoundingBoxOfAll(state.shapes.map((so) => so.shape))!;
        state.canvasSize = {
          rows: bb.bottom + 1,
          cols: bb.right + 1,
        };
      }
    },
    setTool: (state, action: PayloadAction<Tool>) => {
      if (state.selectedTool !== action.payload) {
        if (action.payload === "SELECT") {
          state.mode = { M: "SELECT", selectedShapeId: null };
        } else {
          state.mode = { M: "BEFORE_CREATING" };
        }
      }

      state.selectedTool = action.payload;
    },
    onCellDoubleClick: (state, action: PayloadAction<Coords>) => {
      if (state.mode.M === "SELECT" || state.mode.M === "TEXT_EDIT") {
        const shapeObj = getShapeObjAtCoords(state.shapes, action.payload);
        if (shapeObj?.shape.type === "TEXT") {
          state.mode = {
            M: "TEXT_EDIT",
            shapeId: shapeObj.id,
            startShape: { ...shapeObj.shape },
          };
        }
      } else if (
        state.mode.M === "CREATE" &&
        state.mode.shape.type === "MULTI_SEGMENT_LINE"
      ) {
        const createMode = state.mode;

        const newShape: MultiSegment | null = isShapeLegal(
          createMode.shape as MultiSegment
        )
          ? (createMode.shape as MultiSegment)
          : (createMode.checkpoint as MultiSegment | null);

        if (newShape) {
          addNewShape(state, normalizeMultiSegmentLine(newShape));
        }
        state.mode = { M: "BEFORE_CREATING" };
      }
    },
    onCellClick: (state, action: PayloadAction<Coords>) => {
      if (state.mode.M === "SELECT") {
        const shape = getShapeObjAtCoords(state.shapes, action.payload);
        state.mode = {
          M: "SELECT",
          selectedShapeId: shape ? shape.id : null,
        };
      } else if (state.mode.M === "TEXT_EDIT") {
        const shape = getShapeObjAtCoords(state.shapes, action.payload);
        state.mode = {
          M: "SELECT",
          selectedShapeId: shape ? shape.id : null,
        };
      } else if (
        state.mode.M === "BEFORE_CREATING" &&
        state.selectedTool === "MULTI_SEGMENT_LINE"
      ) {
        state.mode = {
          M: "CREATE",
          start: action.payload,
          curr: action.payload,
          checkpoint: null,
          shape: {
            type: "MULTI_SEGMENT_LINE",
            segments: [createZeroWidthSegment(action.payload)],
          },
        };
      } else if (
        state.mode.M === "CREATE" &&
        state.selectedTool === "MULTI_SEGMENT_LINE"
      ) {
        const createMode = state.mode;
        if (isShapeLegal(createMode.shape)) {
          createMode.shape = normalizeMultiSegmentLine(
            createMode.shape as MultiSegment
          );
          createMode.checkpoint = _.cloneDeep(createMode.shape as MultiSegment);

          const lastPoint =
            createMode.shape.segments[createMode.shape.segments.length - 1].end;
          createMode.start = lastPoint;
          createMode.shape.segments.push(createZeroWidthSegment(lastPoint));
        }
      } else if (
        state.mode.M === "BEFORE_CREATING" &&
        state.selectedTool === "TEXT"
      ) {
        state.mode = {
          M: "CREATE",
          start: action.payload,
          curr: action.payload,
          checkpoint: null,
          shape: { type: "TEXT", start: action.payload, lines: [] },
        };
      } else if (state.mode.M === "CREATE" && state.selectedTool === "TEXT") {
        addNewShape(state, state.mode.shape);
        state.mode = {
          M: "CREATE",
          start: action.payload,
          curr: action.payload,
          checkpoint: null,
          shape: { type: "TEXT", start: action.payload, lines: [] },
        };
      }
    },
    onCellMouseDown: (state, action: PayloadAction<Coords>) => {
      if (state.mode.M === "SELECT" && state.mode.selectedShapeId != null) {
        const selectMode = state.mode;

        const selectedShapeObj = state.shapes.find(
          (s) => s.id === selectMode.selectedShapeId
        )!;

        if (
          hasResizePointAtCoords(
            selectedShapeObj.shape,
            state.currentHoveredCell!
          )
        ) {
          state.mode = {
            M: "RESIZE",
            shapeId: selectedShapeObj.id,
            resizePoint: state.currentHoveredCell!,
            startShape: { ...selectedShapeObj.shape },
          };
        } else if (
          isShapeAtCoords(selectedShapeObj.shape, state.currentHoveredCell!)
        ) {
          state.mode = {
            M: "MOVE",
            shapeId: selectedShapeObj.id,
            start: state.currentHoveredCell!,
            startShape: { ...selectedShapeObj.shape },
          };
        }
      } else if (
        state.mode.M === "BEFORE_CREATING" &&
        state.selectedTool === "RECTANGLE"
      ) {
        state.mode = {
          M: "CREATE",
          start: action.payload,
          curr: action.payload,
          checkpoint: null,
          shape: {
            type: "RECTANGLE",
            tl: action.payload,
            br: action.payload,
          },
        };
      } else if (
        state.mode.M === "BEFORE_CREATING" &&
        state.selectedTool === "LINE"
      ) {
        state.mode = {
          M: "CREATE",
          start: action.payload,
          curr: action.payload,
          checkpoint: null,
          shape: { type: "LINE", ...createZeroWidthSegment(action.payload) },
        };
      }
    },
    onCellMouseUp: (state, action: PayloadAction<Coords>) => {
      if (state.mode.M === "MOVE") {
        state.mode = {
          M: "SELECT",
          selectedShapeId: state.mode.shapeId,
        };
      } else if (state.mode.M === "RESIZE") {
        state.mode = {
          M: "SELECT",
          selectedShapeId: state.mode.shapeId,
        };
      } else if (
        state.mode.M === "CREATE" &&
        (state.mode.shape.type === "RECTANGLE" ||
          state.mode.shape.type === "LINE")
      ) {
        // Else, I finished creating a shape
        const newShape: Shape | null = isShapeLegal(state.mode.shape)
          ? state.mode.shape
          : null;

        if (newShape) {
          addNewShape(state, newShape);
        }
        state.mode = { M: "BEFORE_CREATING" };
      }
    },
    onCellHover: (state, action: PayloadAction<Coords>) => {
      state.currentHoveredCell = action.payload;

      if (state.mode.M === "MOVE") {
        const moveMode = state.mode;
        //* I'm currently moving a Shape and I change mouse position => Update shape position
        // Get selected shape
        const selectedShapeIdx: number = state.shapes.findIndex(
          (s) => s.id === moveMode.shapeId
        )!;
        // Translate shape
        const from = moveMode.start;
        const to = action.payload;
        const delta = { r: to.r - from.r, c: to.c - from.c };
        const translatedShape: Shape = translate(
          moveMode.startShape,
          delta,
          state.canvasSize
        );
        // Replace translated shape
        state.shapes[selectedShapeIdx].shape = translatedShape;
      } else if (state.mode.M === "RESIZE") {
        const resizeMode = state.mode;
        //* I'm currently resizing a Shape and I change mouse position => Update shape

        // Get selected shape
        const selectedShapeIdx: number = state.shapes.findIndex(
          (s) => s.id === resizeMode.shapeId
        )!;
        // Resize shape
        const resizePoint = resizeMode.resizePoint;
        const to = action.payload;
        const delta = { r: to.r - resizePoint.r, c: to.c - resizePoint.c };
        const resizedShape: Shape = resize(
          resizeMode.startShape,
          resizePoint,
          delta,
          state.canvasSize
        );
        if (isShapeLegal(resizedShape)) {
          // Replace resized shape
          state.shapes[selectedShapeIdx].shape = resizedShape;
        }
      } else if (
        state.mode.M === "CREATE" &&
        (state.selectedTool === "RECTANGLE" ||
          state.selectedTool === "LINE" ||
          state.selectedTool === "MULTI_SEGMENT_LINE")
      ) {
        const creationMode = state.mode;
        if (!_.isEqual(creationMode.curr, action.payload)) {
          const curr = action.payload;
          switch (creationMode.shape.type) {
            case "RECTANGLE": {
              const tl: Coords = {
                r: Math.min(creationMode.start.r, curr.r),
                c: Math.min(creationMode.start.c, curr.c),
              };

              const br: Coords = {
                r: Math.max(creationMode.start.r, curr.r),
                c: Math.max(creationMode.start.c, curr.c),
              };

              state.mode = {
                ...creationMode,
                curr,
                shape: {
                  ...creationMode.shape,
                  tl,
                  br,
                },
              };
              break;
            }
            case "LINE": {
              state.mode = {
                ...creationMode,
                curr,
                shape: {
                  type: "LINE",
                  ...createLineSegment(creationMode.start, curr),
                },
              };
              break;
            }
            case "MULTI_SEGMENT_LINE": {
              const newSegment = createLineSegment(creationMode.start, curr);
              creationMode.shape.segments.pop();
              creationMode.shape.segments.push(newSegment);
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
      if (state.mode.M === "CREATE" && state.selectedTool === "TEXT") {
        addNewShape(state, state.mode.shape);
        state.mode = { M: "BEFORE_CREATING" };
      } else if (state.mode.M === "TEXT_EDIT") {
        //* I am editing a text, I press Ctlr+Enter => I complete editing text (since editing a text is progressively saved, I don't need to save it here)
        state.mode = {
          M: "SELECT",
          selectedShapeId: state.mode.shapeId,
        };
      }
    },
    onDeletePress: (state) => {
      if (state.mode.M === "SELECT" && state.mode.selectedShapeId != null) {
        const selectMode = state.mode;
        //* I selected shape, I'm not currently editing it, I press delete => Delete shape
        const shapeObjIdx = state.shapes.findIndex(
          (s) => s.id === selectMode.selectedShapeId
        );
        state.shapes.splice(shapeObjIdx, 1);
        state.mode = { M: "SELECT", selectedShapeId: null };
      }
    },
    updateText: (state, action: PayloadAction<string>) => {
      if (state.mode.M === "CREATE" && state.mode.shape.type === "TEXT") {
        state.mode.shape.lines = capText(
          state.mode.shape.start,
          getLines(action.payload),
          state.canvasSize
        );
      } else if (state.mode.M === "TEXT_EDIT") {
        const textEditMode = state.mode;

        const selectedTextShapeObjIdx = state.shapes.findIndex(
          (s) => s.id === textEditMode.shapeId
        );

        const selectTextShape = state.shapes[selectedTextShapeObjIdx]
          .shape as TextShape;

        selectTextShape.lines = capText(
          selectTextShape.start,
          getLines(action.payload),
          state.canvasSize
        );
      }
    },
    onMoveToFrontButtonClick: (state) => {
      if (state.mode.M === "SELECT" && state.mode.selectedShapeId != null) {
        state.shapes = moveShapeToFront(
          state.shapes,
          state.mode.selectedShapeId
        );
      }
    },
    onMoveToBackButtonClick: (state) => {
      if (state.mode.M === "SELECT" && state.mode.selectedShapeId != null) {
        state.shapes = moveShapeToBack(
          state.shapes,
          state.mode.selectedShapeId
        );
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
      if (state.mode.M === "SELECT" && state.mode.selectedShapeId != null) {
        const selectedShapeId = state.mode.selectedShapeId;
        return state.shapes.find((shape) => shape.id === selectedShapeId);
      } else {
        return undefined;
      }
    },
    currentCreatedShape: (state): Shape | null => {
      if (state.mode.M === "CREATE") return state.mode.shape;
      else return null;
    },
    currentEditedText: (state): TextShape | null => {
      if (state.mode.M === "CREATE" && state.mode.shape.type === "TEXT") {
        return state.mode.shape;
      } else if (state.mode.M === "TEXT_EDIT") {
        const selectedShapeId = state.mode.shapeId;
        const selectedTextShapeObj = state.shapes.find(
          (s) => s.id === selectedShapeId
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
