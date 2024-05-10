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
  const corrDelta: Coords = {
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

  switch (shape.type) {
    case "RECTANGLE": {
      return {
        type: "RECTANGLE",
        tl: { r: shape.tl.r + corrDelta.r, c: shape.tl.c + corrDelta.c },
        br: { r: shape.br.r + corrDelta.r, c: shape.br.c + corrDelta.c },
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
          ? { r: tl.r + delta.r, c: tl.c + delta.c }
          : resizePointType === "TR"
          ? { r: tl.r + delta.r, c: tl.c }
          : resizePointType === "BR"
          ? { r: tl.r, c: tl.c }
          : { r: tl.r, c: tl.c + delta.c };

      const new_br =
        resizePointType === "TL"
          ? { r: br.r, c: br.c }
          : resizePointType === "TR"
          ? { r: br.r, c: br.c + delta.c }
          : resizePointType === "BR"
          ? { r: br.r + delta.r, c: br.c + delta.c }
          : { r: br.r + delta.r, c: br.c };

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
  }
}

function isShapeLegal(
  shape: Shape,
  canvasSize: { rows: number; cols: number }
): boolean {
  switch (shape.type) {
    case "RECTANGLE": {
      if (shape.tl.r < 0 || shape.tl.r >= canvasSize.rows) return false;
      if (shape.tl.c < 0 || shape.tl.c >= canvasSize.cols) return false;
      if (shape.br.r < 0 || shape.br.r >= canvasSize.rows) return false;
      if (shape.br.c < 0 || shape.br.c >= canvasSize.cols) return false;
      return true;
    }
  }
}

function getBoundingBox(shape: Shape): {
  top: number;
  bottom: number;
  left: number;
  right: number;
} {
  switch (shape.type) {
    case "RECTANGLE": {
      return {
        top: shape.tl.r,
        bottom: shape.br.r,
        left: shape.tl.c,
        right: shape.br.c,
      };
    }
  }
}
