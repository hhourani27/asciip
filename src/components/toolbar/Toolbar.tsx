import {
  AppBar as MuiAppBar,
  Toolbar as MuiToolbar,
  ButtonGroup,
  IconButton,
  Box,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { ToolbarTools } from "./ToolbarTools";
import { ToolbarStyleMode } from "./ToolbarStyleMode";

import { useAppDispatch } from "../../store/hooks";
import { appActions } from "../../store/appSlice";

export default function Toolbar() {
  const dispatch = useAppDispatch();

  return (
    <MuiAppBar
      position="static"
      // sx={{ flexGrow: 0, flexShrink: 0, flexBasis: "auto" }}
    >
      <MuiToolbar sx={{ justifyContent: "space-between" }}>
        <Box id="left-buttons" sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
          <ToolbarTools />
          <ToolbarStyleMode />
        </Box>
        <ButtonGroup>
          <IconButton
            onClick={() => dispatch(appActions.openExport())}
            aria-label="Export"
          >
            <FileDownloadIcon />
          </IconButton>
        </ButtonGroup>
      </MuiToolbar>
    </MuiAppBar>
  );
}
