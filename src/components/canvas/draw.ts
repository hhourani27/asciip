import _ from "lodash";
import { Coords, Shape } from "../../models/shapes";
import {
  CellValueMap,
  getStyledShapeRepresentation,
} from "../../models/representation";
import { ResizePoint, getResizePoints } from "../../models/transformation";
import { Style, StyleMode } from "../../models/style";
import { ShapeObject } from "../../store/diagramSlice";
import { alpha } from "@mui/material/styles";

export const FONT_SIZE = 16;
export const FONT_WIDTH = 9.603; // see https://stackoverflow.com/a/56379770/471461
export const CELL_WIDTH = FONT_WIDTH;
export const CELL_HEIGHT = FONT_SIZE * 1.1;

export const FONT_FAMILY = "monospace";
export const FONT = `${FONT_SIZE}px ${FONT_FAMILY}`;

function setBackground(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}

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

function drawGrid(
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

function drawSelectBox(
  ctx: CanvasRenderingContext2D,
  boxTL: Coords,
  boxBR: Coords,
  color: string
) {
  ctx.strokeStyle = color;
  ctx.setLineDash([2, 2]);
  ctx.lineWidth = 1;

  // Draw the unfilled rectangle
  ctx.strokeRect(
    boxTL.c * CELL_WIDTH,
    boxTL.r * CELL_HEIGHT,
    (boxBR.c - boxTL.c) * CELL_WIDTH,
    (boxBR.r - boxTL.r) * CELL_HEIGHT
  );
}

function drawHoveredCell(ctx: CanvasRenderingContext2D, cell: Coords) {
  ctx.fillStyle = "LightBlue";
  ctx.fillRect(
    cell.c * CELL_WIDTH,
    cell.r * CELL_HEIGHT,
    CELL_WIDTH,
    CELL_HEIGHT
  );
}

export type DrawOptions = {
  color: string;
  drawResizePoints: boolean;
};

type CellGraphicElemMap = {
  [key: number]: {
    [key: number]: { char: string; color: string };
  };
};

function getGraphicCanvasRepresentation(
  shapes: ShapeObject[] | Shape[],
  styleMode: StyleMode,
  globalStyle: Style,
  drawOpts: DrawOptions[]
): CellGraphicElemMap {
  function isShapeObject(shape: ShapeObject | Shape): shape is ShapeObject {
    return "id" in shape;
  }

  let graphicCanvasRepr: CellGraphicElemMap = {};

  shapes.forEach((s, idx) => {
    const shape = isShapeObject(s) ? s.shape : s;
    const shapeStyle = isShapeObject(s) ? s.style : undefined;
    const color = drawOpts[idx].color;

    const styledShapeRepr: CellValueMap = getStyledShapeRepresentation(
      shape,
      styleMode,
      globalStyle,
      shapeStyle
    );

    const graphicShapeRepr: CellGraphicElemMap = {};
    for (const row in styledShapeRepr) {
      graphicShapeRepr[row] = {};
      for (const col in styledShapeRepr[row]) {
        graphicShapeRepr[row][col] = {
          char: styledShapeRepr[row][col],
          color,
        };
      }
    }

    graphicCanvasRepr = _.merge(graphicCanvasRepr, graphicShapeRepr);
  });

  return graphicCanvasRepr;
}

function drawShapes(
  ctx: CanvasRenderingContext2D,
  shapes: ShapeObject[] | Shape[],
  styleMode: StyleMode,
  globalStyle: Style,
  opts: DrawOptions[]
): void {
  if (shapes.length === 0) return;

  const repr: CellGraphicElemMap = getGraphicCanvasRepresentation(
    shapes,
    styleMode,
    globalStyle,
    opts
  );

  ctx.font = FONT;
  ctx.textBaseline = "middle"; // To align the text in the middle of the cell (the default value "alphabetic" does not align the text in the middle)
  for (const row in repr) {
    for (const col in repr[row]) {
      const { char, color } = repr[row][col];
      ctx.fillStyle = color;

      const x = parseInt(col) * CELL_WIDTH;
      const y = parseInt(row) * CELL_HEIGHT + 0.5 * CELL_HEIGHT;

      ctx.fillText(char, x, y);
    }
  }

  // Draw resize points
  function isShapeObject(shape: ShapeObject | Shape): shape is ShapeObject {
    return "id" in shape;
  }
  shapes.forEach((s, idx) => {
    if (opts[idx].drawResizePoints) {
      const resizePoints: ResizePoint[] = getResizePoints(
        isShapeObject(s) ? s.shape : s
      );
      resizePoints.forEach(({ coords: { r, c } }) => {
        ctx.beginPath(); // Start a new path
        ctx.arc(
          c * CELL_WIDTH + 0.5 * CELL_WIDTH,
          r * CELL_HEIGHT + 0.5 * CELL_HEIGHT,
          0.5 * CELL_HEIGHT,
          0,
          Math.PI * 2
        ); // Create a circular path
        ctx.fillStyle = alpha(opts[idx].color, 0.66); // Set the fill color
        ctx.fill(); // Fill the path with the color
        ctx.closePath(); // Close the path
      });
    }
  });
}

export const canvasDraw = {
  setBackground,
  drawGrid,
  drawHoveredCell,
  drawShapes,
  drawSelectBox,
};
