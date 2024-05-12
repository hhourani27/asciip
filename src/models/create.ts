import _ from "lodash";
import { Coords, Segment } from "./shapes";

export function createZeroWidthSegment(start: Coords): Segment {
  return {
    axis: "HORIZONTAL",
    direction: "LEFT_TO_RIGHT",
    start: start,
    end: start,
  };
}

export function createLineSegment(start: Coords, end: Coords): Segment {
  if (_.isEqual(start, end)) {
    return createZeroWidthSegment(start);
  }

  const [deltaR, deltaC] = [end.r - start.r, end.c - start.c];
  if (Math.abs(deltaC) >= Math.abs(deltaR)) {
    // Create horizontal line
    return {
      axis: "HORIZONTAL",
      start,
      end: { r: start.r, c: end.c },
      direction: deltaC > 0 ? "LEFT_TO_RIGHT" : "RIGHT_TO_LEFT",
    };
  } else {
    //Create Vertical line
    return {
      axis: "VERTICAL",
      start,
      end: { r: end.r, c: start.c },
      direction: deltaR > 0 ? "DOWN" : "UP",
    };
  }
}
