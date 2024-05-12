import {
  Line,
  Path,
  getAllPathsBetweenTwoPoints,
  getCanonicalPath,
  range,
} from "./shapes";

describe("range()", () => {
  test("range()", () => {
    expect(range(1, 4)).toEqual([1, 2, 3, 4]);
    expect(range(4, 0)).toEqual([4, 3, 2, 1, 0]);
    expect(range(1, 1)).toEqual([1]);
  });
});

describe("getAllPathsBetweenTwoPoints()", () => {
  test("FROM === TO", () => {
    const paths = getAllPathsBetweenTwoPoints({ r: 2, c: 2 }, { r: 2, c: 2 });
    expect(paths).toEqual([
      [
        {
          type: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          r: 2,
          c_from: 2,
          c_to: 2,
        },
      ],
    ]);
  });

  test("TO is on right of FROM", () => {
    const paths = getAllPathsBetweenTwoPoints({ r: 2, c: 2 }, { r: 2, c: 4 });
    expect(paths).toEqual([
      [
        {
          type: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          r: 2,
          c_from: 2,
          c_to: 4,
        },
      ],
    ]);
  });

  test("TO is on left of FROM", () => {
    const paths = getAllPathsBetweenTwoPoints({ r: 2, c: 2 }, { r: 2, c: 0 });
    expect(paths).toEqual([
      [
        {
          type: "HORIZONTAL",
          direction: "RIGHT_TO_LEFT",
          r: 2,
          c_from: 2,
          c_to: 0,
        },
      ],
    ]);
  });

  test("TO is above FROM", () => {
    const paths = getAllPathsBetweenTwoPoints({ r: 2, c: 2 }, { r: 0, c: 2 });
    expect(paths).toEqual([
      [
        {
          type: "VERTICAL",
          direction: "UP",
          c: 2,
          r_from: 2,
          r_to: 0,
        },
      ],
    ]);
  });

  test("TO is below FROM", () => {
    const paths = getAllPathsBetweenTwoPoints({ r: 2, c: 2 }, { r: 4, c: 2 });
    expect(paths).toEqual([
      [
        {
          type: "VERTICAL",
          direction: "DOWN",
          c: 2,
          r_from: 2,
          r_to: 4,
        },
      ],
    ]);
  });

  test("TO is NE of FROM", () => {
    const paths = getAllPathsBetweenTwoPoints({ r: 2, c: 2 }, { r: 0, c: 4 });

    const expected: Path[] = [
      [
        { type: "VERTICAL", direction: "UP", c: 2, r_from: 2, r_to: 0 },
        {
          type: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          r: 0,
          c_from: 2,
          c_to: 4,
        },
      ],
      [
        {
          type: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          r: 2,
          c_from: 2,
          c_to: 4,
        },
        { type: "VERTICAL", direction: "UP", c: 4, r_from: 2, r_to: 0 },
      ],
    ];
    expect(paths).toIncludeSameMembers(expected);
  });

  test("TO is SE of FROM", () => {
    const paths = getAllPathsBetweenTwoPoints({ r: 2, c: 2 }, { r: 4, c: 4 });

    const expected: Path[] = [
      [
        { type: "VERTICAL", direction: "DOWN", c: 2, r_from: 2, r_to: 4 },
        {
          type: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          r: 4,
          c_from: 2,
          c_to: 4,
        },
      ],
      [
        {
          type: "HORIZONTAL",
          direction: "LEFT_TO_RIGHT",
          r: 2,
          c_from: 2,
          c_to: 4,
        },
        { type: "VERTICAL", direction: "DOWN", c: 4, r_from: 2, r_to: 4 },
      ],
    ];

    expect(paths).toIncludeSameMembers(expected);
  });

  test("TO is NW of FROM", () => {
    const paths = getAllPathsBetweenTwoPoints({ r: 2, c: 2 }, { r: 0, c: 0 });
    const expected: Path[] = [
      [
        { type: "VERTICAL", direction: "UP", c: 2, r_from: 2, r_to: 0 },
        {
          type: "HORIZONTAL",
          direction: "RIGHT_TO_LEFT",
          r: 0,
          c_from: 2,
          c_to: 0,
        },
      ],
      [
        {
          type: "HORIZONTAL",
          direction: "RIGHT_TO_LEFT",
          r: 2,
          c_from: 2,
          c_to: 0,
        },
        { type: "VERTICAL", direction: "UP", c: 0, r_from: 2, r_to: 0 },
      ],
    ];

    expect(paths).toIncludeSameMembers(expected);
  });

  test("TO is SW of FROM", () => {
    const paths = getAllPathsBetweenTwoPoints({ r: 2, c: 2 }, { r: 4, c: 0 });

    const expected: Path[] = [
      [
        { type: "VERTICAL", direction: "DOWN", c: 2, r_from: 2, r_to: 4 },
        {
          type: "HORIZONTAL",
          direction: "RIGHT_TO_LEFT",
          r: 4,
          c_from: 2,
          c_to: 0,
        },
      ],
      [
        {
          type: "HORIZONTAL",
          direction: "RIGHT_TO_LEFT",
          r: 2,
          c_from: 2,
          c_to: 0,
        },
        { type: "VERTICAL", direction: "DOWN", c: 0, r_from: 2, r_to: 4 },
      ],
    ];

    expect(paths).toIncludeSameMembers(expected);
  });
});

