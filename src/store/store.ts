import { StateFromReducersMapObject, configureStore } from "@reduxjs/toolkit";
import { diagramReducer } from "./diagramSlice";
import { appReducer } from "./appSlice";
import { listenerMiddleware } from "./middleware";
import { appLocalStorage } from "./localStorage";
import { createLogger } from "redux-logger";

const reducer = {
  app: appReducer,
  diagram: diagramReducer,
};

export type RootState = StateFromReducersMapObject<typeof reducer>;

const preloadedState: RootState = appLocalStorage.loadState();

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => {
    const mdws = [listenerMiddleware.middleware];
    if (process.env.NODE_ENV === "development") {
      mdws.push(
        createLogger({
          predicate: (getState, action) =>
            action.type !== "diagram/onCellHover",
        })
      );
    }
    return getDefaultMiddleware().prepend(...mdws);
  },
  preloadedState,
  devTools: { maxAge: 1000 },
});

export type AppDispatch = typeof store.dispatch;
