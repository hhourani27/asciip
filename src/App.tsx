import React from "react";
import "./App.css";
import {
  AppBar,
  Box,
  ToggleButtonGroup,
  Toolbar,
  ToggleButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

function App() {
  const [alignment, setAlignment] = React.useState<string | null>("left");

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    setAlignment(newAlignment);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={handleAlignment}
          >
            <ToggleButton value="left" aria-label="left aligned">
              <MenuIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default App;
