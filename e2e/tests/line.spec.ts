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
  test("01-Create a left-to-right horizontal line", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Create Simple Line" }).click();

    await canvas.mouse.move(5, 5);
    await canvas.mouse.down();
    await canvas.mouse.move(5, 10);
    await canvas.mouse.up();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("line-01.png");
  });

  test("02-Create a right-to-left horizontal line", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Create Simple Line" }).click();

    await canvas.mouse.move(5, 5);
    await canvas.mouse.down();
    await canvas.mouse.move(5, 0);
    await canvas.mouse.up();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("line-02.png");
  });

  test("03-Create a downward vertical line", async ({ page, canvas }) => {
    await page.getByRole("button", { name: "Create Simple Line" }).click();

    await canvas.mouse.move(5, 5);
    await canvas.mouse.down();
    await canvas.mouse.move(10, 5);
    await canvas.mouse.up();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("line-03.png");
  });

  test("04-Create an upward vertical line", async ({ page, canvas }) => {
    await page.getByRole("button", { name: "Create Simple Line" }).click();

    await canvas.mouse.move(5, 5);
    await canvas.mouse.down();
    await canvas.mouse.move(0, 5);
    await canvas.mouse.up();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("line-04.png");
  });

  test("05-Cannot create zero-length line", async ({ page, canvas }) => {
    await page.getByRole("button", { name: "Create Simple Line" }).click();

    await canvas.mouse.move(5, 5);
    await canvas.mouse.down();
    await canvas.mouse.up();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("line-05.png");
  });

  test("06-Create a left-to-right horizontal line while mouse is not on the line", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Create Simple Line" }).click();

    await canvas.mouse.move(5, 5);
    await canvas.mouse.down();
    await canvas.mouse.move(3, 10);
    await canvas.mouse.up();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("line-06.png");
  });

  test("07-Create a downwards vertical line while mouse is not on the line", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Create Simple Line" }).click();

    await canvas.mouse.move(5, 5);
    await canvas.mouse.down();
    await canvas.mouse.move(10, 7);
    await canvas.mouse.up();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("line-07.png");
  });

  test("15-Create a left-to-right horizontal line with the shortcut key A", async ({
    page,
    canvas,
  }) => {
    await page.keyboard.press("a");

    await canvas.mouse.move(5, 5);
    await canvas.mouse.down();
    await canvas.mouse.move(5, 10);
    await canvas.mouse.up();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("line-15.png");
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

  test("08-Extend horizontal line by dragging the end point", async ({
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

    await expect(canvas.locator()).toHaveScreenshot("line-08.png");
  });

  test("09-Shrink horizontal line by dragging the end point", async ({
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

    await expect(canvas.locator()).toHaveScreenshot("line-09.png");
  });

  test("10-Extend horizontal line by dragging the start point", async ({
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

    await expect(canvas.locator()).toHaveScreenshot("line-10.png");
  });

  test("11-Shrink horizontal line by dragging the start point", async ({
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

    await expect(canvas.locator()).toHaveScreenshot("line-11.png");
  });

  test("12-Turn horizontal line 180 degrees by dragging the end point", async ({
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

    await expect(canvas.locator()).toHaveScreenshot("line-12.png");
  });

  test("13-Turn horizontal line 90 degrees by dragging the end point", async ({
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

    await expect(canvas.locator()).toHaveScreenshot("line-13.png");
  });

  test("14-Cannot shrink horizontal line to a zero-length line", async ({
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

    await expect(canvas.locator()).toHaveScreenshot("line-14.png");
  });
});
