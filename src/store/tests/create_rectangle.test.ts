import { appReducer, appActions, initState } from "../appSlice";
import { applyActions, generateMouseMoveActions } from "./utils";

test("Create a 5x5 rectangle", () => {
  const actions = [
    appActions.setTool("RECTANGLE"),
    appActions.onCellHover({ r: 0, c: 0 }),
    appActions.onCellMouseDown({ r: 0, c: 0 }),
    ...generateMouseMoveActions({ r: 1, c: 1 }, { r: 4, c: 4 }),
    appActions.onCellMouseUp({ r: 4, c: 4 }),
  ];

  const finalState = applyActions(appReducer, initState(), actions);

  expect(finalState.shapes).toHaveLength(1);
  expect(finalState.shapes[0].shape).toEqual({
    type: "RECTANGLE",
    tl: { r: 0, c: 0 },
    br: { r: 4, c: 4 },
  });
});

test("Create a 5x5 rectangle by moving the mouse to the top left", () => {
  const actions = [
    appActions.setTool("RECTANGLE"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 4, c: 4 }),
    appActions.onCellMouseDown({ r: 4, c: 4 }),
    ...generateMouseMoveActions({ r: 3, c: 3 }, { r: 0, c: 0 }),
    appActions.onCellMouseUp({ r: 0, c: 0 }),
  ];

  const finalState = applyActions(appReducer, initState(), actions);

  expect(finalState.shapes).toHaveLength(1);
  expect(finalState.shapes[0].shape).toEqual({
    type: "RECTANGLE",
    tl: { r: 0, c: 0 },
    br: { r: 4, c: 4 },
  });
});

test("Cannot create a 0x0 rectangle", () => {
  const actions = [
    appActions.setTool("RECTANGLE"),
    appActions.onCellHover({ r: 0, c: 0 }),
    appActions.onCellMouseDown({ r: 0, c: 0 }),
    appActions.onCellMouseUp({ r: 0, c: 0 }),
  ];

  const finalState = applyActions(appReducer, initState(), actions);

  expect(finalState.shapes).toHaveLength(0);
});

test("Cannot create a 5x0 rectangle", () => {
  const actions = [
    appActions.setTool("RECTANGLE"),
    appActions.onCellHover({ r: 0, c: 0 }),
    appActions.onCellMouseDown({ r: 0, c: 0 }),
    ...generateMouseMoveActions({ r: 1, c: 0 }, { r: 4, c: 0 }),
    appActions.onCellMouseUp({ r: 4, c: 0 }),
  ];

  const finalState = applyActions(appReducer, initState(), actions);

  expect(finalState.shapes).toHaveLength(0);
});

test("Cannot create a 0x5 rectangle", () => {
  const actions = [
    appActions.setTool("RECTANGLE"),
    appActions.onCellHover({ r: 0, c: 0 }),
    appActions.onCellMouseDown({ r: 0, c: 0 }),
    ...generateMouseMoveActions({ r: 0, c: 1 }, { r: 0, c: 4 }),
    appActions.onCellMouseUp({ r: 0, c: 4 }),
  ];

  const finalState = applyActions(appReducer, initState(), actions);

  expect(finalState.shapes).toHaveLength(0);
});
