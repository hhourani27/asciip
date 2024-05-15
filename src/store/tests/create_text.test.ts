import { TextShape } from "../../models/shapes";
import {
  CanvasSize,
  diagramActions,
  diagramReducer,
  initDiagramState,
} from "../diagramSlice";
import {
  applyActions,
  generateMouseClickAction,
  generateMouseMoveActions,
  generateUpdateText,
} from "./utils";

const canvasSize: CanvasSize = { rows: 10, cols: 10 };

test("Create text", () => {
  const actions = [
    diagramActions.setTool("TEXT"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    ...generateMouseClickAction({ r: 0, c: 0 }),
    ...generateUpdateText("Hello\nWorld"),
    diagramActions.onCtrlEnterPress(),
  ];

  const finalState = applyActions(
    diagramReducer,
    initDiagramState({ canvasSize }),
    actions
  );

  const expectedShape: TextShape = {
    type: "TEXT",
    start: { r: 0, c: 0 },
    lines: ["Hello", "World"],
  };

  expect(finalState.shapes).toHaveLength(1);
  expect(finalState.shapes[0].shape).toEqual(expectedShape);
  expect(finalState.creationProgress).toBeNull();
});

test("Text cannot exceed canvas", () => {
  const actions = [
    diagramActions.setTool("TEXT"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    ...generateMouseClickAction({ r: 0, c: 0 }),
    ...generateUpdateText(
      "Lorem ipsum dolor sit amet\nconsectetur adipiscing elits"
    ),
    diagramActions.onCtrlEnterPress(),
  ];

  const finalState = applyActions(
    diagramReducer,
    initDiagramState({ canvasSize }),
    actions
  );

  const expectedShape: TextShape = {
    type: "TEXT",
    start: { r: 0, c: 0 },
    lines: ["Lorem ipsu", "consectetu"],
  };

  expect(finalState.shapes).toHaveLength(1);
  expect(finalState.shapes[0].shape).toEqual(expectedShape);
});

test("Create 2 texts", () => {
  const actions = [
    diagramActions.setTool("TEXT"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    ...generateMouseClickAction({ r: 0, c: 0 }),
    ...generateUpdateText("Hello"),
    diagramActions.onCtrlEnterPress(),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 0 }),
    ...generateMouseClickAction({ r: 2, c: 0 }),
    ...generateUpdateText("World"),
    diagramActions.onCtrlEnterPress(),
  ];

  const finalState = applyActions(
    diagramReducer,
    initDiagramState({ canvasSize }),
    actions
  );

  const expectedShape1: TextShape = {
    type: "TEXT",
    start: { r: 0, c: 0 },
    lines: ["Hello"],
  };

  const expectedShape2: TextShape = {
    type: "TEXT",
    start: { r: 2, c: 0 },
    lines: ["World"],
  };

  expect(finalState.shapes).toHaveLength(2);
  expect(finalState.shapes[0].shape).toEqual(expectedShape1);
  expect(finalState.shapes[1].shape).toEqual(expectedShape2);
  expect(finalState.creationProgress).toBeNull();
});
