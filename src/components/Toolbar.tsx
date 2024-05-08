import React from "react";
import {
  AppBar,
  ToggleButtonGroup,
  Toolbar as MuiToolbar,
  ToggleButton,
} from "@mui/material";
import Crop54Icon from "@mui/icons-material/Crop54";

export default function Toolbar() {
  return (
    <AppBar position="static">
      <MuiToolbar>
        <ToggleButtonGroup>
          <ToggleButton value="left" aria-label="left aligned">
            <Crop54Icon />
          </ToggleButton>
        </ToggleButtonGroup>
      </MuiToolbar>
    </AppBar>
  );
}
