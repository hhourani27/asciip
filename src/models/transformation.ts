import _ from "lodash";
import { CanvasSize } from "../store/diagramSlice";
import { Coords, Shape, normalizeMultiSegmentLine } from "./shapes";
import { createLineSegment } from "./create";
import { BoundingBox, getBoundingBoxOfAll } from "./shapeInCanvas";
import { getBoundingBox } from "./shapeInCanvas";

export function translate(
  shape: Shape,
  delta: Coords,
  canvasSize: CanvasSize
): Shape {
  // The shape bouding box cannot go outside the canvas. So adjust delta accordingly
  const bb = getBoundingBox(shape);
  const cappedDelta = capDelta(delta, bb, canvasSize);

  switch (shape.type) {
    case "RECTANGLE": {
      return {
        type: "RECTANGLE",
        tl: { r: shape.tl.r + cappedDelta.r, c: shape.tl.c + cappedDelta.c },
        br: { r: shape.br.r + cappedDelta.r, c: shape.br.c + cappedDelta.c },
      };
    }
    case "LINE": {
      return {
        ...shape,
        start: {
          r: shape.start.r + cappedDelta.r,
          c: shape.start.c + cappedDelta.c,
        },
        end: {
          r: shape.end.r + cappedDelta.r,
          c: shape.end.c + cappedDelta.c,
        },
      };
    }
    case "MULTI_SEGMENT_LINE": {
      return {
        ...shape,
        segments: shape.segments.map((segment) => ({
          ...segment,
          start: {
            r: segment.start.r + cappedDelta.r,
            c: segment.start.c + cappedDelta.c,
          },
          end: {
            r: segment.end.r + cappedDelta.r,
            c: segment.end.c + cappedDelta.c,
          },
        })),
      };
    }
    case "TEXT": {
      return {
        ...shape,
        start: {
          r: shape.start.r + cappedDelta.r,
          c: shape.start.c + cappedDelta.c,
        },
      };
    }
  }
}

export function translateAll(
  shapes: Shape[],
  delta: Coords,
  canvasSize: CanvasSize
): Shape[] {
  if (shapes.length === 0) {
    return [];
  }

  const bb = getBoundingBoxOfAll(shapes)!;
  const cappedDelta = capDelta(delta, bb, canvasSize);

  return shapes.map((s) => translate(s, cappedDelta, canvasSize));
}

export type ResizePoint = {
  name: string;
  coords: Coords;
};

export function resize(
  shape: Shape,
  resizePointCoords: Coords,
  delta: Coords,
  canvasSize: CanvasSize
): Shape {
  // If the resize point is not legal for this shape, then return the same shape
  const resizePoints = getResizePoints(shape);
  const resizePointName = resizePoints.find((rp) =>
    _.isEqual(rp.coords, resizePointCoords)
  )?.name;

  if (!resizePointName) {
    return shape;
  }

  const cappedDelta = capDelta(delta, resizePointCoords, canvasSize);

  switch (shape.type) {
    case "RECTANGLE": {
      const { tl, br } = shape;

      const new_tl =
        resizePointName === "TL"
          ? { r: tl.r + cappedDelta.r, c: tl.c + cappedDelta.c }
          : resizePointName === "TR"
          ? { r: tl.r + cappedDelta.r, c: tl.c }
          : resizePointName === "BR"
          ? { r: tl.r, c: tl.c }
          : { r: tl.r, c: tl.c + cappedDelta.c };

      const new_br =
        resizePointName === "TL"
          ? { r: br.r, c: br.c }
          : resizePointName === "TR"
          ? { r: br.r, c: br.c + cappedDelta.c }
          : resizePointName === "BR"
          ? { r: br.r + cappedDelta.r, c: br.c + cappedDelta.c }
          : { r: br.r + cappedDelta.r, c: br.c };

      // The new TL and BR may be inverted. Correct it
      const corrected_tl = {
        r: Math.min(new_tl.r, new_br.r),
        c: Math.min(new_tl.c, new_br.c),
      };
      const corrected_br = {
        r: Math.max(new_tl.r, new_br.r),
        c: Math.max(new_tl.c, new_br.c),
      };

      const resizedShape = { ...shape, tl: corrected_tl, br: corrected_br };

      // If we resized outside the canvas bounds, then return the original shape
      if (isShapeOutsideCanvas(resizedShape, canvasSize)) return resizedShape;
      else return shape;
    }
    case "LINE": {
      let resizedShape = _.cloneDeep(shape);
      if (resizePointName === "START") {
        resizedShape = {
          type: "LINE",
          ...createLineSegment(
            {
              r: shape.start.r + cappedDelta.r,
              c: shape.start.c + cappedDelta.c,
            },
            shape.end,
            "END"
          ),
        };
      } else if (resizePointName === "END") {
        resizedShape = {
          type: "LINE",
          ...createLineSegment(
            shape.start,
            {
              r: shape.end.r + cappedDelta.r,
              c: shape.end.c + cappedDelta.c,
            },
            "START"
          ),
        };
      }

      if (isShapeOutsideCanvas(resizedShape, canvasSize)) return resizedShape;
      else return shape;
    }
    case "MULTI_SEGMENT_LINE": {
      const resizedShape = _.cloneDeep(shape);

      if (resizePointName === "START") {
        const firstSegment = resizedShape.segments[0];
        const newSegment = createLineSegment(
          {
            r: firstSegment.start.r + cappedDelta.r,
            c: firstSegment.start.c + cappedDelta.c,
          },
          firstSegment.start
        );

        if (newSegment.axis === firstSegment.axis) {
          // In this case, we're modifying the length of first segment
          resizedShape.segments[0].start = newSegment.start;
        } else {
          resizedShape.segments = [newSegment, ...resizedShape.segments];
        }
      } else if (resizePointName === "END") {
        const lastSegment =
          resizedShape.segments[resizedShape.segments.length - 1];
        const newSegment = createLineSegment(lastSegment.end, {
          r: lastSegment.end.r + cappedDelta.r,
          c: lastSegment.end.c + cappedDelta.c,
        });

        if (newSegment.axis === lastSegment.axis) {
          // In this case, we're modifying the length of last segment
          resizedShape.segments[resizedShape.segments.length - 1].end =
            newSegment.end;
        } else {
          resizedShape.segments.push(newSegment);
        }
      } else if (resizePointName.startsWith("SEGMENT_")) {
        const segIdx = parseInt(resizePointName.split("_")[1]);

        switch (resizedShape.segments[segIdx].axis) {
          case "HORIZONTAL": {
            resizedShape.segments[segIdx].start.r += cappedDelta.r;
            resizedShape.segments[segIdx].end.r += cappedDelta.r;
            if (segIdx > 0) {
              resizedShape.segments[segIdx - 1].end.r += cappedDelta.r;
            }
            if (segIdx < resizedShape.segments.length - 1) {
              resizedShape.segments[segIdx + 1].start.r += cappedDelta.r;
            }
            break;
          }
          case "VERTICAL": {
            resizedShape.segments[segIdx].start.c += cappedDelta.c;
            resizedShape.segments[segIdx].end.c += cappedDelta.c;
            if (segIdx > 0) {
              resizedShape.segments[segIdx - 1].end.c += cappedDelta.c;
            }
            if (segIdx < resizedShape.segments.length - 1) {
              resizedShape.segments[segIdx + 1].start.c += cappedDelta.c;
            }
            break;
          }
        }
      }

      const correctedLine = normalizeMultiSegmentLine(resizedShape);
      if (isShapeOutsideCanvas(correctedLine, canvasSize)) return correctedLine;
      else return shape;
    }
    case "TEXT": {
      return shape;
    }
  }
}

