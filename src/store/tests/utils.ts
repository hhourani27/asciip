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
  while (!_.isEqual(curr, to)) {
    curr.r = curr.r < to.r ? curr.r + 1 : curr.r > to.r ? curr.r - 1 : curr.r;
    curr.c = curr.c < to.c ? curr.c + 1 : curr.c > to.c ? curr.c - 1 : curr.c;
    actions.push(appActions.onCellHover(curr));
  }

  return actions;
}
