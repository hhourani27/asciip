import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DiagramData, initDiagramData } from "./diagramSlice";
import { v4 as uuidv4 } from "uuid";

export type Diagram = {
  id: string;
  name: string;
  data: DiagramData;
};

export type AppState = {
  diagrams: Diagram[];
  activeDiagramId: string;
};

export const initAppState = (): AppState => {
  const id = uuidv4();

  const firstDiagram: Diagram = {
    id,
    name: "New diagram",
    data: initDiagramData(),
  };

  return {
    diagrams: [firstDiagram],
    activeDiagramId: id,
  };
};

export const appSlice = createSlice({
  name: "app",
  initialState: initAppState(),
  reducers: {
    updateDiagramData: (state, action: PayloadAction<DiagramData>) => {
      const idx = state.diagrams.findIndex(
        (d) => d.id === state.activeDiagramId
      );
      state.diagrams[idx].data = action.payload;
    },
  },
});

export const appReducer = appSlice.reducer;
export const appActions = appSlice.actions;
export const appSelectors = appSlice.selectors;
