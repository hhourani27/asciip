import { CanvasSize } from "../../store/diagramSlice";
import {
  getStyledCanvasGrid,
  getAbstractShapeRepresentation,
  getTextExport,
} from "../representation";
import { Line, MultiSegment, Rectangle } from "../shapes";

describe("getAbstractShapeRepresentation()", () => {
  test("Abstract Representation of 6x6 rectangle", () => {
    const rectangle: Rectangle = {
      type: "RECTANGLE",
      tl: { r: 0, c: 0 },
      br: { r: 5, c: 5 },
    };

    const repr = getAbstractShapeRepresentation(rectangle);

    expect(repr).toEqual({
      0: {
        0: "CORNER_TL",
        1: "LINE_HORIZONTAL",
        2: "LINE_HORIZONTAL",
        3: "LINE_HORIZONTAL",
        4: "LINE_HORIZONTAL",
        5: "CORNER_TR",
      },
      1: { 0: "LINE_VERTICAL", 5: "LINE_VERTICAL" },
      2: { 0: "LINE_VERTICAL", 5: "LINE_VERTICAL" },
      3: { 0: "LINE_VERTICAL", 5: "LINE_VERTICAL" },
      4: { 0: "LINE_VERTICAL", 5: "LINE_VERTICAL" },
      5: {
        0: "CORNER_BL",
        1: "LINE_HORIZONTAL",
        2: "LINE_HORIZONTAL",
        3: "LINE_HORIZONTAL",
        4: "LINE_HORIZONTAL",
        5: "CORNER_BR",
      },
    });
  });

  test("Abstract Representation of 3x3 rectangle", () => {
    const rectangle: Rectangle = {
      type: "RECTANGLE",
      tl: { r: 0, c: 0 },
      br: { r: 2, c: 2 },
    };

    const repr = getAbstractShapeRepresentation(rectangle);

    expect(repr).toEqual({
      0: { 0: "CORNER_TL", 1: "LINE_HORIZONTAL", 2: "CORNER_TR" },
      1: { 0: "LINE_VERTICAL", 2: "LINE_VERTICAL" },
      2: { 0: "CORNER_BL", 1: "LINE_HORIZONTAL", 2: "CORNER_BR" },
    });
  });

  test("Abstract Representation of 2x2 rectangle", () => {
    const rectangle: Rectangle = {
      type: "RECTANGLE",
      tl: { r: 0, c: 0 },
      br: { r: 1, c: 1 },
    };

    const repr = getAbstractShapeRepresentation(rectangle);

    expect(repr).toEqual({
      0: { 0: "CORNER_TL", 1: "CORNER_TR" },
      1: { 0: "CORNER_BL", 1: "CORNER_BR" },
    });
  });

  test("Abstract Representation of 1x1 rectangle", () => {
    const rectangle: Rectangle = {
      type: "RECTANGLE",
      tl: { r: 0, c: 0 },
      br: { r: 0, c: 0 },
    };

    const repr = getAbstractShapeRepresentation(rectangle);

    expect(repr).toEqual({
      0: { 0: "CORNER_TL" },
    });
  });

  test("Abstract Representation of a horizontal line", () => {
    const line: Line = {
      type: "LINE",
      axis: "HORIZONTAL",
      direction: "LEFT_TO_RIGHT",
      start: { r: 0, c: 0 },
      end: { r: 0, c: 3 },
    };

    const repr = getAbstractShapeRepresentation(line);

    expect(repr).toEqual({
      0: {
        0: "LINEHEAD_START_LEFT",
        1: "LINE_HORIZONTAL",
        2: "LINE_HORIZONTAL",
        3: "LINEHEAD_END_RIGHT",
      },
    });
  });

  test("Representation of a 2-segment line : Horizontal L2R + Vertical Up", () => {
    const line: MultiSegment = {
      type: "MULTI_SEGMENT_LINE",
      segments: [
        {
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 3, c: 0 },
          end: { r: 3, c: 2 },
        },
        {
          axis: "VERTICAL",
          direction: "UP",
          start: { r: 3, c: 2 },
          end: { r: 1, c: 2 },
        },
      ],
    };

    const repr = getAbstractShapeRepresentation(line);

    expect(repr).toEqual({
      1: { 2: "LINEHEAD_END_UP" },
      2: { 2: "LINE_VERTICAL" },
      3: { 0: "LINEHEAD_START_LEFT", 1: "LINE_HORIZONTAL", 2: "CORNER_BR" },
    });
  });
});

describe("getStyledCanvasGrid()", () => {
  test("Grid with a single rectangle (default styles)", () => {
    const canvasSize: CanvasSize = { rows: 4, cols: 4 };

    const rectangle: Rectangle = {
      type: "RECTANGLE",
      tl: { r: 0, c: 0 },
      br: { r: 3, c: 3 },
    };

    const grid = getStyledCanvasGrid(canvasSize, [rectangle]);

    expect(grid).toEqual([
      ["+", "-", "-", "+"],
      ["|", " ", " ", "|"],
      ["|", " ", " ", "|"],
      ["+", "-", "-", "+"],
    ]);
  });

  test("Grid with 2 adjacent rectangles (default styles)", () => {
    const canvasSize: CanvasSize = { rows: 10, cols: 10 };

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

    const grid = getStyledCanvasGrid(canvasSize, [rectangle1, rectangle2]);

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

  test("Grid with 2 overlapping rectangles (default styles)", () => {
    const canvasSize: CanvasSize = { rows: 4, cols: 4 };

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

    const grid = getStyledCanvasGrid(canvasSize, [rectangle1, rectangle2]);

    expect(grid).toEqual([
      ["+", "-", "-", "+"],
      ["|", "+", "-", "+"],
      ["|", "|", " ", "|"],
      ["+", "+", "-", "+"],
    ]);
  });
});

describe("getTextExport()", () => {
  test("Export a single rectangle at the center of the canvas (default styles)", () => {
    const rectangle: Rectangle = {
      type: "RECTANGLE",
      tl: { r: 3, c: 3 },
      br: { r: 6, c: 6 },
    };

    const exportText = getTextExport([rectangle]);

    expect(exportText).toBe("// +--+\n// |  |\n// |  |\n// +--+");
  });

  test("Export 2 adjacent rectangles (default styles)", () => {
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

    const exportText = getTextExport([rectangle1, rectangle2]);

    expect(exportText).toBe(
      "// +--+    \n// |  |    \n// |  |    \n// +--+    \n//     +--+\n//     |  |\n//     |  |\n//     +--+"
    );
  });
});
