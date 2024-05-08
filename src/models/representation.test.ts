import { getShapeRepresentation } from "./representation";
import { Rectangle } from "./shapes";

test("Representation of 6x6 rectangle", () => {
  const rectangle: Rectangle = {
    type: "RECTANGLE",
    tl: { x: 0, y: 0 },
    br: { x: 5, y: 5 },
  };

  const repr = getShapeRepresentation(rectangle);

  expect(repr).toEqual({
    0: { 0: "+", 1: "-", 2: "-", 3: "-", 4: "-", 5: "+" },
    1: { 0: "|", 5: "|" },
    2: { 0: "|", 5: "|" },
    3: { 0: "|", 5: "|" },
    4: { 0: "|", 5: "|" },
    5: { 0: "+", 1: "-", 2: "-", 3: "-", 4: "-", 5: "+" },
  });
});

test("Representation of 3x3 rectangle", () => {
  const rectangle: Rectangle = {
    type: "RECTANGLE",
    tl: { x: 0, y: 0 },
    br: { x: 2, y: 2 },
  };

  const repr = getShapeRepresentation(rectangle);

  expect(repr).toEqual({
    0: { 0: "+", 1: "-", 2: "+" },
    1: { 0: "|", 2: "|" },
    2: { 0: "+", 1: "-", 2: "+" },
  });
});

test("Representation of 2x2 rectangle", () => {
  const rectangle: Rectangle = {
    type: "RECTANGLE",
    tl: { x: 0, y: 0 },
    br: { x: 1, y: 1 },
  };

  const repr = getShapeRepresentation(rectangle);

  expect(repr).toEqual({
    0: { 0: "+", 1: "+" },
    1: { 0: "+", 1: "+" },
  });
});

test("Representation of 1x1 rectangle", () => {
  const rectangle: Rectangle = {
    type: "RECTANGLE",
    tl: { x: 0, y: 0 },
    br: { x: 0, y: 0 },
  };

  const repr = getShapeRepresentation(rectangle);

  expect(repr).toEqual({
    0: { 0: "+" },
  });
});
