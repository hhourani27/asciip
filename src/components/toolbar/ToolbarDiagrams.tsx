import { Button, Menu, MenuItem } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { appActions, appSelectors } from "../../store/appSlice";
import { useState } from "react";

export function ToolbarDiagrams(): JSX.Element {
  const dispatch = useAppDispatch();

  const diagrams = useAppSelector((state) => state.app.diagrams);
  const activeDiagram = useAppSelector((state) =>
    appSelectors.activeDiagram(state)
  );

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleDiagramClick = (diagramId: string) => {
    if (diagramId !== activeDiagram.id) {
      dispatch(appActions.setActiveDiagram(diagramId));
    }
    setMenuAnchorEl(null);
  };

  const handleClose = () => {
    setMenuAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="diagrams-button"
        aria-controls={menuOpen ? "diagrams-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? "true" : undefined}
        variant="text"
        color="inherit"
        sx={{ textTransform: "capitalize" }}
        onClick={handleClick}
      >
        {activeDiagram.name}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {diagrams.map((diagram) => (
          <MenuItem
            key={diagram.id}
            onClick={() => handleDiagramClick(diagram.id)}
          >
            {diagram.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
