import { Line } from "../../models/shapes";
import { appActions, appReducer, initState } from "../appSlice";
import { applyActions, generateMouseMoveActions } from "./utils";

test("Create Left-to-right horizontal line", () => {
  const actions = [
    appActions.setTool("LINE"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 2 }),
    appActions.onCellMouseDown({ r: 2, c: 2 }),
    ...generateMouseMoveActions({ r: 2, c: 2 }, { r: 2, c: 4 }),
    appActions.onCellMouseUp({ r: 2, c: 4 }),
  ];

  const finalState = applyActions(appReducer, initState(), actions);

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
    appActions.setTool("LINE"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 2 }),
    appActions.onCellMouseDown({ r: 2, c: 2 }),
    ...generateMouseMoveActions({ r: 2, c: 2 }, { r: 2, c: 0 }),
    appActions.onCellMouseUp({ r: 2, c: 0 }),
  ];

  const finalState = applyActions(appReducer, initState(), actions);

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
    appActions.setTool("LINE"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 2 }),
    appActions.onCellMouseDown({ r: 2, c: 2 }),
    ...generateMouseMoveActions({ r: 2, c: 2 }, { r: 4, c: 2 }),
    appActions.onCellMouseUp({ r: 4, c: 2 }),
  ];

  const finalState = applyActions(appReducer, initState(), actions);

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
    appActions.setTool("LINE"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 2 }),
    appActions.onCellMouseDown({ r: 2, c: 2 }),
    ...generateMouseMoveActions({ r: 2, c: 2 }, { r: 0, c: 2 }),
    appActions.onCellMouseUp({ r: 0, c: 2 }),
  ];

  const finalState = applyActions(appReducer, initState(), actions);

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
    appActions.setTool("LINE"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 2 }),
    appActions.onCellMouseDown({ r: 2, c: 2 }),
    appActions.onCellMouseUp({ r: 2, c: 2 }),
  ];

  const finalState = applyActions(appReducer, initState(), actions);

  expect(finalState.shapes).toHaveLength(0);
});
