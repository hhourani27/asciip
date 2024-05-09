import _ from "lodash";
import { CanvasSize } from "../store/appSlice";
import { Coords, Shape } from "./shapes";

export function translate(
  shape: Shape,
  delta: Coords,
  canvasSize: CanvasSize
): Shape {
  const translatedShape = { ...shape };
  if (shape.type === "RECTANGLE") {
    const { tl, br } = translatedShape;
    translatedShape.tl = { r: tl.r + delta.r, c: tl.c + delta.c };
    translatedShape.br = { r: br.r + delta.r, c: br.c + delta.c };
  }

  // If we translated outside the canvas bounds, then return the original shape
  if (isShapeLegal(translatedShape, canvasSize)) return translatedShape;
  else return shape;
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
