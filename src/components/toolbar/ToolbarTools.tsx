import { ToggleButtonGroup, ToggleButton } from "@mui/material";
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
      <ToggleButton value="SELECT" aria-label="Select tool">
        <TouchAppIcon />
      </ToggleButton>
      <ToggleButton value="RECTANGLE" aria-label="Create Rectangle">
        <Crop54Icon />
      </ToggleButton>
      <ToggleButton value="LINE" aria-label="Create Simple Line">
        <HorizontalRuleIcon />
      </ToggleButton>
      <ToggleButton
        value="MULTI_SEGMENT_LINE"
        aria-label="Create Multi-segment Line"
      >
        <TimelineIcon />
      </ToggleButton>
      <ToggleButton value="TEXT" aria-label="Add Text">
        <TextFieldsIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
