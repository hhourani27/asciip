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
});
