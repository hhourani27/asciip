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
} from "@mui/material";
import { LINE_STYLE } from "../../models/style";

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
        <MenuItem value={"LIGHT"}>
          <ListItemText
            primary={
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 3,
                }}
              >
                <span>{"Light"}</span>
                <Box sx={{ fontFamily: "monospace" }}>{"──"}</Box>
              </Box>
            }
          />
        </MenuItem>
        <MenuItem value={"ASCII"}>
          <ListItemText
            primary={
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <span>{"ASCII"}</span>
                <Box sx={{ fontFamily: "monospace" }}>{"--"}</Box>
              </Box>
            }
          />
        </MenuItem>
        <MenuItem value={"HEAVY"}>
          <ListItemText
            primary={
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <span>{"Heavy"}</span>
                <Box sx={{ fontFamily: "monospace" }}>{"━━"}</Box>
              </Box>
            }
          />
        </MenuItem>
      </Select>
    </FormControl>
  );
}
