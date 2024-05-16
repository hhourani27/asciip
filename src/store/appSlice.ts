import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DiagramData, initDiagramData } from "./diagramSlice";
import { v4 as uuidv4 } from "uuid";

export type DiagramMetadata = {
  id: string;
  name: string;
};

export type Diagram = DiagramMetadata & {
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
    setActiveDiagram: (state, action: PayloadAction<string>) => {
      state.activeDiagramId = action.payload;
    },
    addDiagram: (state, action: PayloadAction<string>) => {
      const id = uuidv4();
      const newDiagram: Diagram = {
        id,
        name: action.payload,
        data: initDiagramData(),
      };
      state.diagrams = [...state.diagrams, newDiagram];
      state.activeDiagramId = id;
    },
    updateDiagramData: (state, action: PayloadAction<DiagramData>) => {
      const idx = state.diagrams.findIndex(
        (d) => d.id === state.activeDiagramId
      );
      state.diagrams[idx].data = action.payload;
    },
  },
  selectors: {
    activeDiagram: (state): Diagram => {
      return state.diagrams.find((d) => d.id === state.activeDiagramId)!;
    },
  },
});

export const appReducer = appSlice.reducer;
export const appActions = appSlice.actions;
export const appSelectors = appSlice.selectors;
