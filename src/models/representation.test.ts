import {
  getCanvasGridRepresentation,
  getShapeRepresentation,
  getTextExportRepresentation,
} from "./representation";
import { Rectangle } from "./shapes";

describe("getShapeRepresentation()", () => {
  test("Representation of 6x6 rectangle", () => {
    const rectangle: Rectangle = {
      type: "RECTANGLE",
      tl: { r: 0, c: 0 },
      br: { r: 5, c: 5 },
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
      tl: { r: 0, c: 0 },
      br: { r: 2, c: 2 },
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
      tl: { r: 0, c: 0 },
      br: { r: 1, c: 1 },
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
      tl: { r: 0, c: 0 },
      br: { r: 0, c: 0 },
    };

    const repr = getShapeRepresentation(rectangle);

    expect(repr).toEqual({
      0: { 0: "+" },
    });
  });
});

describe("getCanvasGridRepresentation()", () => {
  test("Grid with a single rectangle", () => {
    const rectangle: Rectangle = {
      type: "RECTANGLE",
      tl: { r: 0, c: 0 },
      br: { r: 3, c: 3 },
    };

    const grid = getCanvasGridRepresentation(4, 4, [rectangle]);

    expect(grid).toEqual([
      ["+", "-", "-", "+"],
      ["|", " ", " ", "|"],
      ["|", " ", " ", "|"],
      ["+", "-", "-", "+"],
    ]);
  });

  test("Grid with 2 adjacent rectangles", () => {
    const rectangle1: Rectangle = {
      type: "RECTANGLE",
      tl: { r: 0, c: 0 },
      br: { r: 3, c: 3 },
    };

    const rectangle2: Rectangle = {
      type: "RECTANGLE",
      tl: { r: 4, c: 4 },
      br: { r: 7, c: 7 },
    };

    const grid = getCanvasGridRepresentation(10, 10, [rectangle1, rectangle2]);

    expect(grid).toEqual([
      ["+", "-", "-", "+", " ", " ", " ", " ", " ", " "],
      ["|", " ", " ", "|", " ", " ", " ", " ", " ", " "],
      ["|", " ", " ", "|", " ", " ", " ", " ", " ", " "],
      ["+", "-", "-", "+", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", "+", "-", "-", "+", " ", " "],
      [" ", " ", " ", " ", "|", " ", " ", "|", " ", " "],
      [" ", " ", " ", " ", "|", " ", " ", "|", " ", " "],
      [" ", " ", " ", " ", "+", "-", "-", "+", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
    ]);
  });

  test("Grid with 2 overlapping rectangles", () => {
    const rectangle1: Rectangle = {
      type: "RECTANGLE",
      tl: { r: 0, c: 0 },
      br: { r: 3, c: 3 },
    };

    const rectangle2: Rectangle = {
      type: "RECTANGLE",
      tl: { r: 1, c: 1 },
      br: { r: 3, c: 3 },
    };

    const grid = getCanvasGridRepresentation(4, 4, [rectangle1, rectangle2]);

    expect(grid).toEqual([
      ["+", "-", "-", "+"],
      ["|", "+", "-", "+"],
      ["|", "|", " ", "|"],
      ["+", "+", "-", "+"],
    ]);
  });
});

describe("getTextExportRepresentation()", () => {
  test("Export a single rectangle at the center of the canvas", () => {
    const rectangle: Rectangle = {
      type: "RECTANGLE",
      tl: { r: 3, c: 3 },
      br: { r: 6, c: 6 },
    };

    const exportText = getTextExportRepresentation(10, 10, [rectangle]);

    expect(exportText).toBe("// +--+\n// |  |\n// |  |\n// +--+");
  });

  test("Export 2 adjacent rectangles", () => {
    const rectangle1: Rectangle = {
      type: "RECTANGLE",
      tl: { r: 0, c: 0 },
      br: { r: 3, c: 3 },
    };

    const rectangle2: Rectangle = {
      type: "RECTANGLE",
      tl: { r: 4, c: 4 },
      br: { r: 7, c: 7 },
    };

    const exportText = getTextExportRepresentation(10, 10, [
      rectangle1,
      rectangle2,
    ]);

    expect(exportText).toBe(
      "// +--+    \n// |  |    \n// |  |    \n// +--+    \n//     +--+\n//     |  |\n//     |  |\n//     +--+"
    );
  });
});
