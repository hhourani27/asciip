import { TextShape } from "../../models/shapes";
import {
  ShapeObject,
  diagramActions,
  diagramReducer,
  initDiagramState,
} from "../diagramSlice";
import {
  applyActions,
  generateMouseDoubleClickAction,
  generateMouseMoveActions,
} from "./utils";

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
    ...generateMouseDoubleClickAction({ r: 0, c: 0 }),
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

test("I edit a text, and then I edit another one", () => {
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
      {
        id: "2",
        shape: {
          type: "TEXT",
          start: { r: 2, c: 0 },
          lines: ["foo"],
        },
      },
    ],
  });

  const actions = [
    diagramActions.setTool("SELECT"),
    // Edit first text
    diagramActions.onCellHover({ r: 0, c: 0 }),
    ...generateMouseDoubleClickAction({ r: 0, c: 0 }),
    diagramActions.updateText("Hello\nWorld1"),

    // Edit second text
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 0 }),
    ...generateMouseDoubleClickAction({ r: 2, c: 0 }),
    diagramActions.updateText("foo1"),
    diagramActions.onCtrlEnterPress(),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  expect((finalState.shapes[0].shape as TextShape).lines).toEqual([
    "Hello",
    "World1",
  ]);
  expect((finalState.shapes[1].shape as TextShape).lines).toEqual(["foo1"]);
});
