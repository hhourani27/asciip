import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { appActions, appSelectors } from "../../store/appSlice";
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
  const selectedShapeObj = useAppSelector((state) =>
    appSelectors.selectedShapeObj(state)
  );

  const isLineStyleSelectEnabled = (): boolean => {
    if (styleMode === "ASCII") return false;

    if (
      selectedTool === "RECTANGLE" ||
      selectedTool === "LINE" ||
      selectedTool === "MULTI_SEGMENT_LINE"
    )
      return true;

    const selectedShape = selectedShapeObj?.shape;
    if (
      selectedShape &&
      selectedTool === "SELECT" &&
      (selectedShape.type === "RECTANGLE" ||
        selectedShape.type === "LINE" ||
        selectedShape.type === "MULTI_SEGMENT_LINE")
    )
      return true;

    return false;
  };

  const isArrowStyleSelectEnabled = (): boolean => {
    if (styleMode === "ASCII") return false;

    if (selectedTool === "LINE" || selectedTool === "MULTI_SEGMENT_LINE")
      return true;

    const selectedShape = selectedShapeObj?.shape;
    if (
      selectedShape &&
      selectedTool === "SELECT" &&
      (selectedShape.type === "LINE" ||
        selectedShape.type === "MULTI_SEGMENT_LINE")
    )
      return true;

    return false;
  };

  const isArrowHeadSelectEnabled = (): boolean => {
    if (selectedTool === "LINE" || selectedTool === "MULTI_SEGMENT_LINE")
      return true;

    const selectedShape = selectedShapeObj?.shape;
    if (
      selectedShape &&
      selectedTool === "SELECT" &&
      (selectedShape.type === "LINE" ||
        selectedShape.type === "MULTI_SEGMENT_LINE")
    )
      return true;

    return false;
  };

  const handleLineStyleChange = (event: SelectChangeEvent<LINE_STYLE>) => {
    const selectedShapeId: string | undefined = selectedShapeObj
      ? selectedShapeObj.id
      : undefined;

    if (event.target.value)
      dispatch(
        appActions.setStyle({
          style: { lineStyle: event.target.value as LINE_STYLE },
          shapeId: selectedShapeId,
        })
      );
  };

  const handleArrowStyleChange = (event: SelectChangeEvent<ARROW_STYLE>) => {
    const selectedShapeId: string | undefined = selectedShapeObj
      ? selectedShapeObj.id
      : undefined;

    if (event.target.value)
      dispatch(
        appActions.setStyle({
          style: { arrowStyle: event.target.value as ARROW_STYLE },
          shapeId: selectedShapeId,
        })
      );
  };

  const handleArrowHeadStyleChange = (event: SelectChangeEvent<string>) => {
    const selectedShapeId: string | undefined = selectedShapeObj
      ? selectedShapeObj.id
      : undefined;

    if (event.target.value === "NONE") {
      dispatch(
        appActions.setStyle({
          style: {
            arrowStartHead: false,
            arrowEndHead: false,
          },
          shapeId: selectedShapeId,
        })
      );
    } else if (event.target.value === "END") {
      dispatch(
        appActions.setStyle({
          style: { arrowStartHead: false, arrowEndHead: true },
          shapeId: selectedShapeId,
        })
      );
    } else if (event.target.value === "START") {
      dispatch(
        appActions.setStyle({
          style: { arrowStartHead: true, arrowEndHead: false },
          shapeId: selectedShapeId,
        })
      );
    } else if (event.target.value === "START_END") {
      dispatch(
        appActions.setStyle({
          style: { arrowStartHead: true, arrowEndHead: true },
          shapeId: selectedShapeId,
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
      <FormControl
        size="small"
        sx={{ minWidth: "100px" }}
        disabled={!isLineStyleSelectEnabled()}
      >
        <InputLabel id="line-style-label">Line style</InputLabel>
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
      <FormControl
        size="small"
        sx={{ minWidth: "100px" }}
        disabled={!isArrowHeadSelectEnabled()}
      >
        <InputLabel id="arrow-head-label">Arrow head</InputLabel>
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
      <FormControl
        size="small"
        sx={{ minWidth: "100px" }}
        disabled={!isArrowStyleSelectEnabled()}
      >
        <InputLabel id="arrow-style-label">Head style</InputLabel>
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
    </Box>
  );
}
