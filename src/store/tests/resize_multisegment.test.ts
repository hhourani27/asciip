import {
  ShapeObject,
  diagramActions,
  diagramReducer,
  initDiagramState,
} from "../diagramSlice";
import { applyActions, generateMouseMoveActions } from "./utils";

test("Resize all segments", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: {
          type: "MULTI_SEGMENT_LINE",
          segments: [
            {
              axis: "HORIZONTAL",
              direction: "LEFT_TO_RIGHT",
              start: { r: 0, c: 0 },
              end: { r: 0, c: 3 },
            },
            {
              axis: "VERTICAL",
              direction: "DOWN",
              start: { r: 0, c: 3 },
              end: { r: 3, c: 3 },
            },
            {
              axis: "HORIZONTAL",
              direction: "LEFT_TO_RIGHT",
              start: { r: 3, c: 3 },
              end: { r: 3, c: 6 },
            },
          ],
        },
      },
    ],
  });

  const actions = [
    // Select shape
    diagramActions.setTool("SELECT"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 0 } }),
    // Drag first segment
    diagramActions.onCellHover({ r: 0, c: 1 }),
    diagramActions.onCellMouseDown({ r: 0, c: 1 }),
    diagramActions.onCellHover({ r: 1, c: 1 }),
    diagramActions.onCellMouseUp({ r: 1, c: 1 }),

    // Drag second segment
    ...generateMouseMoveActions({ r: 1, c: 1 }, { r: 2, c: 3 }),
    diagramActions.onCellMouseDown({ r: 2, c: 3 }),
    diagramActions.onCellHover({ r: 2, c: 2 }),
    diagramActions.onCellMouseUp({ r: 2, c: 2 }),

    // Drag third segment
    ...generateMouseMoveActions({ r: 2, c: 2 }, { r: 3, c: 4 }),
    diagramActions.onCellMouseDown({ r: 3, c: 4 }),
    diagramActions.onCellHover({ r: 2, c: 4 }),
    diagramActions.onCellMouseUp({ r: 2, c: 4 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  const expected: ShapeObject = {
    id: "1",
    shape: {
      type: "MULTI_SEGMENT_LINE",
      segments: [
        {
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 1, c: 0 },
          end: { r: 1, c: 2 },
        },
        {
          axis: "VERTICAL",
          direction: "DOWN",
          start: { r: 1, c: 2 },
          end: { r: 2, c: 2 },
        },
        {
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 2, c: 2 },
          end: { r: 2, c: 6 },
        },
      ],
    },
  };

  expect(finalState.shapes[0]).toEqual(expected);
});

test("Extend start point", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: {
          type: "MULTI_SEGMENT_LINE",
          segments: [
            {
              axis: "HORIZONTAL",
              direction: "LEFT_TO_RIGHT",
              start: { r: 0, c: 1 },
              end: { r: 0, c: 3 },
            },
            {
              axis: "VERTICAL",
              direction: "DOWN",
              start: { r: 0, c: 3 },
              end: { r: 2, c: 3 },
            },
          ],
        },
      },
    ],
  });

  const actions = [
    // Select shape
    diagramActions.setTool("SELECT"),
    diagramActions.onCellHover({ r: 0, c: 2 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 2 } }),
    // Drag start point
    diagramActions.onCellHover({ r: 0, c: 1 }),
    diagramActions.onCellMouseDown({ r: 0, c: 1 }),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellMouseUp({ r: 0, c: 0 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  const expected: ShapeObject = {
    id: "1",
    shape: {
      type: "MULTI_SEGMENT_LINE",
      segments: [
        {
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 3 },
        },
        {
          axis: "VERTICAL",
          direction: "DOWN",
          start: { r: 0, c: 3 },
          end: { r: 2, c: 3 },
        },
      ],
    },
  };
  expect(finalState.shapes[0]).toEqual(expected);
});

test("Shrink first segment", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: {
          type: "MULTI_SEGMENT_LINE",
          segments: [
            {
              axis: "HORIZONTAL",
              direction: "LEFT_TO_RIGHT",
              start: { r: 0, c: 1 },
              end: { r: 0, c: 3 },
            },
            {
              axis: "VERTICAL",
              direction: "DOWN",
              start: { r: 0, c: 3 },
              end: { r: 2, c: 3 },
            },
          ],
        },
      },
    ],
  });

  const actions = [
    // Select shape
    diagramActions.setTool("SELECT"),
    diagramActions.onCellHover({ r: 0, c: 2 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 2 } }),
    // Drag start point
    diagramActions.onCellHover({ r: 0, c: 1 }),
    diagramActions.onCellMouseDown({ r: 0, c: 1 }),
    diagramActions.onCellHover({ r: 0, c: 2 }),
    diagramActions.onCellMouseUp({ r: 0, c: 2 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  const expected: ShapeObject = {
    id: "1",
    shape: {
      type: "MULTI_SEGMENT_LINE",
      segments: [
        {
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 2 },
          end: { r: 0, c: 3 },
        },
        {
          axis: "VERTICAL",
          direction: "DOWN",
          start: { r: 0, c: 3 },
          end: { r: 2, c: 3 },
        },
      ],
    },
  };
  expect(finalState.shapes[0]).toEqual(expected);
});

