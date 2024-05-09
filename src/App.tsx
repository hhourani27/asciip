import React from "react";
import { Box } from "@mui/material";
import Toolbar from "./components/Toolbar";
import { store } from "./store/store";
import { Provider } from "react-redux";
import Canvas from "./components/canvas/Canvas";

function App() {
  return (
    <Provider store={store}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          height: "100vh",
          width: "100vw",
        }}
      >
        <Toolbar />
        <Canvas />
      </Box>
    </Provider>
  );
}

export default App;
