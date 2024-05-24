import { getStyledCanvasGrid } from "../../models/representation";
import {
  CanvasSize,
  diagramActions,
  diagramReducer,
  initDiagramState,
} from "../diagramSlice";
import { applyActions, generateMouseMoveActions } from "./utils";

test("Newly created non-Text shapes are placed below existing text shapes", () => {
  const canvasSize: CanvasSize = { rows: 2, cols: 6 };

  // Start with a text shape
  const initialState = initDiagramState({
    canvasSize,
    shapes: [
      {
        id: "1",
        shape: {
          type: "TEXT",
          start: { r: 0, c: 0 },
          lines: ["Hello"],
        },
      },
    ],
  });

  // Add a line
  const actions = [
    // Select line
    diagramActions.setTool("LINE"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellMouseDown({ r: 0, c: 0 }),
    ...generateMouseMoveActions({ r: 0, c: 1 }, { r: 0, c: 5 }),
    diagramActions.onCellMouseUp({ r: 0, c: 5 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  expect(finalState.shapes[0].shape.type).toBe("LINE");
  expect(finalState.shapes[1].shape.type).toBe("TEXT");
  expect(getStyledCanvasGrid(canvasSize, finalState.shapes)).toEqual([
    ["H", "e", "l", "l", "o", ">"],
    [" ", " ", " ", " ", " ", " "],
  ]);
});

test("ARROW | Rectangle (Touch) => Bring to front => Rectangle | ARROW", () => {
  const canvasSize: CanvasSize = { rows: 10, cols: 10 };

  const initialState = initDiagramState({
    canvasSize,
    shapes: [
      {
        id: "line_0",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 1, c: 0 },
          end: { r: 1, c: 4 },
        },
      },
      {
        id: "rectangle_1",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 1 }, br: { r: 2, c: 3 } },
      },
    ],
  });

  const actions = [
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 1, c: 0 }),
    diagramActions.onCellClick({ coords: { r: 1, c: 0 } }),
    ...generateMouseMoveActions({ r: 1, c: 0 }, { r: 0, c: 0 }),
    diagramActions.onMoveToFrontButtonClick(),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);
  expect(finalState.shapes[0].id).toBe("rectangle_1");
  expect(finalState.shapes[1].id).toBe("line_0");
});

test("Rectangle (Touch) | ARROW => Bring to front => Rectangle | ARROW", () => {
  const canvasSize: CanvasSize = { rows: 10, cols: 10 };

  const initialState = initDiagramState({
    canvasSize,
    shapes: [
      {
        id: "rectangle_0",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 1 }, br: { r: 2, c: 3 } },
      },
      {
        id: "line_1",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 1, c: 0 },
          end: { r: 1, c: 4 },
        },
      },
    ],
  });

  const actions = [
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 1, c: 0 }),
    diagramActions.onCellClick({ coords: { r: 1, c: 0 } }),
    ...generateMouseMoveActions({ r: 1, c: 0 }, { r: 0, c: 0 }),
    diagramActions.onMoveToFrontButtonClick(),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);
  expect(finalState.shapes[0].id).toBe("rectangle_0");
  expect(finalState.shapes[1].id).toBe("line_1");
});

test("ARROW | Rectangle 1 (Touch) | Rectangle 2 (Touch) => Bring to front => Rectangle 1 (Touch) | ARROW | Rectangle 2 (Touch)", () => {
  const canvasSize: CanvasSize = { rows: 10, cols: 10 };

  const initialState = initDiagramState({
    canvasSize,
    shapes: [
      {
        id: "line_0",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 1, c: 0 },
          end: { r: 1, c: 5 },
        },
      },
      {
        id: "rectangle_1",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 1 }, br: { r: 2, c: 3 } },
      },
      {
        id: "rectangle_2",
        shape: { type: "RECTANGLE", tl: { r: 1, c: 2 }, br: { r: 3, c: 4 } },
      },
    ],
  });

  const actions = [
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 1, c: 0 }),
    diagramActions.onCellClick({ coords: { r: 1, c: 0 } }),
    ...generateMouseMoveActions({ r: 1, c: 0 }, { r: 0, c: 0 }),
    diagramActions.onMoveToFrontButtonClick(),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);
  expect(finalState.shapes[0].id).toBe("rectangle_1");
  expect(finalState.shapes[1].id).toBe("line_0");
  expect(finalState.shapes[2].id).toBe("rectangle_2");
});

