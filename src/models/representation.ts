import { Shape } from "./shapes";
import _ from "lodash";

export type CellValueMap = {
  [key: number]: { [key: number]: string };
};

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
    const tr = { x: tl.x, y: br.y };
    const bl = { x: br.x, y: tl.y };

    for (let x = tl.x; x <= bl.x; x++) {
      repr[x] = {};
    }

    repr[tl.x][tl.y] = "+";
    repr[br.x][br.y] = "+";
    repr[tr.x][tr.y] = "+";
    repr[bl.x][bl.y] = "+";

    for (let y = tl.y + 1; y < tr.y; y++) {
      repr[tl.x][y] = "-";
      repr[bl.x][y] = "-";
    }
    for (let x = tl.x + 1; x < bl.x; x++) {
      repr[x][tl.y] = "|";
      repr[x][tr.y] = "|";
    }
  }

  return repr;
}
