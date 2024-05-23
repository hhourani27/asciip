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
import { ARROW_STYLE, arrow_repr } from "../../models/style";
import { selectors } from "../../store/selectors";
import _ from "lodash";

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
  const selectedShapeObjs: ShapeObject[] = useAppSelector((state) =>
    selectors.selectedShapeObjs(state.diagram)
  );

  const isArrowStyleSelectEnabled = (): boolean => {
    if (styleMode === "ASCII") return false;

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

  const handleArrowStyleChange = (event: SelectChangeEvent<ARROW_STYLE>) => {
    const shapeIds: string[] | undefined =
      selectedShapeObjs.length === 0
        ? undefined
        : selectedShapeObjs.map((so) => so.id);

    if (event.target.value)
      dispatch(
        diagramActions.setStyle({
          style: { arrowStyle: event.target.value as ARROW_STYLE },
          shapeIds,
        })
      );
  };

  const getValue = (): ARROW_STYLE | "" => {
    if (selectedShapeObjs.length === 0) {
      return globalStyle.arrowStyle;
    }

    const values = selectedShapeObjs.map(
      (s) => s?.style?.arrowStyle ?? globalStyle.arrowStyle
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
      disabled={!isArrowStyleSelectEnabled()}
    >
      <InputLabel id="head-style-label">Head style</InputLabel>
      <Select
        labelId="head-style-label"
        id="head-style"
        value={getValue()}
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
