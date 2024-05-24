import { test, expect } from "../fixtures/fixture";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/");
});

test.afterEach(async ({ page }) => {
  await page.evaluate(() => {
    localStorage.clear();
  });
});

test.describe("Create rectangle", () => {
  test("01-Create a 10x10 Rectangle by starting from the top left", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Create Rectangle" }).click();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.down();
    await canvas.mouse.move(9, 9);
    await canvas.mouse.up();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("rectangle-01.png");
  });

  test("02-Create a 10x10 Rectangle by starting from the bottom right", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Create Rectangle" }).click();

    await canvas.mouse.move(9, 9);
    await canvas.mouse.down();
    await canvas.mouse.move(0, 0);
    await canvas.mouse.up();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("rectangle-02.png");
  });

  test("03-Cannot create a 0x0 Rectangle", async ({ page, canvas }) => {
    await page.getByRole("button", { name: "Create Rectangle" }).click();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.down();
    await canvas.mouse.move(0, 0);
    await canvas.mouse.up();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("rectangle-03.png");
  });

  test("04-Cannot create a 5x0 rectangle", async ({ page, canvas }) => {
    await page.getByRole("button", { name: "Create Rectangle" }).click();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.down();
    await canvas.mouse.move(5, 0);
    await canvas.mouse.up();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("rectangle-04.png");
  });

  test("05-Cannot create a 0x5 rectangle", async ({ page, canvas }) => {
    await page.getByRole("button", { name: "Create Rectangle" }).click();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.down();
    await canvas.mouse.move(0, 5);
    await canvas.mouse.up();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("rectangle-05.png");
  });

  test("12-Create a 10x10 Rectangle with the shortcut key R", async ({
    page,
    canvas,
  }) => {
    await page.keyboard.press("r");

    await canvas.mouse.move(0, 0);
    await canvas.mouse.down();
    await canvas.mouse.move(9, 9);
    await canvas.mouse.up();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("rectangle-12.png");
  });
});

test.describe("Resize rectangle", () => {
  test.beforeEach(async ({ page, canvas }) => {
    await page.getByRole("button", { name: "Create Rectangle" }).click();

    // Create rectangle
    await canvas.mouse.move(5, 5);
    await canvas.mouse.down();
    await canvas.mouse.move(10, 10);
    await canvas.mouse.up();
    await canvas.mouse.leave();

    await page.getByRole("button", { name: "Select tool" }).click();
  });

  test("06-Enlarge a rectangle by dragging the bottom right point", async ({
    page,
    canvas,
  }) => {
    await canvas.mouse.move(10, 10);
    await canvas.mouse.click();

    await canvas.mouse.down();
    await canvas.mouse.move(15, 15);
    await canvas.mouse.up();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.click();

    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("rectangle-06.png");
  });

  test("07-Shrink a rectangle by dragging the top left point", async ({
    page,
    canvas,
  }) => {
    await canvas.mouse.move(5, 5);
    await canvas.mouse.click();

    await canvas.mouse.down();
    await canvas.mouse.move(7, 7);
    await canvas.mouse.up();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.click();

    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("rectangle-07.png");
  });

  test("08-Invert a rectangle by dragging the bottom right point", async ({
    page,
    canvas,
  }) => {
    await canvas.mouse.move(10, 10);
    await canvas.mouse.click();

    await canvas.mouse.down();
    await canvas.mouse.move(1, 1);
    await canvas.mouse.up();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.click();

    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("rectangle-08.png");
  });

  test("09-Cannot resize a rectangle to a single point", async ({
    page,
    canvas,
  }) => {
    await canvas.mouse.move(10, 10);
    await canvas.mouse.click();

    await canvas.mouse.down();
    await canvas.mouse.move(5, 5);
    await canvas.mouse.up();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.click();

    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("rectangle-09.png");
  });

  test("10-Cannot resize a rectangle to a vertical line", async ({
    page,
    canvas,
  }) => {
    await canvas.mouse.move(10, 10);
    await canvas.mouse.click();

    await canvas.mouse.down();
    await canvas.mouse.move(10, 5);
    await canvas.mouse.up();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.click();

    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("rectangle-10.png");
  });

  test("11-Cannot resize a rectangle to a horizontal line", async ({
    page,
    canvas,
  }) => {
    await canvas.mouse.move(10, 10);
    await canvas.mouse.click();

    await canvas.mouse.down();
    await canvas.mouse.move(5, 10);
    await canvas.mouse.up();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.click();

    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("rectangle-11.png");
  });
});
