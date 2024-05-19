import { Line, Rectangle } from "../shapes";
import { resize, translate } from "../transformation";
import { getBoundingBoxOfAll } from "../shapeInCanvas";

describe("translate()", () => {
  test("Translate rectangle dr,dc = 1,1", () => {
    const canvasSize = { rows: 100, cols: 100 };

    const rectangle: Rectangle = {
      type: "RECTANGLE",
      tl: { r: 1, c: 1 },
      br: { r: 5, c: 5 },
    };

    const translatedRectangle = translate(
      rectangle,
      { r: 1, c: 1 },
      canvasSize
    ) as Rectangle;

    expect(translatedRectangle.tl).toEqual({ r: 2, c: 2 });
    expect(translatedRectangle.br).toEqual({ r: 6, c: 6 });
  });

  test("Translate rectangle dr,dc = -1,-1", () => {
    const canvasSize = { rows: 100, cols: 100 };

    const rectangle: Rectangle = {
      type: "RECTANGLE",
      tl: { r: 1, c: 1 },
      br: { r: 5, c: 5 },
    };

    const translatedRectangle = translate(
      rectangle,
      { r: -1, c: -1 },
      canvasSize
    ) as Rectangle;

    expect(translatedRectangle.tl).toEqual({ r: 0, c: 0 });
    expect(translatedRectangle.br).toEqual({ r: 4, c: 4 });
  });

  test("Cannot translate rectangle beyond top border", () => {
    const canvasSize = { rows: 10, cols: 10 };

    const rectangle: Rectangle = {
      type: "RECTANGLE",
      tl: { r: 0, c: 0 },
      br: { r: 4, c: 4 },
    };

    const translatedRectangle = translate(
      rectangle,
      { r: -1, c: 0 },
      canvasSize
    ) as Rectangle;

    expect(translatedRectangle.tl).toEqual({ r: 0, c: 0 });
    expect(translatedRectangle.br).toEqual({ r: 4, c: 4 });
  });

  test("Cannot translate rectangle beyond left border", () => {
    const canvasSize = { rows: 10, cols: 10 };

    const rectangle: Rectangle = {
      type: "RECTANGLE",
      tl: { r: 0, c: 0 },
      br: { r: 4, c: 4 },
    };

    const translatedRectangle = translate(
      rectangle,
      { r: 0, c: -1 },
      canvasSize
    ) as Rectangle;

    expect(translatedRectangle.tl).toEqual({ r: 0, c: 0 });
    expect(translatedRectangle.br).toEqual({ r: 4, c: 4 });
  });

  test("Cannot translate rectangle beyond right border", () => {
    const canvasSize = { rows: 10, cols: 10 };

    const rectangle: Rectangle = {
      type: "RECTANGLE",
      tl: { r: 5, c: 5 },
      br: { r: 9, c: 9 },
    };

    const translatedRectangle = translate(
      rectangle,
      { r: 0, c: 1 },
      canvasSize
    ) as Rectangle;

    expect(translatedRectangle.tl).toEqual({ r: 5, c: 5 });
    expect(translatedRectangle.br).toEqual({ r: 9, c: 9 });
  });

  test("Cannot translate rectangle beyond right border (test 2)", () => {
    const canvasSize = { rows: 10, cols: 10 };

    const rectangle: Rectangle = {
      type: "RECTANGLE",
      tl: { r: 2, c: 6 },
      br: { r: 4, c: 8 },
    };

    const translatedRectangle = translate(
      rectangle,
      { r: 0, c: 2 },
      canvasSize
    ) as Rectangle;

    expect(translatedRectangle.tl).toEqual({ r: 2, c: 7 });
    expect(translatedRectangle.br).toEqual({ r: 4, c: 9 });
  });

  test("Cannot translate rectangle beyond bottom border", () => {
    const canvasSize = { rows: 10, cols: 10 };

    const rectangle: Rectangle = {
      type: "RECTANGLE",
      tl: { r: 5, c: 5 },
      br: { r: 9, c: 9 },
    };

    const translatedRectangle = translate(
      rectangle,
      { r: 1, c: 0 },
      canvasSize
    ) as Rectangle;

    expect(translatedRectangle.tl).toEqual({ r: 5, c: 5 });
    expect(translatedRectangle.br).toEqual({ r: 9, c: 9 });
  });
});

