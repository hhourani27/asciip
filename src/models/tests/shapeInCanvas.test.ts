import { ShapeObject } from "../../store/diagramSlice";
import { moveShapeToBack, moveShapeToFront } from "../shapeInCanvas";

//#region moveShapeToFront()
describe("moveShapeToFront()", () => {
  // Moving a shape, no text
  test("SHAPE_0, Shape_1 (t), Shape_2 (t) => Shape_1 (t), SHAPE_0, Shape_2 (t)", () => {
    const shapes: ShapeObject[] = [
      {
        id: "line_0",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 5 },
        },
      },
      {
        id: "rectangle_1",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 0 }, br: { r: 2, c: 2 } },
      },
      {
        id: "rectangle_2",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 3 }, br: { r: 2, c: 5 } },
      },
    ];

    const movedShapes = moveShapeToFront(shapes, "line_0");

    expect(movedShapes.map((s) => s.id)).toEqual([
      "rectangle_1",
      "line_0",
      "rectangle_2",
    ]);
  });

  test("SHAPE_0, Shape_1, Shape_2 (t) => Shape_1, Shape_2 (t), SHAPE_0", () => {
    const shapes: ShapeObject[] = [
      {
        id: "line_0",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 5 },
        },
      },
      {
        id: "rectangle_1",
        shape: { type: "RECTANGLE", tl: { r: 1, c: 0 }, br: { r: 3, c: 2 } },
      },
      {
        id: "rectangle_2",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 3 }, br: { r: 2, c: 5 } },
      },
    ];

    const movedShapes = moveShapeToFront(shapes, "line_0");

    expect(movedShapes.map((s) => s.id)).toEqual([
      "rectangle_1",
      "rectangle_2",
      "line_0",
    ]);
  });

  test("SHAPE_0, Shape_1, Shape_2 => Shape_1, Shape_2, SHAPE_0", () => {
    const shapes: ShapeObject[] = [
      {
        id: "line_0",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 5 },
        },
      },
      {
        id: "rectangle_1",
        shape: { type: "RECTANGLE", tl: { r: 1, c: 0 }, br: { r: 3, c: 2 } },
      },
      {
        id: "rectangle_2",
        shape: { type: "RECTANGLE", tl: { r: 1, c: 3 }, br: { r: 3, c: 5 } },
      },
    ];

    const movedShapes = moveShapeToFront(shapes, "line_0");

    expect(movedShapes.map((s) => s.id)).toEqual([
      "rectangle_1",
      "rectangle_2",
      "line_0",
    ]);
  });

  test("SHAPE_0, Shape_1, Shape_2 (t), Shape_3, Shape_4 (t) => Shape_1, Shape_2 (t), SHAPE_0, Shape_3, Shape_4 (t)", () => {
    const shapes: ShapeObject[] = [
      {
        id: "line_0",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 5 },
        },
      },
      {
        id: "rectangle_1",
        shape: { type: "RECTANGLE", tl: { r: 3, c: 0 }, br: { r: 5, c: 2 } },
      },
      {
        id: "rectangle_2",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 0 }, br: { r: 2, c: 2 } },
      },
      {
        id: "rectangle_3",
        shape: { type: "RECTANGLE", tl: { r: 3, c: 3 }, br: { r: 5, c: 5 } },
      },
      {
        id: "rectangle_4",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 3 }, br: { r: 2, c: 5 } },
      },
    ];

    const movedShapes = moveShapeToFront(shapes, "line_0");

    expect(movedShapes.map((s) => s.id)).toEqual([
      "rectangle_1",
      "rectangle_2",
      "line_0",
      "rectangle_3",
      "rectangle_4",
    ]);
  });

  // Moving a shape, with text in front
  test("SHAPE_0, Shape_1 (t), Shape_2 (t), Text_3 => Shape_1 (t), SHAPE_0, Shape_2 (t), Text_3", () => {
    const shapes: ShapeObject[] = [
      {
        id: "line_0",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 5 },
        },
      },
      {
        id: "rectangle_1",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 0 }, br: { r: 2, c: 2 } },
      },
      {
        id: "rectangle_2",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 3 }, br: { r: 2, c: 5 } },
      },
      {
        id: "text_3",
        shape: { type: "TEXT", start: { r: 0, c: 0 }, lines: ["Hello"] },
      },
    ];

    const movedShapes = moveShapeToFront(shapes, "line_0");

    expect(movedShapes.map((s) => s.id)).toEqual([
      "rectangle_1",
      "line_0",
      "rectangle_2",
      "text_3",
    ]);
  });

  test("SHAPE_0, Shape_1, Shape_2 (t), Text_3 => Shape_1, Shape_2 (t), SHAPE_0, Text_3", () => {
    const shapes: ShapeObject[] = [
      {
        id: "line_0",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 5 },
        },
      },
      {
        id: "rectangle_1",
        shape: { type: "RECTANGLE", tl: { r: 1, c: 0 }, br: { r: 3, c: 2 } },
      },
      {
        id: "rectangle_2",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 3 }, br: { r: 2, c: 5 } },
      },
      {
        id: "text_3",
        shape: { type: "TEXT", start: { r: 0, c: 0 }, lines: ["Hello"] },
      },
    ];

    const movedShapes = moveShapeToFront(shapes, "line_0");

    expect(movedShapes.map((s) => s.id)).toEqual([
      "rectangle_1",
      "rectangle_2",
      "line_0",
      "text_3",
    ]);
  });

  test("SHAPE_0, Shape_1, Shape_2, Text_3 => Shape_1, Shape_2, SHAPE_0, Text_3", () => {
    const shapes: ShapeObject[] = [
      {
        id: "line_0",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 5 },
        },
      },
      {
        id: "rectangle_1",
        shape: { type: "RECTANGLE", tl: { r: 1, c: 0 }, br: { r: 3, c: 2 } },
      },
      {
        id: "rectangle_2",
        shape: { type: "RECTANGLE", tl: { r: 1, c: 3 }, br: { r: 3, c: 5 } },
      },
      {
        id: "text_3",
        shape: { type: "TEXT", start: { r: 0, c: 0 }, lines: ["Hello"] },
      },
    ];

    const movedShapes = moveShapeToFront(shapes, "line_0");

    expect(movedShapes.map((s) => s.id)).toEqual([
      "rectangle_1",
      "rectangle_2",
      "line_0",
      "text_3",
    ]);
  });

  test("SHAPE_0, Shape_1, Shape_2 (t), Shape_3, Shape_4 (t), Text_5 => Shape_1, Shape_2 (t), SHAPE_0, Shape_3, Shape_4 (t), Text_5", () => {
    const shapes: ShapeObject[] = [
      {
        id: "line_0",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 5 },
        },
      },
      {
        id: "rectangle_1",
        shape: { type: "RECTANGLE", tl: { r: 3, c: 0 }, br: { r: 5, c: 2 } },
      },
      {
        id: "rectangle_2",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 0 }, br: { r: 2, c: 2 } },
      },
      {
        id: "rectangle_3",
        shape: { type: "RECTANGLE", tl: { r: 3, c: 3 }, br: { r: 5, c: 5 } },
      },
      {
        id: "rectangle_4",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 3 }, br: { r: 2, c: 5 } },
      },
      {
        id: "text_5",
        shape: { type: "TEXT", start: { r: 0, c: 0 }, lines: ["Hello"] },
      },
    ];

    const movedShapes = moveShapeToFront(shapes, "line_0");

    expect(movedShapes.map((s) => s.id)).toEqual([
      "rectangle_1",
      "rectangle_2",
      "line_0",
      "rectangle_3",
      "rectangle_4",
      "text_5",
    ]);
  });

  // Moving a text, with shape in back
  test("Shape_0, TEXT_0, Text_1 (t), Text_2 (t) => Shape_0, Text_1 (t), TEXT_0, Text_2 (t)", () => {
    const shapes: ShapeObject[] = [
      {
        id: "line_0",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 5 },
        },
      },
      {
        id: "text_0",
        shape: { type: "TEXT", start: { r: 0, c: 0 }, lines: ["Hello"] },
      },
      {
        id: "text_1",
        shape: { type: "TEXT", start: { r: 0, c: 1 }, lines: ["world"] },
      },
      {
        id: "text_2",
        shape: { type: "TEXT", start: { r: 0, c: 2 }, lines: ["foo"] },
      },
    ];

    const movedShapes = moveShapeToFront(shapes, "text_0");

    expect(movedShapes.map((s) => s.id)).toEqual([
      "line_0",
      "text_1",
      "text_0",
      "text_2",
    ]);
  });

  test("Shape_0, TEXT_0, Text_1, Text_2 (t) => Shape_0, Text_1, Text_2 (t), TEXT_0", () => {
    const shapes: ShapeObject[] = [
      {
        id: "line_0",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 5 },
        },
      },
      {
        id: "text_0",
        shape: { type: "TEXT", start: { r: 0, c: 0 }, lines: ["Hello"] },
      },
      {
        id: "text_1",
        shape: { type: "TEXT", start: { r: 1, c: 1 }, lines: ["world"] },
      },
      {
        id: "text_2",
        shape: { type: "TEXT", start: { r: 0, c: 2 }, lines: ["foo"] },
      },
    ];

    const movedShapes = moveShapeToFront(shapes, "text_0");

    expect(movedShapes.map((s) => s.id)).toEqual([
      "line_0",
      "text_1",
      "text_2",
      "text_0",
    ]);
  });
  test("Shape_0, TEXT_0, Text_1, Text_2 => Shape_0, Text_1, Text_2, TEXT_0", () => {
    const shapes: ShapeObject[] = [
      {
        id: "line_0",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 5 },
        },
      },
      {
        id: "text_0",
        shape: { type: "TEXT", start: { r: 0, c: 0 }, lines: ["Hello"] },
      },
      {
        id: "text_1",
        shape: { type: "TEXT", start: { r: 1, c: 1 }, lines: ["world"] },
      },
      {
        id: "text_2",
        shape: { type: "TEXT", start: { r: 1, c: 2 }, lines: ["foo"] },
      },
    ];

    const movedShapes = moveShapeToFront(shapes, "text_0");

    expect(movedShapes.map((s) => s.id)).toEqual([
      "line_0",
      "text_1",
      "text_2",
      "text_0",
    ]);
  });

  test("Shape_0, TEXT_0, Text_1, Text_2 (t), Text_3, Text_4 (t) => Text_1, Text_2 (t), TEXT_0, Text_3, Text_4 (t)", () => {
    const shapes: ShapeObject[] = [
      {
        id: "line_0",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 5 },
        },
      },
      {
        id: "text_0",
        shape: { type: "TEXT", start: { r: 0, c: 0 }, lines: ["Hello"] },
      },
      {
        id: "text_1",
        shape: { type: "TEXT", start: { r: 1, c: 1 }, lines: ["world"] },
      },
      {
        id: "text_2",
        shape: { type: "TEXT", start: { r: 0, c: 2 }, lines: ["foo"] },
      },
      {
        id: "text_3",
        shape: { type: "TEXT", start: { r: 1, c: 3 }, lines: ["bar"] },
      },
      {
        id: "text_4",
        shape: { type: "TEXT", start: { r: 0, c: 4 }, lines: ["shi"] },
      },
    ];

    const movedShapes = moveShapeToFront(shapes, "text_0");

    expect(movedShapes.map((s) => s.id)).toEqual([
      "line_0",
      "text_1",
      "text_2",
      "text_0",
      "text_3",
      "text_4",
    ]);
  });

  // Edge case : Only text
  test("TEXT_0, Text_1 (t), Text_2 (t) => Text_1 (t), TEXT_0, Text_2 (t)", () => {
    const shapes: ShapeObject[] = [
      {
        id: "text_0",
        shape: { type: "TEXT", start: { r: 0, c: 0 }, lines: ["Hello"] },
      },
      {
        id: "text_1",
        shape: { type: "TEXT", start: { r: 0, c: 1 }, lines: ["world"] },
      },
      {
        id: "text_2",
        shape: { type: "TEXT", start: { r: 0, c: 2 }, lines: ["foo"] },
      },
    ];

    const movedShapes = moveShapeToFront(shapes, "text_0");

    expect(movedShapes.map((s) => s.id)).toEqual([
      "text_1",
      "text_0",
      "text_2",
    ]);
  });

  // Edge case : single shape
  test("SHAPE_0 => SHAPE_0", () => {
    const shapes: ShapeObject[] = [
      {
        id: "line_0",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 5 },
        },
      },
    ];

    const movedShapes = moveShapeToFront(shapes, "line_0");

    expect(movedShapes.map((s) => s.id)).toEqual(["line_0"]);
  });

  // Edge case : Shape already on top (touching others)
  test("Shape_0 (t), Shape_1 (t), SHAPE_2 => Shape_0 (t), Shape_1 (t), SHAPE_2", () => {
    const shapes: ShapeObject[] = [
      {
        id: "rectangle_0",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 0 }, br: { r: 2, c: 2 } },
      },
      {
        id: "rectangle_1",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 3 }, br: { r: 2, c: 5 } },
      },
      {
        id: "line_2",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 5 },
        },
      },
    ];

    const movedShapes = moveShapeToFront(shapes, "line_2");

    expect(movedShapes.map((s) => s.id)).toEqual([
      "rectangle_0",
      "rectangle_1",
      "line_2",
    ]);
  });

  // Edge case : Shape already on top (not touching others)
  test("Shape_0, Shape_1, SHAPE_2 => Shape_0, Shape_1, SHAPE_2", () => {
    const shapes: ShapeObject[] = [
      {
        id: "rectangle_0",
        shape: { type: "RECTANGLE", tl: { r: 1, c: 0 }, br: { r: 3, c: 2 } },
      },
      {
        id: "rectangle_1",
        shape: { type: "RECTANGLE", tl: { r: 1, c: 3 }, br: { r: 3, c: 5 } },
      },
      {
        id: "line_2",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 5 },
        },
      },
    ];

    const movedShapes = moveShapeToFront(shapes, "line_2");

    expect(movedShapes.map((s) => s.id)).toEqual([
      "rectangle_0",
      "rectangle_1",
      "line_2",
    ]);
  });

  // Other case: Shape is in middle
  test("Shape_0, SHAPE_1, Shape_2 (t), Shape_3, Shape_4 (t), Text_5 => Shape_0, Shape_2 (t), SHAPE_1, Shape_3, Shape_4 (t), Text_5", () => {
    const shapes: ShapeObject[] = [
      {
        id: "rectangle_0",
        shape: { type: "RECTANGLE", tl: { r: 3, c: 0 }, br: { r: 5, c: 2 } },
      },
      {
        id: "line_1",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 5 },
        },
      },
      {
        id: "rectangle_2",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 0 }, br: { r: 2, c: 2 } },
      },
      {
        id: "rectangle_3",
        shape: { type: "RECTANGLE", tl: { r: 3, c: 3 }, br: { r: 5, c: 5 } },
      },
      {
        id: "rectangle_4",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 3 }, br: { r: 2, c: 5 } },
      },
      {
        id: "text_5",
        shape: { type: "TEXT", start: { r: 0, c: 0 }, lines: ["Hello"] },
      },
    ];

    const movedShapes = moveShapeToFront(shapes, "line_1");

    expect(movedShapes.map((s) => s.id)).toEqual([
      "rectangle_0",
      "rectangle_2",
      "line_1",
      "rectangle_3",
      "rectangle_4",
      "text_5",
    ]);
  });
});
//#endregion