export function getResizePoints(shape: Shape): ResizePoint[] {
  switch (shape.type) {
    case "RECTANGLE": {
      const { tl, br } = shape;
      return [
        { name: "TL", coords: { r: tl.r, c: tl.c } },
        { name: "TR", coords: { r: tl.r, c: br.c } },
        { name: "BR", coords: { r: br.r, c: br.c } },
        { name: "BL", coords: { r: br.r, c: tl.c } },
      ];
    }
    case "LINE": {
      return [
        { name: "START", coords: shape.start },
        { name: "END", coords: shape.end },
      ];
    }
    case "MULTI_SEGMENT_LINE": {
      const resizePoints: ResizePoint[] = [];

      resizePoints.push({ name: "START", coords: shape.segments[0].start });
      shape.segments.forEach((seg, idx) => {
        resizePoints.push({
          name: `SEGMENT_${idx}`,
          coords: {
            r: Math.floor((seg.start.r + seg.end.r) / 2),
            c: Math.floor((seg.start.c + seg.end.c) / 2),
          },
        });
      });
      resizePoints.push({
        name: "END",
        coords: shape.segments[shape.segments.length - 1].end,
      });
      return resizePoints;
    }
    case "TEXT": {
      return [];
    }
  }
}

function isShapeOutsideCanvas(shape: Shape, canvasSize: CanvasSize): boolean {
  const bb = getBoundingBox(shape);
  if (bb.top < 0) return false;
  if (bb.bottom >= canvasSize.rows) return false;
  if (bb.left < 0) return false;
  if (bb.right >= canvasSize.cols) return false;

  return true;
}

/**
 * Cap the delta coords so that the bounding box doesn't go outside of the canvas
 */
function capDelta(
  delta: Coords,
  points: BoundingBox | Coords,
  canvasSize: CanvasSize
): Coords {
  if ("left" in points) {
    const bb = points;

    const cappedDelta: Coords = {
      r:
        delta.r > 0
          ? Math.min(delta.r, canvasSize.rows - 1 - bb.bottom)
          : delta.r < 0
          ? Math.max(delta.r, 0 - bb.top)
          : 0,
      c:
        delta.c > 0
          ? Math.min(delta.c, canvasSize.cols - 1 - bb.right)
          : delta.c < 0
          ? Math.max(delta.c, 0 - bb.left)
          : 0,
    };

    return cappedDelta;
  } else {
    const p = points;

    const cappedDelta: Coords = {
      r:
        delta.r > 0
          ? Math.min(delta.r, canvasSize.rows - 1 - p.r)
          : delta.r < 0
          ? Math.max(delta.r, 0 - p.r)
          : 0,
      c:
        delta.c > 0
          ? Math.min(delta.c, canvasSize.cols - 1 - p.c)
          : delta.c < 0
          ? Math.max(delta.c, 0 - p.c)
          : 0,
    };

    return cappedDelta;
  }
}
