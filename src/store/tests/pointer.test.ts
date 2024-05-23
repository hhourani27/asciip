import {
  diagramActions,
  diagramReducer,
  initDiagramState,
} from "../diagramSlice";
import { selectors } from "../selectors";
import {
  applyActions,
  generateMouseClickAction,
  generateMouseMoveActions,
} from "./utils";

test("Select tool: when mouse points to an empty cell => Pointer = NONE", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: { type: "RECTANGLE", tl: { r: 1, c: 1 }, br: { r: 5, c: 5 } },
      },
    ],
  });

  const actions = [
    // Select line
    diagramActions.setTool("SELECT"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  expect(selectors.getPointer(finalState)).toBe("NONE");
});

test("Select tool: when mouse points to a shape => Pointer = SELECT", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: { type: "RECTANGLE", tl: { r: 1, c: 1 }, br: { r: 5, c: 5 } },
      },
    ],
  });

  const actions = [
    // Select line
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 1, c: 1 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  expect(selectors.getPointer(finalState)).toBe("SELECT");
});

test("Select tool: when mouse points a selected shape (not on its resize points) => Pointer = MOVE", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: { type: "RECTANGLE", tl: { r: 1, c: 1 }, br: { r: 5, c: 5 } },
      },
    ],
  });

  const actions = [
    // Select line
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 1, c: 2 }),
    ...generateMouseClickAction({ r: 1, c: 2 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  expect(selectors.getPointer(finalState)).toBe("MOVE");
});

test("Select tool: when mouse points to the resize point of a selected shape => Pointer = RESIZE", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: { type: "RECTANGLE", tl: { r: 1, c: 1 }, br: { r: 5, c: 5 } },
      },
    ],
  });

  const actions = [
    // Select line
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 1, c: 1 }),
    ...generateMouseClickAction({ r: 1, c: 1 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  expect(selectors.getPointer(finalState)).toBe("RESIZE");
});

test("Create Rectangle tool => Pointer = CREATE", () => {
  const actions = [
    // Select line
    diagramActions.setTool("RECTANGLE"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
  ];

  const finalState = applyActions(diagramReducer, initDiagramState(), actions);

  expect(selectors.getPointer(finalState)).toBe("CREATE");
});
