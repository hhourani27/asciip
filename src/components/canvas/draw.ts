import _ from "lodash";
import { Coords, Shape } from "../../models/shapes";
import {
  CellValueMap,
  getStyledCanvasRepresentation,
} from "../../models/representation";
import { ResizePoint, getResizePoints } from "../../models/transformation";
import { Style, StyleMode } from "../../models/style";
import { ShapeObject } from "../../store/appSlice";

export const FONT_SIZE = 16;
export const FONT_WIDTH = 9.603; // see https://stackoverflow.com/a/56379770/471461
export const CELL_WIDTH = FONT_WIDTH;
export const CELL_HEIGHT = FONT_SIZE * 1.1;

export const FONT_FAMILY = "monospace";
export const FONT = `${FONT_SIZE}px ${FONT_FAMILY}`;

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

export function drawHoveredCell(ctx: CanvasRenderingContext2D, cell: Coords) {
  ctx.fillStyle = "LightBlue";
  ctx.fillRect(
    cell.c * CELL_WIDTH,
    cell.r * CELL_HEIGHT,
    CELL_WIDTH,
    CELL_HEIGHT
  );
}

export function drawShapes(
  ctx: CanvasRenderingContext2D,
  shapes: ShapeObject[] | Shape[],
  styleMode: StyleMode,
  globalStyle: Style,
  color: string
): void {
  if (shapes.length === 0) return;

  const repr: CellValueMap = getStyledCanvasRepresentation(
    shapes,
    styleMode,
    globalStyle
  );

  ctx.fillStyle = color;
  ctx.font = FONT;
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

export function drawSelectedShape(
  ctx: CanvasRenderingContext2D,
  shapeObj: ShapeObject,
  styleMode: StyleMode,
  globalStyle: Style
) {
  drawShapes(ctx, [shapeObj], styleMode, globalStyle, "blue");

  const resizePoints: ResizePoint[] = getResizePoints(shapeObj.shape);
  resizePoints.forEach(({ coords: { r, c } }) => {
    ctx.beginPath(); // Start a new path
    ctx.arc(
      c * CELL_WIDTH + 0.5 * CELL_WIDTH,
      r * CELL_HEIGHT + 0.5 * CELL_HEIGHT,
      0.5 * CELL_HEIGHT,
      0,
      Math.PI * 2
    ); // Create a circular path
    ctx.fillStyle = "#9e9e9eAA"; // Set the fill color
    ctx.fill(); // Fill the path with the color
    ctx.closePath(); // Close the path
  });
}