test("Add 4 segments at start (all segment types)", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: {
          type: "MULTI_SEGMENT_LINE",
          segments: [
            {
              axis: "HORIZONTAL",
              direction: "LEFT_TO_RIGHT",
              start: { r: 0, c: 1 },
              end: { r: 0, c: 3 },
            },
            {
              axis: "VERTICAL",
              direction: "DOWN",
              start: { r: 0, c: 3 },
              end: { r: 2, c: 3 },
            },
          ],
        },
      },
    ],
  });

  const actions = [
    // Select shape
    diagramActions.setTool("SELECT"),
    diagramActions.onCellHover({ r: 0, c: 2 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 2 } }),
    // Drag start point down and add an UP Segment
    diagramActions.onCellHover({ r: 0, c: 1 }),
    diagramActions.onCellMouseDown({ r: 0, c: 1 }),
    ...generateMouseMoveActions({ r: 0, c: 1 }, { r: 3, c: 1 }),
    diagramActions.onCellMouseUp({ r: 3, c: 1 }),
    // Drag new start point left and add a RIGHT-TO-LEFT Segment
    diagramActions.onCellMouseDown({ r: 3, c: 1 }),
    ...generateMouseMoveActions({ r: 3, c: 1 }, { r: 3, c: 6 }),
    diagramActions.onCellMouseUp({ r: 3, c: 6 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  const expected: ShapeObject = {
    id: "1",
    shape: {
      type: "MULTI_SEGMENT_LINE",
      segments: [
        {
          axis: "HORIZONTAL",
          direction: "RIGHT_TO_LEFT",
          start: { r: 3, c: 6 },
          end: { r: 3, c: 1 },
        },
        {
          axis: "VERTICAL",
          direction: "UP",
          start: { r: 3, c: 1 },
          end: { r: 0, c: 1 },
        },
        {
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 1 },
          end: { r: 0, c: 3 },
        },
        {
          axis: "VERTICAL",
          direction: "DOWN",
          start: { r: 0, c: 3 },
          end: { r: 2, c: 3 },
        },
      ],
    },
  };
  expect(finalState.shapes[0]).toEqual(expected);
});

test("Extend end point", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: {
          type: "MULTI_SEGMENT_LINE",
          segments: [
            {
              axis: "HORIZONTAL",
              direction: "LEFT_TO_RIGHT",
              start: { r: 0, c: 1 },
              end: { r: 0, c: 3 },
            },
            {
              axis: "VERTICAL",
              direction: "DOWN",
              start: { r: 0, c: 3 },
              end: { r: 2, c: 3 },
            },
          ],
        },
      },
    ],
  });

  const actions = [
    // Select shape
    diagramActions.setTool("SELECT"),
    diagramActions.onCellHover({ r: 0, c: 2 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 2 } }),
    // Drag end point
    ...generateMouseMoveActions({ r: 0, c: 2 }, { r: 2, c: 3 }),
    diagramActions.onCellHover({ r: 2, c: 3 }),
    diagramActions.onCellMouseDown({ r: 2, c: 3 }),
    diagramActions.onCellHover({ r: 3, c: 3 }),
    diagramActions.onCellMouseUp({ r: 3, c: 3 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  const expected: ShapeObject = {
    id: "1",
    shape: {
      type: "MULTI_SEGMENT_LINE",
      segments: [
        {
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 1 },
          end: { r: 0, c: 3 },
        },
        {
          axis: "VERTICAL",
          direction: "DOWN",
          start: { r: 0, c: 3 },
          end: { r: 3, c: 3 },
        },
      ],
    },
  };
  expect(finalState.shapes[0]).toEqual(expected);
});

test("Shrink end point", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: {
          type: "MULTI_SEGMENT_LINE",
          segments: [
            {
              axis: "HORIZONTAL",
              direction: "LEFT_TO_RIGHT",
              start: { r: 0, c: 1 },
              end: { r: 0, c: 3 },
            },
            {
              axis: "VERTICAL",
              direction: "DOWN",
              start: { r: 0, c: 3 },
              end: { r: 2, c: 3 },
            },
          ],
        },
      },
    ],
  });

  const actions = [
    // Select shape
    diagramActions.setTool("SELECT"),
    diagramActions.onCellHover({ r: 0, c: 2 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 2 } }),
    // Drag end point
    ...generateMouseMoveActions({ r: 0, c: 2 }, { r: 2, c: 3 }),
    diagramActions.onCellHover({ r: 2, c: 3 }),
    diagramActions.onCellMouseDown({ r: 2, c: 3 }),
    diagramActions.onCellHover({ r: 1, c: 3 }),
    diagramActions.onCellMouseUp({ r: 1, c: 3 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  const expected: ShapeObject = {
    id: "1",
    shape: {
      type: "MULTI_SEGMENT_LINE",
      segments: [
        {
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 1 },
          end: { r: 0, c: 3 },
        },
        {
          axis: "VERTICAL",
          direction: "DOWN",
          start: { r: 0, c: 3 },
          end: { r: 1, c: 3 },
        },
      ],
    },
  };
  expect(finalState.shapes[0]).toEqual(expected);
});

