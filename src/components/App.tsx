import React, { useEffect } from "react";
import { Box } from "@mui/material";
import Toolbar from "./toolbar/Toolbar";
import Canvas from "./canvas/Canvas";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { diagramActions } from "../store/diagramSlice";
import { isShortcutsEnabled } from "../store/uiSelectors";
import { Footer } from "./footer/Footer";

function App() {
  const dispatch = useAppDispatch();

  const shortcutsEnabled = useAppSelector((state) => isShortcutsEnabled(state));

  // Centralize key presses listener in this component
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && event.ctrlKey) {
        dispatch(diagramActions.onCtrlEnterPress());
      } else if (event.key === "Delete") {
        dispatch(diagramActions.onDeletePress());
      }

      if (shortcutsEnabled) {
        if (event.key === "s" || event.key === "S") {
          dispatch(diagramActions.setTool("SELECT"));
        }
        if (event.key === "r" || event.key === "R") {
          dispatch(diagramActions.setTool("RECTANGLE"));
        }
        if (event.key === "a" || event.key === "A") {
          dispatch(diagramActions.setTool("LINE"));
        }
        if (event.key === "w" || event.key === "W") {
          dispatch(diagramActions.setTool("MULTI_SEGMENT_LINE"));
        }
        if (event.key === "t" || event.key === "T") {
          dispatch(diagramActions.setTool("TEXT"));
        }
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
  }, [dispatch, shortcutsEnabled]);

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
      <Footer />
    </Box>
  );
}

export default App;
