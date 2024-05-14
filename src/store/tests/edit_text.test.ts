import { ShapeObject, appActions, appReducer, initState } from "../appSlice";
import { applyActions, generateMouseMoveActions } from "./utils";

test("Edit text", () => {
  const initialState = initState({
    shapes: [
      {
        id: "1",
        shape: {
          type: "TEXT",
          start: { r: 0, c: 0 },
          lines: ["Hello", "World"],
        },
      },
    ],
  });

  const actions = [
    appActions.setTool("SELECT"),
    appActions.onCellHover({ r: 0, c: 0 }),
    appActions.onCellDoubleClick({ r: 0, c: 0 }),
    appActions.updateText("Hello\nWorld1"),
    appActions.onCtrlEnterPress(),
  ];

  const finalState = applyActions(appReducer, initialState, actions);

  const expected: ShapeObject = {
    id: "1",
    shape: {
      type: "TEXT",
      start: { r: 0, c: 0 },
      lines: ["Hello", "World1"],
    },
  };

  expect(finalState.shapes[0]).toEqual(expected);
});
