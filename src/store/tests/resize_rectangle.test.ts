import { ShapeObject, appActions, appReducer, initState } from "../appSlice";
import {
  applyActions,
  generateMouseMoveActions,
  generateMouseUpAction,
} from "./utils";

test("Resize a rectangle", () => {
  const initialState = initState({
    shapes: [
      {
        id: "1",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 0 }, br: { r: 4, c: 4 } },
      },
    ],
  });

  const actions = [
    appActions.setTool("SELECT"),
    appActions.onCellHover({ r: 0, c: 1 }),
    appActions.onCellClick({ r: 0, c: 1 }),
    appActions.onCellHover({ r: 0, c: 0 }),
    appActions.onCellMouseDown({ r: 0, c: 0 }),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 1, c: 1 }),
    ...generateMouseUpAction({ r: 1, c: 1 }),
  ];

  const finalState = applyActions(appReducer, initialState, actions);

  const expected: ShapeObject = {
    id: "1",
    shape: {
      type: "RECTANGLE",
      tl: { r: 1, c: 1 },
      br: { r: 4, c: 4 },
    },
  };

  expect(finalState.shapes[0]).toEqual(expected);
});

test("Resize a rectangle by inverting it", () => {
  const initialState = initState({
    shapes: [
      {
        id: "1",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 0 }, br: { r: 4, c: 4 } },
      },
    ],
  });

  const actions = [
    appActions.setTool("SELECT"),
    appActions.onCellHover({ r: 0, c: 1 }),
    appActions.onCellClick({ r: 0, c: 1 }),
    appActions.onCellHover({ r: 0, c: 0 }),
    appActions.onCellMouseDown({ r: 0, c: 0 }),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 8, c: 8 }),
    ...generateMouseUpAction({ r: 8, c: 8 }),
  ];

  const finalState = applyActions(appReducer, initialState, actions);

  const expected: ShapeObject = {
    id: "1",
    shape: {
      type: "RECTANGLE",
      tl: { r: 4, c: 4 },
      br: { r: 8, c: 8 },
    },
  };

  expect(finalState.shapes[0]).toEqual(expected);
});

test("Cannot resize a rectangle to a single point", () => {
  const initialState = initState({
    shapes: [
      {
        id: "1",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 0 }, br: { r: 4, c: 4 } },
      },
    ],
  });

  const actions = [
    appActions.setTool("SELECT"),
    appActions.onCellHover({ r: 0, c: 1 }),
    appActions.onCellClick({ r: 0, c: 1 }),
    appActions.onCellHover({ r: 0, c: 0 }),
    appActions.onCellMouseDown({ r: 0, c: 0 }),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 4, c: 4 }),
    ...generateMouseUpAction({ r: 4, c: 4 }),
  ];

  const finalState = applyActions(appReducer, initialState, actions);

  const expected: ShapeObject = {
    id: "1",
    shape: {
      type: "RECTANGLE",
      tl: { r: 3, c: 3 },
      br: { r: 4, c: 4 },
    },
  };

  expect(finalState.shapes[0]).toEqual(expected);
});

test("Cannot resize a rectangle to a vertical line", () => {
  const initialState = initState({
    shapes: [
      {
        id: "1",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 0 }, br: { r: 4, c: 4 } },
      },
    ],
  });

  const actions = [
    appActions.setTool("SELECT"),
    appActions.onCellHover({ r: 0, c: 1 }),
    appActions.onCellClick({ r: 0, c: 1 }),
    appActions.onCellHover({ r: 0, c: 0 }),
    appActions.onCellMouseDown({ r: 0, c: 0 }),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 4, c: 0 }),
    ...generateMouseUpAction({ r: 4, c: 0 }),
  ];

  const finalState = applyActions(appReducer, initialState, actions);

  const expected: ShapeObject = {
    id: "1",
    shape: {
      type: "RECTANGLE",
      tl: { r: 3, c: 0 },
      br: { r: 4, c: 4 },
    },
  };

  expect(finalState.shapes[0]).toEqual(expected);
});

test("Cannot resize a rectangle to a horizontal line", () => {
  const initialState = initState({
    shapes: [
      {
        id: "1",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 0 }, br: { r: 4, c: 4 } },
      },
    ],
  });

  const actions = [
    appActions.setTool("SELECT"),
    appActions.onCellHover({ r: 0, c: 1 }),
    appActions.onCellClick({ r: 0, c: 1 }),
    appActions.onCellHover({ r: 0, c: 0 }),
    appActions.onCellMouseDown({ r: 0, c: 0 }),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 0, c: 4 }),
    ...generateMouseUpAction({ r: 0, c: 4 }),
  ];

  const finalState = applyActions(appReducer, initialState, actions);

  const expected: ShapeObject = {
    id: "1",
    shape: {
      type: "RECTANGLE",
      tl: { r: 0, c: 3 },
      br: { r: 4, c: 4 },
    },
  };

  expect(finalState.shapes[0]).toEqual(expected);
});

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
