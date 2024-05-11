export type Coords = {
  r: number;
  c: number;
};

export type Rectangle = {
  type: "RECTANGLE";
  tl: Coords;
  br: Coords;
};

export type Line = {
  type: "LINE";
  start: Coords;
  inflection: Coords;
  end: Coords;
};

export type Shape = Rectangle | Line;

export function getLineInflection(start: Coords, end: Coords): Coords {
  return { r: end.r, c: start.c };
}