test("ARROW | Rectangle 1 (Touch) | Rectangle 2 => Bring to front => Rectangle 1 (Touch) | ARROW | Rectangle 2", () => {
  const canvasSize: CanvasSize = { rows: 10, cols: 10 };

  const initialState = initDiagramState({
    canvasSize,
    shapes: [
      {
        id: "line_0",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 1, c: 0 },
          end: { r: 1, c: 5 },
        },
      },
      {
        id: "rectangle_1",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 1 }, br: { r: 2, c: 3 } },
      },
      {
        id: "rectangle_2",
        shape: { type: "RECTANGLE", tl: { r: 2, c: 2 }, br: { r: 4, c: 4 } },
      },
    ],
  });

  const actions = [
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 1, c: 0 }),
    diagramActions.onCellClick({ coords: { r: 1, c: 0 } }),
    ...generateMouseMoveActions({ r: 1, c: 0 }, { r: 0, c: 0 }),
    diagramActions.onMoveToFrontButtonClick(),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);
  expect(finalState.shapes[0].id).toBe("rectangle_1");
  expect(finalState.shapes[1].id).toBe("line_0");
  expect(finalState.shapes[2].id).toBe("rectangle_2");
});

test("ARROW | Rectangle 1 | Rectangle 2 => Bring to front => Rectangle 1 | Rectangle 2 | ARROW", () => {
  const canvasSize: CanvasSize = { rows: 10, cols: 10 };

  const initialState = initDiagramState({
    canvasSize,
    shapes: [
      {
        id: "line_0",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 1, c: 0 },
          end: { r: 1, c: 5 },
        },
      },
      {
        id: "rectangle_1",
        shape: { type: "RECTANGLE", tl: { r: 2, c: 2 }, br: { r: 4, c: 4 } },
      },
      {
        id: "rectangle_2",
        shape: { type: "RECTANGLE", tl: { r: 3, c: 2 }, br: { r: 5, c: 4 } },
      },
    ],
  });

  const actions = [
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 1, c: 0 }),
    diagramActions.onCellClick({ coords: { r: 1, c: 0 } }),
    ...generateMouseMoveActions({ r: 1, c: 0 }, { r: 0, c: 0 }),
    diagramActions.onMoveToFrontButtonClick(),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);
  expect(finalState.shapes[0].id).toBe("rectangle_1");
  expect(finalState.shapes[1].id).toBe("rectangle_2");
  expect(finalState.shapes[2].id).toBe("line_0");
});

test("ARROW | Rectangle 1 | Rectangle 2 | Text => Bring to front => Rectangle 1 | Rectangle 2 | ARROW | Text", () => {
  const canvasSize: CanvasSize = { rows: 10, cols: 10 };

  const initialState = initDiagramState({
    canvasSize,
    shapes: [
      {
        id: "line_0",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 1, c: 0 },
          end: { r: 1, c: 5 },
        },
      },
      {
        id: "rectangle_1",
        shape: { type: "RECTANGLE", tl: { r: 2, c: 2 }, br: { r: 4, c: 4 } },
      },
      {
        id: "rectangle_2",
        shape: { type: "RECTANGLE", tl: { r: 3, c: 2 }, br: { r: 5, c: 4 } },
      },
      {
        id: "text_3",
        shape: { type: "TEXT", start: { r: 0, c: 0 }, lines: ["Hello"] },
      },
    ],
  });

  const actions = [
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 1, c: 0 }),
    diagramActions.onCellClick({ coords: { r: 1, c: 0 } }),
    ...generateMouseMoveActions({ r: 1, c: 0 }, { r: 0, c: 0 }),
    diagramActions.onMoveToFrontButtonClick(),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);
  expect(finalState.shapes[0].id).toBe("rectangle_1");
  expect(finalState.shapes[1].id).toBe("rectangle_2");
  expect(finalState.shapes[2].id).toBe("line_0");
  expect(finalState.shapes[3].id).toBe("text_3");
});

