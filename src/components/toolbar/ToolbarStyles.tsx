import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { appActions } from "../../store/appSlice";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { ARROW_STYLE, LINE_STYLE, Style } from "../../models/style";

import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import WestIcon from "@mui/icons-material/West";
import EastIcon from "@mui/icons-material/East";
export function ToolbarStyles(): JSX.Element {
  const dispatch = useAppDispatch();

  const styleMode = useAppSelector((state) => state.app.styleMode);
  const globalStyle = useAppSelector((state) => state.app.globalStyle);
  const selectedTool = useAppSelector((state) => state.app.selectedTool);
  const selectedShapeId = useAppSelector((state) => state.app.selectedShapeId);

  const handleLineStyleChange = (event: SelectChangeEvent<LINE_STYLE>) => {
    if (event.target.value)
      dispatch(
        appActions.setStyle({
          style: { lineStyle: event.target.value as LINE_STYLE },
        })
      );
  };

  const handleArrowStyleChange = (event: SelectChangeEvent<ARROW_STYLE>) => {
    if (event.target.value)
      dispatch(
        appActions.setStyle({
          style: { arrowStyle: event.target.value as ARROW_STYLE },
        })
      );
  };

  const handleArrowHeadStyleChange = (event: SelectChangeEvent<string>) => {
    if (event.target.value === "NONE") {
      dispatch(
        appActions.setStyle({
          style: { arrowStartHead: false, arrowEndHead: false },
        })
      );
    } else if (event.target.value === "END") {
      dispatch(
        appActions.setStyle({
          style: { arrowStartHead: false, arrowEndHead: true },
        })
      );
    } else if (event.target.value === "START") {
      dispatch(
        appActions.setStyle({
          style: { arrowStartHead: true, arrowEndHead: false },
        })
      );
    } else if (event.target.value === "START_END") {
      dispatch(
        appActions.setStyle({
          style: { arrowStartHead: true, arrowEndHead: true },
        })
      );
    }
  };

  const getArrowHeadSelectValue = (style: Partial<Style>): string => {
    if (style.arrowEndHead && style.arrowStartHead) return "START_END";
    else if (style.arrowEndHead && !style.arrowStartHead) return "END";
    else if (!style.arrowEndHead && style.arrowStartHead) return "START";
    else return "NONE";
  };

  return (
    <Box>
      <FormControl size="small" sx={{ minWidth: "100px" }}>
        <InputLabel id="line-style-label">Line</InputLabel>
        <Select
          labelId="line-style-label"
          id="line-style"
          value={globalStyle.lineStyle}
          label="Line style"
          onChange={handleLineStyleChange}
        >
          <MenuItem value={"LIGHT"}>Light</MenuItem>
          <MenuItem value={"ASCII"}>ASCII</MenuItem>
          <MenuItem value={"HEAVY"}>Heavy</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: "100px" }}>
        <InputLabel id="arrow-style-label">Arrow</InputLabel>
        <Select
          labelId="arrow-style-label"
          id="arrow-style"
          value={globalStyle.arrowStyle}
          label="Arrow style"
          onChange={handleArrowStyleChange}
        >
          <MenuItem value={"FILLED"}>Filled</MenuItem>
          <MenuItem value={"ASCII"}>ASCII</MenuItem>
          <MenuItem value={"OUTLINED"}>Outlined</MenuItem>
        </Select>
      </FormControl>
      <FormControl size="small" sx={{ minWidth: "100px" }}>
        <InputLabel id="arrow-head-label">Head</InputLabel>
        <Select
          labelId="arrow-head-label"
          id="arrow-head"
          value={getArrowHeadSelectValue(globalStyle)}
          label="Arrow head"
          onChange={handleArrowHeadStyleChange}
        >
          <MenuItem value={"NONE"}>
            <HorizontalRuleIcon fontSize="small" />
            <HorizontalRuleIcon fontSize="small" />
          </MenuItem>
          <MenuItem value={"END"}>
            <HorizontalRuleIcon fontSize="small" />
            <EastIcon fontSize="small" />
          </MenuItem>
          <MenuItem value={"START"}>
            <WestIcon fontSize="small" />
            <HorizontalRuleIcon fontSize="small" />
          </MenuItem>
          <MenuItem value={"START_END"}>
            <WestIcon fontSize="small" />
            <EastIcon fontSize="small" />
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
