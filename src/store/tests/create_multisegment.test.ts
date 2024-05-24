import { MultiSegment } from "../../models/shapes";
import {
  diagramActions,
  diagramReducer,
  initDiagramState,
} from "../diagramSlice";
import {
  applyActions,
  generateMouseDoubleClickAction,
  generateMouseMoveActions,
} from "./utils";

test("Create multi-line segment with all segment types", () => {
  const actions = [
    diagramActions.setTool("MULTI_SEGMENT_LINE"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 0 } }),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 0, c: 2 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 2 } }),
    ...generateMouseMoveActions({ r: 1, c: 2 }, { r: 2, c: 2 }),
    diagramActions.onCellClick({ coords: { r: 2, c: 2 } }),
    diagramActions.onCellHover({ r: 2, c: 1 }),
    diagramActions.onCellClick({ coords: { r: 2, c: 1 } }),
    diagramActions.onCellHover({ r: 1, c: 1 }),
    ...generateMouseDoubleClickAction({ r: 1, c: 1 }),
  ];

  const finalState = applyActions(diagramReducer, initDiagramState(), actions);

  const expectedShape: MultiSegment = {
    type: "MULTI_SEGMENT_LINE",
    segments: [
      {
        axis: "HORIZONTAL",
        direction: "LEFT_TO_RIGHT",
        start: { r: 0, c: 0 },
        end: { r: 0, c: 2 },
      },
      {
        axis: "VERTICAL",
        direction: "DOWN",
        start: { r: 0, c: 2 },
        end: { r: 2, c: 2 },
      },
      {
        axis: "HORIZONTAL",
        direction: "RIGHT_TO_LEFT",
        start: { r: 2, c: 2 },
        end: { r: 2, c: 1 },
      },
      {
        axis: "VERTICAL",
        direction: "UP",
        start: { r: 2, c: 1 },
        end: { r: 1, c: 1 },
      },
    ],
  };

  expect(finalState.shapes).toHaveLength(1);
  expect((finalState.shapes[0].shape as MultiSegment).segments).toHaveLength(4);
  expect(finalState.shapes[0].shape).toEqual(expectedShape);
});

test("Two consecutive segments with the same direction are merged", () => {
  const actions = [
    diagramActions.setTool("MULTI_SEGMENT_LINE"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 0 } }),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 0, c: 2 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 2 } }),
    ...generateMouseMoveActions({ r: 0, c: 3 }, { r: 0, c: 4 }),
    ...generateMouseDoubleClickAction({ r: 0, c: 4 }),
  ];

  const finalState = applyActions(diagramReducer, initDiagramState(), actions);

  const expectedShape: MultiSegment = {
    type: "MULTI_SEGMENT_LINE",
    segments: [
      {
        axis: "HORIZONTAL",
        direction: "LEFT_TO_RIGHT",
        start: { r: 0, c: 0 },
        end: { r: 0, c: 4 },
      },
    ],
  };

  expect(finalState.shapes).toHaveLength(1);
  expect((finalState.shapes[0].shape as MultiSegment).segments).toHaveLength(1);
  expect(finalState.shapes[0].shape).toEqual(expectedShape);
});

test("0-length segments are ignored", () => {
  const actions = [
    diagramActions.setTool("MULTI_SEGMENT_LINE"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 0 } }),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 0, c: 2 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 2 } }),
    diagramActions.onCellClick({ coords: { r: 0, c: 2 } }),
    diagramActions.onCellClick({ coords: { r: 0, c: 2 } }),
    ...generateMouseDoubleClickAction({ r: 0, c: 2 }),
  ];

  const finalState = applyActions(diagramReducer, initDiagramState(), actions);

  const expectedShape: MultiSegment = {
    type: "MULTI_SEGMENT_LINE",
    segments: [
      {
        axis: "HORIZONTAL",
        direction: "LEFT_TO_RIGHT",
        start: { r: 0, c: 0 },
        end: { r: 0, c: 2 },
      },
    ],
  };

  expect(finalState.shapes).toHaveLength(1);
  expect((finalState.shapes[0].shape as MultiSegment).segments).toHaveLength(1);
  expect(finalState.shapes[0].shape).toEqual(expectedShape);
});
