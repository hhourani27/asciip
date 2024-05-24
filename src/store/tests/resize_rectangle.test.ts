import {
  ShapeObject,
  diagramActions,
  diagramReducer,
  initDiagramState,
} from "../diagramSlice";
import { applyActions, generateMouseMoveActions } from "./utils";

test("Resize a rectangle", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 0 }, br: { r: 4, c: 4 } },
      },
    ],
  });

  const actions = [
    diagramActions.setTool("SELECT"),
    diagramActions.onCellHover({ r: 0, c: 1 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 1 } }),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellMouseDown({ r: 0, c: 0 }),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 1, c: 1 }),
    diagramActions.onCellMouseUp({ r: 1, c: 1 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  const expected: ShapeObject = {
    id: "1",
    shape: {
      type: "RECTANGLE",
      tl: { r: 1, c: 1 },
      br: { r: 4, c: 4 },
    },
  };

  expect(finalState.shapes[0]).toEqual(expected);
});

test("Resize a rectangle by inverting it", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 0 }, br: { r: 4, c: 4 } },
      },
    ],
  });

  const actions = [
    diagramActions.setTool("SELECT"),
    diagramActions.onCellHover({ r: 0, c: 1 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 1 } }),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellMouseDown({ r: 0, c: 0 }),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 8, c: 8 }),
    diagramActions.onCellMouseUp({ r: 8, c: 8 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  const expected: ShapeObject = {
    id: "1",
    shape: {
      type: "RECTANGLE",
      tl: { r: 4, c: 4 },
      br: { r: 8, c: 8 },
    },
  };

  expect(finalState.shapes[0]).toEqual(expected);
});

test("Cannot resize a rectangle to a single point", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 0 }, br: { r: 4, c: 4 } },
      },
    ],
  });

  const actions = [
    diagramActions.setTool("SELECT"),
    diagramActions.onCellHover({ r: 0, c: 1 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 1 } }),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellMouseDown({ r: 0, c: 0 }),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 4, c: 4 }),
    diagramActions.onCellMouseUp({ r: 4, c: 4 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  const expected: ShapeObject = {
    id: "1",
    shape: {
      type: "RECTANGLE",
      tl: { r: 3, c: 3 },
      br: { r: 4, c: 4 },
    },
  };

  expect(finalState.shapes[0]).toEqual(expected);
});

test("Cannot resize a rectangle to a vertical line", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 0 }, br: { r: 4, c: 4 } },
      },
    ],
  });

  const actions = [
    diagramActions.setTool("SELECT"),
    diagramActions.onCellHover({ r: 0, c: 1 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 1 } }),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellMouseDown({ r: 0, c: 0 }),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 4, c: 0 }),
    diagramActions.onCellMouseUp({ r: 4, c: 0 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  const expected: ShapeObject = {
    id: "1",
    shape: {
      type: "RECTANGLE",
      tl: { r: 3, c: 0 },
      br: { r: 4, c: 4 },
    },
  };

  expect(finalState.shapes[0]).toEqual(expected);
});

test("Cannot resize a rectangle to a horizontal line", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 0 }, br: { r: 4, c: 4 } },
      },
    ],
  });

  const actions = [
    diagramActions.setTool("SELECT"),
    diagramActions.onCellHover({ r: 0, c: 1 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 1 } }),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellMouseDown({ r: 0, c: 0 }),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 0, c: 4 }),
    diagramActions.onCellMouseUp({ r: 0, c: 4 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  const expected: ShapeObject = {
    id: "1",
    shape: {
      type: "RECTANGLE",
      tl: { r: 0, c: 3 },
      br: { r: 4, c: 4 },
    },
  };

  expect(finalState.shapes[0]).toEqual(expected);
});

test("Fix: If a shape has another shape that overlaps it on top, even if I select it, I couldn't grab all resize points", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: { type: "RECTANGLE", tl: { r: 2, c: 1 }, br: { r: 4, c: 3 } },
      },
      {
        id: "2",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 3 }, br: { r: 2, c: 5 } },
      },
    ],
  });

  const actions = [
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 2 }, { r: 2, c: 2 }),
    diagramActions.onCellClick({ coords: { r: 2, c: 2 } }),
    diagramActions.onCellHover({ r: 2, c: 3 }),
    diagramActions.onCellMouseDown({ r: 2, c: 3 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  expect(finalState.mode.M).toBe("RESIZE");
});
