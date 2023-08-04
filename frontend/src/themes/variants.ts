import { ThemeVariant } from "../types";

import { white, black } from "./colors";

export const defaultVariant: ThemeVariant = {
  name: "Light Theme",
  id: "light",
  type: "light",
  primaryColor: "#449f7b",
  secondaryColor: "#370375",
  backgroundColor: "rgb(242,242,242)",
  headerColor: "#fff",
  scrollColor: "#f9e9bb",
  themeIndicator: "#449f7b",
  highlight: "black",
  buttonFontColor: "white",
  buttonBackgroundColor: "#449f7b",
  textFontColor: "black",
  buttonHoverBackgroundColor: "rgba(255,255,255,0.7)",
  initialFontColor: white,
  sidebarBackgroundColor: white,
  sideBarIconColor: "#449f7b",
};

export const darkVariant: ThemeVariant = {
  name: "Dark Theme",
  id: "dark",
  type: "dark",
  primaryColor: "#449f7b",
  secondaryColor: "#370375",
  backgroundColor: "rgb(242,242,242)",
  headerColor: "#fff",
  scrollColor: "#f9e9bb",
  themeIndicator: "#449f7b",
  highlight: "black",
  buttonFontColor: "white",
  buttonBackgroundColor: "#449f7b",
  textFontColor: "black",
  buttonHoverBackgroundColor: "rgba(255,255,255,0.7)",
  initialFontColor: white,
  sidebarBackgroundColor: white,
  sideBarIconColor: "#449f7b",
};

const variants = [
  defaultVariant,
  darkVariant,
];

export default variants;
