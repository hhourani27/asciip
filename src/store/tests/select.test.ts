import {
  diagramReducer,
  diagramActions,
  initDiagramState,
} from "../diagramSlice";
import { selectors } from "../selectors";
import { applyActions, generateMouseMoveActions } from "./utils";

test("I select a shape, I click on an empty cell => selection is cleared", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 0 }, br: { r: 4, c: 4 } },
      },
    ],
  });

  const actions = [
    diagramActions.setTool("SELECT"),
    diagramActions.onCellHover({ r: 0, c: 2 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 2 } }),
    ...generateMouseMoveActions({ r: 0, c: 2 }, { r: 0, c: 6 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 6 } }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  expect(selectors.hasSelectedShape(finalState)).toBeFalse();
});

test("I am creating a shape, then I select the Select tool (with the S shortcut) => The new shape creation is cancelled", () => {
  const actions = [
    diagramActions.setTool("RECTANGLE"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellMouseDown({ r: 0, c: 0 }),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 0, c: 2 }),
    diagramActions.setTool("SELECT"),
  ];

  const finalState = applyActions(diagramReducer, initDiagramState(), actions);

  expect(finalState.shapes).toHaveLength(0);
});

test("Select 2 shapes", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: { type: "RECTANGLE", tl: { r: 1, c: 1 }, br: { r: 5, c: 5 } },
      },
      {
        id: "2",
        shape: { type: "RECTANGLE", tl: { r: 10, c: 1 }, br: { r: 15, c: 5 } },
      },
    ],
  });

  const actions = [
    diagramActions.setTool("SELECT"),
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 1, c: 1 }),
    diagramActions.onCellClick({ coords: { r: 1, c: 1 } }),
    ...generateMouseMoveActions({ r: 1, c: 1 }, { r: 10, c: 1 }),
    diagramActions.onCellClick({ coords: { r: 10, c: 1 }, ctrlKey: true }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  expect(selectors.selectedShapeObjs(finalState)).toHaveLength(2);
});

test("Select 2 shapes, then unselect a shape", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: { type: "RECTANGLE", tl: { r: 1, c: 1 }, br: { r: 5, c: 5 } },
      },
      {
        id: "2",
        shape: { type: "RECTANGLE", tl: { r: 10, c: 1 }, br: { r: 15, c: 5 } },
      },
    ],
  });

  const actions = [
    diagramActions.setTool("SELECT"),
    // Select first rectangle
    ...generateMouseMoveActions({ r: 0, c: 0 }, { r: 1, c: 1 }),
    diagramActions.onCellClick({ coords: { r: 1, c: 1 } }),
    // Select second rectangle
    ...generateMouseMoveActions({ r: 1, c: 1 }, { r: 10, c: 1 }),
    diagramActions.onCellClick({ coords: { r: 10, c: 1 }, ctrlKey: true }),
    // Unselect second rectangle
    diagramActions.onCellClick({ coords: { r: 10, c: 1 }, ctrlKey: true }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  expect(selectors.selectedShapeObjs(finalState)).toHaveLength(1);
  expect(selectors.selectedShapeObj(finalState)?.id).toBe("1");
});
