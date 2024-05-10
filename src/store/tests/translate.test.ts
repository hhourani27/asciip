import { appReducer, appActions, initState } from "../appSlice";
import { applyActions, generateMouseMoveActions } from "./utils";

test("Translate a rectangle 1 row up", () => {
  const initialState = initState({
    shapes: [
      {
        id: "1",
        shape: { type: "RECTANGLE", tl: { r: 2, c: 2 }, br: { r: 7, c: 7 } },
      },
    ],
  });

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
  const initialState = initState({
    shapes: [
      {
        id: "1",
        shape: {
          type: "RECTANGLE",
          tl: { r: 10, c: 10 },
          br: { r: 14, c: 14 },
        },
      },
    ],
  });

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

test("Fix: If I grab a rectangle from the bottom border, and move it up to the canvas top border, it returned to its original position", () => {
  const initialState = initState({
    shapes: [
      {
        id: "1",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 2 }, br: { r: 4, c: 6 } },
      },
    ],
  });

  const actions = [
    appActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 6 }, { r: 2, c: 6 }),
    appActions.onCellClick({ r: 2, c: 6 }),
    appActions.onCellMouseDown({ r: 2, c: 6 }),
    appActions.onCellHover({ r: 2, c: 5 }),
    appActions.onCellHover({ r: 2, c: 4 }),
    appActions.onCellHover({ r: 2, c: 3 }),
    appActions.onCellMouseUp({ r: 2, c: 4 }),
  ];

  const finalState = applyActions(appReducer, initialState, actions);

  expect(finalState.shapes[0].shape).toEqual({
    type: "RECTANGLE",
    tl: { r: 0, c: 0 },
    br: { r: 4, c: 4 },
  });
});

test("Fix: Rectangle could be translated beyond the right canvas border if it was grabbed by the right border", () => {
  const initialState = initState({
    canvasSize: { rows: 10, cols: 10 },
    shapes: [
      {
        id: "1",
        shape: { type: "RECTANGLE", tl: { r: 2, c: 6 }, br: { r: 4, c: 8 } },
      },
    ],
  });

  const actions = [
    appActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 6 }, { r: 3, c: 6 }),
    appActions.onCellClick({ r: 3, c: 6 }),
    appActions.onCellMouseDown({ r: 3, c: 6 }),
    appActions.onCellHover({ r: 3, c: 7 }),
    appActions.onCellHover({ r: 3, c: 8 }),
    appActions.onCellHover({ r: 3, c: 9 }),
    appActions.onCellMouseUp({ r: 3, c: 9 }),
  ];

  const finalState = applyActions(appReducer, initialState, actions);

  expect(finalState.shapes[0].shape).toEqual({
    type: "RECTANGLE",
    tl: { r: 2, c: 7 },
    br: { r: 4, c: 9 },
  });
});
