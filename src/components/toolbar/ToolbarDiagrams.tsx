import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { appActions, appSelectors } from "../../store/appSlice";
import { useState } from "react";
import SchemaIcon from "@mui/icons-material/Schema";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";

export function ToolbarDiagrams(): JSX.Element {
  const dispatch = useAppDispatch();

  const diagrams = useAppSelector((state) => state.app.diagrams);
  const activeDiagram = useAppSelector((state) =>
    appSelectors.activeDiagram(state)
  );

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);

  const [diagramFormOpen, setDiagramFormOpen] = useState<boolean>(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleDiagramClick = (diagramId: string): void => {
    if (diagramId !== activeDiagram.id) {
      dispatch(appActions.setActiveDiagram(diagramId));
    }
    setMenuAnchorEl(null);
  };

  const handleNewDiagramClick = () => {
    setDiagramFormOpen(true);
  };

  const handleDiagramFormClose = () => {
    setDiagramFormOpen(false);
  };

  const handleMenuClose = () => {
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
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {diagrams.map((diagram) => (
          <MenuItem
            key={diagram.id}
            onClick={() => handleDiagramClick(diagram.id)}
          >
            <ListItemIcon>
              <SchemaIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText> {diagram.name}</ListItemText>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleNewDiagramClick}>
          <ListItemIcon>
            <AddBoxOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add new diagram</ListItemText>
        </MenuItem>
      </Menu>
      <Dialog
        open={diagramFormOpen}
        onClose={handleDiagramFormClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const name = formJson.name;
            dispatch(appActions.addDiagram(name));
            handleDiagramFormClose();
          },
        }}
      >
        <DialogTitle>New Diagram</DialogTitle>
        <DialogContent>
          <DialogContentText>Chose the diagram name.</DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="diagram_name"
            name="name"
            label="Diagram name"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDiagramFormClose}>Cancel</Button>
          <Button type="submit">Subscribe</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
