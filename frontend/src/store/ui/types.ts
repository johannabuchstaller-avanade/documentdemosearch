import { AlertColor } from "@mui/material/Alert";

export interface IToast {
  open: boolean;
  message: string;
  severity: AlertColor;
}

export interface IUIState {
  toast: IToast;
  themeId: string;
  themeNumber: number;
  themeChooserOpen: boolean;
  sidebarOpen: boolean;
  textfieldquery: string;
  searchlang: string;
  openDialog: boolean;
  chatOpen: boolean;
  appQuery: string;
  context: Array<string>;
  metadata: Array<Object>;
  loading: boolean;
  searchType: string;
}
