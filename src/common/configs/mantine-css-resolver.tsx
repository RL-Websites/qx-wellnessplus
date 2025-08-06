import { CSSVariablesResolver } from "@mantine/core";

export const cssResolver: CSSVariablesResolver = () => ({
  variables: {
    "--input-height-md": "var(--input-height-md)",
    "--input-disabled-bg": "#FFFFFF",
  },
  light: {},
  dark: {},
});
