import _ from "lodash";
import { Shape } from "../../models/shapes";
import {
  CellValueMap,
  getCanvasRepresentation,
} from "../../models/representation";

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

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  rowCount: number,
  colCount: number,
  color: string
) {
  drawVerticalGridLine(ctx, 0, canvasHeight, color);
  _.forEach(_.range(0, colCount), (col) => {
    drawVerticalGridLine(ctx, col * CELL_WIDTH, canvasHeight, color);
  });

  drawHorizontalGridLine(ctx, 0, canvasWidth, color);
  _.forEach(_.range(0, rowCount), (row) => {
    drawHorizontalGridLine(ctx, row * CELL_HEIGHT, canvasWidth, color);
  });
}

export function drawShapes(
  ctx: CanvasRenderingContext2D,
  shapes: Shape[],
  color: string
) {
  const repr: CellValueMap = getCanvasRepresentation(shapes);

  ctx.fillStyle = color;
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
}
