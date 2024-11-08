import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { ShapeObject, diagramActions } from "../../store/diagramSlice";
import {
  Box,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
} from "@mui/material";
import { LINE_STYLE, line_repr } from "../../models/style";
import { selectors } from "../../store/selectors";
import _ from "lodash";

const lineStyleDisplay: {
  [key in LINE_STYLE]: { name: string; repr: string; tooltip: React.ReactNode };
} = {
  ASCII: {
    name: "ASCII",
    repr: `${line_repr.LINE_HORIZONTAL.ASCII}${line_repr.LINE_HORIZONTAL.ASCII}${line_repr.CORNER_TR.ASCII}`,
    tooltip: "This style displays correctly on most monospaced fonts",
  },
  LIGHT: {
    name: "Light",
    repr: `${line_repr.LINE_HORIZONTAL.LIGHT}${line_repr.LINE_HORIZONTAL.LIGHT}${line_repr.CORNER_TR.LIGHT}`,
    tooltip: (
      <span>
        This style may not display correctly on these monospaced fonts:
        <br />
        <em>{"Monaco"}</em>
      </span>
    ),
  },
  LIGHT_ROUNDED: {
    name: "Light rounded",
    repr: `${line_repr.LINE_HORIZONTAL.LIGHT_ROUNDED}${line_repr.LINE_HORIZONTAL.LIGHT_ROUNDED}${line_repr.CORNER_TR.LIGHT_ROUNDED}`,
    tooltip: (
      <span>
        This style may not display correctly on these monospaced fonts:
        <br />
        <em>{"Courier New, Monaco"}</em>
      </span>
    ),
  },
  HEAVY: {
    name: "Heavy",
    repr: `${line_repr.LINE_HORIZONTAL.HEAVY}${line_repr.LINE_HORIZONTAL.HEAVY}${line_repr.CORNER_TR.HEAVY}`,
    tooltip: (
      <span>
        This style may not display correctly on these monospaced fonts:
        <br />
        <em>{"Courier New, Monaco"}</em>
      </span>
    ),
  },
  DOUBLE: {
    name: "Double",
    repr: `${line_repr.LINE_HORIZONTAL.DOUBLE}${line_repr.LINE_HORIZONTAL.DOUBLE}${line_repr.CORNER_TR.DOUBLE}`,
    tooltip: (
      <span>
        This style may not display correctly on these monospaced fonts:
        <br />
        <em>{"Monaco"}</em>
      </span>
    ),
  },
};

export function SelectLineStyle(): JSX.Element {
  const dispatch = useAppDispatch();

  const styleMode = useAppSelector((state) => state.diagram.styleMode);
  const globalStyle = useAppSelector((state) => state.diagram.globalStyle);
  const selectedTool = useAppSelector((state) => state.diagram.selectedTool);
  const selectedShapeObjs: ShapeObject[] = useAppSelector((state) =>
    selectors.selectedShapeObjs(state.diagram)
  );

  const isLineStyleSelectEnabled = (): boolean => {
    if (styleMode === "ASCII") return false;

    if (
      selectedTool === "RECTANGLE" ||
      selectedTool === "LINE" ||
      selectedTool === "MULTI_SEGMENT_LINE"
    )
      return true;

    if (
      selectedTool === "SELECT" &&
      selectedShapeObjs.length > 0 &&
      selectedShapeObjs.every(
        (s) =>
          s.shape.type === "RECTANGLE" ||
          s.shape.type === "LINE" ||
          s.shape.type === "MULTI_SEGMENT_LINE"
      )
    )
      return true;

    return false;
  };

  const handleLineStyleChange = (event: SelectChangeEvent<LINE_STYLE>) => {
    const shapeIds: string[] | undefined =
      selectedShapeObjs.length === 0
        ? undefined
        : selectedShapeObjs.map((so) => so.id);

    if (event.target.value)
      dispatch(
        diagramActions.setStyle({
          style: { lineStyle: event.target.value as LINE_STYLE },
          shapeIds,
        })
      );
  };

  const getValue = (): LINE_STYLE | "" => {
    if (selectedShapeObjs.length === 0) {
      return globalStyle.lineStyle;
    }

    const values = selectedShapeObjs.map(
      (s) => s?.style?.lineStyle ?? globalStyle.lineStyle
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
      disabled={!isLineStyleSelectEnabled()}
    >
      <InputLabel id="line-style-label">Line style</InputLabel>
      <Select
        labelId="line-style-label"
        id="line-style"
        value={getValue()}
        label="Line style"
        onChange={handleLineStyleChange}
      >
        {Object.keys(lineStyleDisplay).map((value) => (
          <MenuItem key={value} value={value} sx={{ pt: 0.5, pb: 0.5 }}>
            <Tooltip
              title={lineStyleDisplay[value as LINE_STYLE].tooltip}
              arrow
              placement="right"
            >
              <ListItemText
                sx={{ m: 0 }} // So the width of the Select is the same as <SelectArrowHead/>
                primary={
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 3,
                    }}
                  >
                    <span>{lineStyleDisplay[value as LINE_STYLE].name}</span>
                    <Box sx={{ fontFamily: "monospace" }}>
                      {lineStyleDisplay[value as LINE_STYLE].repr}
                    </Box>
                  </Box>
                }
              />
            </Tooltip>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
