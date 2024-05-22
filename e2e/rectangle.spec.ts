import { test, expect } from "./fixtures/fixture";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/");
});

test.afterEach(async ({ page }) => {
  await page.evaluate(() => {
    localStorage.clear();
  });
});

test.describe("Create rectangle", () => {
  test("Create a 10x10 Rectangle by starting from the top left", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Create Rectangle" }).click();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.down();
    await canvas.mouse.move(9, 9);
    await canvas.mouse.up();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot();
  });

  test("Create a 10x10 Rectangle by starting from the bottom right", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Create Rectangle" }).click();

    await canvas.mouse.move(9, 9);
    await canvas.mouse.down();
    await canvas.mouse.move(0, 0);
    await canvas.mouse.up();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot();
  });

  test("Cannot create a 0x0 Rectangle", async ({ page, canvas }) => {
    await page.getByRole("button", { name: "Create Rectangle" }).click();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.down();
    await canvas.mouse.move(0, 0);
    await canvas.mouse.up();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot();
  });

  test("Cannot create a 5x0 rectangle", async ({ page, canvas }) => {
    await page.getByRole("button", { name: "Create Rectangle" }).click();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.down();
    await canvas.mouse.move(5, 0);
    await canvas.mouse.up();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot();
  });

  test("Cannot create a 0x5 rectangle", async ({ page, canvas }) => {
    await page.getByRole("button", { name: "Create Rectangle" }).click();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.down();
    await canvas.mouse.move(0, 5);
    await canvas.mouse.up();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot();
  });
});
