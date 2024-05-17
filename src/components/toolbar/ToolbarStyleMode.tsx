import { ToggleButtonGroup, ToggleButton, Tooltip } from "@mui/material";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { diagramActions } from "../../store/diagramSlice";
import { StyleMode } from "../../models/style";

export function ToolbarStyleMode(): JSX.Element {
  const dispatch = useAppDispatch();

  const styleMode = useAppSelector((state) => state.diagram.styleMode);

  const handleStyleModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newStyleMode: StyleMode | null
  ) => {
    if (newStyleMode != null && newStyleMode !== styleMode) {
      dispatch(diagramActions.setStyleMode(newStyleMode));
    }
  };

  return (
    <ToggleButtonGroup
      value={styleMode}
      exclusive
      onChange={handleStyleModeChange}
      size="small"
    >
      <Tooltip
        title="This mode ensures diagrams are displayed correctly on most monospaced fonts but limits your styling options"
        arrow
      >
        <ToggleButton value="ASCII" aria-label="ASCII">
          ASCII
        </ToggleButton>
      </Tooltip>
      <Tooltip
        title="This mode offers more styling options but may not display correctly on some monospaced fonts (hover over style options for details)."
        arrow
      >
        <ToggleButton value="UNICODE" aria-label="Unicode">
          Unicode
        </ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>
  );
}
