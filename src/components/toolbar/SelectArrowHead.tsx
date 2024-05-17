import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { diagramActions, diagramSelectors } from "../../store/diagramSlice";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Style } from "../../models/style";

export function SelectArrowHead(): JSX.Element {
  const dispatch = useAppDispatch();

  const globalStyle = useAppSelector((state) => state.diagram.globalStyle);
  const selectedTool = useAppSelector((state) => state.diagram.selectedTool);
  const selectedShapeObj = useAppSelector((state) =>
    diagramSelectors.selectedShapeObj(state)
  );

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
    <FormControl
      variant="standard"
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
        <MenuItem value={"NONE"}>{"‒ ― ‒"}</MenuItem>
        <MenuItem value={"END"}>{"‒ ― ▶"}</MenuItem>
        <MenuItem value={"START"}>{"◀ ― ‒"}</MenuItem>
        <MenuItem value={"START_END"}>{"◀ ― ▶"}</MenuItem>
      </Select>
    </FormControl>
  );
}
