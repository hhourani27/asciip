import { ButtonGroup, IconButton, Tooltip } from "@mui/material";
import { useAppDispatch } from "../../store/hooks";
import SettingsOverscanIcon from "@mui/icons-material/SettingsOverscan";
import FitScreenIcon from "@mui/icons-material/FitScreen";
import { diagramActions } from "../../store/diagramSlice";

export function FooterCanvasSize(): JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <ButtonGroup size="small">
      <Tooltip title="Expand canvas" arrow>
        <IconButton
          aria-label="expand canvas"
          size="medium"
          onClick={() => dispatch(diagramActions.expandCanvas())}
        >
          <SettingsOverscanIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Shrink canvas to fit" arrow>
        <IconButton
          aria-label="Shrink canvas to fit"
          size="medium"
          onClick={() => dispatch(diagramActions.shrinkCanvasToFit())}
        >
          <FitScreenIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
    </ButtonGroup>
  );
}
