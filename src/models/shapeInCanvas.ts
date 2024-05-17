import { ShapeObject } from "../store/diagramSlice";
import { getAbstractShapeRepresentation } from "./representation";
import { Coords, Shape } from "./shapes";

/**
 *
 * @returns the shapes whose edge touch the coordinate. If there are multiple shapes, they are returned in the same order than shapes[]
 */

export function getShapeObjsAtCoords(
  shapeObjs: ShapeObject[],
  { r, c }: Coords
): ShapeObject[] {
  return shapeObjs.filter((obj) => {
    const repr = getAbstractShapeRepresentation(obj.shape);
    return r in repr && c in repr[r];
  });
}

/**
 *
 * @returns a single shape whose edge touch the coordinate. If there are multiple shapes returns according to pos
 */
export function getShapeObjAtCoords(
  shapes: ShapeObject[],
  coords: Coords,
  priorityId?: string // If multiple shapes ate at coords, return the shape that has id = priorityId, else return the last one
): ShapeObject | null {
  const touchedShapes = getShapeObjsAtCoords(shapes, coords);

  if (touchedShapes.length === 0) return null;

  if (priorityId) {
    const priorityShape = touchedShapes.find((s) => s.id === priorityId);
    return priorityShape ?? touchedShapes[touchedShapes.length - 1];
  } else return touchedShapes[touchedShapes.length - 1];
}

export type BoundingBox = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export function getBoundingBox(shape: Shape): BoundingBox {
  switch (shape.type) {
    case "RECTANGLE": {
      return {
        top: shape.tl.r,
        bottom: shape.br.r,
        left: shape.tl.c,
        right: shape.br.c,
      };
    }
    case "LINE": {
      return {
        top: Math.min(shape.start.r, shape.end.r),
        bottom: Math.max(shape.start.r, shape.end.r),
        left: Math.min(shape.start.c, shape.end.c),
        right: Math.max(shape.start.c, shape.end.c),
      };
    }
    case "MULTI_SEGMENT_LINE": {
      const points = [
        ...shape.segments.map((s) => s.start),
        ...shape.segments.map((s) => s.end),
      ];

      return {
        top: Math.min(...points.map((p) => p.r)),
        bottom: Math.max(...points.map((p) => p.r)),
        left: Math.min(...points.map((p) => p.c)),
        right: Math.max(...points.map((p) => p.c)),
      };
    }
    case "TEXT": {
      const lineCount = shape.lines.length;
      const longestLineLength = Math.max(
        ...shape.lines.map((line) => line.length)
      );

      return {
        top: shape.start.r,
        bottom: shape.start.r + lineCount,
        left: shape.start.c,
        right: shape.start.c + longestLineLength,
      };
    }
  }
}

export function getBoundingBoxOfAll(shapes: Shape[]): BoundingBox | null {
  if (shapes.length === 0) return null;

  const bb = getBoundingBox(shapes[0]);
  shapes.slice(1).forEach((shape) => {
    const sbb = getBoundingBox(shape);
    bb.top = Math.min(bb.top, sbb.top);
    bb.bottom = Math.max(bb.bottom, sbb.bottom);
    bb.left = Math.min(bb.left, sbb.left);
    bb.right = Math.max(bb.right, sbb.right);
  });
  return bb;
}
