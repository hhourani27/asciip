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

  // UI state
  createDiagramInProgress: boolean;
  deleteDiagramInProgress: string | null;
  renameDiagramInProgress: string | null;
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

    deleteDiagramInProgress: null,
    renameDiagramInProgress: null,
    createDiagramInProgress: false,
  };
};

export const appSlice = createSlice({
  name: "app",
  initialState: initAppState(),
  reducers: {
    setActiveDiagram: (state, action: PayloadAction<string>) => {
      state.activeDiagramId = action.payload;
    },
    createDiagram: (state, action: PayloadAction<string>) => {
      createDiagram(state, action.payload);
      state.createDiagramInProgress = false;
    },
    deleteDiagram: (state, action: PayloadAction<string>) => {
      const deletedId = action.payload;
      const deletedDiagramIdx = state.diagrams.findIndex(
        (d) => d.id === deletedId
      );

      if (deletedDiagramIdx > -1) {
        // Delete diagram
        state.diagrams.splice(deletedDiagramIdx, 1);

        // If we're deleting the last diagram, then create a new default diagram
        if (state.diagrams.length === 0) {
          createDiagram(state);
        } else {
          // If the deleted diagram is the active one, then set the active diagram to the first diagram on the list
          if (deletedId === state.activeDiagramId) {
            state.activeDiagramId = state.diagrams[0].id;
          }
        }
      }
      state.deleteDiagramInProgress = null;
    },
    renameDiagram: (
      state,
      action: PayloadAction<{ id: string; newName: string }>
    ) => {
      const diagram = state.diagrams.find((d) => d.id === action.payload.id);
      if (diagram) {
        diagram.name = action.payload.newName;
      }
      state.renameDiagramInProgress = null;
    },
    startCreateDiagram: (state) => {
      state.createDiagramInProgress = true;
    },
    cancelCreateDiagram: (state) => {
      state.createDiagramInProgress = false;
    },
    startDeleteDiagram: (state, action: PayloadAction<string>) => {
      state.deleteDiagramInProgress = action.payload;
    },
    cancelDeleteDiagram: (state) => {
      state.deleteDiagramInProgress = null;
    },
    startRenameDiagram: (state, action: PayloadAction<string>) => {
      state.renameDiagramInProgress = action.payload;
    },
    cancelRenameDiagram: (state) => {
      state.renameDiagramInProgress = null;
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

//#region Helper state function that mutate directly the state
function createDiagram(state: AppState, name: string = "New diagram") {
  const id = uuidv4();
  const newDiagram: Diagram = {
    id,
    name,
    data: initDiagramData(),
  };
  state.diagrams = [...state.diagrams, newDiagram];
  state.activeDiagramId = id;
}

export const appReducer = appSlice.reducer;
export const appActions = appSlice.actions;
export const appSelectors = appSlice.selectors;
