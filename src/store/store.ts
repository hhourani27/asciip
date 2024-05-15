import { StateFromReducersMapObject, configureStore } from "@reduxjs/toolkit";
import { diagramReducer } from "./diagramSlice";
import { appReducer } from "./appSlice";
import { listenerMiddleware } from "./middleware";
import { appLocalStorage } from "./localStorage";

const reducer = {
  app: appReducer,
  diagram: diagramReducer,
};

export type RootState = StateFromReducersMapObject<typeof reducer>;

const preloadedState: RootState = appLocalStorage.loadState();

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
  preloadedState,
  devTools: { maxAge: 1000 },
});

export type AppDispatch = typeof store.dispatch;