describe("getCanonicalPath()", () => {
  /*
   *     ^
   *     |
   * +-o-+
   * |
   * |
   */
  test("test1", () => {
    const line: Line = {
      type: "LINE",
      start: { r: 4, c: 0 },
      inflection: { r: 2, c: 2 },
      end: { r: 0, c: 4 },
    };

    const path: Path = getCanonicalPath(line);
    const expected: Path = [
      { type: "VERTICAL", direction: "UP", c: 0, r_from: 4, r_to: 2 },
      {
        type: "HORIZONTAL",
        direction: "LEFT_TO_RIGHT",
        r: 2,
        c_from: 0,
        c_to: 2,
      },
      {
        type: "HORIZONTAL",
        direction: "LEFT_TO_RIGHT",
        r: 2,
        c_from: 2,
        c_to: 4,
      },
      { type: "VERTICAL", direction: "UP", c: 4, r_from: 2, r_to: 0 },
    ];

    expect(path).toEqual(expected);
  });

  /*
   * ^
   * |
   * +-o-+
   *     |
   *     |
   */
  test("test2", () => {
    const line: Line = {
      type: "LINE",
      start: { r: 4, c: 4 },
      inflection: { r: 2, c: 2 },
      end: { r: 0, c: 0 },
    };

    const path: Path = getCanonicalPath(line);
    const expected: Path = [
      { type: "VERTICAL", direction: "UP", c: 4, r_from: 4, r_to: 2 },
      {
        type: "HORIZONTAL",
        direction: "RIGHT_TO_LEFT",
        r: 2,
        c_from: 4,
        c_to: 2,
      },
      {
        type: "HORIZONTAL",
        direction: "RIGHT_TO_LEFT",
        r: 2,
        c_from: 2,
        c_to: 0,
      },
      { type: "VERTICAL", direction: "UP", c: 0, r_from: 2, r_to: 0 },
    ];

    expect(path).toEqual(expected);
  });

  /*
   *     |
   *     |
   * +-o-+
   * |
   * v
   */
  test("test3", () => {
    const line: Line = {
      type: "LINE",
      start: { r: 0, c: 4 },
      inflection: { r: 2, c: 2 },
      end: { r: 4, c: 0 },
    };

    const path: Path = getCanonicalPath(line);
    const expected: Path = [
      { type: "VERTICAL", direction: "DOWN", c: 4, r_from: 0, r_to: 2 },
      {
        type: "HORIZONTAL",
        direction: "RIGHT_TO_LEFT",
        r: 2,
        c_from: 4,
        c_to: 2,
      },
      {
        type: "HORIZONTAL",
        direction: "RIGHT_TO_LEFT",
        r: 2,
        c_from: 2,
        c_to: 0,
      },
      { type: "VERTICAL", direction: "DOWN", c: 0, r_from: 2, r_to: 4 },
    ];

    expect(path).toEqual(expected);
  });

  /*
   * |
   * |
   * +-o-+
   *     |
   *     v
   */
  test("test4", () => {
    const line: Line = {
      type: "LINE",
      start: { r: 0, c: 0 },
      inflection: { r: 2, c: 2 },
      end: { r: 4, c: 4 },
    };

    const path: Path = getCanonicalPath(line);
    const expected: Path = [
      { type: "VERTICAL", direction: "DOWN", c: 0, r_from: 0, r_to: 2 },
      {
        type: "HORIZONTAL",
        direction: "LEFT_TO_RIGHT",
        r: 2,
        c_from: 0,
        c_to: 2,
      },
      {
        type: "HORIZONTAL",
        direction: "LEFT_TO_RIGHT",
        r: 2,
        c_from: 2,
        c_to: 4,
      },
      { type: "VERTICAL", direction: "DOWN", c: 4, r_from: 2, r_to: 4 },
    ];

    expect(path).toEqual(expected);
  });

  /*
   * +---->
   * |
   * o
   * |
   * +--
   */
  test("test5", () => {
    const line: Line = {
      type: "LINE",
      start: { r: 4, c: 2 },
      inflection: { r: 2, c: 0 },
      end: { r: 0, c: 5 },
    };

    const path: Path = getCanonicalPath(line);
    const expected: Path = [
      {
        type: "HORIZONTAL",
        direction: "RIGHT_TO_LEFT",
        r: 4,
        c_from: 2,
        c_to: 0,
      },
      { type: "VERTICAL", direction: "UP", c: 0, r_from: 4, r_to: 2 },
      { type: "VERTICAL", direction: "UP", c: 0, r_from: 2, r_to: 0 },
      {
        type: "HORIZONTAL",
        direction: "LEFT_TO_RIGHT",
        r: 0,
        c_from: 0,
        c_to: 5,
      },
    ];

    expect(path).toEqual(expected);
  });

  /*
   *    <-+
   *      |
   *      o
   *      |
   * -----+
   */
  test("test7", () => {
    const line: Line = {
      type: "LINE",
      start: { r: 4, c: 0 },
      inflection: { r: 2, c: 5 },
      end: { r: 0, c: 3 },
    };

    const path: Path = getCanonicalPath(line);
    const expected: Path = [
      {
        type: "HORIZONTAL",
        direction: "LEFT_TO_RIGHT",
        r: 4,
        c_from: 0,
        c_to: 5,
      },
      { type: "VERTICAL", direction: "UP", c: 5, r_from: 4, r_to: 2 },
      { type: "VERTICAL", direction: "UP", c: 5, r_from: 2, r_to: 0 },
      {
        type: "HORIZONTAL",
        direction: "RIGHT_TO_LEFT",
        r: 0,
        c_from: 5,
        c_to: 3,
      },
    ];

    expect(path).toEqual(expected);
  });

  /*
   *   >
   */
  test("test8", () => {
    const line: Line = {
      type: "LINE",
      start: { r: 2, c: 2 },
      inflection: { r: 2, c: 2 },
      end: { r: 2, c: 2 },
    };

    const path: Path = getCanonicalPath(line);
    const expected: Path = [
      {
        type: "HORIZONTAL",
        direction: "LEFT_TO_RIGHT",
        r: 2,
        c_from: 2,
        c_to: 2,
      },
    ];

    expect(path).toEqual(expected);
  });

  /*
   *   o->
   */
  test("test9", () => {
    const line: Line = {
      type: "LINE",
      start: { r: 0, c: 0 },
      inflection: { r: 0, c: 0 },
      end: { r: 0, c: 2 },
    };

    const path: Path = getCanonicalPath(line);
    const expected: Path = [
      {
        type: "HORIZONTAL",
        direction: "LEFT_TO_RIGHT",
        r: 0,
        c_from: 0,
        c_to: 2,
      },
    ];

    expect(path).toEqual(expected);
  });

  /*
   *   --o
   */
  test("test10", () => {
    const line: Line = {
      type: "LINE",
      start: { r: 0, c: 0 },
      inflection: { r: 0, c: 2 },
      end: { r: 0, c: 2 },
    };

    const path: Path = getCanonicalPath(line);
    const expected: Path = [
      {
        type: "HORIZONTAL",
        direction: "LEFT_TO_RIGHT",
        r: 0,
        c_from: 0,
        c_to: 2,
      },
    ];

    expect(path).toEqual(expected);
  });

  /*
   * o
   * |
   * |
   * v
   */
  test("test11", () => {
    const line: Line = {
      type: "LINE",
      start: { r: 3, c: 0 },
      inflection: { r: 0, c: 0 },
      end: { r: 3, c: 0 },
    };

    const path: Path = getCanonicalPath(line);
    const expected: Path = [
      {
        type: "VERTICAL",
        direction: "UP",
        c: 0,
        r_from: 3,
        r_to: 0,
      },
      {
        type: "VERTICAL",
        direction: "DOWN",
        c: 0,
        r_from: 0,
        r_to: 3,
      },
    ];

    expect(path).toEqual(expected);
  });

  /*
   * o-->
   */
  test("test12", () => {
    const line: Line = {
      type: "LINE",
      start: { r: 0, c: 3 },
      inflection: { r: 0, c: 0 },
      end: { r: 0, c: 3 },
    };

    const path: Path = getCanonicalPath(line);
    const expected: Path = [
      {
        type: "HORIZONTAL",
        direction: "RIGHT_TO_LEFT",
        r: 0,
        c_from: 3,
        c_to: 0,
      },
      {
        type: "HORIZONTAL",
        direction: "LEFT_TO_RIGHT",
        r: 0,
        c_from: 0,
        c_to: 3,
      },
    ];

    expect(path).toEqual(expected);
  });

  /*
   * o---+
   * |   |
   * |   v
   * |
   * +--
   */
  test("test13", () => {
    const line: Line = {
      type: "LINE",
      start: { r: 4, c: 2 },
      inflection: { r: 0, c: 0 },
      end: { r: 2, c: 4 },
    };

    const path: Path = getCanonicalPath(line);
    const expected: Path = [
      {
        type: "HORIZONTAL",
        direction: "RIGHT_TO_LEFT",
        r: 4,
        c_from: 2,
        c_to: 0,
      },
      { type: "VERTICAL", direction: "UP", c: 0, r_from: 4, r_to: 0 },
      {
        type: "HORIZONTAL",
        direction: "LEFT_TO_RIGHT",
        r: 0,
        c_from: 0,
        c_to: 4,
      },
      { type: "VERTICAL", direction: "DOWN", c: 4, r_from: 0, r_to: 2 },
    ];

    expect(path).toEqual(expected);
  });
});
