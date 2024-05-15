import { ToggleButtonGroup, ToggleButton } from "@mui/material";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { appActions } from "../../store/appSlice";
import { StyleMode } from "../../models/style";

export function ToolbarStyleMode(): JSX.Element {
  const dispatch = useAppDispatch();

  const styleMode = useAppSelector((state) => state.app.styleMode);

  const handleStyleModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newStyleMode: StyleMode | null
  ) => {
    if (newStyleMode != null && newStyleMode !== styleMode) {
      dispatch(appActions.setStyleMode(newStyleMode));
    }
  };

  return (
    <ToggleButtonGroup
      value={styleMode}
      exclusive
      onChange={handleStyleModeChange}
      size="small"
    >
      <ToggleButton value="UNICODE" aria-label="Unicode">
        Unicode
      </ToggleButton>
      <ToggleButton value="ASCII" aria-label="ASCII">
        ASCII
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
