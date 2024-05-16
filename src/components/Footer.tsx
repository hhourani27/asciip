import { Box, IconButton, Tooltip } from "@mui/material";
import SettingsOverscanIcon from "@mui/icons-material/SettingsOverscan";

import { diagramActions } from "../store/diagramSlice";
import { useAppDispatch } from "../store/hooks";

export function Footer(): JSX.Element {
  const dispatch = useAppDispatch();

  return (
    <Box
      component="footer"
      sx={{
        py: 0,
        px: 3,
        backgroundColor: (theme) => theme.palette.grey[200],
      }}
    >
      <Tooltip title="Expand canvas">
        <IconButton
          aria-label="expand canvas"
          size="medium"
          onClick={() => dispatch(diagramActions.expandCanvas())}
        >
          <SettingsOverscanIcon fontSize="inherit" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
