import React from "react";
import "./App.css";
import { Box } from "@mui/material";
import Toolbar from "./components/Toolbar";

function App() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Toolbar />
    </Box>
  );
}

export default App;
