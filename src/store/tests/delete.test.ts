import { appActions, appReducer, initState } from "../appSlice";
import { applyActions, generateMouseClickAction } from "./utils";

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
    ...generateMouseClickAction({ r: 0, c: 0 }),
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
    ...generateMouseClickAction({ r: 0, c: 0 }),
    appActions.onDeletePress(),
    ...generateMouseClickAction({ r: 0, c: 0 }),
    appActions.onDeletePress(),
  ];

  const finalState = applyActions(appReducer, initialState, actions);

  expect(finalState.shapes).toHaveLength(0);
});
