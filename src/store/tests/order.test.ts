import { getStyledCanvasGrid } from "../../models/representation";
import {
  CanvasSize,
  diagramActions,
  diagramReducer,
  initDiagramState,
} from "../diagramSlice";
import {
  applyActions,
  generateMouseMoveActions,
  generateMouseUpAction,
} from "./utils";

test("Newly created non-Text shapes are placed below existing text shapes", () => {
  const canvasSize: CanvasSize = { rows: 2, cols: 6 };

  // Start with a text shape
  const initialState = initDiagramState({
    canvasSize,
    shapes: [
      {
        id: "1",
        shape: {
          type: "TEXT",
          start: { r: 0, c: 0 },
          lines: ["Hello"],
        },
      },
    ],
  });

  // Add a line
  const actions = [
    // Select line
    diagramActions.setTool("LINE"),
    diagramActions.onCellHover({ r: 0, c: 0 }),
    diagramActions.onCellMouseDown({ r: 0, c: 0 }),
    ...generateMouseMoveActions({ r: 0, c: 1 }, { r: 0, c: 5 }),
    ...generateMouseUpAction({ r: 0, c: 5 }),
  ];

  const finalState = applyActions(diagramReducer, initialState, actions);

  expect(finalState.shapes[0].shape.type).toBe("LINE");
  expect(finalState.shapes[1].shape.type).toBe("TEXT");
  expect(getStyledCanvasGrid(canvasSize, finalState.shapes)).toEqual([
    ["H", "e", "l", "l", "o", ">"],
    [" ", " ", " ", " ", " ", " "],
  ]);
});
