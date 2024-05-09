import { useTheme } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useEffect, useRef } from "react";
import {
  CellValueMap,
  getCanvasRepresentation,
} from "../../models/representation";
import { Coords } from "../../models/shapes";
import { appActions } from "../../store/appSlice";
import { drawGrid } from "./draw";

const FONT_SIZE = 16;
const FONT_WIDTH = 9.603; // see https://stackoverflow.com/a/56379770/471461
const CELL_WIDTH = FONT_WIDTH;
const CELL_HEIGHT = FONT_SIZE;

export default function Canvas(): JSX.Element {
  const dispatch = useAppDispatch();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const theme = useTheme();

  const rowCount = useAppSelector((state) => state.app.canvasSize.rows);
  const colCount = useAppSelector((state) => state.app.canvasSize.cols);
  const canvasWidth = colCount * CELL_WIDTH;
  const canvasHeight = rowCount * CELL_HEIGHT;

  const newShape = useAppSelector((state) => state.app.creationProgress?.shape);
  const shapes = useAppSelector((state) => state.app.shapes);

  const repr: CellValueMap = getCanvasRepresentation(
    newShape ? [...shapes, newShape] : shapes
  );

  const getCellCoords = (eventX: number, eventY: number): Coords => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const x = eventX - rect.left;
    const y = eventY - rect.top;

    return { r: Math.floor(y / CELL_HEIGHT), c: Math.floor(x / CELL_WIDTH) };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) return;
    const ctx = canvas.getContext("2d")!;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid(
      ctx,
      canvasWidth,
      canvasHeight,
      rowCount,
      colCount,
      theme.palette.grey["200"]
    );

    // Draw shapes
    ctx.fillStyle = "black";
    ctx.font = `${FONT_SIZE}px Courier New`;
    ctx.textBaseline = "middle"; // To align the text in the middle of the cell (the default value "alphabetic" does not align the text in the middle)
    for (const row in repr) {
      for (const col in repr[row]) {
        const value = repr[row][col];
        const x = parseInt(col) * CELL_WIDTH;
        const y = parseInt(row) * CELL_HEIGHT + 0.5 * CELL_HEIGHT;

        ctx.fillText(value, x, y);
      }
    }
  }, [canvasHeight, canvasWidth, colCount, repr, rowCount, theme.palette.grey]);

  return (
    <div
      style={{
        flex: 1,
        overflow: "scroll",
      }}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={(e) =>
          dispatch(
            appActions.onCellMouseDown(getCellCoords(e.clientX, e.clientY))
          )
        }
        onMouseUp={(e) =>
          dispatch(
            appActions.onCellMouseUp(getCellCoords(e.clientX, e.clientY))
          )
        }
        onMouseMove={(e) =>
          dispatch(appActions.onCellHover(getCellCoords(e.clientX, e.clientY)))
        }
      ></canvas>
    </div>
  );
}
