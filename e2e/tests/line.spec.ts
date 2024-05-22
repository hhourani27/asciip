import { test, expect } from "../fixtures/fixture";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/");
});

test.afterEach(async ({ page }) => {
  await page.evaluate(() => {
    localStorage.clear();
  });
});

test.describe("Create Line", () => {
  test("Create a left-to-right horizontal line", async ({ page, canvas }) => {
    await page.getByRole("button", { name: "Create Simple Line" }).click();

    await canvas.mouse.move(5, 5);
    await canvas.mouse.down();
    await canvas.mouse.move(5, 10);
    await canvas.mouse.up();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot();
  });

  test("Create a right-to-left horizontal line", async ({ page, canvas }) => {
    await page.getByRole("button", { name: "Create Simple Line" }).click();

    await canvas.mouse.move(5, 5);
    await canvas.mouse.down();
    await canvas.mouse.move(5, 0);
    await canvas.mouse.up();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot();
  });

  test("Create a downward vertical line", async ({ page, canvas }) => {
    await page.getByRole("button", { name: "Create Simple Line" }).click();

    await canvas.mouse.move(5, 5);
    await canvas.mouse.down();
    await canvas.mouse.move(10, 5);
    await canvas.mouse.up();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot();
  });

  test("Create an upward vertical line", async ({ page, canvas }) => {
    await page.getByRole("button", { name: "Create Simple Line" }).click();

    await canvas.mouse.move(5, 5);
    await canvas.mouse.down();
    await canvas.mouse.move(0, 5);
    await canvas.mouse.up();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot();
  });

  test("Cannot create zero-length line", async ({ page, canvas }) => {
    await page.getByRole("button", { name: "Create Simple Line" }).click();

    await canvas.mouse.move(5, 5);
    await canvas.mouse.down();
    await canvas.mouse.up();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot();
  });

  test("Create a left-to-right horizontal line while mouse is not on the line", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Create Simple Line" }).click();

    await canvas.mouse.move(5, 5);
    await canvas.mouse.down();
    await canvas.mouse.move(3, 10);
    await canvas.mouse.up();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot();
  });

  test("Create a downwards vertical line while mouse is not on the line", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Create Simple Line" }).click();

    await canvas.mouse.move(5, 5);
    await canvas.mouse.down();
    await canvas.mouse.move(10, 7);
    await canvas.mouse.up();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot();
  });
});

test.describe("Resize horizontal Line", () => {
  test.beforeEach(async ({ page, canvas }) => {
    await page.getByRole("button", { name: "Create Simple Line" }).click();

    await canvas.mouse.move(5, 5);
    await canvas.mouse.down();
    await canvas.mouse.move(5, 10);
    await canvas.mouse.up();
    await canvas.mouse.leave();

    await page.getByRole("button", { name: "Select tool" }).click();
  });

  test("Extend horizontal line by dragging the end point", async ({
    page,
    canvas,
  }) => {
    await canvas.mouse.move(5, 10);
    await canvas.mouse.click();

    await canvas.mouse.down();
    await canvas.mouse.move(5, 15);
    await canvas.mouse.up();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.click();

    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot();
  });

  test("Shrink horizontal line by dragging the end point", async ({
    page,
    canvas,
  }) => {
    await canvas.mouse.move(5, 10);
    await canvas.mouse.click();

    await canvas.mouse.down();
    await canvas.mouse.move(5, 7);
    await canvas.mouse.up();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.click();

    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot();
  });

  test("Extend horizontal line by dragging the start point", async ({
    page,
    canvas,
  }) => {
    await canvas.mouse.move(5, 5);
    await canvas.mouse.click();

    await canvas.mouse.down();
    await canvas.mouse.move(5, 0);
    await canvas.mouse.up();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.click();

    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot();
  });

  test("Shrink horizontal line by dragging the start point", async ({
    page,
    canvas,
  }) => {
    await canvas.mouse.move(5, 10);
    await canvas.mouse.click();

    await canvas.mouse.down();
    await canvas.mouse.move(5, 7);
    await canvas.mouse.up();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.click();

    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot();
  });

  test("Turn horizontal line 180 degrees by dragging the end point", async ({
    page,
    canvas,
  }) => {
    await canvas.mouse.move(5, 10);
    await canvas.mouse.click();

    await canvas.mouse.down();
    await canvas.mouse.move(5, 0);
    await canvas.mouse.up();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.click();

    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot();
  });

  test("Turn horizontal line 90 degrees by dragging the end point", async ({
    page,
    canvas,
  }) => {
    await canvas.mouse.move(5, 10);
    await canvas.mouse.click();

    await canvas.mouse.down();
    await canvas.mouse.move(10, 5);
    await canvas.mouse.up();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.click();

    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot();
  });

  test("Cannot shrink horizontal line to a zero-length line", async ({
    page,
    canvas,
  }) => {
    await canvas.mouse.move(5, 10);
    await canvas.mouse.click();

    await canvas.mouse.down();
    await canvas.mouse.move(5, 5);
    await canvas.mouse.up();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.click();

    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot();
  });
});
