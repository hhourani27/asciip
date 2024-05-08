export type Coords = {
  r: number;
  c: number;
};

export type Rectangle = {
  type: "RECTANGLE";
  tl: Coords;
  br: Coords;
};

export type Shape = Rectangle;
