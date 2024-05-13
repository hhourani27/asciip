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
        ...shape,
        segments: shape.segments.map((segment) => ({
          ...segment,
          start: {
            r: segment.start.r + cappedDelta.r,
            c: segment.start.c + cappedDelta.c,
          },
          end: {
            r: segment.end.r + cappedDelta.r,
            c: segment.end.c + cappedDelta.c,
          },
        })),
      };
    }
  }
}

export type ResizePoint = {
  name: string;
  coords: Coords;
};

export function resize(
  shape: Shape,
  resizePointCoords: Coords,
  delta: Coords,
  canvasSize: CanvasSize
): Shape {
  // If the resize point is not legal for this shape, then return the same shape
  const resizePoints = getResizePoints(shape);
  const resizePointName = resizePoints.find((rp) =>
    _.isEqual(rp.coords, resizePointCoords)
  )?.name;

  if (!resizePointName) {
    return shape;
  }

  const cappedDelta = capDelta(delta, resizePointCoords, canvasSize);

  switch (shape.type) {
    case "RECTANGLE": {
      const { tl, br } = shape;

      const new_tl =
        resizePointName === "TL"
          ? { r: tl.r + cappedDelta.r, c: tl.c + cappedDelta.c }
          : resizePointName === "TR"
          ? { r: tl.r + cappedDelta.r, c: tl.c }
          : resizePointName === "BR"
          ? { r: tl.r, c: tl.c }
          : { r: tl.r, c: tl.c + cappedDelta.c };

      const new_br =
        resizePointName === "TL"
          ? { r: br.r, c: br.c }
          : resizePointName === "TR"
          ? { r: br.r, c: br.c + cappedDelta.c }
          : resizePointName === "BR"
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
      return shape;
    }
  }
}

export function getResizePoints(shape: Shape): ResizePoint[] {
  switch (shape.type) {
    case "RECTANGLE": {
      const { tl, br } = shape;
      return [
        { name: "TL", coords: { r: tl.r, c: tl.c } },
        { name: "TR", coords: { r: tl.r, c: br.c } },
        { name: "BR", coords: { r: br.r, c: br.c } },
        { name: "BL", coords: { r: br.r, c: tl.c } },
      ];
    }
    case "LINE": {
      return [];
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
