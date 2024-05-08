import { useTheme } from "@mui/material";
import { useAppSelector } from "../store/hooks";
import { useEffect, useRef } from "react";
import _ from "lodash";
import { getCanvasRepresentation } from "../models/representation";

const FONT_SIZE = 16;
const FONT_WIDTH = 9.603; // see https://stackoverflow.com/a/56379770/471461
const CELL_WIDTH = FONT_WIDTH;
const CELL_HEIGHT = FONT_SIZE;

function drawVerticalGridLine(
  ctx: CanvasRenderingContext2D,
  x: number,
  height: number,
  color: string
) {
  ctx.beginPath();
  ctx.moveTo(x, 0); // Starting point
  ctx.lineTo(x, height); // Ending point
  ctx.strokeStyle = color; // Line color
  ctx.stroke(); // Draw the line
}

function drawHorizontalGridLine(
  ctx: CanvasRenderingContext2D,
  y: number,
  width: number,
  color: string
) {
  ctx.beginPath();
  ctx.moveTo(0, y); // Starting point
  ctx.lineTo(width, y); // Ending point
  ctx.strokeStyle = color; // Line color
  ctx.stroke(); // Draw the line
}

export default function Canvas(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const theme = useTheme();

  const rowCount = useAppSelector((state) => state.app.canvasSize.rows);
  const colCount = useAppSelector((state) => state.app.canvasSize.cols);
  const canvasWidth = colCount * CELL_WIDTH;
  const canvasHeight = rowCount * CELL_HEIGHT;

  const newShape = useAppSelector((state) => state.app.creationProgress?.shape);
  const shapes = useAppSelector((state) => state.app.shapes);

  const repr = getCanvasRepresentation(
    newShape ? [...shapes, newShape] : shapes
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) return;
    const ctx = canvas.getContext("2d")!;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    drawVerticalGridLine(ctx, 0, canvasHeight, theme.palette.grey["200"]);
    _.forEach(_.range(0, colCount), (col) => {
      drawVerticalGridLine(
        ctx,
        col * CELL_WIDTH,
        canvasHeight,
        theme.palette.grey["200"]
      );
    });

    drawHorizontalGridLine(ctx, 0, canvasWidth, theme.palette.grey["200"]);
    _.forEach(_.range(0, rowCount), (row) => {
      drawHorizontalGridLine(
        ctx,
        row * CELL_HEIGHT,
        canvasWidth,
        theme.palette.grey["200"]
      );
    });

    // Draw shapes
    for (const row in repr) {
      for (const col in repr[row]) {
        const value = repr[row][col];
        const x = parseInt(col) * CELL_WIDTH;
        const y = parseInt(row) * CELL_HEIGHT + 0.5 * CELL_HEIGHT;

        ctx.fillStyle = "black";
        ctx.font = `${FONT_SIZE}px Courier New`;
        ctx.textBaseline = "middle"; // To align the text in the middle of the cell (the default value "alphabetic" does not align the text in the middle)
        ctx.fillText(value, x, y);
      }
    }
  }, [canvasHeight, canvasWidth, colCount, repr, rowCount, theme.palette.grey]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth} // Logical width
      height={canvasHeight} // Logical height
      style={{ width: canvasWidth, height: canvasHeight }} // Make width/height=logical width/height so pixel calculations are easier
    ></canvas>
  );
}
