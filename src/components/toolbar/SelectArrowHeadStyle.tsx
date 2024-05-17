import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { diagramActions, diagramSelectors } from "../../store/diagramSlice";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { ARROW_STYLE } from "../../models/style";

export function SelectArrowHeadStyle(): JSX.Element {
  const dispatch = useAppDispatch();

  const styleMode = useAppSelector((state) => state.diagram.styleMode);
  const globalStyle = useAppSelector((state) => state.diagram.globalStyle);
  const selectedTool = useAppSelector((state) => state.diagram.selectedTool);
  const selectedShapeObj = useAppSelector((state) =>
    diagramSelectors.selectedShapeObj(state)
  );

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

  return (
    <FormControl
      variant="standard"
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
  );
}
