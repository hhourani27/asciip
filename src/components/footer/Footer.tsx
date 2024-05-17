import { IconButton, Paper, Tooltip } from "@mui/material";
import SettingsOverscanIcon from "@mui/icons-material/SettingsOverscan";
import FitScreenIcon from "@mui/icons-material/FitScreen";
import { diagramActions } from "../../store/diagramSlice";
import { useAppDispatch } from "../../store/hooks";
import { FooterTip } from "./FooterTip";

export function Footer(): JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <Paper
      component="footer"
      sx={{
        display: "flex",
        alignItems: "center",
        py: 0,
        px: 3,
      }}
    >
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
      <FooterTip />
    </Paper>
  );
}
