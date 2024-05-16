import { ToggleButtonGroup, ToggleButton, Tooltip } from "@mui/material";
import Crop54Icon from "@mui/icons-material/Crop54";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import TimelineIcon from "@mui/icons-material/Timeline";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import TextFieldsIcon from "@mui/icons-material/TextFields";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { Tool, diagramActions } from "../../store/diagramSlice";

export function ToolbarTools(): JSX.Element {
  const dispatch = useAppDispatch();

  const selectedTool = useAppSelector((state) => state.diagram.selectedTool);

  const handleToolChange = (
    event: React.MouseEvent<HTMLElement>,
    newTool: Tool | null
  ) => {
    if (newTool != null && newTool !== selectedTool) {
      dispatch(diagramActions.setTool(newTool));
    }
  };

  return (
    <ToggleButtonGroup
      value={selectedTool}
      exclusive
      onChange={handleToolChange}
    >
      <Tooltip title="Select (S)" arrow>
        <ToggleButton value="SELECT" aria-label="Select tool">
          <TouchAppIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Add rectangle (R)" arrow>
        <ToggleButton value="RECTANGLE" aria-label="Create Rectangle">
          <Crop54Icon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Add line or arrow (A)" arrow>
        <ToggleButton value="LINE" aria-label="Create Simple Line">
          <HorizontalRuleIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Add multi-segment line (W)" arrow>
        <ToggleButton
          value="MULTI_SEGMENT_LINE"
          aria-label="Create Multi-segment Line"
        >
          <TimelineIcon />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Add text (T)" arrow>
        <ToggleButton value="TEXT" aria-label="Add Text">
          <TextFieldsIcon />
        </ToggleButton>
      </Tooltip>
    </ToggleButtonGroup>
  );
}
