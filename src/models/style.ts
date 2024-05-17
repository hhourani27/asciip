import _ from "lodash";
import { Char, LineChar } from "./representation";

export type StyleMode = "ASCII" | "UNICODE";

export type LINE_STYLE = "ASCII" | "LIGHT" | "HEAVY";
//   | "DOUBLE"
//   | "DOUBLE_DASH"
//   | "TRIPLE_DASH"
//   | "QUADRUPLE_DASH";

export type ARROW_STYLE = "ASCII" | "OUTLINED" | "FILLED";
//   | "OUTLINED_SMALL"
//   | "FILLED_SMALL";

//see https://symbl.cc/en/unicode/blocks/box-drawing/
export const line_repr = {
  LINE_HORIZONTAL: {
    ASCII: "-",
    LIGHT: "─",
    HEAVY: "━",
  },
  LINE_VERTICAL: {
    ASCII: "|",
    LIGHT: "│",
    HEAVY: "┃",
  },
  CORNER_TL: {
    ASCII: "+",
    LIGHT: "┌",
    HEAVY: "┏",
  },
  CORNER_TR: {
    ASCII: "+",
    LIGHT: "┐",
    HEAVY: "┓",
  },
  CORNER_BR: {
    ASCII: "+",
    LIGHT: "┘",
    HEAVY: "┛",
  },
  CORNER_BL: {
    ASCII: "+",
    LIGHT: "└",
    HEAVY: "┗",
  },
};

export const arrow_repr = {
  ARROW_UP: {
    ASCII: "^",
    OUTLINED: "△",
    FILLED: "▲",
  },
  ARROW_DOWN: {
    ASCII: "v",
    OUTLINED: "▽",
    FILLED: "▼",
  },
  ARROW_LEFT: {
    ASCII: "<",
    OUTLINED: "◁",
    FILLED: "◀",
  },
  ARROW_RIGHT: {
    ASCII: ">",
    OUTLINED: "▷",
    FILLED: "▶",
  },
};

export type Style = {
  lineStyle: LINE_STYLE;
  arrowStyle: ARROW_STYLE;
  arrowStartHead: boolean;
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
