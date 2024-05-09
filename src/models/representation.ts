import { ShapeObject } from "../store/appSlice";
import { Coords, Shape } from "./shapes";
import _ from "lodash";

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

  if (shape.type === "RECTANGLE") {
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
  pos: number = 0
): ShapeObject | null {
  const touchedShapes = getShapesAtCoords(shapes, coords);

  if (touchedShapes.length === 0) return null;
  if (pos >= touchedShapes.length) return null;

  return touchedShapes.slice().reverse()[pos];
}
