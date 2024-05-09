import { Rectangle } from "./shapes";
import { translate } from "./transformation";

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
    );

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
    );

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
    );

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
    );

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
    );

    expect(translatedRectangle.tl).toEqual({ r: 5, c: 5 });
    expect(translatedRectangle.br).toEqual({ r: 9, c: 9 });
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
    );

    expect(translatedRectangle.tl).toEqual({ r: 5, c: 5 });
    expect(translatedRectangle.br).toEqual({ r: 9, c: 9 });
  });
});
