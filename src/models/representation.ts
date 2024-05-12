import { ShapeObject } from "../store/appSlice";
import { Coords, Shape, getCanonicalPath } from "./shapes";
import _ from "lodash";
import { getBoundingBox } from "./transformation";

export type CellValueMap = {
  [key: number]: { [key: number]: string };
};

export type Grid = string[][];

// TODO: This is not used right now, it may be used for the export feature
export function getCanvasGridRepresentation(
  rows: number,
  cols: number,
  shapes: Shape[]
): Grid {
  const grid: Grid = _.times(rows, () => _.fill(Array(cols), "\u00A0"));

  let repr: CellValueMap = {};
  shapes.forEach((shape) => {
    repr = _.merge(repr, getShapeRepresentation(shape));
  });

  for (const x in repr) {
    for (const y in repr[x]) {
      grid[x][y] = repr[x][y];
    }
  }

  return grid;
}

export function getCanvasRepresentation(shapes: Shape[]): CellValueMap {
  let repr: CellValueMap = {};

  shapes.forEach((shape) => {
    repr = _.merge(repr, getShapeRepresentation(shape));
  });

  return repr;
}

export function getShapeRepresentation(shape: Shape): CellValueMap {
  const repr: CellValueMap = {};
  switch (shape.type) {
    case "RECTANGLE": {
      const { tl, br } = shape;
      const tr = { x: tl.r, y: br.c };
      const bl = { x: br.r, y: tl.c };

      for (let x = tl.r; x <= bl.x; x++) {
        repr[x] = {};
      }

      repr[tl.r][tl.c] = "+";
      repr[br.r][br.c] = "+";
      repr[tr.x][tr.y] = "+";
      repr[bl.x][bl.y] = "+";

      for (let y = tl.c + 1; y < tr.y; y++) {
        repr[tl.r][y] = "-";
        repr[bl.x][y] = "-";
      }
      for (let x = tl.r + 1; x < bl.x; x++) {
        repr[x][tl.c] = "|";
        repr[x][tr.y] = "|";
      }

      return repr;
    }
    case "LINE": {
      // Prepare the objects in the repr
      const bb = getBoundingBox(shape);
      for (let x = bb.top; x <= bb.bottom; x++) {
        repr[x] = {};
      }

      const { start, end } = shape;

      const path = getCanonicalPath(shape);
      path.forEach((segment) => {
        switch (segment.type) {
          case "HORIZONTAL": {
            _.merge(
              repr,
              drawHorizontalLine(segment.r, segment.c_from, segment.c_to)
            );
            repr[segment.r][segment.c_from] = "+";
            repr[segment.r][segment.c_to] = "+";
            break;
          }
          case "VERTICAL": {
            _.merge(
              repr,
              drawVerticalLine(segment.c, segment.r_from, segment.r_to)
            );
            repr[segment.r_from][segment.c] = "+";
            repr[segment.r_to][segment.c] = "+";
          }
        }
      });

      const lastSegment = path[path.length - 1];
      repr[end.r][end.c] =
        lastSegment.type === "HORIZONTAL" &&
        lastSegment.direction === "LEFT_TO_RIGHT"
          ? ">"
          : lastSegment.type === "HORIZONTAL" &&
            lastSegment.direction === "RIGHT_TO_LEFT"
          ? "<"
          : lastSegment.type === "VERTICAL" && lastSegment.direction === "DOWN"
          ? "v"
          : "^";

      return repr;
    }
  }
}

function drawHorizontalLine(
  r: number,
  from_c: number,
  to_c: number
): CellValueMap {
  const repr: CellValueMap = {};

  repr[r] = {};

  const [start_c, end_c] = [Math.min(from_c, to_c), Math.max(from_c, to_c)];

  for (let c = start_c; c <= end_c; c++) {
    repr[r][c] = "-";
  }

  return repr;
}

function drawVerticalLine(
  c: number,
  from_r: number,
  to_r: number
): CellValueMap {
  const repr: CellValueMap = {};

  const [start_r, end_r] = [Math.min(from_r, to_r), Math.max(from_r, to_r)];

  for (let r = start_r; r <= end_r; r++) {
    repr[r] = {};
    repr[r][c] = "|";
  }

  return repr;
}

/**
 *
 * @returns the shapes whose edge touch the coordinate. If there are multiple shapes, they are returned in the same order than shapes[]
 */
export function getShapesAtCoords(
  shapeObjs: ShapeObject[],
  { r, c }: Coords
): ShapeObject[] {
  return shapeObjs.filter((obj) => {
    const repr = getShapeRepresentation(obj.shape);
    return r in repr && c in repr[r];
  });
}

/**
 *
 * @returns a single shape whose edge touch the coordinate. If there are multiple shapes returns according to pos
 */
export function getShapeAtCoords(
  shapes: ShapeObject[],
  coords: Coords,
  priorityId?: string // If multiple shapes ate at coords, return the shape that has id = priorityId, else return the last one
): ShapeObject | null {
  const touchedShapes = getShapesAtCoords(shapes, coords);

  if (touchedShapes.length === 0) return null;

  if (priorityId) {
    const priorityShape = touchedShapes.find((s) => s.id === priorityId);
    return priorityShape ?? touchedShapes[touchedShapes.length - 1];
  } else return touchedShapes[touchedShapes.length - 1];
}
