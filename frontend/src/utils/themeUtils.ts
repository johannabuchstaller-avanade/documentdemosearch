import variants, { defaultVariant } from "themes/variants";
import type { ThemeVariant } from "types";

export const checkThemeExists = (themeId: string): string => {
  const variant = variants.filter(variant => variant.id === themeId)[0];
  if (variant) return themeId;
  return defaultVariant.id;
};

export const getVariant = (themeId: string): ThemeVariant => {
  const variant = variants.filter(variant => variant.id === themeId)[0];
  if (variant) return variant;
  return defaultVariant;
};