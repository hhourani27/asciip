import { Reducer, UnknownAction } from "@reduxjs/toolkit";
import { DiagramState, diagramActions } from "../diagramSlice";
import { Coords } from "../../models/shapes";
import _ from "lodash";

export function applyActions(
  reducer: Reducer<DiagramState>,
  initialState: DiagramState,
  actions: UnknownAction[]
): DiagramState {
  let nextState = initialState;
  actions.forEach((action) => (nextState = reducer(nextState, action)));
  return nextState;
}

export function generateMouseMoveActions(
  from: Coords,
  to: Coords
): UnknownAction[] {
  const actions: UnknownAction[] = [];
  const curr: Coords = { r: from.r, c: from.c };

  actions.push(diagramActions.onCellHover(curr));

  let nextMove: "HORIZONTAL" | "VERTICAL" = "HORIZONTAL";
  while (!_.isEqual(curr, to)) {
    if (nextMove === "VERTICAL") {
      if (curr.r !== to.r) {
        curr.r = curr.r < to.r ? curr.r + 1 : curr.r - 1;
        actions.push(diagramActions.onCellHover({ ...curr }));
      }
      nextMove = "HORIZONTAL";
    } else {
      if (curr.c !== to.c) {
        curr.c = curr.c < to.c ? curr.c + 1 : curr.c - 1;
        actions.push(diagramActions.onCellHover({ ...curr }));
      }
      nextMove = "VERTICAL";
    }
  }

  return actions;
}

export function generateUpdateText(text: string): UnknownAction[] {
  const actions: UnknownAction[] = [];

  for (let i = 1; i <= text.length; i++) {
    actions.push(diagramActions.updateText(text.slice(0, i)));
  }

  return actions;
}

export function generateMouseDoubleClickAction(cell: Coords): UnknownAction[] {
  return [
    diagramActions.onCellMouseDown(cell),
    diagramActions.onCellMouseUp(cell),
    diagramActions.onCellClick({ coords: cell }),
    diagramActions.onCellMouseDown(cell),
    diagramActions.onCellMouseUp(cell),
    diagramActions.onCellClick({ coords: cell }),
    diagramActions.onCellDoubleClick(cell),
  ];
}
