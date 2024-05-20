import {
  diagramReducer,
  diagramActions,
  initDiagramState,
  diagramSelectors,
} from "../diagramSlice";
import {
  applyActions,
  generateMouseClickAction,
  generateMouseMoveActions,
} from "./utils";

test("When clicking on empty cell, selection should be cleared", () => {
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
    ...generateMouseClickAction({ r: 0, c: 2 }),
    ...generateMouseMoveActions({ r: 0, c: 2 }, { r: 0, c: 6 }),
    ...generateMouseClickAction({ r: 0, c: 6 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  expect(
    diagramSelectors.selectedShapeObj({ diagram: finalState })
  ).toBeUndefined();
});
