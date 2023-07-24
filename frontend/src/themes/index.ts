import { createTheme as createMuiTheme, Theme } from "@mui/material/styles";

import type { ThemeVariant } from "../types";
import { checkThemeExists, getVariant } from "../utils/themeUtils";

import { white, black, transparent } from "./colors";
import typography from "./typography";
import { defaultVariant } from "./variants";

const createTheme = (variant: ThemeVariant) => {
  return createMuiTheme({
    spacing: 2,
    typography: typography,
    palette: {
      type: variant.type,
      primary: {
        main: variant.primaryColor,
      },
      secondary: {
        main: variant.secondaryColor,
      },
      header: {
        main: variant.headerColor,
      },
      background: {
        default: variant.backgroundColor,
        button: variant.buttonBackgroundColor || variant.secondaryColor,
        hover: variant.buttonHoverBackgroundColor || white,
        highlight: variant.highlight || transparent,
      },
      font: {
        button: variant.buttonFontColor || white,
        hover: variant.buttonHoverFontColor || black,
        text: variant.textFontColor || variant.primaryColor,
        initials: variant.initialFontColor || black,
      },
      border: {
        main: variant.borderColor || variant.secondaryColor,
      },
      sidebar: {
        icon: variant.sideBarIconColor || variant.secondaryColor,
        font: variant.sideBarFontColor || black,
        background: variant.sidebarBackgroundColor || white,
        indicator: variant.themeIndicator || variant.primaryColor,
      },
    },
    components: {
        MuiCssBaseline: {
          styleOverrides: `
          html {
            boxSizing: "initial",
          },
          body: {
            fontSize: "1rem",
            fontFamily: ${typography.fontFamily},
            height: "100%",
          },
          button: {
            cursor: "pointer",
            color: "inherit",
            backgroundColor: "inherit",
            border: "none",
            outline: "none",
            fontSize: "1rem",
            fontFamily: ${typography.fontFamily},
          },
          a: {
            color: ${variant.primaryColor},
            "&:hover": {
              color: ${variant.secondaryColor},
            },
          },
          "&::-webkit-scrollbar": {
            width: 8,
          },
          "&::-webkit-scrollbar-track": {
            "-webkit-box-shadow": "inset 0 0 5px white",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: ${variant.scrollColor},
            borderRadius: 12,
            "&:hover": {
              background: "#D5D5D5",
            },
          },
          .webchat__imageAvatar__image > img {
                width: 80% !important;
            }
            .webchat__stacked-layout__status > span {
                padding-top: 0;
            }
            .webchat__basic-transcript__filler {
                flex: 0 !important;
            }
            .webchat__bubble__nub-pad {
                width: 1px !important;
            }
            .webchat__stacked-layout__content {
                margin: 3px !important;
               
            }
            .webchat__bubble__content {
              margin: 5px !important;
              box-shadow: 0px 2px 3px -1px rgba(0,0,0,0.2), 0px 0px 4px 1px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12) !important;

            }
            .webchat__basic-transcript__scrollable::-webkit-scrollbar {
                background-color: #ffad3445;
                width: 8px;
            }
            .webchat__basic-transcript__scrollable::-webkit-scrollbar-track {
                -webkit-box-shadow: inset 0 0 5px white;
            }
            .webchat__basic-transcript__scrollable::-webkit-scrollbar-thumb {
                background-color: #cfcfcf;
                border-radius: 12px;
                &:hover {
                  background: #D5D5D5;
                }
        `,
      }
    },
  });
};

type ThemeMap = {
  [key: string]: Theme;
};

const themes: ThemeMap = {
  [defaultVariant.id]: createTheme(defaultVariant),
};

export const getTheme = (themeId: string): Theme => {
  themeId = checkThemeExists(themeId);
  const theme = themes[themeId];
  if (theme) return theme;
  const variant = getVariant(themeId);
  const newTheme = createTheme(variant);
  themes[themeId] = newTheme;
  return themes[themeId];
};

export const getDefaultTheme = (): Theme => {
  return themes[defaultVariant.id];
};
