import { Line } from "../../models/shapes";
import {
  diagramActions,
  diagramReducer,
  initDiagramState,
} from "../diagramSlice";
import {
  applyActions,
  generateMouseMoveActions,
  generateMouseUpAction,
} from "./utils";

test("Create Left-to-right horizontal line", () => {
  const actions = [
    diagramActions.setTool("LINE"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 2 }),
    diagramActions.onCellMouseDown({ r: 2, c: 2 }),
    ...generateMouseMoveActions({ r: 2, c: 2 }, { r: 2, c: 4 }),
    ...generateMouseUpAction({ r: 2, c: 4 }),
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
    ...generateMouseUpAction({ r: 2, c: 0 }),
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
    ...generateMouseUpAction({ r: 4, c: 2 }),
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
    ...generateMouseUpAction({ r: 0, c: 2 }),
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
    ...generateMouseUpAction({ r: 2, c: 2 }),
  ];

  const finalState = applyActions(diagramReducer, initDiagramState(), actions);

  expect(finalState.shapes).toHaveLength(0);
});
