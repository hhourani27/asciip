import React from "react";
import "./App.css";
import { Box } from "@mui/material";
import Toolbar from "./components/Toolbar";
import { store } from "./store/store";
import { Provider } from "react-redux";

function App() {
  return (
    <Provider store={store}>
      <Box sx={{ flexGrow: 1 }}>
        <Toolbar />
      </Box>
    </Provider>
  );
}

export default App;
