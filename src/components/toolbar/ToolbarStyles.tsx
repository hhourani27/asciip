import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { diagramActions, diagramSelectors } from "../../store/diagramSlice";
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

  const styleMode = useAppSelector((state) => state.diagram.styleMode);
  const globalStyle = useAppSelector((state) => state.diagram.globalStyle);
  const selectedTool = useAppSelector((state) => state.diagram.selectedTool);
  const selectedShapeObj = useAppSelector((state) =>
    diagramSelectors.selectedShapeObj(state)
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
        diagramActions.setStyle({
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
        diagramActions.setStyle({
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
        diagramActions.setStyle({
          style: {
            arrowStartHead: false,
            arrowEndHead: false,
          },
          shapeId: selectedShapeId,
        })
      );
    } else if (event.target.value === "END") {
      dispatch(
        diagramActions.setStyle({
          style: { arrowStartHead: false, arrowEndHead: true },
          shapeId: selectedShapeId,
        })
      );
    } else if (event.target.value === "START") {
      dispatch(
        diagramActions.setStyle({
          style: { arrowStartHead: true, arrowEndHead: false },
          shapeId: selectedShapeId,
        })
      );
    } else if (event.target.value === "START_END") {
      dispatch(
        diagramActions.setStyle({
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
      {/* Line style*/}
      <FormControl
        size="small"
        sx={{ minWidth: "100px" }}
        disabled={!isLineStyleSelectEnabled()}
      >
        <InputLabel id="line-style-label">Line style</InputLabel>
        <Select
          labelId="line-style-label"
          id="line-style"
          value={selectedShapeObj?.style?.lineStyle ?? globalStyle.lineStyle}
          label="Line style"
          onChange={handleLineStyleChange}
        >
          <MenuItem value={"LIGHT"}>Light</MenuItem>
          <MenuItem value={"ASCII"}>ASCII</MenuItem>
          <MenuItem value={"HEAVY"}>Heavy</MenuItem>
        </Select>
      </FormControl>
      {/* Arrow head presence/absence */}
      <FormControl
        size="small"
        sx={{ minWidth: "100px" }}
        disabled={!isArrowHeadSelectEnabled()}
      >
        <InputLabel id="arrow-head-label">Arrow head</InputLabel>
        <Select
          labelId="arrow-head-label"
          id="arrow-head"
          value={
            selectedShapeObj?.style?.arrowStartHead !== undefined &&
            selectedShapeObj?.style?.arrowEndHead !== undefined
              ? getArrowHeadSelectValue(selectedShapeObj.style)
              : getArrowHeadSelectValue(globalStyle)
          }
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
      {/* Arrow head style*/}
      <FormControl
        size="small"
        sx={{ minWidth: "100px" }}
        disabled={!isArrowStyleSelectEnabled()}
      >
        <InputLabel id="arrow-style-label">Head style</InputLabel>
        <Select
          labelId="arrow-style-label"
          id="arrow-style"
          value={selectedShapeObj?.style?.arrowStyle ?? globalStyle.arrowStyle}
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
