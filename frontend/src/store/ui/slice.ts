import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "store";
import { IToast, IUIState } from "./types";
import { appConfig } from "config";

const initialState: IUIState = {
  themeNumber: 0,
  themeId: "default",
  themeChooserOpen: false,
  sidebarOpen: false,
  textfieldquery: "",
  toast: {} as IToast,
  searchlang: "EN",
  openDialog: false,
  chatOpen: false,
  appQuery: "",
  context: [],
  metadata: [],
  loading: true,
  searchType: appConfig.searchVariables.searchType
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    changeTheme(state, action: PayloadAction<string>) {
      state.themeId = action.payload;
    },
    changeThemeNumber(state, action: PayloadAction<number>) {
      state.themeNumber = action.payload;
    },
    openToast(state, action: PayloadAction<IToast>) {
      state.toast = action.payload;
    },
    closeToast(state) {
      state.toast.open = false;
    },
    toggleThemeChooser(state) {
      state.themeChooserOpen = !state.themeChooserOpen;
    },
    closeThemeChooser(state) {
      state.themeChooserOpen = false;
    },
    openSidebar(state) {
      state.sidebarOpen = true;
    },
    closeSidebar(state) {
      state.sidebarOpen = false;
    },
    setTextfield(state, action: PayloadAction<string>) {
      state.textfieldquery = action.payload;
    },
    setSearchLang(state, action: PayloadAction<string>) {
      state.searchlang = action.payload;
    },
    openDialog(state) {
      state.openDialog = true;
    },
    closeDialog(state) {
      state.openDialog = false;
    },
    openChat(state) {
      state.chatOpen = true;
    },
    closeChat(state) {
      state.chatOpen = false;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.appQuery = action.payload;
    },
    emptySearchQuery(state) {
      state.appQuery = "";
    },
    setContextData(state, action: PayloadAction<Array<string>>) {
      state.context = action.payload;
    },
    setMetadata(state, action: PayloadAction<Array<Object>>) {
      state.metadata = action.payload;
    },
    clearSearchData(state) {
      state.appQuery = "";
      state.context = [];
      state.metadata = [];
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setSearchType(state, action: PayloadAction<string>) {
      state.searchType = action.payload;
    }
  },
});

export const {
  changeTheme,
  changeThemeNumber,
  toggleThemeChooser,
  closeThemeChooser,
  closeSidebar,
  closeToast,
  openSidebar,
  openToast,
  setTextfield,
  setSearchLang,
  openDialog,
  closeDialog,
  openChat,
  closeChat,
  setSearchQuery,
  emptySearchQuery,
  setContextData,
  setMetadata,
  clearSearchData,
  setLoading,
  setSearchType
} = uiSlice.actions;

export const selectToastState = (state: RootState): IToast => state.ui.toast;
export const selectThemeId = (state: RootState): string => state.ui.themeId;
export const selectTextfieldState = (state: RootState): string => state.ui.textfieldquery;
export const selectThemeNumber = (state: RootState): number => state.ui.themeNumber;
export const selectSidebarOpen = (state: RootState): boolean => state.ui.sidebarOpen;
export const selectThemeChooserOpen = (state: RootState): boolean => state.ui.themeChooserOpen;
export const selectSearchLang = (state: RootState): string => state.ui.searchlang;
export const selectOpenDialog = (state: RootState): boolean => state.ui.openDialog;
export const selectChatOpen = (state: RootState): boolean => state.ui.chatOpen;
export const selectAppQuery = (state: RootState): string => state.ui.appQuery;
export const selectContext = (state: RootState): Array<string> => state.ui.context;
export const selectMetadata = (state: RootState): Array<Object> => state.ui.metadata;
export const selectLoading = (state: RootState): boolean => state.ui.loading;
export const selectSearchType = (state: RootState): string => state.ui.searchType;


export const uiReducer = uiSlice.reducer;
