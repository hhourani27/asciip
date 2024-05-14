import { CanvasSize } from "../store/appSlice";
import { TextShape } from "./shapes";

export function getStringFromShape(textShape: TextShape): string {
  return textShape.lines.join("\n");
}

export function getLines(text: string): string[] {
  return text.split("\n");
}

export function capTextShape(
  textShape: TextShape,
  canvasSize: CanvasSize
): TextShape {
  return {
    ...textShape,
    lines: textShape.lines
      .filter((_line, idx) => textShape.start.r + idx < canvasSize.rows)
      .map((line) => line.slice(0, canvasSize.cols - textShape.start.c)),
  };
}
