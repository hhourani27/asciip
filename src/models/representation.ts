import { CanvasSize, ShapeObject } from "../store/diagramSlice";
import { Shape } from "./shapes";
import _ from "lodash";
import { getBoundingBoxOfAll } from "./shapeInCanvas";
import { getBoundingBox } from "./shapeInCanvas";
import { Style, StyleMode, defaultStyle, getCharRepr } from "./style";

export type LineChar =
  | "LINE_HORIZONTAL"
  | "LINE_VERTICAL"
  | "CORNER_TR"
  | "CORNER_TL"
  | "CORNER_BR"
  | "CORNER_BL";
export type LineHeadChar =
  | "LINEHEAD_START_UP"
  | "LINEHEAD_START_DOWN"
  | "LINEHEAD_START_LEFT"
  | "LINEHEAD_START_RIGHT"
  | "LINEHEAD_END_UP"
  | "LINEHEAD_END_DOWN"
  | "LINEHEAD_END_LEFT"
  | "LINEHEAD_END_RIGHT";

export type Char = LineChar | LineHeadChar | string | "EMPTY_CHAR";

export type CellValueMap = {
  [key: number]: { [key: number]: Char };
};

export type Grid = string[][];

export function getAbstractShapeRepresentation(shape: Shape): CellValueMap {
  const repr: CellValueMap = {};
  switch (shape.type) {
    case "RECTANGLE": {
      const { tl, br } = shape;

      // Special case: 1x1 rectangle
      if (_.isEqual(tl, br)) {
        repr[tl.r] = {};
        repr[tl.r][tl.c] = "CORNER_TL";
        return repr;
      }

      const tr = { x: tl.r, y: br.c };
      const bl = { x: br.r, y: tl.c };

      for (let x = tl.r; x <= bl.x; x++) {
        repr[x] = {};
      }

      repr[tl.r][tl.c] = "CORNER_TL";
      repr[br.r][br.c] = "CORNER_BR";
      repr[tr.x][tr.y] = "CORNER_TR";
      repr[bl.x][bl.y] = "CORNER_BL";

      for (let y = tl.c + 1; y < tr.y; y++) {
        repr[tl.r][y] = "LINE_HORIZONTAL";
        repr[bl.x][y] = "LINE_HORIZONTAL";
      }
      for (let x = tl.r + 1; x < bl.x; x++) {
        repr[x][tl.c] = "LINE_VERTICAL";
        repr[x][tr.y] = "LINE_VERTICAL";
      }

      return repr;
    }
    case "LINE": {
      // Prepare the objects in the repr
      const bb = getBoundingBox(shape);
      for (let x = bb.top; x <= bb.bottom; x++) {
        repr[x] = {};
      }

      switch (shape.axis) {
        case "HORIZONTAL": {
          _.merge(
            repr,
            reprHorizontalLine(shape.start.r, shape.start.c, shape.end.c)
          );
          break;
        }
        case "VERTICAL": {
          _.merge(
            repr,
            reprVerticalLine(shape.start.c, shape.start.r, shape.end.r)
          );
          break;
        }
      }

      repr[shape.start.r][shape.start.c] =
        shape.axis === "HORIZONTAL" && shape.direction === "LEFT_TO_RIGHT"
          ? "LINEHEAD_START_LEFT"
          : shape.axis === "HORIZONTAL" && shape.direction === "RIGHT_TO_LEFT"
          ? "LINEHEAD_START_RIGHT"
          : shape.axis === "VERTICAL" && shape.direction === "DOWN"
          ? "LINEHEAD_START_UP"
          : "LINEHEAD_START_DOWN";

      repr[shape.end.r][shape.end.c] =
        shape.axis === "HORIZONTAL" && shape.direction === "LEFT_TO_RIGHT"
          ? "LINEHEAD_END_RIGHT"
          : shape.axis === "HORIZONTAL" && shape.direction === "RIGHT_TO_LEFT"
          ? "LINEHEAD_END_LEFT"
          : shape.axis === "VERTICAL" && shape.direction === "DOWN"
          ? "LINEHEAD_END_DOWN"
          : "LINEHEAD_END_UP";

      return repr;
    }
    case "MULTI_SEGMENT_LINE": {
      // Prepare the objects in the repr
      const bb = getBoundingBox(shape);
      for (let x = bb.top; x <= bb.bottom; x++) {
        repr[x] = {};
      }

      shape.segments.forEach((segment) => {
        // First represent horizontal and vertical segments
        switch (segment.axis) {
          case "HORIZONTAL": {
            _.merge(
              repr,
              reprHorizontalLine(
                segment.start.r,
                segment.start.c,
                segment.end.c
              )
            );
            break;
          }
          case "VERTICAL": {
            _.merge(
              repr,
              reprVerticalLine(segment.start.c, segment.start.r, segment.end.r)
            );
          }
        }
      });

      // Then represent segment joints
      shape.segments.forEach((segment, segIdx) => {
        if (segIdx > 0) {
          const { axis, direction } = segment;
          const { axis: prevAxis, direction: prevDirection } =
            shape.segments[segIdx - 1];

          if (axis === "HORIZONTAL" && direction === "LEFT_TO_RIGHT") {
            if (prevAxis === "VERTICAL" && prevDirection === "DOWN") {
              repr[segment.start.r][segment.start.c] = "CORNER_BL";
            } else if (prevAxis === "VERTICAL" && prevDirection === "UP") {
              repr[segment.start.r][segment.start.c] = "CORNER_TL";
            }
          } else if (axis === "HORIZONTAL" && direction === "RIGHT_TO_LEFT") {
            if (prevAxis === "VERTICAL" && prevDirection === "DOWN") {
              repr[segment.start.r][segment.start.c] = "CORNER_BR";
            } else if (prevAxis === "VERTICAL" && prevDirection === "UP") {
              repr[segment.start.r][segment.start.c] = "CORNER_TR";
            }
          } else if (axis === "VERTICAL" && direction === "UP") {
            if (
              prevAxis === "HORIZONTAL" &&
              prevDirection === "LEFT_TO_RIGHT"
            ) {
              repr[segment.start.r][segment.start.c] = "CORNER_BR";
            } else if (
              prevAxis === "HORIZONTAL" &&
              prevDirection === "RIGHT_TO_LEFT"
            ) {
              repr[segment.start.r][segment.start.c] = "CORNER_BL";
            }
          } else if (axis === "VERTICAL" && direction === "DOWN") {
            if (
              prevAxis === "HORIZONTAL" &&
              prevDirection === "LEFT_TO_RIGHT"
            ) {
              repr[segment.start.r][segment.start.c] = "CORNER_TR";
            } else if (
              prevAxis === "HORIZONTAL" &&
              prevDirection === "RIGHT_TO_LEFT"
            ) {
              repr[segment.start.r][segment.start.c] = "CORNER_TL";
            }
          }
        }
      });

      // Then represent line heads
      const firstSegment = shape.segments[0];
      if (firstSegment.axis === "HORIZONTAL") {
        if (firstSegment.direction === "LEFT_TO_RIGHT") {
          repr[firstSegment.start.r][firstSegment.start.c] =
            "LINEHEAD_START_LEFT";
        } else if (firstSegment.direction === "RIGHT_TO_LEFT") {
          repr[firstSegment.start.r][firstSegment.start.c] =
            "LINEHEAD_START_RIGHT";
        }
      } else if (firstSegment.axis === "VERTICAL") {
        if (firstSegment.direction === "DOWN") {
          repr[firstSegment.start.r][firstSegment.start.c] =
            "LINEHEAD_START_UP";
        } else if (firstSegment.direction === "UP") {
          repr[firstSegment.start.r][firstSegment.start.c] =
            "LINEHEAD_START_DOWN";
        }
      }

      const lastSegment = shape.segments[shape.segments.length - 1];
      if (lastSegment.axis === "HORIZONTAL") {
        if (lastSegment.direction === "LEFT_TO_RIGHT") {
          repr[lastSegment.end.r][lastSegment.end.c] = "LINEHEAD_END_RIGHT";
        } else if (lastSegment.direction === "RIGHT_TO_LEFT") {
          repr[lastSegment.end.r][lastSegment.end.c] = "LINEHEAD_END_LEFT";
        }
      } else if (lastSegment.axis === "VERTICAL") {
        if (lastSegment.direction === "DOWN") {
          repr[lastSegment.end.r][lastSegment.end.c] = "LINEHEAD_END_DOWN";
        } else if (lastSegment.direction === "UP") {
          repr[lastSegment.end.r][lastSegment.end.c] = "LINEHEAD_END_UP";
        }
      }

      return repr;
    }
    case "TEXT": {
      // If text is empty, then display the empty symbol
      if (
        shape.lines.length === 0 ||
        shape.lines.every((line) => line.length === 0)
      ) {
        repr[shape.start.r] = {};
        repr[shape.start.r][shape.start.c] = "EMPTY_CHAR";
      } else {
        // Prepare the objects in the repr
        shape.lines.forEach((line, lineIdx) => {
          if (line.length > 0) {
            repr[shape.start.r + lineIdx] = {};
          }
        });

        shape.lines.forEach((line, lineIdx) => {
          if (line.length > 0) {
            const chars = Array.from(line);

            chars.forEach((c, charIdx) => {
              repr[shape.start.r + lineIdx][shape.start.c + charIdx] = c;
            });
          }
        });
      }

      return repr;
    }
  }
}

