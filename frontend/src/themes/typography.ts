import { TypographyOptions } from "@mui/material/styles/createTypography";

const fontFamily = (fonts: string[]) => fonts.map(font => `'${font}'`).join(", ");

const typography: TypographyOptions = {
  fontFamily: fontFamily(["Roboto", "Urbanist", "Arial", "Calibri", "Helvetica Neue", "sans-serif"]),
};

export default typography;
