import {
  diagramReducer,
  diagramActions,
  initDiagramState,
} from "../diagramSlice";
import { applyActions, generateMouseMoveActions } from "./utils";

test("Create a 5x5 rectangle", () => {
  const actions = [
    diagramActions.setTool("RECTANGLE"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellMouseDown({ r: 0, c: 0 }),
    ...generateMouseMoveActions({ r: 1, c: 1 }, { r: 4, c: 4 }),
    diagramActions.onCellMouseUp({ r: 4, c: 4 }),
  ];

  const finalState = applyActions(diagramReducer, initDiagramState(), actions);

  expect(finalState.shapes).toHaveLength(1);
  expect(finalState.shapes[0].shape).toEqual({
    type: "RECTANGLE",
    tl: { r: 0, c: 0 },
    br: { r: 4, c: 4 },
  });
});

test("Create a 5x5 rectangle by moving the mouse to the top left", () => {
  const actions = [
    diagramActions.setTool("RECTANGLE"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 4, c: 4 }),
    diagramActions.onCellMouseDown({ r: 4, c: 4 }),
    ...generateMouseMoveActions({ r: 3, c: 3 }, { r: 0, c: 0 }),
    diagramActions.onCellMouseUp({ r: 0, c: 0 }),
  ];

  const finalState = applyActions(diagramReducer, initDiagramState(), actions);

  expect(finalState.shapes).toHaveLength(1);
  expect(finalState.shapes[0].shape).toEqual({
    type: "RECTANGLE",
    tl: { r: 0, c: 0 },
    br: { r: 4, c: 4 },
  });
});

test("After creating a rectangle, state is in SELECT mode and shape is selected", () => {
  const actions = [
    diagramActions.setTool("RECTANGLE"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellMouseDown({ r: 0, c: 0 }),
    ...generateMouseMoveActions({ r: 1, c: 1 }, { r: 4, c: 4 }),
    diagramActions.onCellMouseUp({ r: 4, c: 4 }),
  ];

  const finalState = applyActions(diagramReducer, initDiagramState(), actions);

  expect(finalState.selectedTool).toBe("SELECT");

  const selectMode = finalState.mode as { M: "SELECT"; shapeIds: string[] };
  expect(selectMode.M).toBe("SELECT");
  expect(selectMode.shapeIds).toHaveLength(1);
  expect(selectMode.shapeIds[0]).toBe(finalState.shapes[0].id);
});

test("Cannot create a 0x0 rectangle", () => {
  const actions = [
    diagramActions.setTool("RECTANGLE"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellMouseDown({ r: 0, c: 0 }),
    diagramActions.onCellMouseUp({ r: 0, c: 0 }),
  ];

  const finalState = applyActions(diagramReducer, initDiagramState(), actions);

  expect(finalState.shapes).toHaveLength(0);
});

test("Cannot create a 5x0 rectangle", () => {
  const actions = [
    diagramActions.setTool("RECTANGLE"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellMouseDown({ r: 0, c: 0 }),
    ...generateMouseMoveActions({ r: 1, c: 0 }, { r: 4, c: 0 }),
    diagramActions.onCellMouseUp({ r: 4, c: 0 }),
  ];

  const finalState = applyActions(diagramReducer, initDiagramState(), actions);

  expect(finalState.shapes).toHaveLength(0);
});

test("Cannot create a 0x5 rectangle", () => {
  const actions = [
    diagramActions.setTool("RECTANGLE"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellMouseDown({ r: 0, c: 0 }),
    ...generateMouseMoveActions({ r: 0, c: 1 }, { r: 0, c: 4 }),
    diagramActions.onCellMouseUp({ r: 0, c: 4 }),
  ];

  const finalState = applyActions(diagramReducer, initDiagramState(), actions);

  expect(finalState.shapes).toHaveLength(0);
});

test("After failing to create a rectangle, state is still in BEFORE_CREATING mode", () => {
  const actions = [
    diagramActions.setTool("RECTANGLE"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellMouseDown({ r: 0, c: 0 }),
    diagramActions.onCellMouseUp({ r: 0, c: 0 }),
  ];

  const finalState = applyActions(diagramReducer, initDiagramState(), actions);

  expect(finalState.selectedTool).toBe("RECTANGLE");
  expect(finalState.mode.M).toBe("BEFORE_CREATING");
});
