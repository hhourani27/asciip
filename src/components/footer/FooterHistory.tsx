import { ButtonGroup, IconButton, Tooltip } from "@mui/material";
import { useAppDispatch } from "../../store/hooks";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import { diagramActions } from "../../store/diagramSlice";

export function FooterHistory(): JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <ButtonGroup size="small">
      <Tooltip title="Undo" arrow>
        <IconButton
          aria-label="Undo"
          size="medium"
          onClick={() => dispatch(diagramActions.moveInHistory("UNDO"))}
        >
          <UndoIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Redo" arrow>
        <IconButton
          aria-label="Redo"
          size="medium"
          onClick={() => dispatch(diagramActions.moveInHistory("REDO"))}
        >
          <RedoIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
    </ButtonGroup>
  );
}