describe("resize()", () => {
  test("Resize rectangle by dragging TL delta=(-1,-1)", () => {
    const canvasSize = { rows: 10, cols: 10 };

    const rectangle: Rectangle = {
      type: "RECTANGLE",
      tl: { r: 1, c: 1 },
      br: { r: 5, c: 5 },
    };

    const resizedRectangle = resize(
      rectangle,
      { r: 1, c: 1 },
      { r: -1, c: -1 },
      canvasSize
    ) as Rectangle;

    expect(resizedRectangle.tl).toEqual({ r: 0, c: 0 });
    expect(resizedRectangle.br).toEqual(rectangle.br);
  });

  test("Resize rectangle by dragging TR delta=(-1,1)", () => {
    const canvasSize = { rows: 10, cols: 10 };

    const rectangle: Rectangle = {
      type: "RECTANGLE",
      tl: { r: 1, c: 1 },
      br: { r: 5, c: 5 },
    };

    const resizedRectangle = resize(
      rectangle,
      { r: 1, c: 5 },
      { r: -1, c: 1 },
      canvasSize
    ) as Rectangle;

    expect(resizedRectangle.tl).toEqual({ r: 0, c: 1 });
    expect(resizedRectangle.br).toEqual({ r: 5, c: 6 });
  });

  test("Resize rectangle by dragging BR delta=(1,1)", () => {
    const canvasSize = { rows: 10, cols: 10 };

    const rectangle: Rectangle = {
      type: "RECTANGLE",
      tl: { r: 1, c: 1 },
      br: { r: 5, c: 5 },
    };

    const resizedRectangle = resize(
      rectangle,
      { r: 5, c: 5 },
      { r: 1, c: 1 },
      canvasSize
    ) as Rectangle;

    expect(resizedRectangle.tl).toEqual(rectangle.tl);
    expect(resizedRectangle.br).toEqual({ r: 6, c: 6 });
  });

  test("Resize rectangle by dragging BL delta=(1,-1)", () => {
    const canvasSize = { rows: 10, cols: 10 };

    const rectangle: Rectangle = {
      type: "RECTANGLE",
      tl: { r: 1, c: 1 },
      br: { r: 5, c: 5 },
    };

    const resizedRectangle = resize(
      rectangle,
      { r: 5, c: 1 },
      { r: 1, c: -1 },
      canvasSize
    ) as Rectangle;

    expect(resizedRectangle.tl).toEqual({ r: 1, c: 0 });
    expect(resizedRectangle.br).toEqual({ r: 6, c: 5 });
  });

  test("Resize rectangle by inverting TL and BR", () => {
    const canvasSize = { rows: 10, cols: 10 };

    const rectangle: Rectangle = {
      type: "RECTANGLE",
      tl: { r: 1, c: 1 },
      br: { r: 5, c: 5 },
    };

    const resizedRectangle = resize(
      rectangle,
      { r: 1, c: 1 },
      { r: 6, c: 6 },
      canvasSize
    ) as Rectangle;

    expect(resizedRectangle.tl).toEqual(rectangle.br);
    expect(resizedRectangle.br).toEqual({ r: 7, c: 7 });
  });

  test("Extend a horizontal line by dragging start", () => {
    const canvasSize = { rows: 10, cols: 10 };

    const line: Line = {
      type: "LINE",
      axis: "HORIZONTAL",
      direction: "LEFT_TO_RIGHT",
      start: { r: 0, c: 1 },
      end: { r: 0, c: 3 },
    };

    const resizedLine = resize(
      line,
      { r: 0, c: 1 },
      { r: 0, c: -1 },
      canvasSize
    );

    expect(resizedLine).toEqual({
      type: "LINE",
      axis: "HORIZONTAL",
      direction: "LEFT_TO_RIGHT",
      start: { r: 0, c: 0 },
      end: { r: 0, c: 3 },
    });
  });
});

describe("mergeBoundingBoxes()", () => {
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

  const bb = getBoundingBoxOfAll([rectangle1, rectangle2]);

  expect(bb).toEqual({ top: 0, bottom: 7, left: 0, right: 7 });
});
