import React, { useEffect } from "react";
import { Box } from "@mui/material";
import Toolbar from "./components/Toolbar";
import Canvas from "./components/canvas/Canvas";
import { useAppDispatch } from "./store/hooks";
import { appActions } from "./store/appSlice";
import { ExportModal } from "./components/ExportModal";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && event.ctrlKey) {
        dispatch(appActions.onCtrlEnterPress());
      } else if (event.key === "Delete") {
        dispatch(appActions.onDeletePress());
      }
    };

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
      <ExportModal />
      <Canvas />
    </Box>
  );
}

export default App;
