import {
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { appActions, appSelectors } from "../../store/appSlice";
import { useState } from "react";
import SchemaIcon from "@mui/icons-material/Schema";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { DeleteDiagramConfirmationDialog } from "../dialogs/DeleteDiagramConfirmationDialog";
import { CreateDiagramFormDialog } from "../dialogs/CreateDiagramFormDialog";
import { RenameDiagramFormDialog } from "../dialogs/RenameDiagramFormDialog";

export function ToolbarDiagrams(): JSX.Element {
  const dispatch = useAppDispatch();

  const diagrams = useAppSelector((state) => state.app.diagrams);
  const activeDiagram = useAppSelector((state) =>
    appSelectors.activeDiagram(state)
  );
  const deleteDiagramInProgress = useAppSelector(
    (state) => state.app.deleteDiagramInProgress
  );
  const renameDiagramInProgress = useAppSelector(
    (state) => state.app.renameDiagramInProgress
  );
  const createDiagramInProgress = useAppSelector(
    (state) => state.app.createDiagramInProgress
  );

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDiagramClick = (diagramId: string): void => {
    if (diagramId !== activeDiagram.id) {
      dispatch(appActions.setActiveDiagram(diagramId));
    }
    setMenuAnchorEl(null);
  };

  const handleCreateDiagram = () => {
    dispatch(appActions.startCreateDiagram());
  };

  const handleDeleteDiagram = (diagramId: string) => {
    dispatch(appActions.startDeleteDiagram(diagramId));
  };

  const handleRenameDiagram = (diagramId: string) => {
    dispatch(appActions.startRenameDiagram(diagramId));
  };

  return (
    <div>
      <Button
        id="diagram-list"
        aria-controls={menuOpen ? "diagrams-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? "true" : undefined}
        variant="text"
        color="inherit"
        sx={{ textTransform: "capitalize" }}
        onClick={handleMenuOpen}
        endIcon={<ExpandMoreIcon />}
      >
        {activeDiagram.name}
      </Button>
      <Menu
        id="diagrams-menu"
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
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
            <Box sx={{ paddingLeft: "20px" }}>
              <ListItemIcon>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRenameDiagram(diagram.id);
                  }}
                >
                  <DriveFileRenameOutlineIcon />
                </IconButton>
              </ListItemIcon>
              <ListItemIcon>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteDiagram(diagram.id);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemIcon>
            </Box>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleCreateDiagram}>
          <ListItemIcon>
            <AddBoxOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Create new diagram</ListItemText>
        </MenuItem>
      </Menu>
      {createDiagramInProgress && <CreateDiagramFormDialog />}
      {renameDiagramInProgress && <RenameDiagramFormDialog />}
      {deleteDiagramInProgress && <DeleteDiagramConfirmationDialog />}
    </div>
  );
}
