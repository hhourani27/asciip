import { styled } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../store/hooks";

const CanvasWorkspace = styled("div")(({ theme }) => ({
  fontFamily: "monospace",
  flex: 1,
  overflow: "auto",
}));
const CanvasRow = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
}));

const CanvasCell = styled("div")(({ theme }) => ({
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: theme.palette.grey["200"],
}));

export default function Canvas() {
  const dispatch = useAppDispatch();

  const rowCount = useAppSelector((state) => state.app.canvasSize.rows);
  const colCount = useAppSelector((state) => state.app.canvasSize.cols);

  const rows = Array.from({ length: rowCount }, (_, index) => index);
  const cols = Array.from({ length: colCount }, (_, index) => index);
  return (
    <CanvasWorkspace>
      {rows.map((r) => (
        <CanvasRow key={`r${r}`}>
          {cols.map((c) => (
            <CanvasCell key={`c${c}`}>&nbsp;</CanvasCell>
          ))}
        </CanvasRow>
      ))}
    </CanvasWorkspace>
  );
}