//#region moveShapeToBack()
describe("moveShapeToBack()", () => {
  // Moving a shape, no text
  test("Shape_0 (t), Shape_1 (t), SHAPE_2 => Shape_0 (t), SHAPE_2, Shape_1 (t)", () => {
    const shapes: ShapeObject[] = [
      {
        id: "rectangle_0",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 0 }, br: { r: 2, c: 2 } },
      },
      {
        id: "rectangle_1",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 3 }, br: { r: 2, c: 5 } },
      },
      {
        id: "line_2",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 5 },
        },
      },
    ];

    const movedShapes = moveShapeToBack(shapes, "line_2");

    expect(movedShapes.map((s) => s.id)).toEqual([
      "rectangle_0",
      "line_2",
      "rectangle_1",
    ]);
  });

  test("Shape_0 (t), Shape_1, SHAPE_2 => SHAPE_2, Shape_0 (t), Shape_1", () => {
    const shapes: ShapeObject[] = [
      {
        id: "rectangle_0",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 0 }, br: { r: 2, c: 2 } },
      },
      {
        id: "rectangle_1",
        shape: { type: "RECTANGLE", tl: { r: 1, c: 3 }, br: { r: 3, c: 5 } },
      },
      {
        id: "line_2",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 5 },
        },
      },
    ];

    const movedShapes = moveShapeToBack(shapes, "line_2");

    expect(movedShapes.map((s) => s.id)).toEqual([
      "line_2",
      "rectangle_0",
      "rectangle_1",
    ]);
  });

  test("Shape_0, Shape_1, SHAPE_2 => SHAPE_2, Shape_0, Shape_1", () => {
    const shapes: ShapeObject[] = [
      {
        id: "rectangle_0",
        shape: { type: "RECTANGLE", tl: { r: 1, c: 0 }, br: { r: 3, c: 2 } },
      },
      {
        id: "rectangle_1",
        shape: { type: "RECTANGLE", tl: { r: 1, c: 3 }, br: { r: 3, c: 5 } },
      },
      {
        id: "line_2",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 5 },
        },
      },
    ];

    const movedShapes = moveShapeToBack(shapes, "line_2");

    expect(movedShapes.map((s) => s.id)).toEqual([
      "line_2",
      "rectangle_0",
      "rectangle_1",
    ]);
  });

  test("Shape_0 (t), Shape_1, Shape_2 (t), Shape_3, SHAPE_4 => Shape_0 (t), Shape_1, SHAPE_4, Shape_2 (t), Shape_3", () => {
    const shapes: ShapeObject[] = [
      {
        id: "rectangle_0",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 0 }, br: { r: 2, c: 2 } },
      },
      {
        id: "rectangle_1",
        shape: { type: "RECTANGLE", tl: { r: 3, c: 0 }, br: { r: 5, c: 2 } },
      },
      {
        id: "rectangle_2",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 3 }, br: { r: 2, c: 5 } },
      },
      {
        id: "rectangle_3",
        shape: { type: "RECTANGLE", tl: { r: 3, c: 3 }, br: { r: 5, c: 5 } },
      },
      {
        id: "line_4",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 5 },
        },
      },
    ];

    const movedShapes = moveShapeToBack(shapes, "line_4");

    expect(movedShapes.map((s) => s.id)).toEqual([
      "rectangle_0",
      "rectangle_1",
      "line_4",
      "rectangle_2",
      "rectangle_3",
    ]);
  });

  // Moving a text, with shape in back
  test("Shape_0, Text_0 (t), Text_1 (t), TEXT_2 => Shape_0, Text_0 (t), TEXT_2, Text_1 (t)", () => {
    const shapes: ShapeObject[] = [
      {
        id: "line_0",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 5 },
        },
      },
      {
        id: "text_0",
        shape: { type: "TEXT", start: { r: 0, c: 0 }, lines: ["Hello"] },
      },
      {
        id: "text_1",
        shape: { type: "TEXT", start: { r: 0, c: 1 }, lines: ["world"] },
      },
      {
        id: "text_2",
        shape: { type: "TEXT", start: { r: 0, c: 2 }, lines: ["foo"] },
      },
    ];

    const movedShapes = moveShapeToBack(shapes, "text_2");

    expect(movedShapes.map((s) => s.id)).toEqual([
      "line_0",
      "text_0",
      "text_2",
      "text_1",
    ]);
  });

  test("Shape_0, Text_0 (t), Text_1, TEXT_2 => Shape_0, TEXT_2, Text_0 (t), Text_1", () => {
    const shapes: ShapeObject[] = [
      {
        id: "line_0",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 5 },
        },
      },
      {
        id: "text_0",
        shape: { type: "TEXT", start: { r: 0, c: 0 }, lines: ["Hello"] },
      },
      {
        id: "text_1",
        shape: { type: "TEXT", start: { r: 1, c: 1 }, lines: ["world"] },
      },
      {
        id: "text_2",
        shape: { type: "TEXT", start: { r: 0, c: 2 }, lines: ["foo"] },
      },
    ];

    const movedShapes = moveShapeToBack(shapes, "text_2");

    expect(movedShapes.map((s) => s.id)).toEqual([
      "line_0",
      "text_2",
      "text_0",
      "text_1",
    ]);
  });

  test("Shape_0, Text_0, Text_1, TEXT_2 => Shape_0, TEXT_2, Text_0, Text_1", () => {
    const shapes: ShapeObject[] = [
      {
        id: "line_0",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 5 },
        },
      },
      {
        id: "text_0",
        shape: { type: "TEXT", start: { r: 1, c: 0 }, lines: ["Hello"] },
      },
      {
        id: "text_1",
        shape: { type: "TEXT", start: { r: 1, c: 1 }, lines: ["world"] },
      },
      {
        id: "text_2",
        shape: { type: "TEXT", start: { r: 0, c: 2 }, lines: ["foo"] },
      },
    ];

    const movedShapes = moveShapeToBack(shapes, "text_2");

    expect(movedShapes.map((s) => s.id)).toEqual([
      "line_0",
      "text_2",
      "text_0",
      "text_1",
    ]);
  });

  test("Shape_0, Text_0 (t), Text_1, Text_2 (t), Text_3, TEXT_4 => Shape_0, Text_0 (t), Text_1, TEXT_4, Text_2 (t), Text_3", () => {
    const shapes: ShapeObject[] = [
      {
        id: "line_0",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 5 },
        },
      },
      {
        id: "text_0",
        shape: { type: "TEXT", start: { r: 1, c: 0 }, lines: ["Hello"] },
      },
      {
        id: "text_1",
        shape: { type: "TEXT", start: { r: 1, c: 0 }, lines: ["world"] },
      },
      {
        id: "text_2",
        shape: { type: "TEXT", start: { r: 0, c: 1 }, lines: ["foo"] },
      },
      {
        id: "text_3",
        shape: { type: "TEXT", start: { r: 1, c: 1 }, lines: ["bar"] },
      },
      {
        id: "text_4",
        shape: { type: "TEXT", start: { r: 0, c: 2 }, lines: ["shi"] },
      },
    ];

    const movedShapes = moveShapeToBack(shapes, "text_4");

    expect(movedShapes.map((s) => s.id)).toEqual([
      "line_0",
      "text_0",
      "text_1",
      "text_4",
      "text_2",
      "text_3",
    ]);
  });

  // Edge case : single shape
  test("SHAPE_0 => SHAPE_0", () => {
    const shapes: ShapeObject[] = [
      {
        id: "line_0",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 5 },
        },
      },
    ];

    const movedShapes = moveShapeToBack(shapes, "line_0");

    expect(movedShapes.map((s) => s.id)).toEqual(["line_0"]);
  });

  // Edge case : Shape already in back (touching others)
  test("SHAPE_0, Shape_1 (t), shape_2 (t) => SHAPE_0, Shape_1 (t), shape_2 (t)", () => {
    const shapes: ShapeObject[] = [
      {
        id: "line_0",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 5 },
        },
      },
      {
        id: "rectangle_1",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 0 }, br: { r: 2, c: 2 } },
      },
      {
        id: "rectangle_2",
        shape: { type: "RECTANGLE", tl: { r: 0, c: 3 }, br: { r: 2, c: 5 } },
      },
    ];

    const movedShapes = moveShapeToBack(shapes, "line_0");

    expect(movedShapes.map((s) => s.id)).toEqual([
      "line_0",
      "rectangle_1",
      "rectangle_2",
    ]);
  });

  // Edge case : Shape already on top (not touching others)
  test("SHAPE_0, Shape_1, shape_2 => SHAPE_0, Shape_1, shape_2", () => {
    const shapes: ShapeObject[] = [
      {
        id: "line_0",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 5 },
        },
      },
      {
        id: "rectangle_1",
        shape: { type: "RECTANGLE", tl: { r: 1, c: 0 }, br: { r: 3, c: 2 } },
      },
      {
        id: "rectangle_2",
        shape: { type: "RECTANGLE", tl: { r: 1, c: 3 }, br: { r: 3, c: 5 } },
      },
    ];

    const movedShapes = moveShapeToBack(shapes, "line_0");

    expect(movedShapes.map((s) => s.id)).toEqual([
      "line_0",
      "rectangle_1",
      "rectangle_2",
    ]);
  });

  test("Shape_0, Text_0 (t), Text_1, TEXT_2, Text_3 (t), Text_4 => Shape_0, TEXT_2, Text_0 (t), Text_1, Text_3 (t), Text_4", () => {
    const shapes: ShapeObject[] = [
      {
        id: "line_0",
        shape: {
          type: "LINE",
          axis: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 5 },
        },
      },
      {
        id: "text_0",
        shape: { type: "TEXT", start: { r: 0, c: 0 }, lines: ["Hello"] },
      },
      {
        id: "text_1",
        shape: { type: "TEXT", start: { r: 1, c: 0 }, lines: ["world"] },
      },
      {
        id: "text_2",
        shape: { type: "TEXT", start: { r: 0, c: 1 }, lines: ["foo"] },
      },
      {
        id: "text_3",
        shape: { type: "TEXT", start: { r: 0, c: 1 }, lines: ["bar"] },
      },
      {
        id: "text_4",
        shape: { type: "TEXT", start: { r: 1, c: 2 }, lines: ["shi"] },
      },
    ];

    const movedShapes = moveShapeToBack(shapes, "text_2");

    expect(movedShapes.map((s) => s.id)).toEqual([
      "line_0",
      "text_2",
      "text_0",
      "text_1",
      "text_3",
      "text_4",
    ]);
  });
});

//#endregion
