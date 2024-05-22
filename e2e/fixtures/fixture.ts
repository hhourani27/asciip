import { Canvas } from "../pom/Canvas";
import { test as base } from "@playwright/test";

type MyFixtures = {
  canvas: Canvas;
};

export const test = base.extend<MyFixtures>({
  canvas: async ({ page }, use) => {
    const canvas = new Canvas(page);
    use(canvas);
  },
});

export { expect } from "@playwright/test";
