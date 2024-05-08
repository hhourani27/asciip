import { styled } from "@mui/material";
import { useAppSelector } from "../store/hooks";
import { CanvasCell } from "./CanvasCell";

const CanvasWorkspace = styled("div")(({ theme }) => ({
  fontFamily: "monospace",
  flex: 1,
  overflow: "auto",
  userSelect: "none",

  display: "flex",
  flexDirection: "column",
}));
const CanvasRow = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  width: "1500px",
  height: "10px",

  flexBasis: "10px",
  flexGrow: 0,
  flexShrink: 0,
}));

export default function Canvas() {
  const rowCount = useAppSelector((state) => state.app.canvasSize.rows);
  const colCount = useAppSelector((state) => state.app.canvasSize.cols);

  const rows = Array.from({ length: rowCount }, (_, index) => index);
  const cols = Array.from({ length: colCount }, (_, index) => index);
  return (
    <CanvasWorkspace>
      {rows.map((x) => (
        <CanvasRow key={`r${x}`}>
          {cols.map((y) => (
            <CanvasCell x={x} y={y} />
          ))}
        </CanvasRow>
      ))}
    </CanvasWorkspace>
  );
}
