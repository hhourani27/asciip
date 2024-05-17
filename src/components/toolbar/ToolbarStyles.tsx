import { useAppSelector } from "../../store/hooks";
import { Box } from "@mui/material";
import { SelectLineStyle } from "./SelectLineStyle";
import { SelectArrowHead } from "./SelectArrowHead";
import { SelectArrowHeadStyle } from "./SelectArrowHeadStyle";

export function ToolbarStyles(): JSX.Element {
  const styleMode = useAppSelector((state) => state.diagram.styleMode);

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {/* Line style*/}
      {styleMode === "UNICODE" && <SelectLineStyle />}
      {/* Arrow head presence/absence */}
      <SelectArrowHead />
      {/* Arrow head style*/}
      {styleMode === "UNICODE" && <SelectArrowHeadStyle />}
    </Box>
  );
}
