import { range } from "../shapes";

describe("range()", () => {
  test("range()", () => {
    expect(range(1, 4)).toEqual([1, 2, 3, 4]);
    expect(range(4, 0)).toEqual([4, 3, 2, 1, 0]);
    expect(range(1, 1)).toEqual([1]);
  });
});
