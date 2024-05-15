import {
  addListener,
  createListenerMiddleware,
  isAnyOf,
} from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "./store";
import { appActions } from "./appSlice";
import { appLocalStorage } from "./localStorage";

export const listenerMiddleware = createListenerMiddleware();

const startAppListening = listenerMiddleware.startListening.withTypes<
  RootState,
  AppDispatch
>();

export const addAppListener = addListener.withTypes<RootState, AppDispatch>();

/**
 * If the active diagram data is modified in diagramSlice => Update the diagram in appSlice
 */
startAppListening({
  predicate: (action, currentState, originalState) => {
    return (
      currentState.diagram.canvasSize !== originalState.diagram.canvasSize ||
      currentState.diagram.shapes !== originalState.diagram.shapes ||
      currentState.diagram.styleMode !== originalState.diagram.styleMode ||
      currentState.diagram.globalStyle !== originalState.diagram.globalStyle
    );
  },
  effect: (action, listenerApi) => {
    console.log("[Listener] Detected a change in the current diagram");
    const { canvasSize, shapes, styleMode, globalStyle } =
      listenerApi.getState().diagram;

    listenerApi.dispatch(
      appActions.updateDiagramData({
        canvasSize,
        shapes,
        styleMode,
        globalStyle,
      })
    );
  },
});

/**
 * If data is modified in appSlice => Save it to local storage
 */
startAppListening({
  matcher: isAnyOf(appActions.updateDiagramData),
  effect: (action, listenerApi) => {
    console.log("[Listener] Saving to local storage");
    appLocalStorage.saveState(listenerApi.getState().app);
  },
});
