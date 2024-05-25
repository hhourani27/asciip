import { Line } from "../../models/shapes";
import {
  diagramActions,
  diagramReducer,
  initDiagramState,
} from "../diagramSlice";
import { applyActions, generateMouseMoveActions } from "./utils";

test("Create Left-to-right horizontal line", () => {
  const actions = [
    diagramActions.setTool("LINE"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 2 }),
    diagramActions.onCellMouseDown({ r: 2, c: 2 }),
    ...generateMouseMoveActions({ r: 2, c: 2 }, { r: 2, c: 4 }),
    diagramActions.onCellMouseUp({ r: 2, c: 4 }),
  ];

  const finalState = applyActions(diagramReducer, initDiagramState(), actions);

  const expectedShape: Line = {
    type: "LINE",
    axis: "HORIZONTAL",
    direction: "LEFT_TO_RIGHT",
    start: { r: 2, c: 2 },
    end: { r: 2, c: 4 },
  };

  expect(finalState.shapes).toHaveLength(1);
  expect(finalState.shapes[0].shape).toEqual(expectedShape);
});

test("Create Right-to-left horizontal line", () => {
  const actions = [
    diagramActions.setTool("LINE"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 2 }),
    diagramActions.onCellMouseDown({ r: 2, c: 2 }),
    ...generateMouseMoveActions({ r: 2, c: 2 }, { r: 2, c: 0 }),
    diagramActions.onCellMouseUp({ r: 2, c: 0 }),
  ];

  const finalState = applyActions(diagramReducer, initDiagramState(), actions);

  const expectedShape: Line = {
    type: "LINE",
    axis: "HORIZONTAL",
    direction: "RIGHT_TO_LEFT",
    start: { r: 2, c: 2 },
    end: { r: 2, c: 0 },
  };

  expect(finalState.shapes).toHaveLength(1);
  expect(finalState.shapes[0].shape).toEqual(expectedShape);
});

test("Create Downward vertical line", () => {
  const actions = [
    diagramActions.setTool("LINE"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 2 }),
    diagramActions.onCellMouseDown({ r: 2, c: 2 }),
    ...generateMouseMoveActions({ r: 2, c: 2 }, { r: 4, c: 2 }),
    diagramActions.onCellMouseUp({ r: 4, c: 2 }),
  ];

  const finalState = applyActions(diagramReducer, initDiagramState(), actions);

  const expectedShape: Line = {
    type: "LINE",
    axis: "VERTICAL",
    direction: "DOWN",
    start: { r: 2, c: 2 },
    end: { r: 4, c: 2 },
  };

  expect(finalState.shapes).toHaveLength(1);
  expect(finalState.shapes[0].shape).toEqual(expectedShape);
});

test("Create Upward vertical line", () => {
  const actions = [
    diagramActions.setTool("LINE"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 2 }),
    diagramActions.onCellMouseDown({ r: 2, c: 2 }),
    ...generateMouseMoveActions({ r: 2, c: 2 }, { r: 0, c: 2 }),
    diagramActions.onCellMouseUp({ r: 0, c: 2 }),
  ];

  const finalState = applyActions(diagramReducer, initDiagramState(), actions);

  const expectedShape: Line = {
    type: "LINE",
    axis: "VERTICAL",
    direction: "UP",
    start: { r: 2, c: 2 },
    end: { r: 0, c: 2 },
  };

  expect(finalState.shapes).toHaveLength(1);
  expect(finalState.shapes[0].shape).toEqual(expectedShape);
});

test("Cannot create zero-length line", () => {
  const actions = [
    diagramActions.setTool("LINE"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 2 }),
    diagramActions.onCellMouseDown({ r: 2, c: 2 }),
    diagramActions.onCellMouseUp({ r: 2, c: 2 }),
  ];

  const finalState = applyActions(diagramReducer, initDiagramState(), actions);

  expect(finalState.shapes).toHaveLength(0);
});

test("After creating a line, state is in SELECT mode and shape is selected", () => {
  const actions = [
    diagramActions.setTool("LINE"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 2 }),
    diagramActions.onCellMouseDown({ r: 2, c: 2 }),
    ...generateMouseMoveActions({ r: 2, c: 2 }, { r: 2, c: 0 }),
    diagramActions.onCellMouseUp({ r: 2, c: 0 }),
  ];

  const finalState = applyActions(diagramReducer, initDiagramState(), actions);

  expect(finalState.selectedTool).toBe("SELECT");

  const selectMode = finalState.mode as { M: "SELECT"; shapeIds: string[] };
  expect(selectMode.M).toBe("SELECT");
  expect(selectMode.shapeIds).toHaveLength(1);
  expect(selectMode.shapeIds[0]).toBe(finalState.shapes[0].id);
});

test("After failing to create a line, state is still in BEFORE_CREATING mode", () => {
  const actions = [
    diagramActions.setTool("LINE"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 2 }),
    diagramActions.onCellMouseDown({ r: 2, c: 2 }),
    diagramActions.onCellMouseUp({ r: 2, c: 2 }),
  ];

  const finalState = applyActions(diagramReducer, initDiagramState(), actions);

  expect(finalState.selectedTool).toBe("LINE");
  expect(finalState.mode.M).toBe("BEFORE_CREATING");
});