export function getStyledShapeRepresentation(
  shape: Shape,
  styleMode: StyleMode,
  globalStyle: Style,
  shapeStyle?: Partial<Style>
): CellValueMap {
  const repr = getAbstractShapeRepresentation(shape);

  for (const r in repr) {
    for (const c in repr[r]) {
      repr[r][c] = getCharRepr(repr[r][c], {
        styleMode,
        globalStyle,
        shapeStyle,
      });
    }
  }

  return repr;
}

export function getStyledCanvasRepresentation(
  shapes: ShapeObject[] | Shape[],
  styleMode: StyleMode,
  globalStyle: Style
): CellValueMap {
  function isShapeObject(shape: ShapeObject | Shape): shape is ShapeObject {
    return "id" in shape;
  }

  let repr: CellValueMap = {};

  shapes.forEach((s) => {
    const shape = isShapeObject(s) ? s.shape : s;
    const shapeStyle = isShapeObject(s) ? s.style : undefined;

    repr = _.merge(
      repr,
      getStyledShapeRepresentation(shape, styleMode, globalStyle, shapeStyle)
    );
  });

  return repr;
}

export function getStyledCanvasGrid(
  canvasSize: CanvasSize,
  shapes: ShapeObject[] | Shape[],
  styleOpts: { styleMode: StyleMode; globalStyle: Style } = {
    styleMode: "ASCII",
    globalStyle: defaultStyle(),
  }
): Grid {
  const grid: Grid = _.times(canvasSize.rows, () =>
    _.fill(Array(canvasSize.cols), " ")
  );

  let repr: CellValueMap = getStyledCanvasRepresentation(
    shapes,
    styleOpts.styleMode,
    styleOpts.globalStyle
  );

  for (const x in repr) {
    for (const y in repr[x]) {
      grid[x][y] = repr[x][y];
    }
  }

  return grid;
}

