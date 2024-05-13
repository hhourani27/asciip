import { Reducer, UnknownAction } from "@reduxjs/toolkit";
import { AppState, appActions } from "../appSlice";
import { Coords } from "../../models/shapes";
import _ from "lodash";

export function applyActions(
  reducer: Reducer<AppState>,
  initialState: AppState,
  actions: UnknownAction[]
): AppState {
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

  actions.push(appActions.onCellHover(curr));

  let nextMove: "HORIZONTAL" | "VERTICAL" = "HORIZONTAL";
  while (!_.isEqual(curr, to)) {
    if (nextMove === "VERTICAL") {
      if (curr.r !== to.r) {
        curr.r = curr.r < to.r ? curr.r + 1 : curr.r - 1;
        actions.push(appActions.onCellHover({ ...curr }));
      }
      nextMove = "HORIZONTAL";
    } else {
      if (curr.c !== to.c) {
        curr.c = curr.c < to.c ? curr.c + 1 : curr.c - 1;
        actions.push(appActions.onCellHover({ ...curr }));
      }
      nextMove = "VERTICAL";
    }
  }

  return actions;
}
