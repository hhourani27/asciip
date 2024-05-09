import { Coords, Shape } from "./shapes";

export function translate(
  shape: Shape,
  delta: Coords,
  canvasSize: { rows: number; cols: number }
): Shape {
  const translatedShape = { ...shape };
  if (shape.type === "RECTANGLE") {
    const { tl, br } = translatedShape;
    translatedShape.tl = { r: tl.r + delta.r, c: tl.c + delta.c };
    translatedShape.br = { r: br.r + delta.r, c: br.c + delta.c };
  }

  if (isShapeLegal(translatedShape, canvasSize)) return translatedShape;
  else return shape;
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
