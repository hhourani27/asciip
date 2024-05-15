import { configureStore } from "@reduxjs/toolkit";
import { diagramReducer } from "./diagramSlice";

export const store = configureStore({
  reducer: {
    diagram: diagramReducer,
  },
  devTools: { maxAge: 1000 },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
