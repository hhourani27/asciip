import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { diagramActions } from "../../store/diagramSlice";
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
import { ARROW_STYLE, arrow_repr } from "../../models/style";
import { selectors } from "../../store/selectors";

const arrowHeadStyleDisplay: {
  [key in ARROW_STYLE]: {
    name: string;
    repr: string;
    tooltip: React.ReactNode;
  };
} = {
  ASCII: {
    name: "ASCII",
    repr: arrow_repr.ARROW_RIGHT.ASCII,
    tooltip: "This style displays correctly on most monospaced fonts",
  },
  FILLED: {
    name: "Filled",
    repr: arrow_repr.ARROW_RIGHT.FILLED,
    tooltip: (
      <span>
        This style may not display correctly on these monospaced fonts:
        <br />
        <em>{"IBM Plex Mono, Inconsolata, Monaco, Ubuntu Mono"}</em>
      </span>
    ),
  },
  OUTLINED: {
    name: "Outlined",
    repr: arrow_repr.ARROW_RIGHT.OUTLINED,
    tooltip: (
      <span>
        This style may not display correctly on these monospaced fonts:
        <br />
        <em>
          {
            "Consolas, Courier New, Fira Code, IBM Plex Mono, Inconsolata, Monaco, Ubuntu Mono"
          }
        </em>
      </span>
    ),
  },
};

export function SelectArrowHeadStyle(): JSX.Element {
  const dispatch = useAppDispatch();

  const styleMode = useAppSelector((state) => state.diagram.styleMode);
  const globalStyle = useAppSelector((state) => state.diagram.globalStyle);
  const selectedTool = useAppSelector((state) => state.diagram.selectedTool);
  const selectedShapeObj = useAppSelector((state) =>
    selectors.selectedShapeObj(state.diagram)
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
      <InputLabel id="head-style-label">Head style</InputLabel>
      <Select
        labelId="head-style-label"
        id="head-style"
        value={selectedShapeObj?.style?.arrowStyle ?? globalStyle.arrowStyle}
        label="Head style"
        onChange={handleArrowStyleChange}
      >
        {Object.keys(arrowHeadStyleDisplay).map((value) => (
          <MenuItem key={value} value={value} sx={{ pt: 0.5, pb: 0.5 }}>
            <Tooltip
              title={arrowHeadStyleDisplay[value as ARROW_STYLE].tooltip}
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
                    <span>
                      {arrowHeadStyleDisplay[value as ARROW_STYLE].name}
                    </span>
                    <Box sx={{ fontFamily: "monospace" }}>
                      {arrowHeadStyleDisplay[value as ARROW_STYLE].repr}
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
