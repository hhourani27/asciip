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
import { ARROW_STYLE, LINE_STYLE } from "../../models/style";

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
          <MenuItem value={"OUTLINED"}>Outlined</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
