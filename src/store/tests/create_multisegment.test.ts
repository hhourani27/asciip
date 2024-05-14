import { MultiSegment } from "../../models/shapes";
import { appActions, appReducer, initState } from "../appSlice";
import {
  applyActions,
  generateMouseClickAction,
  generateMouseMoveActions,
} from "./utils";

test("Create multi-line segment with all segment types", () => {
  const actions = [
    appActions.setTool("MULTI_SEGMENT_LINE"),
    appActions.onCellHover({ r: 0, c: 0 }),
    ...generateMouseClickAction({ r: 0, c: 0 }),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 0, c: 2 }),
    appActions.onCellClick({ r: 0, c: 2 }),
    ...generateMouseMoveActions({ r: 1, c: 2 }, { r: 2, c: 2 }),
    appActions.onCellClick({ r: 2, c: 2 }),
    appActions.onCellHover({ r: 2, c: 1 }),
    appActions.onCellClick({ r: 2, c: 1 }),
    appActions.onCellHover({ r: 1, c: 1 }),
    appActions.onCellDoubleClick({ r: 1, c: 1 }),
  ];

  const finalState = applyActions(appReducer, initState(), actions);

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
    appActions.setTool("MULTI_SEGMENT_LINE"),
    appActions.onCellHover({ r: 0, c: 0 }),
    appActions.onCellClick({ r: 0, c: 0 }),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 0, c: 2 }),
    appActions.onCellClick({ r: 0, c: 2 }),
    ...generateMouseMoveActions({ r: 0, c: 3 }, { r: 0, c: 4 }),
    appActions.onCellDoubleClick({ r: 0, c: 4 }),
  ];

  const finalState = applyActions(appReducer, initState(), actions);

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
    appActions.setTool("MULTI_SEGMENT_LINE"),
    appActions.onCellHover({ r: 0, c: 0 }),
    appActions.onCellClick({ r: 0, c: 0 }),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 0, c: 2 }),
    appActions.onCellClick({ r: 0, c: 2 }),
    appActions.onCellClick({ r: 0, c: 2 }),
    appActions.onCellClick({ r: 0, c: 2 }),
    appActions.onCellDoubleClick({ r: 0, c: 2 }),
  ];

  const finalState = applyActions(appReducer, initState(), actions);

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
