import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type Tool = "SELECT" | "RECTANGLE";

type AppState = {
  selectedTool: Tool;
};

const initialState: AppState = {
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
