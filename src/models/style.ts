import _ from "lodash";
import { Char, LineChar } from "./representation";

export type StyleMode = "ASCII" | "UNICODE";

export type LINE_STYLE =
  | "ASCII"
  | "LIGHT"
  | "LIGHT_ROUNDED"
  | "HEAVY"
  | "DOUBLE";

export type ARROW_STYLE = "ASCII" | "OUTLINED" | "FILLED";

//see https://symbl.cc/en/unicode/blocks/box-drawing/
/*
Tested fonts are 

Courier New
Consolas
Monaco
DejaVu Sans Mono
Menlo
Ubuntu Mono
Fira Code
Source Code Pro
Inconsolata
IBM Plex Mono
*/
export const line_repr = {
  LINE_HORIZONTAL: {
    ASCII: "-",
    LIGHT: "─",
    LIGHT_ROUNDED: "─",
    HEAVY: "━",
    DOUBLE: "═",
  },
  LINE_VERTICAL: {
    ASCII: "|",
    LIGHT: "│",
    LIGHT_ROUNDED: "│",
    HEAVY: "┃",
    DOUBLE: "║",
  },
  CORNER_TL: {
    ASCII: "+",
    LIGHT: "┌",
    LIGHT_ROUNDED: "╭",
    HEAVY: "┏",
    DOUBLE: "╔",
  },
  CORNER_TR: {
    ASCII: "+",
    LIGHT: "┐",
    LIGHT_ROUNDED: "╮",
    HEAVY: "┓",
    DOUBLE: "╗",
  },
  CORNER_BR: {
    ASCII: "+",
    LIGHT: "┘",
    LIGHT_ROUNDED: "╯",
    HEAVY: "┛",
    DOUBLE: "╝",
  },
  CORNER_BL: {
    ASCII: "+",
    LIGHT: "└",
    LIGHT_ROUNDED: "╰",
    HEAVY: "┗",
    DOUBLE: "╚",
  },
};

export const arrow_repr = {
  ARROW_UP: {
    ASCII: "^",
    FILLED: "▲", // 25B2: Black Up-Pointing Triangle
    OUTLINED: "△", // 25B3: White Up-Pointing Triangle
  },
  ARROW_DOWN: {
    ASCII: "v",
    FILLED: "▼", // 25BC: Black Down-Pointing Triangle
    OUTLINED: "▽", // 25BD: White Down-Pointing Triangle
  },
  ARROW_LEFT: {
    ASCII: "<",
    FILLED: "◄", // 25C4: Black Left-Pointing Pointer
    OUTLINED: "◁", // 25C1: White Left-Pointing Triangle
  },
  ARROW_RIGHT: {
    ASCII: ">",
    FILLED: "►", //25BA: Black Right-Pointing Pointer
    OUTLINED: "▷", //25B7: White Right-Pointing Triangle
  },
};

export type Style = {
  lineStyle: LINE_STYLE;
  arrowStyle: ARROW_STYLE;
  arrowStartHead: boolean; // TODO: simplify and use a single value arrowHeadStyle
  arrowEndHead: boolean;
};

export function defaultStyle(): Style {
  return {
    lineStyle: "LIGHT",
    arrowStyle: "FILLED",
    arrowStartHead: false,
    arrowEndHead: true,
  };
}

export function getCharRepr(
  char: Char,
  {
    styleMode = "ASCII",
    globalStyle,
    shapeStyle,
  }: {
    styleMode?: StyleMode;
    globalStyle: Style;
    shapeStyle?: Partial<Style>;
  }
): string {
  const style: Style = { ...globalStyle };
  if (shapeStyle) {
    _.merge(style, shapeStyle);
  }

  if (char.length === 1) return char;

  switch (char) {
    case "LINE_HORIZONTAL":
    case "LINE_VERTICAL":
    case "CORNER_TR":
    case "CORNER_TL":
    case "CORNER_BR":
    case "CORNER_BL":
      return line_repr[char as LineChar][
        styleMode === "ASCII" ? "ASCII" : style.lineStyle
      ];
    case "LINEHEAD_START_UP":
      return style.arrowStartHead
        ? arrow_repr["ARROW_UP"][
            styleMode === "ASCII" ? "ASCII" : style.arrowStyle
          ]
        : line_repr["LINE_VERTICAL"][
            styleMode === "ASCII" ? "ASCII" : style.lineStyle
          ];
    case "LINEHEAD_START_DOWN":
      return style.arrowStartHead
        ? arrow_repr["ARROW_DOWN"][
            styleMode === "ASCII" ? "ASCII" : style.arrowStyle
          ]
        : line_repr["LINE_VERTICAL"][
            styleMode === "ASCII" ? "ASCII" : style.lineStyle
          ];
    case "LINEHEAD_START_LEFT":
      return style.arrowStartHead
        ? arrow_repr["ARROW_LEFT"][
            styleMode === "ASCII" ? "ASCII" : style.arrowStyle
          ]
        : line_repr["LINE_HORIZONTAL"][
            styleMode === "ASCII" ? "ASCII" : style.lineStyle
          ];
    case "LINEHEAD_START_RIGHT":
      return style.arrowStartHead
        ? arrow_repr["ARROW_RIGHT"][
            styleMode === "ASCII" ? "ASCII" : style.arrowStyle
          ]
        : line_repr["LINE_HORIZONTAL"][
            styleMode === "ASCII" ? "ASCII" : style.lineStyle
          ];
    case "LINEHEAD_END_UP":
      return style.arrowEndHead
        ? arrow_repr["ARROW_UP"][
            styleMode === "ASCII" ? "ASCII" : style.arrowStyle
          ]
        : line_repr["LINE_VERTICAL"][
            styleMode === "ASCII" ? "ASCII" : style.lineStyle
          ];
    case "LINEHEAD_END_DOWN":
      return style.arrowEndHead
        ? arrow_repr["ARROW_DOWN"][
            styleMode === "ASCII" ? "ASCII" : style.arrowStyle
          ]
        : line_repr["LINE_VERTICAL"][
            styleMode === "ASCII" ? "ASCII" : style.lineStyle
          ];
    case "LINEHEAD_END_LEFT":
      return style.arrowEndHead
        ? arrow_repr["ARROW_LEFT"][
            styleMode === "ASCII" ? "ASCII" : style.arrowStyle
          ]
        : line_repr["LINE_HORIZONTAL"][
            styleMode === "ASCII" ? "ASCII" : style.lineStyle
          ];
    case "LINEHEAD_END_RIGHT":
      return style.arrowEndHead
        ? arrow_repr["ARROW_RIGHT"][
            styleMode === "ASCII" ? "ASCII" : style.arrowStyle
          ]
        : line_repr["LINE_HORIZONTAL"][
            styleMode === "ASCII" ? "ASCII" : style.lineStyle
          ];
  }

  return EMPTY_CHAR;
}

export const EMPTY_CHAR = "▯";
