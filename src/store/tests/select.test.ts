import {
  diagramReducer,
  diagramActions,
  initDiagramState,
} from "../diagramSlice";
import { selectors } from "../selectors";
import {
  applyActions,
  generateMouseClickAction,
  generateMouseMoveActions,
} from "./utils";

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
    ...generateMouseClickAction({ r: 0, c: 2 }),
    ...generateMouseMoveActions({ r: 0, c: 2 }, { r: 0, c: 6 }),
    ...generateMouseClickAction({ r: 0, c: 6 }),
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
