import { ShapeObject, appActions, appReducer, initState } from "../appSlice";
import {
  applyActions,
  generateMouseMoveActions,
  generateMouseUpAction,
} from "./utils";

test("Resize all segments", () => {
  const initialState = initState({
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
    appActions.setTool("SELECT"),
    appActions.onCellHover({ r: 0, c: 0 }),
    appActions.onCellClick({ r: 0, c: 0 }),
    // Drag first segment
    appActions.onCellHover({ r: 0, c: 1 }),
    appActions.onCellMouseDown({ r: 0, c: 1 }),
    appActions.onCellHover({ r: 1, c: 1 }),
    ...generateMouseUpAction({ r: 1, c: 1 }),

    // Drag second segment
    ...generateMouseMoveActions({ r: 1, c: 1 }, { r: 2, c: 3 }),
    appActions.onCellMouseDown({ r: 2, c: 3 }),
    appActions.onCellHover({ r: 2, c: 2 }),
    ...generateMouseUpAction({ r: 2, c: 2 }),

    // Drag third segment
    ...generateMouseMoveActions({ r: 2, c: 2 }, { r: 3, c: 4 }),
    appActions.onCellMouseDown({ r: 3, c: 4 }),
    appActions.onCellHover({ r: 2, c: 4 }),
    ...generateMouseUpAction({ r: 2, c: 4 }),
  ];

  const finalState = applyActions(appReducer, initialState, actions);

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
  const initialState = initState({
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
    appActions.setTool("SELECT"),
    appActions.onCellHover({ r: 0, c: 2 }),
    appActions.onCellClick({ r: 0, c: 2 }),
    // Drag start point
    appActions.onCellHover({ r: 0, c: 1 }),
    appActions.onCellMouseDown({ r: 0, c: 1 }),
    appActions.onCellHover({ r: 0, c: 0 }),
    ...generateMouseUpAction({ r: 0, c: 0 }),
  ];

  const finalState = applyActions(appReducer, initialState, actions);

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
  const initialState = initState({
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
    appActions.setTool("SELECT"),
    appActions.onCellHover({ r: 0, c: 2 }),
    appActions.onCellClick({ r: 0, c: 2 }),
    // Drag start point
    appActions.onCellHover({ r: 0, c: 1 }),
    appActions.onCellMouseDown({ r: 0, c: 1 }),
    appActions.onCellHover({ r: 0, c: 2 }),
    ...generateMouseUpAction({ r: 0, c: 2 }),
  ];

  const finalState = applyActions(appReducer, initialState, actions);

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

test("Add segment at start", () => {
  const initialState = initState({
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
    appActions.setTool("SELECT"),
    appActions.onCellHover({ r: 0, c: 2 }),
    appActions.onCellClick({ r: 0, c: 2 }),
    // Drag start point
    appActions.onCellHover({ r: 0, c: 1 }),
    appActions.onCellMouseDown({ r: 0, c: 1 }),
    appActions.onCellHover({ r: 1, c: 1 }),
    ...generateMouseUpAction({ r: 1, c: 1 }),
  ];

  const finalState = applyActions(appReducer, initialState, actions);

  const expected: ShapeObject = {
    id: "1",
    shape: {
      type: "MULTI_SEGMENT_LINE",
      segments: [
        {
          axis: "VERTICAL",
          direction: "UP",
          start: { r: 1, c: 1 },
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
  const initialState = initState({
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
    appActions.setTool("SELECT"),
    appActions.onCellHover({ r: 0, c: 2 }),
    appActions.onCellClick({ r: 0, c: 2 }),
    // Drag end point
    ...generateMouseMoveActions({ r: 0, c: 2 }, { r: 2, c: 3 }),
    appActions.onCellHover({ r: 2, c: 3 }),
    appActions.onCellMouseDown({ r: 2, c: 3 }),
    appActions.onCellHover({ r: 3, c: 3 }),
    ...generateMouseUpAction({ r: 3, c: 3 }),
  ];

  const finalState = applyActions(appReducer, initialState, actions);

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
  const initialState = initState({
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
    appActions.setTool("SELECT"),
    appActions.onCellHover({ r: 0, c: 2 }),
    appActions.onCellClick({ r: 0, c: 2 }),
    // Drag end point
    ...generateMouseMoveActions({ r: 0, c: 2 }, { r: 2, c: 3 }),
    appActions.onCellHover({ r: 2, c: 3 }),
    appActions.onCellMouseDown({ r: 2, c: 3 }),
    appActions.onCellHover({ r: 1, c: 3 }),
    ...generateMouseUpAction({ r: 1, c: 3 }),
  ];

  const finalState = applyActions(appReducer, initialState, actions);

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
  const initialState = initState({
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
    appActions.setTool("SELECT"),
    appActions.onCellHover({ r: 0, c: 2 }),
    appActions.onCellClick({ r: 0, c: 2 }),
    // Drag end point
    ...generateMouseMoveActions({ r: 0, c: 2 }, { r: 2, c: 3 }),
    appActions.onCellHover({ r: 2, c: 3 }),
    appActions.onCellMouseDown({ r: 2, c: 3 }),
    appActions.onCellHover({ r: 2, c: 4 }),
    ...generateMouseUpAction({ r: 2, c: 4 }),
  ];

  const finalState = applyActions(appReducer, initialState, actions);

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
  const initialState = initState({
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
    appActions.setTool("SELECT"),
    appActions.onCellHover({ r: 0, c: 0 }),
    appActions.onCellClick({ r: 0, c: 0 }),

    // Drag 3rd segment
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 2, c: 2 }),
    appActions.onCellMouseDown({ r: 2, c: 2 }),
    ...generateMouseMoveActions({ r: 2, c: 2 }, { r: 0, c: 2 }),
    ...generateMouseUpAction({ r: 0, c: 2 }),
  ];

  const finalState = applyActions(appReducer, initialState, actions);

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
  const initialState = initState({
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
    appActions.setTool("SELECT"),
    appActions.onCellHover({ r: 0, c: 0 }),
    appActions.onCellClick({ r: 0, c: 0 }),

    // Drag 3rd segment
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 1, c: 2 }),
    appActions.onCellMouseDown({ r: 1, c: 2 }),
    ...generateMouseMoveActions({ r: 1, c: 2 }, { r: 1, c: 0 }),
    ...generateMouseUpAction({ r: 0, c: 2 }),
  ];

  const finalState = applyActions(appReducer, initialState, actions);

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
