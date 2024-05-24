import {
  diagramReducer,
  diagramActions,
  initDiagramState,
} from "../diagramSlice";
import { selectors } from "../selectors";
import { applyActions, generateMouseMoveActions } from "./utils";

test("Translate a rectangle 1 row up", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: { type: "RECTANGLE", tl: { r: 2, c: 2 }, br: { r: 7, c: 7 } },
      },
    ],
  });

  const actions = [
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 4 }),
    diagramActions.onCellClick({ coords: { r: 2, c: 4 } }),
    diagramActions.onCellMouseDown({ r: 2, c: 4 }),
    diagramActions.onCellHover({ r: 1, c: 4 }),
    diagramActions.onCellMouseUp({ r: 1, c: 4 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  expect(finalState.shapes[0].shape).toEqual({
    type: "RECTANGLE",
    tl: { r: 1, c: 2 },
    br: { r: 6, c: 7 },
  });
});

test("Translate a rectangle 2 rows up", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: {
          type: "RECTANGLE",
          tl: { r: 10, c: 10 },
          br: { r: 14, c: 14 },
        },
      },
    ],
  });

  const actions = [
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 10, c: 12 }),
    diagramActions.onCellClick({ coords: { r: 10, c: 12 } }),
    diagramActions.onCellMouseDown({ r: 10, c: 12 }),
    diagramActions.onCellHover({ r: 9, c: 12 }),
    diagramActions.onCellHover({ r: 8, c: 12 }),
    diagramActions.onCellMouseUp({ r: 8, c: 12 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  expect(finalState.shapes[0].shape).toEqual({
    type: "RECTANGLE",
    tl: { r: 8, c: 10 },
    br: { r: 12, c: 14 },
  });
});

test("Fix: If I grab a rectangle from the bottom border, and move it up to the canvas top border => it returned to its original position", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 2 }, br: { r: 4, c: 6 } },
      },
    ],
  });

  const actions = [
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 6 }, { r: 2, c: 6 }),
    diagramActions.onCellClick({ coords: { r: 2, c: 6 } }),
    diagramActions.onCellMouseDown({ r: 2, c: 6 }),
    diagramActions.onCellHover({ r: 2, c: 5 }),
    diagramActions.onCellHover({ r: 2, c: 4 }),
    diagramActions.onCellHover({ r: 2, c: 3 }),
    diagramActions.onCellMouseUp({ r: 2, c: 4 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  expect(finalState.shapes[0].shape).toEqual({
    type: "RECTANGLE",
    tl: { r: 0, c: 0 },
    br: { r: 4, c: 4 },
  });
});

test("Fix: Rectangle was translated beyond the right canvas border if it was grabbed by the right border", () => {
  const initialState = initDiagramState({
    canvasSize: { rows: 10, cols: 10 },
    shapes: [
      {
        id: "1",
        shape: { type: "RECTANGLE", tl: { r: 2, c: 6 }, br: { r: 4, c: 8 } },
      },
    ],
  });

  const actions = [
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 6 }, { r: 3, c: 6 }),
    diagramActions.onCellClick({ coords: { r: 3, c: 6 } }),
    diagramActions.onCellMouseDown({ r: 3, c: 6 }),
    diagramActions.onCellHover({ r: 3, c: 7 }),
    diagramActions.onCellHover({ r: 3, c: 8 }),
    diagramActions.onCellHover({ r: 3, c: 9 }),
    diagramActions.onCellMouseUp({ r: 3, c: 9 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  expect(finalState.shapes[0].shape).toEqual({
    type: "RECTANGLE",
    tl: { r: 2, c: 7 },
    br: { r: 4, c: 9 },
  });
});

test("Fix: Translate 2 rectangle and complete translation => Both rectangles should remain selected", () => {
  const initialState = initDiagramState({
    canvasSize: { rows: 10, cols: 10 },
    shapes: [
      {
        id: "1",
        shape: { type: "RECTANGLE", tl: { r: 2, c: 6 }, br: { r: 4, c: 8 } },
      },
      {
        id: "2",
        shape: { type: "RECTANGLE", tl: { r: 5, c: 6 }, br: { r: 8, c: 8 } },
      },
    ],
  });

  const actions = [
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 6 }, { r: 3, c: 6 }),
    diagramActions.onCellClick({ coords: { r: 3, c: 6 } }),
    ...generateMouseMoveActions({ r: 3, c: 6 }, { r: 7, c: 6 }),
    diagramActions.onCellClick({ coords: { r: 7, c: 6 }, ctrlKey: true }),

    diagramActions.onCellMouseDown({ r: 7, c: 6 }),
    diagramActions.onCellHover({ r: 7, c: 5 }),
    diagramActions.onCellMouseUp({ r: 7, c: 5 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  expect(selectors.selectedShapeObjs(finalState)).toHaveLength(2);
});
