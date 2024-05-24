import {
  ShapeObject,
  diagramActions,
  diagramReducer,
  initDiagramState,
} from "../diagramSlice";
import { applyActions, generateMouseMoveActions } from "./utils";

test("Extend horizontal line by dragging on start", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 2, c: 2 },
          end: { r: 2, c: 4 },
        },
      },
    ],
  });

  const actions = [
    // Select line
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 3 }),
    diagramActions.onCellClick({ coords: { r: 2, c: 3 } }),
    // Drag start point
    diagramActions.onCellHover({ r: 2, c: 2 }),
    diagramActions.onCellMouseDown({ r: 2, c: 2 }),
    diagramActions.onCellHover({ r: 2, c: 1 }),
    diagramActions.onCellMouseUp({ r: 2, c: 1 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  const expected: ShapeObject = {
    id: "1",
    shape: {
      type: "LINE",
      axis: "HORIZONTAL",
      direction: "LEFT_TO_RIGHT",
      start: { r: 2, c: 1 },
      end: { r: 2, c: 4 },
    },
  };

  expect(finalState.shapes[0]).toEqual(expected);
});

test("Shrink horizontal line by dragging on start", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 2, c: 2 },
          end: { r: 2, c: 4 },
        },
      },
    ],
  });

  const actions = [
    // Select line
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 3 }),
    diagramActions.onCellClick({ coords: { r: 2, c: 3 } }),
    // Drag start point
    diagramActions.onCellHover({ r: 2, c: 2 }),
    diagramActions.onCellMouseDown({ r: 2, c: 2 }),
    diagramActions.onCellHover({ r: 2, c: 3 }),
    diagramActions.onCellMouseUp({ r: 2, c: 3 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  const expected: ShapeObject = {
    id: "1",
    shape: {
      type: "LINE",
      axis: "HORIZONTAL",
      direction: "LEFT_TO_RIGHT",
      start: { r: 2, c: 3 },
      end: { r: 2, c: 4 },
    },
  };

  expect(finalState.shapes[0]).toEqual(expected);
});

test("Extend horizontal line by dragging on end", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 2, c: 2 },
          end: { r: 2, c: 4 },
        },
      },
    ],
  });

  const actions = [
    // Select line
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 3 }),
    diagramActions.onCellClick({ coords: { r: 2, c: 3 } }),
    // Drag end point
    diagramActions.onCellHover({ r: 2, c: 4 }),
    diagramActions.onCellMouseDown({ r: 2, c: 4 }),
    diagramActions.onCellHover({ r: 2, c: 5 }),
    diagramActions.onCellMouseUp({ r: 2, c: 5 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  const expected: ShapeObject = {
    id: "1",
    shape: {
      type: "LINE",
      axis: "HORIZONTAL",
      direction: "LEFT_TO_RIGHT",
      start: { r: 2, c: 2 },
      end: { r: 2, c: 5 },
    },
  };

  expect(finalState.shapes[0]).toEqual(expected);
});

test("Shrink horizontal line by dragging on end", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 2, c: 2 },
          end: { r: 2, c: 4 },
        },
      },
    ],
  });

  const actions = [
    // Select line
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 3 }),
    diagramActions.onCellClick({ coords: { r: 2, c: 3 } }),
    // Drag end point
    diagramActions.onCellHover({ r: 2, c: 4 }),
    diagramActions.onCellMouseDown({ r: 2, c: 4 }),
    diagramActions.onCellHover({ r: 2, c: 3 }),
    diagramActions.onCellMouseUp({ r: 2, c: 3 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  const expected: ShapeObject = {
    id: "1",
    shape: {
      type: "LINE",
      axis: "HORIZONTAL",
      direction: "LEFT_TO_RIGHT",
      start: { r: 2, c: 2 },
      end: { r: 2, c: 3 },
    },
  };

  expect(finalState.shapes[0]).toEqual(expected);
});

test("Turn horizontal line 180 degrees by dragging on End", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 2, c: 2 },
          end: { r: 2, c: 4 },
        },
      },
    ],
  });

  const actions = [
    // Select line
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 3 }),
    diagramActions.onCellClick({ coords: { r: 2, c: 3 } }),
    // Drag end point
    diagramActions.onCellHover({ r: 2, c: 4 }),
    diagramActions.onCellMouseDown({ r: 2, c: 4 }),
    ...generateMouseMoveActions({ r: 2, c: 4 }, { r: 2, c: 0 }),
    diagramActions.onCellMouseUp({ r: 2, c: 0 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  const expected: ShapeObject = {
    id: "1",
    shape: {
      type: "LINE",
      axis: "HORIZONTAL",
      direction: "RIGHT_TO_LEFT",
      start: { r: 2, c: 2 },
      end: { r: 2, c: 0 },
    },
  };

  expect(finalState.shapes[0]).toEqual(expected);
});

test("Turn vertical line 90 degrees anti-clockwise by dragging on End", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 2, c: 2 },
          end: { r: 2, c: 4 },
        },
      },
    ],
  });

  const actions = [
    // Select line
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 3 }),
    diagramActions.onCellClick({ coords: { r: 2, c: 3 } }),
    // Drag end point
    diagramActions.onCellHover({ r: 2, c: 4 }),
    diagramActions.onCellMouseDown({ r: 2, c: 4 }),
    ...generateMouseMoveActions({ r: 2, c: 4 }, { r: 0, c: 3 }),
    diagramActions.onCellMouseUp({ r: 0, c: 1 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  const expected: ShapeObject = {
    id: "1",
    shape: {
      type: "LINE",
      axis: "VERTICAL",
      direction: "UP",
      start: { r: 2, c: 2 },
      end: { r: 0, c: 2 },
    },
  };

  expect(finalState.shapes[0]).toEqual(expected);
});

test("Cannot shrink horizontal line to a zero-length line", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 2, c: 2 },
          end: { r: 2, c: 4 },
        },
      },
    ],
  });

  const actions = [
    // Select line
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 3 }),
    diagramActions.onCellClick({ coords: { r: 2, c: 3 } }),
    // Drag end point
    diagramActions.onCellHover({ r: 2, c: 4 }),
    diagramActions.onCellMouseDown({ r: 2, c: 4 }),
    ...generateMouseMoveActions({ r: 2, c: 4 }, { r: 2, c: 2 }),
    diagramActions.onCellMouseUp({ r: 2, c: 2 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  const expected: ShapeObject = {
    id: "1",
    shape: {
      type: "LINE",
      axis: "HORIZONTAL",
      direction: "LEFT_TO_RIGHT",
      start: { r: 2, c: 2 },
      end: { r: 2, c: 3 },
    },
  };

  expect(finalState.shapes[0]).toEqual(expected);
});
