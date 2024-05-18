import { Tooltip, ButtonGroup, IconButton } from "@mui/material";
import FlipToFrontIcon from "@mui/icons-material/FlipToFront";
import FlipToBackIcon from "@mui/icons-material/FlipToBack";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { diagramActions } from "../../store/diagramSlice";

export function ToolbarOrder(): JSX.Element {
  const dispatch = useAppDispatch();

  const selectedShapeId = useAppSelector(
    (state) => state.diagram.selectedShapeId
  );

  return (
    <ButtonGroup size="small">
      <Tooltip title="Push shape to back" arrow>
        <IconButton
          aria-label="push to back"
          disabled={selectedShapeId == null}
        >
          <FlipToBackIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Bring shape to front" arrow>
        <IconButton
          aria-label="bring to front"
          disabled={selectedShapeId == null}
          onClick={() => dispatch(diagramActions.onMoveToFrontButtonClick())}
        >
          <FlipToFrontIcon />
        </IconButton>
      </Tooltip>
    </ButtonGroup>
  );
}