test("Add segment at end", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: {
          type: "MULTI_SEGMENT_LINE",
          segments: [
            {
              axis: "HORIZONTAL",
              direction: "LEFT_TO_RIGHT",
              start: { r: 0, c: 1 },
              end: { r: 0, c: 3 },
            },
            {
              axis: "VERTICAL",
              direction: "DOWN",
              start: { r: 0, c: 3 },
              end: { r: 2, c: 3 },
            },
          ],
        },
      },
    ],
  });

  const actions = [
    // Select shape
    diagramActions.setTool("SELECT"),
    diagramActions.onCellHover({ r: 0, c: 2 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 2 } }),
    // Drag end point
    ...generateMouseMoveActions({ r: 0, c: 2 }, { r: 2, c: 3 }),
    diagramActions.onCellMouseDown({ r: 2, c: 3 }),
    diagramActions.onCellHover({ r: 2, c: 4 }),
    diagramActions.onCellMouseUp({ r: 2, c: 4 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  const expected: ShapeObject = {
    id: "1",
    shape: {
      type: "MULTI_SEGMENT_LINE",
      segments: [
        {
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 1 },
          end: { r: 0, c: 3 },
        },
        {
          axis: "VERTICAL",
          direction: "DOWN",
          start: { r: 0, c: 3 },
          end: { r: 2, c: 3 },
        },
        {
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 2, c: 3 },
          end: { r: 2, c: 4 },
        },
      ],
    },
  };
  expect(finalState.shapes[0]).toEqual(expected);
});

test("Merge 3 segments by dragging the middle segment", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: {
          type: "MULTI_SEGMENT_LINE",
          segments: [
            {
              axis: "HORIZONTAL",
              direction: "LEFT_TO_RIGHT",
              start: { r: 0, c: 0 },
              end: { r: 0, c: 1 },
            },
            {
              axis: "VERTICAL",
              direction: "DOWN",
              start: { r: 0, c: 1 },
              end: { r: 2, c: 1 },
            },
            {
              axis: "HORIZONTAL",
              direction: "LEFT_TO_RIGHT",
              start: { r: 2, c: 1 },
              end: { r: 2, c: 3 },
            },
          ],
        },
      },
    ],
  });

  const actions = [
    // Select shape
    diagramActions.setTool("SELECT"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 0 } }),

    // Drag 3rd segment
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 2 }),
    diagramActions.onCellMouseDown({ r: 2, c: 2 }),
    ...generateMouseMoveActions({ r: 2, c: 2 }, { r: 0, c: 2 }),
    diagramActions.onCellMouseUp({ r: 0, c: 2 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  const expected: ShapeObject = {
    id: "1",
    shape: {
      type: "MULTI_SEGMENT_LINE",
      segments: [
        {
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 3 },
        },
      ],
    },
  };

  expect(finalState.shapes[0]).toEqual(expected);
});

test("Cannot have a u-turn when dragging a segment", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: {
          type: "MULTI_SEGMENT_LINE",
          segments: [
            {
              axis: "VERTICAL",
              direction: "DOWN",
              start: { r: 0, c: 0 },
              end: { r: 2, c: 0 },
            },
            {
              axis: "HORIZONTAL",
              direction: "LEFT_TO_RIGHT",
              start: { r: 2, c: 0 },
              end: { r: 2, c: 2 },
            },
            {
              axis: "VERTICAL",
              direction: "UP",
              start: { r: 2, c: 2 },
              end: { r: 0, c: 2 },
            },
          ],
        },
      },
    ],
  });

  const actions = [
    // Select shape
    diagramActions.setTool("SELECT"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 0 } }),

    // Drag 3rd segment
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 1, c: 2 }),
    diagramActions.onCellMouseDown({ r: 1, c: 2 }),
    ...generateMouseMoveActions({ r: 1, c: 2 }, { r: 1, c: 0 }),
    diagramActions.onCellMouseUp({ r: 0, c: 2 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  const expected: ShapeObject = {
    id: "1",
    shape: {
      type: "MULTI_SEGMENT_LINE",
      segments: [
        {
          axis: "VERTICAL",
          direction: "DOWN",
          start: { r: 0, c: 0 },
          end: { r: 2, c: 0 },
        },
        {
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 2, c: 0 },
          end: { r: 2, c: 1 },
        },
        {
          axis: "VERTICAL",
          direction: "UP",
          start: { r: 2, c: 1 },
          end: { r: 0, c: 1 },
        },
      ],
    },
  };
  expect(finalState.shapes[0]).toEqual(expected);
});
