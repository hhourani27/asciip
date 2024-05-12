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

export type Line = {
  type: "LINE";
  start: Coords;
  inflection: Coords;
  end: Coords;
};

export type Shape = Rectangle | Line;

// Functions for LINE shapes
export type HorizontalPath = {
  type: "HORIZONTAL";
  r: number;
  c_from: number;
  c_to: number;
  direction: "LEFT_TO_RIGHT" | "RIGHT_TO_LEFT";
};
export type VerticalPath = {
  type: "VERTICAL";
  c: number;
  r_from: number;
  r_to: number;
  direction: "UP" | "DOWN";
};
export type AxisPath = HorizontalPath | VerticalPath;

export type Path = AxisPath[];

/**
 * Although, there maybe 2 inflection points, return just one.
 */
export function getInflectionPoint(start: Coords, end: Coords): Coords {
  return { r: end.r, c: start.c };
}

export function getCanonicalPath(line: Line): Path {
  /*
   Simplest Case : Inflection is either equal to start or end,
   then, ignore inflection. We just need a path between start and end
  */
  if (
    _.isEqual(line.inflection, line.start) ||
    _.isEqual(line.inflection, line.end)
  ) {
    // If start and end are on the same row, or the same column, or equal => There is a single path
    if (line.start.r === line.end.r || line.start.c === line.end.c)
      return getAllPathsBetweenTwoPoints(line.start, line.end)[0];
    else {
      // There are 2 paths => Privilege the one that starts vertically
      const paths = getAllPathsBetweenTwoPoints(line.start, line.end);
      return paths.find((p) => p[0].type === "VERTICAL")!;
    }
  } else {
    /*
    More complicated case : we need to find the best path that passes through 3 points
    */
    // Edge case: start and end are the same, and inflection point is on the same row or column than start or end
    if (
      _.isEqual(line.start, line.end) &&
      (line.start.r === line.inflection.r || line.start.c === line.inflection.c)
    ) {
      const startToInflectionPath = getAllPathsBetweenTwoPoints(
        line.start,
        line.inflection
      )[0];
      const inflectionToEndPath = getAllPathsBetweenTwoPoints(
        line.inflection,
        line.end
      )[0];
      return joinPaths(startToInflectionPath, inflectionToEndPath);
    } else {
      // The most common case : start, end and inflection are 3 different points
      const allPaths = getPathCombinations(
        getAllPathsBetweenTwoPoints(line.start, line.inflection),
        getAllPathsBetweenTwoPoints(line.inflection, line.end)
      );

      // Remove paths with u-turns
      const pathsWithoutUTurns = allPaths.filter((path) => !hasPathUTurn(path));

      // Remove paths with crossings
      const pathsWithoutCrossings = pathsWithoutUTurns.filter(
        (path) => !hasCrossing(path)
      );

      // Get the minimum number of turns
      const minTurns = Math.min(
        ...pathsWithoutCrossings.map((path) => getTurnCount(path))
      );

      // Keep the paths with the least number of turns
      const pathsMinTurns = pathsWithoutCrossings.filter(
        (path) => getTurnCount(path) === minTurns
      );

      // If there are still many paths, privilege the one that starts with a vertical line
      if (pathsMinTurns.length > 1) {
        return (
          pathsMinTurns.find((path) => path[0].type === "VERTICAL") ??
          pathsMinTurns[0]
        );
      } else {
        return pathsMinTurns[0];
      }
    }
  }
}

/**
 * Return all shortest paths that gets you from point FROM to TO
 */
export function getAllPathsBetweenTwoPoints(from: Coords, to: Coords): Path[] {
  if (from.r === to.r && from.c === to.c) {
    return [
      [
        {
          type: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          r: from.r,
          c_from: from.c,
          c_to: from.c,
        },
      ],
    ];
  } else if (from.r === to.r) {
    return [
      [
        {
          type: "HORIZONTAL",
          direction: from.c < to.c ? "LEFT_TO_RIGHT" : "RIGHT_TO_LEFT",
          r: from.r,
          c_from: from.c,
          c_to: to.c,
        },
      ],
    ];
  } else if (from.c === to.c) {
    return [
      [
        {
          type: "VERTICAL",
          direction: from.r < to.r ? "DOWN" : "UP",
          c: from.c,
          r_from: from.r,
          r_to: to.r,
        },
      ],
    ];
  } else {
    const horizontalThenVerticalPath: [HorizontalPath, VerticalPath] = [
      {
        type: "HORIZONTAL",
        direction: from.c < to.c ? "LEFT_TO_RIGHT" : "RIGHT_TO_LEFT",
        r: from.r,
        c_from: from.c,
        c_to: to.c,
      },
      {
        type: "VERTICAL",
        direction: from.r < to.r ? "DOWN" : "UP",
        c: to.c,
        r_from: from.r,
        r_to: to.r,
      },
    ];

    const verticalThenHorizontalPath: [VerticalPath, HorizontalPath] = [
      {
        type: "VERTICAL",
        direction: from.r < to.r ? "DOWN" : "UP",
        c: from.c,
        r_from: from.r,
        r_to: to.r,
      },
      {
        type: "HORIZONTAL",
        direction: from.c < to.c ? "LEFT_TO_RIGHT" : "RIGHT_TO_LEFT",
        r: to.r,
        c_from: from.c,
        c_to: to.c,
      },
    ];

    return [horizontalThenVerticalPath, verticalThenHorizontalPath];
  }
}

export function joinPaths(...paths: Path[]): Path {
  return _.flatten(paths);
}

export function getPathCombinations(
  pathsStart: Path[],
  pathsEnd: Path[]
): Path[] {
  const combined = _.flatMap(pathsStart, (pathS) => {
    return pathsEnd.map((pathE) => joinPaths(pathS, pathE));
  });

  return combined;
}

export function hasPathUTurn(path: Path): boolean {
  if (path.length < 2) return false;

  for (let i = 1; i < path.length; i++) {
    if (
      path[i - 1].type === path[i].type &&
      path[i - 1].direction !== path[i].direction
    )
      return true;
  }
  return false;
}

export function hasCrossing(path: Path): boolean {
  const verticalSegments = path.filter(
    (segment) => segment.type === "VERTICAL"
  ) as VerticalPath[];
  const horizontalSegments = path.filter(
    (segment) => segment.type === "HORIZONTAL"
  ) as HorizontalPath[];

  for (const vs of verticalSegments) {
    for (const hs of horizontalSegments) {
      if (
        vs.c > Math.min(hs.c_from, hs.c_to) &&
        vs.c < Math.max(hs.c_from, hs.c_to) &&
        hs.r > Math.min(vs.r_from, vs.r_to) &&
        hs.r < Math.max(vs.r_from, vs.r_to)
      ) {
        return true;
      }
    }
  }

  return false;
}

export function getTurnCount(path: Path): number {
  if (path.length < 2) return 0;

  let turns = 0;
  for (let i = 1; i < path.length; i++) {
    if (
      path[i - 1].type !== path[i].type ||
      (path[i - 1].type === path[i].type &&
        path[i - 1].direction !== path[i].direction)
    )
      turns++;
  }
  return turns;
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
