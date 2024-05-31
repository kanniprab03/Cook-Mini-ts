import ReactDOM from "react-dom/client";
import "./index.css";
import("dotenv/config.js")
import RouteProvider from "./ui/Provider/RouteProvider.tsx";
import GlobalProvider from "./ui/Provider/index.tsx";
import { CssVarsProvider, extendTheme } from "@mui/joy";
import React from "react";

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          "50": "#fff3e0",
          "100": "#ffe0b2",
          "200": "#ffcc80",
          "300": "#ffb74d",
          "400": "#ffa726",
          "500": "#ff9800",
          "600": "#fb8c00",
          "700": "#f57c00",
          "800": "#ef6c00",
          "900": "#e65100",
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CssVarsProvider theme={theme}>
      <GlobalProvider>
        <RouteProvider />
      </GlobalProvider>
    </CssVarsProvider>
  </React.StrictMode>
);
