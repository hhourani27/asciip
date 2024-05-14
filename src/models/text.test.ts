import { CanvasSize } from "../store/appSlice";
import { TextShape } from "./shapes";
import { capTextShape } from "./text";

describe("capTextShape()", () => {
  const canvasSize: CanvasSize = { rows: 10, cols: 10 };

  test("Text fits into canvas", () => {
    const text: TextShape = {
      type: "TEXT",
      start: { r: 5, c: 5 },
      lines: ["1234", "1234"],
    };

    const cappedText = capTextShape(text, canvasSize);

    expect(cappedText).toEqual(text);
  });

  test("Text fills until the last canvas row", () => {
    const text: TextShape = {
      type: "TEXT",
      start: { r: 5, c: 5 },
      lines: ["1234", "1234", "1234", "1234", "1234"],
    };

    const cappedText = capTextShape(text, canvasSize);

    expect(cappedText).toEqual(text);
  });

  test("Text exceeds canvas rows", () => {
    const text: TextShape = {
      type: "TEXT",
      start: { r: 5, c: 5 },
      lines: ["1234", "1234", "1234", "1234", "1234", "1234"],
    };

    const cappedText = capTextShape(text, canvasSize);

    expect(cappedText.lines).not.toHaveLength(text.lines.length);
    expect(cappedText.lines).toHaveLength(5);
  });

  test("Text fills until the last canvas columns", () => {
    const text: TextShape = {
      type: "TEXT",
      start: { r: 5, c: 5 },
      lines: ["12345", "12345"],
    };

    const cappedText = capTextShape(text, canvasSize);

    expect(cappedText).toEqual(text);
  });

  test("Text exceeds the canvas columns", () => {
    const text: TextShape = {
      type: "TEXT",
      start: { r: 5, c: 5 },
      lines: ["12345", "1234", "123456", "1234567", "1"],
    };

    const cappedText = capTextShape(text, canvasSize);

    expect(cappedText.lines).toEqual(["12345", "1234", "12345", "12345", "1"]);
  });
});
