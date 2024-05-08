import { styled } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { appActions } from "../store/appSlice";
import { getCanvasRepresentation } from "../models/representation";

const CanvasWorkspace = styled("div")(({ theme }) => ({
  fontFamily: "monospace",
  flex: 1,
  overflow: "auto",
  userSelect: "none",
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
  const newShape = useAppSelector((state) => state.app.creationProgress?.shape);
  const shapes = useAppSelector((state) => state.app.shapes);

  const rows = Array.from({ length: rowCount }, (_, index) => index);
  const cols = Array.from({ length: colCount }, (_, index) => index);
  const repr = getCanvasRepresentation(
    newShape ? [...shapes, newShape] : shapes
  );
  return (
    <CanvasWorkspace>
      {rows.map((x) => (
        <CanvasRow key={`r${x}`}>
          {cols.map((y) => (
            <CanvasCell
              key={`c${y}`}
              onMouseDown={() => dispatch(appActions.onCellMouseDown({ x, y }))}
              onMouseUp={() => dispatch(appActions.onCellMouseUp({ x, y }))}
              onMouseEnter={() => dispatch(appActions.onCellHover({ x, y }))}
            >
              {repr[x] !== undefined && repr[x][y] !== undefined
                ? repr[x][y]
                : "\u00A0"}
            </CanvasCell>
          ))}
        </CanvasRow>
      ))}
    </CanvasWorkspace>
  );
}
