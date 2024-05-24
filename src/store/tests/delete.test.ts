import {
  diagramActions,
  diagramReducer,
  initDiagramState,
} from "../diagramSlice";
import { applyActions } from "./utils";

test("Delete a shape", () => {
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
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 0 } }),
    diagramActions.onDeletePress(),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  expect(finalState.shapes).toHaveLength(0);
});

test("Delete 2 shapes on top of each other", () => {
  const initialState = initDiagramState({
    shapes: [
      {
        id: "1",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 0 }, br: { r: 4, c: 4 } },
      },
      {
        id: "2",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 0 }, br: { r: 4, c: 4 } },
      },
    ],
  });

  const actions = [
    diagramActions.setTool("SELECT"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellClick({ coords: { r: 0, c: 0 } }),
    diagramActions.onDeletePress(),
    diagramActions.onCellClick({ coords: { r: 0, c: 0 } }),
    diagramActions.onDeletePress(),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  expect(finalState.shapes).toHaveLength(0);
});