test("Rectangle | TEXT 1 | Text 2 (touch) | Text 3 => Bring to front => Rectangle | Text 2 | TEXT 1 | Text 3", () => {
  const canvasSize: CanvasSize = { rows: 10, cols: 10 };

  const initialState = initDiagramState({
    canvasSize,
    shapes: [
      {
        id: "rectangle_0",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 0 }, br: { r: 2, c: 2 } },
      },
      {
        id: "text_1",
        shape: {
          type: "TEXT",
          start: { r: 2, c: 0 },
          lines: ["Hello", "world"],
        },
      },
      {
        id: "text_2",
        shape: { type: "TEXT", start: { r: 2, c: 4 }, lines: ["hi"] },
      },
      {
        id: "text_3",
        shape: { type: "TEXT", start: { r: 5, c: 0 }, lines: ["foo"] },
      },
    ],
  });

  const actions = [
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 0 }),
    diagramActions.onCellClick({ coords: { r: 2, c: 0 } }),
    ...generateMouseMoveActions({ r: 2, c: 0 }, { r: 0, c: 0 }),
    diagramActions.onMoveToFrontButtonClick(),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  expect(finalState.shapes[0].id).toBe("rectangle_0");
  expect(finalState.shapes[1].id).toBe("text_2");
  expect(finalState.shapes[2].id).toBe("text_1");
  expect(finalState.shapes[3].id).toBe("text_3");
});

test("Rectangle | TEXT 1 | Text 2 | Text 3 => Bring to front => Rectangle | Text 1 | Text 3 | TEXT 2", () => {
  const canvasSize: CanvasSize = { rows: 10, cols: 10 };

  const initialState = initDiagramState({
    canvasSize,
    shapes: [
      {
        id: "rectangle_0",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 0 }, br: { r: 2, c: 2 } },
      },
      {
        id: "text_1",
        shape: {
          type: "TEXT",
          start: { r: 2, c: 0 },
          lines: ["Hello", "world"],
        },
      },
      {
        id: "text_2",
        shape: { type: "TEXT", start: { r: 2, c: 5 }, lines: ["hi"] },
      },
      {
        id: "text_3",
        shape: { type: "TEXT", start: { r: 5, c: 0 }, lines: ["foo"] },
      },
    ],
  });

  const actions = [
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 0 }),
    diagramActions.onCellClick({ coords: { r: 2, c: 0 } }),
    ...generateMouseMoveActions({ r: 2, c: 0 }, { r: 0, c: 0 }),
    diagramActions.onMoveToFrontButtonClick(),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  expect(finalState.shapes[0].id).toBe("rectangle_0");
  expect(finalState.shapes[1].id).toBe("text_2");
  expect(finalState.shapes[2].id).toBe("text_3");
  expect(finalState.shapes[3].id).toBe("text_1");
});

test("Arrow (touch) | RECTANGLE => Push to back => RECTANGLE | Arrow", () => {
  const canvasSize: CanvasSize = { rows: 10, cols: 10 };

  const initialState = initDiagramState({
    canvasSize,
    shapes: [
      {
        id: "line_0",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 1, c: 0 },
          end: { r: 1, c: 4 },
        },
      },
      {
        id: "rectangle_1",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 1 }, br: { r: 2, c: 3 } },
      },
    ],
  });

  const actions = [
    diagramActions.setTool("SELECT"),
    diagramActions.onCellHover({ r: 0, c: 1 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 1 } }),
    diagramActions.onMoveToBackButtonClick(),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);
  expect(finalState.shapes[0].id).toBe("rectangle_1");
  expect(finalState.shapes[1].id).toBe("line_0");
});

test("RECTANGLE | Arrow (touch)  => Push to back => RECTANGLE | Arrow", () => {
  const canvasSize: CanvasSize = { rows: 10, cols: 10 };

  const initialState = initDiagramState({
    canvasSize,
    shapes: [
      {
        id: "rectangle_0",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 1 }, br: { r: 2, c: 3 } },
      },
      {
        id: "line_1",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 1, c: 0 },
          end: { r: 1, c: 4 },
        },
      },
    ],
  });

  const actions = [
    diagramActions.setTool("SELECT"),
    diagramActions.onCellHover({ r: 0, c: 1 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 1 } }),
    diagramActions.onMoveToBackButtonClick(),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);
  expect(finalState.shapes[0].id).toBe("rectangle_0");
  expect(finalState.shapes[1].id).toBe("line_1");
});
