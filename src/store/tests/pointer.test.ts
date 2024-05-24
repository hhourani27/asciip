import {
  diagramActions,
  diagramReducer,
  initDiagramState,
} from "../diagramSlice";
import { selectors } from "../selectors";
import { applyActions, generateMouseMoveActions } from "./utils";

const initialStateWithTwoRectangles = initDiagramState({
  shapes: [
    {
      id: "1",
      shape: { type: "RECTANGLE", tl: { r: 1, c: 1 }, br: { r: 5, c: 5 } },
    },
    {
      id: "2",
      shape: { type: "RECTANGLE", tl: { r: 10, c: 1 }, br: { r: 15, c: 5 } },
    },
  ],
});

test("Select tool: when mouse points to an empty cell => Pointer = NONE", () => {
  const actions = [
    // Select line
    diagramActions.setTool("SELECT"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
  ];

  const finalState = applyActions(
    diagramReducer,
    initialStateWithTwoRectangles,
    actions
  );

  expect(selectors.getPointer(finalState)).toBe("NONE");
});

test("Select tool: when mouse points to a shape => Pointer = SELECT", () => {
  const actions = [
    // Select line
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 1, c: 1 }),
  ];

  const finalState = applyActions(
    diagramReducer,
    initialStateWithTwoRectangles,
    actions
  );

  expect(selectors.getPointer(finalState)).toBe("SELECT");
});

test("Select tool: Select a shape and then points to another shape => Pointer = SELECT", () => {
  const actions = [
    // Select line
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 1, c: 1 }),
    diagramActions.onCellClick({ coords: { r: 1, c: 1 } }),
    ...generateMouseMoveActions({ r: 1, c: 1 }, { r: 10, c: 1 }),
  ];

  const finalState = applyActions(
    diagramReducer,
    initialStateWithTwoRectangles,
    actions
  );

  expect(selectors.getPointer(finalState)).toBe("SELECT");
});

test("Select tool: Point to a selected shape (not on its resize points) => Pointer = MOVE", () => {
  const actions = [
    // Select line
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 1, c: 2 }),
    diagramActions.onCellClick({ coords: { r: 1, c: 2 } }),
  ];

  const finalState = applyActions(
    diagramReducer,
    initialStateWithTwoRectangles,
    actions
  );

  expect(selectors.getPointer(finalState)).toBe("MOVE");
});

test("Select tool: Point to the resize point of a selected shape => Pointer = RESIZE", () => {
  const actions = [
    // Select line
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 1, c: 1 }),
    diagramActions.onCellClick({ coords: { r: 1, c: 1 } }),
  ];

  const finalState = applyActions(
    diagramReducer,
    initialStateWithTwoRectangles,
    actions
  );

  expect(selectors.getPointer(finalState)).toBe("RESIZE");
});

test("Select tool: Select 2 shapes and then point to the resize point of a selected shape => Pointer = MOVE", () => {
  const actions = [
    // Select line
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 1, c: 1 }),
    diagramActions.onCellClick({ coords: { r: 1, c: 1 } }),
    ...generateMouseMoveActions({ r: 1, c: 1 }, { r: 10, c: 1 }),
    diagramActions.onCellClick({ coords: { r: 10, c: 1 }, ctrlKey: true }),
  ];

  const finalState = applyActions(
    diagramReducer,
    initialStateWithTwoRectangles,
    actions
  );

  expect(selectors.getPointer(finalState)).toBe("MOVE");
});

test("Create Rectangle tool => Pointer = CREATE", () => {
  const actions = [
    // Select line
    diagramActions.setTool("RECTANGLE"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
  ];

  const finalState = applyActions(diagramReducer, initDiagramState(), actions);

  expect(selectors.getPointer(finalState)).toBe("CREATE");
});
