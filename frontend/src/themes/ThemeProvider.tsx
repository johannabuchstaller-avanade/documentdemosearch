import React, { PropsWithChildren } from "react";

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

import { useSelector } from 'react-redux';
import { RootState } from '../store';

import { getTheme } from "themes";

type ThemeProviderProps = PropsWithChildren<{}>;

const ThemeProvider = (props: ThemeProviderProps): React.ReactElement => {
  const { children } = props;
  const themeId = useSelector((state: RootState) => state.ui.themeId);

  const theme = getTheme(themeId);
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default ThemeProvider;
