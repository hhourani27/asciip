import { TextShape } from "./shapes";

export function getStringFromShape(textShape: TextShape): string {
  return textShape.lines.join("\n");
}

export function getLines(text: string): string[] {
  return text.split("\n");
}
