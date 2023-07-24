import { ThemeVariant } from "../types";

import { white, black } from "./colors";

export const defaultVariant: ThemeVariant = {
  name: "Light Theme",
  id: "light",
  type: "light",
  primaryColor: "#007fff",
  secondaryColor: "#ee650b",
  backgroundColor: "rgb(242,242,242)",
  headerColor: "#fff",
  scrollColor: "#cfcfcf",
  themeIndicator: "#007fff",
  highlight: "black",
  buttonFontColor: "white",
  buttonBackgroundColor: "#007fff",
  textFontColor: "black",
  buttonHoverBackgroundColor: "rgba(255,255,255,0.7)",
  initialFontColor: white,
  sidebarBackgroundColor: white,
  sideBarIconColor: "#007fff",
};

export const darkVariant: ThemeVariant = {
  name: "Dark Theme",
  id: "dark",
  type: "dark",
  primaryColor: "#00b199",
  secondaryColor: "#08c7c7",
  backgroundColor: "#e9e9e9",
  headerColor: "#07151e",
  scrollColor: "#00ffd4",
  borderColor: white,
  themeIndicator: "#00b199",
  highlight: "white",
  buttonFontColor: "white",
  buttonBackgroundColor: "#ee650b",
  textFontColor: "white",
  buttonHoverBackgroundColor: "rgba(0,0,0,0.7)",
  initialFontColor: black,
  sidebarBackgroundColor: "#07151e",
  sideBarIconColor: white,
};

const variants = [
  defaultVariant,
  darkVariant,
];

export default variants;
