import { appReducer, appActions, initState } from "../appSlice";
import { applyActions, generateMouseMoveActions } from "./utils";

test("Translate a rectangle 1 row up", () => {
  const initialState = initState([
    {
      id: "1",
      shape: { type: "RECTANGLE", tl: { r: 2, c: 2 }, br: { r: 7, c: 7 } },
    },
  ]);

  const actions = [
    appActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 4 }),
    appActions.onCellClick({ r: 2, c: 4 }),
    appActions.onCellMouseDown({ r: 2, c: 4 }),
    appActions.onCellHover({ r: 1, c: 4 }),
    appActions.onCellMouseUp({ r: 1, c: 4 }),
  ];

  const finalState = applyActions(appReducer, initialState, actions);

  expect(finalState.shapes[0].shape).toEqual({
    type: "RECTANGLE",
    tl: { r: 1, c: 2 },
    br: { r: 6, c: 7 },
  });
});

test("Translate a rectangle 2 rows up", () => {
  const initialState = initState([
    {
      id: "1",
      shape: { type: "RECTANGLE", tl: { r: 10, c: 10 }, br: { r: 14, c: 14 } },
    },
  ]);

  const actions = [
    appActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 10, c: 12 }),
    appActions.onCellClick({ r: 10, c: 12 }),
    appActions.onCellMouseDown({ r: 10, c: 12 }),
    appActions.onCellHover({ r: 9, c: 12 }),
    appActions.onCellHover({ r: 8, c: 12 }),
    appActions.onCellMouseUp({ r: 8, c: 12 }),
  ];

  const finalState = applyActions(appReducer, initialState, actions);

  expect(finalState.shapes[0].shape).toEqual({
    type: "RECTANGLE",
    tl: { r: 8, c: 10 },
    br: { r: 12, c: 14 },
  });
});
