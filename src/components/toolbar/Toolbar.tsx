import {
  AppBar as MuiAppBar,
  Toolbar as MuiToolbar,
  IconButton,
  Box,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ToolbarTools } from "./ToolbarTools";
import { ToolbarStyleMode } from "./ToolbarStyleMode";

import { useAppDispatch } from "../../store/hooks";
import { diagramActions } from "../../store/diagramSlice";
import { ToolbarStyles } from "./ToolbarStyles";
import { ToolbarDiagrams } from "./ToolbarDiagrams";

export default function Toolbar() {
  const dispatch = useAppDispatch();

  return (
    <MuiAppBar
      position="static"
      // sx={{ flexGrow: 0, flexShrink: 0, flexBasis: "auto" }}
    >
      <MuiToolbar sx={{ justifyContent: "space-between" }}>
        <Box
          id="left-toolbar"
          sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 2 }}
        >
          <ToolbarTools />
          <ToolbarStyles />
          <ToolbarStyleMode />
        </Box>
        <Box
          id="right-toolbar"
          sx={{ flexGrow: 0, display: "flex", alignItems: "center", gap: 2 }}
        >
          <IconButton
            onClick={() => dispatch(diagramActions.openExport())}
            aria-label="Export"
          >
            <FileDownloadIcon />
          </IconButton>
          <ToolbarDiagrams />
        </Box>
      </MuiToolbar>
    </MuiAppBar>
  );
}
