import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { diagramActions, diagramSelectors } from "../../store/diagramSlice";
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

const lineStyleDisplay: {
  [key in LINE_STYLE]: { name: string; repr: string; tooltip: React.ReactNode };
} = {
  ASCII: {
    name: "ASCII",
    repr: `${line_repr.LINE_HORIZONTAL.ASCII}${line_repr.LINE_HORIZONTAL.ASCII}`,
    tooltip: "This style displays correctly on most monospaced fonts",
  },
  LIGHT: {
    name: "Light",
    repr: `${line_repr.LINE_HORIZONTAL.LIGHT}${line_repr.LINE_HORIZONTAL.LIGHT}`,
    tooltip: (
      <span>
        This style may not display correctly on these monospaced fonts:
        <br />
        <em>{"Monaco"}</em>
      </span>
    ),
  },
  HEAVY: {
    name: "Heavy",
    repr: `${line_repr.LINE_HORIZONTAL.HEAVY}${line_repr.LINE_HORIZONTAL.HEAVY}`,
    tooltip: (
      <span>
        This style may not display correctly on these monospaced fonts:
        <br />
        <em>{"Courier New, Monaco, Ubuntu Mono"}</em>
      </span>
    ),
  },
};

export function SelectLineStyle(): JSX.Element {
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
        value={selectedShapeObj?.style?.lineStyle ?? globalStyle.lineStyle}
        label="Line style"
        onChange={handleLineStyleChange}
      >
        {Object.keys(lineStyleDisplay).map((value) => (
          <MenuItem value={value} sx={{ pt: 0.5, pb: 0.5 }}>
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
