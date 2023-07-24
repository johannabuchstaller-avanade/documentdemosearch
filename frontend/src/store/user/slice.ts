import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "store";
import { IUserState, IUserData } from "store/user/types";

const initialState: IUserState = {
  data: { initials: "SB", datasource: "ABBYLibrary"} as IUserData,
  authenticated: false
}

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    initUserData(state, action: PayloadAction<IUserData>) {
      state.data = action.payload;
      console.log("initUserData", action.payload);
      localStorage.setItem('User', JSON.stringify(action.payload));
    },
    logoutUser(state) {
      state.data = {  
        initials: "",
        datasource: ""
      }
      localStorage.removeItem('User');
    },
    userAuthenticated(state) {
      state.authenticated = true;
    },
    userNotAuthenticated(state) {
      state.authenticated = false;
    },
  },
});

export const {
  initUserData,
  logoutUser,
  userAuthenticated,
  userNotAuthenticated
} = userSlice.actions;

export const selectUserData = (state: RootState): IUserData => state.user.data;
export const selectAuthentication = (state: RootState): boolean => state.user.authenticated;

export const userReducer = userSlice.reducer;
