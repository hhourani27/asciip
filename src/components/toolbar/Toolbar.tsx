import { AppBar as MuiAppBar, Toolbar as MuiToolbar, Box } from "@mui/material";
import { ToolbarTools } from "./ToolbarTools";
import { ToolbarStyleMode } from "./ToolbarStyleMode";

import { ToolbarStyles } from "./ToolbarStyles";
import { ToolbarDiagrams } from "./ToolbarDiagrams";
import { ToolbarExport } from "./ToolbarExport";

export default function Toolbar() {
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
          <ToolbarExport />
          <ToolbarDiagrams />
        </Box>
      </MuiToolbar>
    </MuiAppBar>
  );
}
