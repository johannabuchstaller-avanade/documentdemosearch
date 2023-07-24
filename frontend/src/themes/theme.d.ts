/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Palette, PaletteColor, TypeBackground } from "@mui/material/styles/createPalette";
import { Theme } from '@mui/material/styles/createMuiTheme'

declare module "@mui/material/styles/createPalette" {
  export interface TypeBackground {
    image?: string;
    sendBox?: string;
    border?: string;
    button?: string;
    hover?: string;
    highlight?: string;
  }

  export interface Palette {
    type?: string;
    header: Palette["primary"];
    font: {
      user: string;
      bot: string;
      timestamp: string;
      button: string;
      hover: string;
      text: string;
      initials: string;
    };
    sidebar: {
      icon: string;
      font: string;
      background: string;
      indicator: string;
    };
    border: Palette["primary"];
  }

  export interface PaletteOptions {
    type?: string;
    header: PaletteOptions["primary"];
    font: {
      button: string;
      hover: string;
      text: string;
      initials: string;
    };
    sidebar: {
      icon: string;
      font: string;
      background: string;
      indicator: string;
    };
    border: PaletteOptions["primary"];
  }
}

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    overrides: {
      MuiCard: {
        root: {
          width: React.CSSProperties['width']
          height: React.CSSProperties['height']
          margin: React.CSSProperties['margin']
        }
      }
    }
  }

  interface ThemeOptions {
    overrides: {
      MuiCard: {
        root: {
          width: React.CSSProperties['width']
          height: React.CSSProperties['height']
          margin: React.CSSProperties['margin']
        }
      }
    }
  }
}