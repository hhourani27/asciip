export type Coords = {
  x: number;
  y: number;
};

export type Rectangle = {
  type: "RECTANGLE";
  tl: Coords;
  br: Coords;
};

export type Shape = Rectangle;
