import _ from "lodash";
import { CanvasSize } from "../store/appSlice";
import { Coords, Shape } from "./shapes";

export function translate(
  shape: Shape,
  delta: Coords,
  canvasSize: CanvasSize
): Shape {
  // The shape bouding box cannot go outside the canvas. So adjust delta accordingly
  const bb = getBoundingBox(shape);
  const cappedDelta = capDelta(delta, bb, canvasSize);

  switch (shape.type) {
    case "RECTANGLE": {
      return {
        type: "RECTANGLE",
        tl: { r: shape.tl.r + cappedDelta.r, c: shape.tl.c + cappedDelta.c },
        br: { r: shape.br.r + cappedDelta.r, c: shape.br.c + cappedDelta.c },
      };
    }
    case "LINE": {
      return {
        type: "LINE",
        start: {
          r: shape.start.r + cappedDelta.r,
          c: shape.start.c + cappedDelta.c,
        },
        inflection: {
          r: shape.inflection.r + cappedDelta.r,
          c: shape.inflection.c + cappedDelta.c,
        },
        end: { r: shape.end.r + cappedDelta.r, c: shape.end.c + cappedDelta.c },
      };
    }
  }
}

export function resize(
  shape: Shape,
  resizePoint: Coords,
  delta: Coords,
  canvasSize: CanvasSize
): Shape {
  // If the resize point is not legal for this shape, then return the same shape
  const resizePoints = getResizePoints(shape);
  if (!resizePoints.find((rp) => _.isEqual(rp, resizePoint))) return shape;

  const cappedDelta = capDelta(delta, resizePoint, canvasSize);

  switch (shape.type) {
    case "RECTANGLE": {
      const { tl, br } = shape;
      const resizePointType: "TL" | "TR" | "BR" | "BL" = _.isEqual(
        resizePoint,
        { r: tl.r, c: tl.c }
      )
        ? "TL"
        : _.isEqual(resizePoint, { r: tl.r, c: br.c })
        ? "TR"
        : _.isEqual(resizePoint, { r: br.r, c: br.c })
        ? "BR"
        : "BL";

      const new_tl =
        resizePointType === "TL"
          ? { r: tl.r + cappedDelta.r, c: tl.c + cappedDelta.c }
          : resizePointType === "TR"
          ? { r: tl.r + cappedDelta.r, c: tl.c }
          : resizePointType === "BR"
          ? { r: tl.r, c: tl.c }
          : { r: tl.r, c: tl.c + cappedDelta.c };

      const new_br =
        resizePointType === "TL"
          ? { r: br.r, c: br.c }
          : resizePointType === "TR"
          ? { r: br.r, c: br.c + cappedDelta.c }
          : resizePointType === "BR"
          ? { r: br.r + cappedDelta.r, c: br.c + cappedDelta.c }
          : { r: br.r + cappedDelta.r, c: br.c };

      // The new TL and BR may be inverted. Correct it
      const corrected_tl = {
        r: Math.min(new_tl.r, new_br.r),
        c: Math.min(new_tl.c, new_br.c),
      };
      const corrected_br = {
        r: Math.max(new_tl.r, new_br.r),
        c: Math.max(new_tl.c, new_br.c),
      };

      const resizedShape = { ...shape, tl: corrected_tl, br: corrected_br };

      // If we resized outside the canvas bounds, then return the original shape
      if (isShapeLegal(resizedShape, canvasSize)) return resizedShape;
      else return shape;
    }
    case "LINE": {
      const { start, inflection, end } = shape;
      const resizePointType: "START" | "INFLECTION" | "END" = _.isEqual(
        resizePoint,
        start
      )
        ? "START"
        : _.isEqual(resizePoint, inflection)
        ? "INFLECTION"
        : "END";

      const new_point = {
        r: resizePoint.r + cappedDelta.r,
        c: resizePoint.c + cappedDelta.c,
      };

      switch (resizePointType) {
        case "START": {
          return {
            ...shape,
            start: new_point,
          };
        }
        case "END": {
          return {
            ...shape,
            end: new_point,
          };
        }
        case "INFLECTION": {
          return {
            ...shape,
            inflection: new_point,
          };
        }
      }
    }
  }
}

export function getResizePoints(shape: Shape): Coords[] {
  switch (shape.type) {
    case "RECTANGLE": {
      const { tl, br } = shape;
      return [
        { r: tl.r, c: tl.c },
        { r: tl.r, c: br.c },
        { r: br.r, c: br.c },
        { r: br.r, c: tl.c },
      ];
    }
    case "LINE": {
      return [shape.start, shape.inflection, shape.end];
    }
  }
}

function isShapeLegal(
  shape: Shape,
  canvasSize: { rows: number; cols: number }
): boolean {
  const bb = getBoundingBox(shape);
  if (bb.top < 0) return false;
  if (bb.bottom >= canvasSize.rows) return false;
  if (bb.left < 0) return false;
  if (bb.right >= canvasSize.cols) return false;

  return true;
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
        top: Math.min(shape.start.r, shape.inflection.r, shape.end.r),
        bottom: Math.max(shape.start.r, shape.inflection.r, shape.end.r),
        left: Math.min(shape.start.c, shape.inflection.c, shape.end.c),
        right: Math.max(shape.start.c, shape.inflection.c, shape.end.c),
      };
    }
  }
}

/**
 * Cap the delta coords so that the bounding box doesn't go outside of the canvas
 */
function capDelta(
  delta: Coords,
  points: BoundingBox | Coords,
  canvasSize: CanvasSize
): Coords {
  if ("left" in points) {
    const bb = points;

    const cappedDelta: Coords = {
      r:
        delta.r > 0
          ? Math.min(delta.r, canvasSize.rows - 1 - bb.bottom)
          : delta.r < 0
          ? Math.max(delta.r, 0 - bb.top)
          : 0,
      c:
        delta.c > 0
          ? Math.min(delta.c, canvasSize.cols - 1 - bb.right)
          : delta.c < 0
          ? Math.max(delta.c, 0 - bb.left)
          : 0,
    };

    return cappedDelta;
  } else {
    const p = points;

    const cappedDelta: Coords = {
      r:
        delta.r > 0
          ? Math.min(delta.r, canvasSize.rows - 1 - p.r)
          : delta.r < 0
          ? Math.max(delta.r, 0 - p.r)
          : 0,
      c:
        delta.c > 0
          ? Math.min(delta.c, canvasSize.cols - 1 - p.c)
          : delta.c < 0
          ? Math.max(delta.c, 0 - p.c)
          : 0,
    };

    return cappedDelta;
  }
}
