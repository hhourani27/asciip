import { TextShape } from "../../models/shapes";
import {
  CanvasSize,
  diagramActions,
  diagramReducer,
  initDiagramState,
} from "../diagramSlice";
import {
  applyActions,
  generateMouseMoveActions,
  generateUpdateText,
} from "./utils";

const canvasSize: CanvasSize = { rows: 10, cols: 10 };

test("Create a text shape, save with Ctrl+Enter", () => {
  const actions = [
    diagramActions.setTool("TEXT"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 0 } }),
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
});

test("Create a text shape, save by clicking on the canvas (click on empty cell)", () => {
  const actions = [
    diagramActions.setTool("TEXT"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 0 } }),
    ...generateUpdateText("Hello"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 0 }),
    diagramActions.onCellClick({ coords: { r: 2, c: 0 } }),
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

  expect(finalState.shapes).toHaveLength(1);
  expect(finalState.shapes[0].shape).toEqual(expectedShape1);
});

test("Create a text shape, save by clicking on the canvas (click on another shape)", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: { type: "TEXT", start: { r: 5, c: 0 }, lines: ["foo"] },
      },
    ],
  });

  const actions = [
    diagramActions.setTool("TEXT"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 0 } }),
    ...generateUpdateText("Hello"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 5, c: 0 }),
    diagramActions.onCellClick({ coords: { r: 5, c: 0 } }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  const expectedShape1: TextShape = {
    type: "TEXT",
    start: { r: 0, c: 0 },
    lines: ["Hello"],
  };

  expect(finalState.shapes).toHaveLength(2);
  expect(finalState.shapes[1].shape).toEqual(expectedShape1);
});

test("After creating a text shape, state is in SELECT mode and shape is selected (case: save with Ctrl+Enter)", () => {
  const actions = [
    diagramActions.setTool("TEXT"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 0 } }),
    ...generateUpdateText("Hello\nWorld"),
    diagramActions.onCtrlEnterPress(),
  ];

  const finalState = applyActions(
    diagramReducer,
    initDiagramState({ canvasSize }),
    actions
  );

  expect(finalState.selectedTool).toBe("SELECT");

  const selectMode = finalState.mode as { M: "SELECT"; shapeIds: string[] };
  expect(selectMode.M).toBe("SELECT");
  expect(selectMode.shapeIds).toHaveLength(1);
  expect(selectMode.shapeIds[0]).toBe(finalState.shapes[0].id);
});

test("After creating a text shape, state is in SELECT mode and shape is selected (case: save with click)", () => {
  const actions = [
    diagramActions.setTool("TEXT"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 0 } }),
    ...generateUpdateText("Hello\nWorld"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 0 }),
    diagramActions.onCellClick({ coords: { r: 2, c: 0 } }),
  ];

  const finalState = applyActions(
    diagramReducer,
    initDiagramState({ canvasSize }),
    actions
  );

  expect(finalState.selectedTool).toBe("SELECT");

  const selectMode = finalState.mode as { M: "SELECT"; shapeIds: string[] };
  expect(selectMode.M).toBe("SELECT");
  expect(selectMode.shapeIds).toHaveLength(1);
  expect(selectMode.shapeIds[0]).toBe(finalState.shapes[0].id);
});

test("Text cannot exceed canvas", () => {
  const actions = [
    diagramActions.setTool("TEXT"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 0 } }),
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

test("Create 2 text shapes", () => {
  const actions = [
    diagramActions.setTool("TEXT"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 0 } }),
    ...generateUpdateText("Hello"),
    diagramActions.onCtrlEnterPress(),

    diagramActions.setTool("TEXT"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 0 }),
    diagramActions.onCellClick({ coords: { r: 2, c: 0 } }),
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
});
