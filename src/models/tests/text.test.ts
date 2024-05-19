import { CanvasSize } from "../../store/diagramSlice";
import { capText } from "../text";

describe("capTextShape()", () => {
  const canvasSize: CanvasSize = { rows: 10, cols: 10 };

  test("Text fits into canvas", () => {
    const start = { r: 5, c: 5 };
    const lines = ["1234", "1234"];

    const cappedLines = capText(start, lines, canvasSize);

    expect(cappedLines).toEqual(lines);
  });

  test("Text fills until the last canvas row", () => {
    const start = { r: 5, c: 5 };
    const lines = ["1234", "1234", "1234", "1234", "1234"];

    const cappedLines = capText(start, lines, canvasSize);

    expect(cappedLines).toEqual(lines);
  });

  test("Text exceeds canvas rows", () => {
    const start = { r: 5, c: 5 };
    const lines = ["1234", "1234", "1234", "1234", "1234", "1234"];

    const cappedLines = capText(start, lines, canvasSize);

    expect(cappedLines).not.toHaveLength(lines.length);
    expect(cappedLines).toHaveLength(5);
  });

  test("Text fills until the last canvas columns", () => {
    const start = { r: 5, c: 5 };
    const lines = ["12345", "12345"];

    const cappedLines = capText(start, lines, canvasSize);

    expect(cappedLines).toEqual(lines);
  });

  test("Text exceeds the canvas columns", () => {
    const start = { r: 5, c: 5 };
    const lines = ["12345", "1234", "123456", "1234567", "1"];

    const cappedLines = capText(start, lines, canvasSize);

    expect(cappedLines).toEqual(["12345", "1234", "12345", "12345", "1"]);
  });
});
