import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  Coords,
  MultiSegment,
  Shape,
  TextShape,
  isShapeLegal,
  normalizeMultiSegmentLine,
  normalizeTlBr,
} from "../models/shapes";
import {
  getShapeObjAtCoords,
  getShapeObjsInBox,
  hasResizePointAtCoords,
  isShapeAtCoords,
  moveShapeToBack,
  moveShapeToFront,
} from "../models/shapeInCanvas";
import _ from "lodash";
import { v4 as uuidv4 } from "uuid";
import { resize, translateAll } from "../models/transformation";
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
  | { M: "SELECT"; shapeIds: string[] }
  | { M: "SELECT_DRAG"; start: Coords; curr: Coords; shapeIds: string[] }
  | { M: "MOVE"; start: Coords; shapeIds: string[]; startShapes: Shape[] }
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

  history: DiagramData[];
  historyIdx: number;

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
  const diagramData = initDiagramData(opt);

  return {
    ...diagramData,

    currentHoveredCell: null,

    selectedTool: "SELECT",
    mode: { M: "SELECT", shapeIds: [] },

    history: [_.cloneDeep(diagramData)],
    historyIdx: 0,

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
          state.mode = { M: "SELECT", shapeIds: [] };
        } else {
          state.mode = { M: "BEFORE_CREATING" };
        }
      }

      state.selectedTool = action.payload;
    },
    //#endregion
    //#region Mouse actions
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
        // Complete creating multi-segment line
        const createMode = state.mode;

        const newShape: MultiSegment | null = isShapeLegal(
          createMode.shape as MultiSegment
        )
          ? (createMode.shape as MultiSegment)
          : (createMode.checkpoint as MultiSegment | null);

        if (newShape) {
          const newId = addNewShape(state, normalizeMultiSegmentLine(newShape));
          pushHistory(state);
          state.selectedTool = "SELECT";
          state.mode = { M: "SELECT", shapeIds: [newId] };
        } else {
          state.mode = { M: "BEFORE_CREATING" };
        }
      }
    },
    onCellClick: (
      state,
      action: PayloadAction<{ coords: Coords; ctrlKey?: boolean }>
    ) => {
      const { coords, ctrlKey = false } = action.payload;
      if (state.mode.M === "SELECT") {
        const selectMode = state.mode;
        const shapeObj = getShapeObjAtCoords(state.shapes, coords);

        let shapeIds: string[];
        if (ctrlKey) {
          // If ctrl is pressed
          if (shapeObj) {
            if (selectMode.shapeIds.includes(shapeObj.id)) {
              // click on a already selected shape => deselect it
              shapeIds = selectMode.shapeIds.filter((id) => id !== shapeObj.id);
            } else {
              // click on an unselected shape => add it to selection
              shapeIds = [...state.mode.shapeIds, shapeObj.id];
            }
          } else {
            // Click on an empty cell => don't change selection
            shapeIds = selectMode.shapeIds;
          }
        } else {
          // ctrl is not pressed
          if (shapeObj) {
            // Click on a shape => This shape is now selected (other shapes are deselected)
            shapeIds = [shapeObj.id];
          } else {
            // Click on an empty cell => clear selection
            shapeIds = [];
          }
        }

        state.mode = {
          M: "SELECT",
          shapeIds,
        };
      } else if (state.mode.M === "TEXT_EDIT") {
        // Complete editing text
        pushHistory(state);
        const shape = getShapeObjAtCoords(state.shapes, coords);
        state.mode = {
          M: "SELECT",
          shapeIds: shape ? [shape.id] : [],
        };
      } else if (
        state.mode.M === "BEFORE_CREATING" &&
        state.selectedTool === "MULTI_SEGMENT_LINE"
      ) {
        state.mode = {
          M: "CREATE",
          start: coords,
          curr: coords,
          checkpoint: null,
          shape: {
            type: "MULTI_SEGMENT_LINE",
            segments: [createZeroWidthSegment(coords)],
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
          start: coords,
          curr: coords,
          checkpoint: null,
          shape: { type: "TEXT", start: coords, lines: [] },
        };
      } else if (state.mode.M === "CREATE" && state.selectedTool === "TEXT") {
        // Complete creating text
        const newId = addNewShape(state, state.mode.shape);
        pushHistory(state);
        state.selectedTool = "SELECT";
        state.mode = {
          M: "SELECT",
          shapeIds: [newId],
        };
      }
    },
    onCellMouseDown: (state, action: PayloadAction<Coords>) => {
      if (
        state.mode.M === "SELECT" &&
        getShapeObjAtCoords(state.shapes, action.payload) == null
      ) {
        state.mode = {
          M: "SELECT_DRAG",
          start: action.payload,
          curr: action.payload,
          shapeIds: [],
        };
      } else if (
        state.mode.M === "SELECT" &&
        state.mode.shapeIds.length === 1
      ) {
        const shapeObj = toShapeObject(state.shapes, state.mode.shapeIds[0]);

        if (hasResizePointAtCoords(shapeObj.shape, state.currentHoveredCell!)) {
          state.mode = {
            M: "RESIZE",
            shapeId: shapeObj.id,
            resizePoint: state.currentHoveredCell!,
            startShape: { ...shapeObj.shape },
          };
        } else if (isShapeAtCoords(shapeObj.shape, state.currentHoveredCell!)) {
          state.mode = {
            M: "MOVE",
            shapeIds: [shapeObj.id],
            start: state.currentHoveredCell!,
            startShapes: [{ ...shapeObj.shape }],
          };
        }
      } else if (state.mode.M === "SELECT" && state.mode.shapeIds.length > 1) {
        const shapeObjs = toShapeObjects(state.shapes, state.mode.shapeIds);
        if (
          shapeObjs.some((so) =>
            isShapeAtCoords(so.shape, state.currentHoveredCell!)
          )
        ) {
          state.mode = {
            M: "MOVE",
            shapeIds: state.mode.shapeIds,
            start: state.currentHoveredCell!,
            startShapes: shapeObjs.map((so) => so.shape),
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
      if (state.mode.M === "SELECT_DRAG") {
        state.mode = {
          M: "SELECT",
          shapeIds: state.mode.shapeIds,
        };
      } else if (state.mode.M === "MOVE") {
        // Complete moving a shape
        pushHistory(state);
        state.mode = {
          M: "SELECT",
          shapeIds: state.mode.shapeIds,
        };
      } else if (state.mode.M === "RESIZE") {
        // Complete resizing a shape
        pushHistory(state);
        state.mode = {
          M: "SELECT",
          shapeIds: [state.mode.shapeId],
        };
      } else if (
        state.mode.M === "CREATE" &&
        (state.mode.shape.type === "RECTANGLE" ||
          state.mode.shape.type === "LINE")
      ) {
        // Complete creating a rectangle or a line
        const newShape: Shape | null = isShapeLegal(state.mode.shape)
          ? state.mode.shape
          : null;

        if (newShape) {
          const newId = addNewShape(state, newShape);
          pushHistory(state);
          state.selectedTool = "SELECT";
          state.mode = { M: "SELECT", shapeIds: [newId] };
        } else {
          state.mode = { M: "BEFORE_CREATING" };
        }
      }
    },
    onCellHover: (state, action: PayloadAction<Coords>) => {
      state.currentHoveredCell = action.payload;

      if (state.mode.M === "SELECT_DRAG") {
        const selectDragMode = state.mode;
        const curr = action.payload;

        const [tl, br] = normalizeTlBr(selectDragMode.start, curr);

        const selectedShapes = getShapeObjsInBox(state.shapes, tl, br);

        state.mode = {
          ...selectDragMode,
          curr,
          shapeIds: selectedShapes.map((s) => s.id),
        };
      } else if (state.mode.M === "MOVE") {
        const moveMode = state.mode;
        //* I'm currently moving a Shape and I change mouse position => Update shape position
        // Get selected shape

        const from = moveMode.start;
        const to = action.payload;
        const delta = { r: to.r - from.r, c: to.c - from.c };
        const translatedShapes: Shape[] = translateAll(
          moveMode.startShapes,
          delta,
          state.canvasSize
        );

        moveMode.shapeIds.forEach((id, idx) => {
          replaceShape(state, id, translatedShapes[idx]);
        });
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
              const [tl, br] = normalizeTlBr(creationMode.start, curr);

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
    //#endregion
    //#region Keyboard actions
    onCtrlEnterPress: (state) => {
      if (state.mode.M === "CREATE" && state.selectedTool === "TEXT") {
        const newId = addNewShape(state, state.mode.shape);
        pushHistory(state);
        state.selectedTool = "SELECT";
        state.mode = { M: "SELECT", shapeIds: [newId] };
      } else if (state.mode.M === "TEXT_EDIT") {
        //* I am editing a text, I press Ctlr+Enter => I complete editing text (since editing a text is progressively saved, I don't need to save it here)
        pushHistory(state);
        state.mode = {
          M: "SELECT",
          shapeIds: [state.mode.shapeId],
        };
      }
    },
    onDeletePress: (state) => {
      if (state.mode.M === "SELECT" && state.mode.shapeIds.length > 0) {
        deleteShapes(state, state.mode.shapeIds);
        pushHistory(state);
        state.mode = { M: "SELECT", shapeIds: [] };
      }
    },
    onCtrlAPress: (state) => {
      if (state.mode.M === "SELECT") {
        state.mode.shapeIds = state.shapes.map((s) => s.id);
      }
    },
    //#endregion

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
      if (state.mode.M === "SELECT" && state.mode.shapeIds.length === 1) {
        state.shapes = moveShapeToFront(state.shapes, state.mode.shapeIds[0]);
        pushHistory(state);
      }
    },
    onMoveToBackButtonClick: (state) => {
      if (state.mode.M === "SELECT" && state.mode.shapeIds.length === 1) {
        state.shapes = moveShapeToBack(state.shapes, state.mode.shapeIds[0]);
        pushHistory(state);
      }
    },
    //#region history actions
    moveInHistory: (state, action: PayloadAction<"UNDO" | "REDO">) => {
      if (state.mode.M === "SELECT") {
        action.payload === "UNDO" ? undoHistory(state) : redoHistory(state);
        state.mode = { M: "SELECT", shapeIds: [] };
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
      pushHistory(state);
    },
    setStyle: (
      state,
      action: PayloadAction<{ style: Partial<Style>; shapeIds?: string[] }>
    ) => {
      const { style, shapeIds } = action.payload;
      if (!shapeIds) {
        _.merge(state.globalStyle, style);
      } else {
        shapeIds.forEach((sid) => {
          const shapeObj = state.shapes.find((s) => s.id === sid);
          if (shapeObj) {
            if ("style" in shapeObj) {
              _.merge(shapeObj.style, style);
            } else {
              shapeObj.style = style;
            }
          }
        });
      }
      pushHistory(state);
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
});

//#region Helper state function that mutate directly the state
function addNewShape(state: DiagramState, shape: Shape): string {
  const id = uuidv4();
  const newShapeObj: ShapeObject = {
    id,
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

  return id;
}

function replaceShape(
  state: DiagramState,
  shapeId: string,
  shape: Shape
): void {
  const idx = state.shapes.findIndex((s) => s.id === shapeId);
  state.shapes[idx].shape = shape;
}

function deleteShapes(state: DiagramState, shapeIds: string[]): void {
  shapeIds.forEach((shapeId) => {
    const shapeIdx = state.shapes.findIndex((s) => s.id === shapeId);
    if (shapeIdx >= 0) {
      state.shapes.splice(shapeIdx, 1);
    }
  });
}

function pushHistory(state: DiagramState): void {
  const { canvasSize, shapes, styleMode, globalStyle } = state;
  state.history = [
    ...state.history.slice(0, state.historyIdx + 1),
    _.cloneDeep({ canvasSize, shapes, styleMode, globalStyle }),
  ];

  state.historyIdx++;
}

function undoHistory(state: DiagramState): void {
  if (state.historyIdx > 0) {
    const { canvasSize, shapes, styleMode, globalStyle } = _.cloneDeep(
      state.history[state.historyIdx - 1]
    );
    state.canvasSize = canvasSize;
    state.shapes = shapes;
    state.styleMode = styleMode;
    state.globalStyle = globalStyle;

    state.historyIdx--;
  }
}

function redoHistory(state: DiagramState): void {
  if (state.historyIdx < state.history.length - 1) {
    const { canvasSize, shapes, styleMode, globalStyle } = _.cloneDeep(
      state.history[state.historyIdx + 1]
    );
    state.canvasSize = canvasSize;
    state.shapes = shapes;
    state.styleMode = styleMode;
    state.globalStyle = globalStyle;

    state.historyIdx++;
  }
}
//#endregion

//#region Utilities
function toShapeObjects(
  shapes: ShapeObject[],
  shapeIds: string[]
): ShapeObject[] {
  return shapeIds.map((shapeId) => shapes.find((s) => s.id === shapeId)!);
}

function toShapeObject(shapes: ShapeObject[], shapeId: string): ShapeObject {
  return shapes.find((s) => s.id === shapeId)!;
}

//#endregion

export const diagramReducer = diagramSlice.reducer;
export const diagramActions = diagramSlice.actions;
