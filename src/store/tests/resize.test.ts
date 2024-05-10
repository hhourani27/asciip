import { appActions, appReducer, initState } from "../appSlice";
import { applyActions, generateMouseMoveActions } from "./utils";

test("Fix: If a shape has another shape that overlaps it on top, even if I select it, I couldn't grab all resize points", () => {
  const initialState = initState({
    shapes: [
      {
        id: "1",
        shape: { type: "RECTANGLE", tl: { r: 2, c: 1 }, br: { r: 4, c: 3 } },
      },
      {
        id: "2",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 3 }, br: { r: 2, c: 5 } },
      },
    ],
  });

  const actions = [
    appActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 2 }, { r: 2, c: 2 }),
    appActions.onCellClick({ r: 2, c: 2 }),
    appActions.onCellHover({ r: 2, c: 3 }),
  ];

  const finalState = applyActions(appReducer, initialState, actions);

  expect(finalState.nextActionOnClick).toBe("RESIZE");
});
