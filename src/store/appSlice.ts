import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type Tool = "SELECT" | "RECTANGLE";

type AppState = {
  canvasSize: {
    rows: number;
    cols: number;
  };

  selectedTool: Tool;
};

const initialState: AppState = {
  canvasSize: {
    rows: 100,
    cols: 200,
  },
  selectedTool: "SELECT",
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setTool: (state, action: PayloadAction<Tool>) => {
      state.selectedTool = action.payload;
    },
  },
});

export const appReducer = appSlice.reducer;
export const appActions = appSlice.actions;