export type COMMENT_STYLE =
  | "NONE"
  | "SLASHES"
  | "STANDARD_BLOCK"
  | "STANDARD_BLOCK_ASTERISK"
  | "HASHES"
  | "TRIPLE_QUOTES"
  | "TRIPLE_SLASH"
  | "DOUBLE_DASH"
  | "APOSTROPHE"
  | "TRIPLE_BACKTICK"
  | "FOUR_SPACES"
  | "SEMI_COLON"
  | "PERCENT";

export function getTextExport(
  shapes: ShapeObject[] | Shape[],
  styleOpts: { styleMode: StyleMode; globalStyle: Style } = {
    styleMode: "ASCII",
    globalStyle: defaultStyle(),
  },
  commentStyle: COMMENT_STYLE = "SLASHES"
): string {
  if (shapes.length === 0) return "";

  function isShapeObjectArray(
    shapes: ShapeObject[] | Shape[]
  ): shapes is ShapeObject[] {
    return shapes.length > 0 && "id" in shapes[0];
  }
  const bb = getBoundingBoxOfAll(
    isShapeObjectArray(shapes) ? shapes.map((so) => so.shape) : shapes
  )!;

  const grid = getStyledCanvasGrid(
    { rows: bb.bottom + 1, cols: bb.right + 1 },
    shapes,
    styleOpts
  );

  const stringLines: string[] = grid
    .filter((row, rowIdx) => rowIdx >= bb.top && rowIdx <= bb.bottom)
    .map((row) => row.join("").slice(bb.left, bb.right + 1));

  const stringLinesWithCommentMarkers: string[] =
    commentStyle === "SLASHES"
      ? stringLines.map((line) => `// ${line}`)
      : commentStyle === "STANDARD_BLOCK"
      ? ["/*", ...stringLines, "*/"]
      : commentStyle === "STANDARD_BLOCK_ASTERISK"
      ? ["/*", ...stringLines.map((line) => `* ${line}`), "*/"]
      : commentStyle === "HASHES"
      ? stringLines.map((line) => `# ${line}`)
      : commentStyle === "TRIPLE_QUOTES"
      ? ['"""', ...stringLines, '"""']
      : commentStyle === "TRIPLE_SLASH"
      ? stringLines.map((line) => `/// ${line}`)
      : commentStyle === "DOUBLE_DASH"
      ? stringLines.map((line) => `-- ${line}`)
      : commentStyle === "APOSTROPHE"
      ? stringLines.map((line) => `' ${line}`)
      : commentStyle === "TRIPLE_BACKTICK"
      ? ["```", ...stringLines, "```"]
      : commentStyle === "FOUR_SPACES"
      ? stringLines.map((line) => `    ${line}`)
      : commentStyle === "SEMI_COLON"
      ? stringLines.map((line) => `; ${line}`)
      : commentStyle === "PERCENT"
      ? stringLines.map((line) => `% ${line}`)
      : stringLines;

  const exportString = stringLinesWithCommentMarkers.join("\n");

  return exportString;
}

function reprHorizontalLine(
  r: number,
  from_c: number,
  to_c: number
): CellValueMap {
  const repr: CellValueMap = {};

  repr[r] = {};

  const [start_c, end_c] = [Math.min(from_c, to_c), Math.max(from_c, to_c)];

  for (let c = start_c; c <= end_c; c++) {
    repr[r][c] = "LINE_HORIZONTAL";
  }

  return repr;
}

function reprVerticalLine(
  c: number,
  from_r: number,
  to_r: number
): CellValueMap {
  const repr: CellValueMap = {};

  const [start_r, end_r] = [Math.min(from_r, to_r), Math.max(from_r, to_r)];

  for (let r = start_r; r <= end_r; r++) {
    repr[r] = {};
    repr[r][c] = "LINE_VERTICAL";
  }

  return repr;
}
