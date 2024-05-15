import { CanvasSize } from "../store/diagramSlice";
import { Coords, TextShape } from "./shapes";

export function getStringFromShape(textShape: TextShape): string {
  return textShape.lines.join("\n");
}

export function getLines(text: string): string[] {
  return text.split("\n");
}

export function capText(
  start: Coords,
  lines: string[],
  canvasSize: CanvasSize
): string[] {
  return lines
    .filter((_line, idx) => start.r + idx < canvasSize.rows)
    .map((line) => line.slice(0, canvasSize.cols - start.c));
}
