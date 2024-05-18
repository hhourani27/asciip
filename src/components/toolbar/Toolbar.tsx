import {
  AppBar as MuiAppBar,
  Toolbar as MuiToolbar,
  Box,
  Divider,
} from "@mui/material";
import { ToolbarTools } from "./ToolbarTools";
import { ToolbarStyleMode } from "./ToolbarStyleMode";

import { ToolbarStyles } from "./ToolbarStyles";
import { ToolbarDiagrams } from "./ToolbarDiagrams";
import { ToolbarExport } from "./ToolbarExport";
import { ToolbarOrder } from "./ToolbarOrder";

export default function Toolbar() {
  return (
    <MuiAppBar position="static">
      <MuiToolbar sx={{ justifyContent: "space-between" }}>
        <Box
          id="left-toolbar"
          sx={{ flexGrow: 1, display: "flex", alignItems: "center", gap: 3 }}
        >
          <ToolbarTools />
          <Divider orientation="vertical" flexItem />
          <ToolbarStyles />
          <Divider orientation="vertical" flexItem />
          <ToolbarStyleMode />
          <Divider orientation="vertical" flexItem />
          <ToolbarOrder />
        </Box>
        <Box
          id="right-toolbar"
          sx={{ flexGrow: 0, display: "flex", alignItems: "center", gap: 2 }}
        >
          <ToolbarExport />
          <ToolbarDiagrams />
        </Box>
      </MuiToolbar>
    </MuiAppBar>
  );
}
