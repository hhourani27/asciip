import { ButtonGroup, IconButton, Tooltip } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import { diagramActions } from "../../store/diagramSlice";

export function FooterHistory(): JSX.Element {
  const dispatch = useAppDispatch();

  const inSelectMode = useAppSelector(
    (state) => state.diagram.selectedTool === "SELECT"
  );
  const canUndo = useAppSelector((state) => state.diagram.historyIdx > 0);
  const canRedo = useAppSelector(
    (state) => state.diagram.historyIdx < state.diagram.history.length - 1
  );

  return (
    <ButtonGroup size="small">
      <Tooltip title="Undo (Ctrl+Z)" arrow>
        <span>
          <IconButton
            aria-label="Undo"
            size="medium"
            disabled={!canUndo || !inSelectMode}
            onClick={() => dispatch(diagramActions.moveInHistory("UNDO"))}
          >
            <UndoIcon fontSize="inherit" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Redo (Ctrl+Y)" arrow>
        <span>
          <IconButton
            aria-label="Redo"
            size="medium"
            disabled={!canRedo || !inSelectMode}
            onClick={() => dispatch(diagramActions.moveInHistory("REDO"))}
          >
            <RedoIcon fontSize="inherit" />
          </IconButton>
        </span>
      </Tooltip>
    </ButtonGroup>
  );
}
