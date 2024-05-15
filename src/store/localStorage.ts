import { AppState, initAppState } from "./appSlice";
import { initDiagramState } from "./diagramSlice";
import { RootState } from "./store";

const saveState = (state: AppState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("appState", serializedState);
  } catch (err) {
    console.error("Could not save state", err);
  }
};

const loadState = (): RootState => {
  const defaultAppState = initAppState();
  const defaultDiagramState = initDiagramState(
    defaultAppState.diagrams[0].data
  );

  try {
    const serializedState = localStorage.getItem("appState");
    if (serializedState === null) {
      return { app: defaultAppState, diagram: defaultDiagramState };
    } else {
      const appState = JSON.parse(serializedState) as AppState;
      const diagramState = initDiagramState(
        appState.diagrams.find((d) => d.id === appState.activeDiagramId)?.data
      );
      return { app: appState, diagram: diagramState };
    }
  } catch (err) {
    console.error("Could not load state", err);
    return { app: defaultAppState, diagram: defaultDiagramState };
  }
};

export const appLocalStorage = { saveState, loadState };
