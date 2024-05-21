import { Tooltip, ButtonGroup, IconButton } from "@mui/material";
import FlipToFrontIcon from "@mui/icons-material/FlipToFront";
import FlipToBackIcon from "@mui/icons-material/FlipToBack";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { diagramActions, diagramSelectors } from "../../store/diagramSlice";

export function ToolbarOrder(): JSX.Element {
  const dispatch = useAppDispatch();

  const selectedShapeObj = useAppSelector((state) =>
    diagramSelectors.selectedShapeObj(state)
  );

  return (
    <ButtonGroup size="small">
      <Tooltip
        title={
          <span>
            {"Push shape to back"}
            <br />
            <em>{"Text is always in front of shapes"}</em>
          </span>
        }
        arrow
      >
        <span>
          <IconButton
            aria-label="push to back"
            disabled={!selectedShapeObj}
            onClick={() => dispatch(diagramActions.onMoveToBackButtonClick())}
          >
            <FlipToBackIcon />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip
        title={
          <span>
            {"Bring shape to front"}
            <br />
            <em>{"Text is always in front of shapes"}</em>
          </span>
        }
        arrow
      >
        <span>
          <IconButton
            aria-label="bring to front"
            disabled={!selectedShapeObj}
            onClick={() => dispatch(diagramActions.onMoveToFrontButtonClick())}
          >
            <FlipToFrontIcon />
          </IconButton>
        </span>
      </Tooltip>
    </ButtonGroup>
  );
}
