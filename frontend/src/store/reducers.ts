import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import localStorage from "redux-persist/es/storage";

import { uiReducer } from "./ui/slice";
import { userReducer } from "./user/slice";

const uiPersistConfig = {
  key: "ui",
  storage,
  whitelist: ["themeId", "themeNumber"],
};

const userPersistConfig = {
  key: 'User',
  storage: localStorage
}

const reducers = {
  ui: persistReducer(uiPersistConfig, uiReducer),
  user: persistReducer(userPersistConfig, userReducer)
};

export default combineReducers(reducers);
