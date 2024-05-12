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

export type Line = {
  type: "LINE";
  segments: Segment[];
};

export type Shape = Rectangle | Line;

export function isShapeLegal(shape: Shape): boolean {
  switch (shape.type) {
    case "RECTANGLE": {
      const { tl, br } = shape;
      return tl.r !== br.r && tl.c !== br.c;
    }
    case "LINE": {
      for (let i = 0; i < shape.segments.length; i++) {
        const segment = shape.segments[i];
        // If there's a zero-lenght segment
        if (_.isEqual(segment.start, segment.end)) return false;

        // If the segment has uncoherent properties
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

        // If segment is not connected to the previous one
        if (i > 0) {
          if (!_.isEqual(segment.start, shape.segments[i - 1].end))
            return false;
        }
      }

      return true;
    }
  }
}

/**
 * merge consecutive segments if they have the same axis and direction
 */
export function normalizeLine(line: Line): Line {
  const normalizedSegments: Segment[] = [];

  normalizedSegments.push(line.segments[0]);
  for (let i = 1; i < line.segments.length; i++) {
    const [seg1, seg2]: [Segment, Segment] = [
      normalizedSegments[normalizedSegments.length - 1],
      line.segments[i],
    ];
    if (seg1.axis === seg2.axis && seg1.direction === seg2.direction) {
      normalizedSegments.pop();

      const newSegment: Segment = {
        ...seg1,
        end: seg2.end,
      };
      normalizedSegments.push(newSegment);
    } else {
      normalizedSegments.push(seg2);
    }
  }

  return {
    ...line,
    segments: normalizedSegments,
  };
}

/**
 * Like lodash's range, but
 * - from and to are inclusive
 * - if to < from then it generates decreasing number array
 *
 */
export function range(from: number, to: number): number[] {
  if (from === to) return [from];
  if (from < to) return _.range(from, to + 1);
  if (from > to) return _.range(from, to - 1);
  return [];
}
