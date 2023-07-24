import { AnyAction, configureStore, ThunkDispatch } from "@reduxjs/toolkit";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";

import rootReducer from "./reducers";

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch &
  ThunkDispatch<RootState, undefined, AnyAction> &
  ThunkDispatch<RootState, null, AnyAction>;

export default store;
