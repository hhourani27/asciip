import _ from "lodash";

export type Coords = {
  r: number;
  c: number;
};

export type Rectangle = {
  type: "RECTANGLE";
  tl: Coords;
  br: Coords;
};

export type HorizontalSegment = {
  axis: "HORIZONTAL";
  start: Coords;
  end: Coords;
  direction: "LEFT_TO_RIGHT" | "RIGHT_TO_LEFT";
};

export type VerticalSegment = {
  axis: "VERTICAL";
  start: Coords;
  end: Coords;
  direction: "UP" | "DOWN";
};

export type Segment = HorizontalSegment | VerticalSegment;

export type Line = Segment & { type: "LINE" };

export type MultiSegment = {
  type: "MULTI_SEGMENT_LINE";
  segments: Segment[];
};

export type TextShape = {
  type: "TEXT";
  start: Coords;
  lines: string[];
};

export type Shape = Rectangle | Line | MultiSegment | TextShape;

export function isShapeLegal(shape: Shape): boolean {
  switch (shape.type) {
    case "RECTANGLE": {
      const { tl, br } = shape;
      return tl.r !== br.r && tl.c !== br.c;
    }
    case "LINE": {
      if (!isSegmentLegal(shape)) return false;
      return true;
    }
    case "MULTI_SEGMENT_LINE": {
      for (let i = 0; i < shape.segments.length; i++) {
        const segment = shape.segments[i];
        if (!isSegmentLegal(segment)) return false;

        // If segment is not connected to the previous one
        if (i > 0) {
          if (!_.isEqual(segment.start, shape.segments[i - 1].end))
            return false;
        }

        // If there's a consecutive U-turn
        if (i > 0) {
          if (
            segment.axis === shape.segments[i - 1].axis &&
            segment.direction !== shape.segments[i - 1].direction
          ) {
            return false;
          }
        }
      }

      return true;
    }
    case "TEXT": {
      return true;
    }
  }
}

function isSegmentLegal(segment: Segment): boolean {
  // If it's a zero-length segment
  if (_.isEqual(segment.start, segment.end)) return false;

  // If the segment has uncoherent properties (wrong direction, wrong axis)
  if (segment.axis === "HORIZONTAL") {
    if (segment.start.r !== segment.end.r) return false;
    if (
      segment.direction === "LEFT_TO_RIGHT" &&
      segment.start.c > segment.end.c
    )
      return false;
    if (
      segment.direction === "RIGHT_TO_LEFT" &&
      segment.start.c < segment.end.c
    )
      return false;
  } else if (segment.axis === "VERTICAL") {
    if (segment.start.c !== segment.end.c) return false;
    if (segment.direction === "DOWN" && segment.start.r > segment.end.r)
      return false;
    if (segment.direction === "UP" && segment.start.r < segment.end.r)
      return false;
  }

  return true;
}

export function normalizeTlBr(tl: Coords, br: Coords): [Coords, Coords] {
  return [
    {
      r: Math.min(tl.r, br.r),
      c: Math.min(tl.c, br.c),
    },
    {
      r: Math.max(tl.r, br.r),
      c: Math.max(tl.c, br.c),
    },
  ];
}

/**
 *
 * Correct the segment in Line
 * - Remove 0-length segments
 * - Correct segment direction
 * - Merge consecutive segments if they have the same axis and direction
 */
export function normalizeMultiSegmentLine(line: MultiSegment): MultiSegment {
  // - Remove 0-length segments
  // - Correct segment direction
  const correctedSegments: Segment[] = line.segments
    .filter((seg) => !_.isEqual(seg.start, seg.end))
    .map((seg) => {
      switch (seg.axis) {
        case "HORIZONTAL":
          return {
            ...seg,
            direction:
              seg.start.c <= seg.end.c ? "LEFT_TO_RIGHT" : "RIGHT_TO_LEFT",
          };
        case "VERTICAL":
          return {
            ...seg,
            direction: seg.start.r <= seg.end.r ? "DOWN" : "UP",
          };
      }
    });

  //Merge consecutive segments if they have the same axis and direction
  const mergedSegments: Segment[] = [];

  mergedSegments.push(correctedSegments[0]);
  for (let i = 1; i < correctedSegments.length; i++) {
    const [seg1, seg2]: [Segment, Segment] = [
      mergedSegments[mergedSegments.length - 1],
      correctedSegments[i],
    ];
    if (seg1.axis === seg2.axis && seg1.direction === seg2.direction) {
      mergedSegments.pop();

      const newSegment: Segment = {
        ...seg1,
        end: seg2.end,
      };
      mergedSegments.push(newSegment);
    } else {
      mergedSegments.push(seg2);
    }
  }

  return {
    ...line,
    segments: mergedSegments,
  };
}

export function getHorizontalDirection(
  start_c: number,
  end_c: number
): "LEFT_TO_RIGHT" | "RIGHT_TO_LEFT" {
  return start_c <= end_c ? "LEFT_TO_RIGHT" : "RIGHT_TO_LEFT";
}

export function getVerticalDirection(
  start_r: number,
  end_r: number
): "DOWN" | "UP" {
  return start_r <= end_r ? "DOWN" : "UP";
}

/**
 * Like lodash's range, but
 * - from and to are inclusive
 * - if to < from then it generates decreasing number array
 *
 */
// TODO: Remove if no longer used
export function range(from: number, to: number): number[] {
  if (from === to) return [from];
  if (from < to) return _.range(from, to + 1);
  if (from > to) return _.range(from, to - 1);
  return [];
}
