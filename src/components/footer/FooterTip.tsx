import { Box, Typography } from "@mui/material";
import { useAppSelector } from "../../store/hooks";
import { diagramSelectors } from "../../store/diagramSlice";
import InfoIcon from "@mui/icons-material/Info";
export function FooterTip(): JSX.Element {
  const isTextBeingWritten = useAppSelector(
    (state) => diagramSelectors.currentEditedText(state) != null
  );
  const isLineToolSelected = useAppSelector(
    (state) => state.diagram.selectedTool === "LINE"
  );
  const isMultiSegmmentLineToolSelected = useAppSelector(
    (state) => state.diagram.selectedTool === "MULTI_SEGMENT_LINE"
  );

  const isTestShapeSelected = useAppSelector(
    (state) => diagramSelectors.selectedShapeObj(state)?.shape.type === "TEXT"
  );

  const tip: string | null = isTextBeingWritten
    ? "Press Ctrl+Enter to complete editing text."
    : isLineToolSelected
    ? "Click-and-Drag to create a line or arrow."
    : isMultiSegmmentLineToolSelected
    ? "Click once, and then click again to position segments. Double-click to finish creating the line."
    : isTestShapeSelected && !isTextBeingWritten
    ? "Double-click to edit text."
    : null;

  return (
    <Box
      sx={{
        ml: 10,
        display: "flex",
        alignItems: "center",
        gap: 1,
        color: "info.main",
      }}
    >
      {tip && (
        <>
          <InfoIcon fontSize="small" />
          <Typography variant="caption">{tip}</Typography>
        </>
      )}
    </Box>
  );
}
