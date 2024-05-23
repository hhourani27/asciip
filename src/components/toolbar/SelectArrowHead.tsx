import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { ShapeObject, diagramActions } from "../../store/diagramSlice";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Style } from "../../models/style";
import { selectors } from "../../store/selectors";
import _ from "lodash";

export function SelectArrowHead(): JSX.Element {
  const dispatch = useAppDispatch();

  const globalStyle = useAppSelector((state) => state.diagram.globalStyle);
  const selectedTool = useAppSelector((state) => state.diagram.selectedTool);
  const selectedShapeObjs: ShapeObject[] = useAppSelector((state) =>
    selectors.selectedShapeObjs(state.diagram)
  );

  const isArrowHeadSelectEnabled = (): boolean => {
    if (selectedTool === "LINE" || selectedTool === "MULTI_SEGMENT_LINE")
      return true;

    if (
      selectedTool === "SELECT" &&
      selectedShapeObjs.length > 0 &&
      selectedShapeObjs.every(
        (s) => s.shape.type === "LINE" || s.shape.type === "MULTI_SEGMENT_LINE"
      )
    )
      return true;

    return false;
  };

  const handleArrowHeadStyleChange = (event: SelectChangeEvent<string>) => {
    const shapeIds: string[] | undefined =
      selectedShapeObjs.length === 0
        ? undefined
        : selectedShapeObjs.map((so) => so.id);

    if (event.target.value === "NONE") {
      dispatch(
        diagramActions.setStyle({
          style: {
            arrowStartHead: false,
            arrowEndHead: false,
          },
          shapeIds,
        })
      );
    } else if (event.target.value === "END") {
      dispatch(
        diagramActions.setStyle({
          style: { arrowStartHead: false, arrowEndHead: true },
          shapeIds,
        })
      );
    } else if (event.target.value === "START") {
      dispatch(
        diagramActions.setStyle({
          style: { arrowStartHead: true, arrowEndHead: false },
          shapeIds,
        })
      );
    } else if (event.target.value === "START_END") {
      dispatch(
        diagramActions.setStyle({
          style: { arrowStartHead: true, arrowEndHead: true },
          shapeIds,
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

  const getValue = (): string | "" => {
    if (selectedShapeObjs.length === 0) {
      return getArrowHeadSelectValue(globalStyle);
    }

    const values = selectedShapeObjs.map((s) =>
      s.style?.arrowStartHead !== undefined &&
      s.style?.arrowEndHead !== undefined
        ? getArrowHeadSelectValue(s.style)
        : getArrowHeadSelectValue(globalStyle)
    );

    if (_.uniq(values).length === 1) {
      return values[0];
    } else return "";
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
        value={getValue()}
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
