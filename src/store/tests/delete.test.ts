import { appActions, appReducer, initState } from "../appSlice";
import { applyActions } from "./utils";

test("Delete a shape", () => {
  const initialState = initState({
    shapes: [
      {
        id: "1",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 0 }, br: { r: 4, c: 4 } },
      },
    ],
  });

  const actions = [
    appActions.setTool("SELECT"),
    appActions.onCellHover({ r: 0, c: 0 }),
    appActions.onCellClick({ r: 0, c: 0 }),
    appActions.onDeletePress(),
  ];

  const finalState = applyActions(appReducer, initialState, actions);

  expect(finalState.shapes).toHaveLength(0);
});

test("Delete 2 shapes on top of each other", () => {
  const initialState = initState({
    shapes: [
      {
        id: "1",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 0 }, br: { r: 4, c: 4 } },
      },
      {
        id: "2",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 0 }, br: { r: 4, c: 4 } },
      },
    ],
  });

  const actions = [
    appActions.setTool("SELECT"),
    appActions.onCellHover({ r: 0, c: 0 }),
    // I added onCellMouseDown as in real usage, a click is always accompanied by a mousdown event. and in this case, it caused a bug
    appActions.onCellMouseDown({ r: 0, c: 0 }),
    appActions.onCellClick({ r: 0, c: 0 }),
    appActions.onDeletePress(),
    appActions.onCellClick({ r: 0, c: 0 }),
    appActions.onDeletePress(),
  ];

  const finalState = applyActions(appReducer, initialState, actions);

  expect(finalState.shapes).toHaveLength(0);
});
