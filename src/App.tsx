import React, { useEffect } from "react";
import { Box } from "@mui/material";
import Toolbar from "./components/Toolbar";
import Canvas from "./components/canvas/Canvas";
import { useAppDispatch } from "./store/hooks";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {};

    const handleKeyUp = (event: KeyboardEvent) => {};

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Clean up the event listeners
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [dispatch]);

  return (
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
  );
}

export default App;
