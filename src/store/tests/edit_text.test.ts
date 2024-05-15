import {
  ShapeObject,
  diagramActions,
  diagramReducer,
  initDiagramState,
} from "../diagramSlice";
import { applyActions } from "./utils";

test("Edit text", () => {
  const initialState = initDiagramState({
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
    diagramActions.setTool("SELECT"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellDoubleClick({ r: 0, c: 0 }),
    diagramActions.updateText("Hello\nWorld1"),
    diagramActions.onCtrlEnterPress(),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

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
