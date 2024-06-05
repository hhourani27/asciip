import { ThemeOptions, createTheme } from "@mui/material/styles";
import "@mui/material";

/* Create the app's theme*/
const themeOptions: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#12131c",
    },
    secondary: {
      main: "#c4c7fa",
    },
  },
};

const theme = createTheme(themeOptions);

/* Extend the theme and add canvas properties to the theme */
declare module "@mui/material/styles" {
  interface Theme {
    canvas: {
      background: string;
      grid: string;
      selectBox: string;
      shape: string;
      createdShape: string;
      selectedShape: string;
    };
  }
  interface ThemeOptions {
    canvas?: {
      background?: string;
      grid: string;
      selectBox: string;
      shape: string;
      createdShape: string;
      selectedShape: string;
    };
  }
}

// Note: I did not add the "canvas" property to "palette", as MUI has a specific format for "palette" (main, light, dark...)
const themeWithCanvas = createTheme(theme, {
  canvas: {
    background: theme.palette.background.default,
    grid: theme.palette.grey[900],
    selectBox: theme.palette.grey[500],
    shape: theme.palette.grey[300],
    createdShape: theme.palette.info.main,
    selectedShape: theme.palette.info.main,
  },
});

export { themeWithCanvas as theme };
