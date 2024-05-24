import { test, expect } from "../fixtures/fixture";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/");
});

test.afterEach(async ({ page }) => {
  await page.evaluate(() => {
    localStorage.clear();
  });
});

test.describe("Create Mult-segment line", () => {
  test("01-Create a multi-segment line with all segment types", async ({
    page,
    canvas,
  }) => {
    await page
      .getByRole("button", { name: "Create Multi-segment Line" })
      .click();

    await canvas.mouse.move(5, 5);
    await canvas.mouse.click();
    await canvas.mouse.move(5, 10);
    await canvas.mouse.click();
    await canvas.mouse.move(10, 10);
    await canvas.mouse.click();
    await canvas.mouse.move(10, 5);
    await canvas.mouse.click();
    await canvas.mouse.move(7, 5);
    await canvas.mouse.dblclick();

    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("multisegment-line-01.png");
  });

  test("02-Create a multi-segment line with the shortcut key w", async ({
    page,
    canvas,
  }) => {
    await page.keyboard.press("w");

    await canvas.mouse.move(5, 5);
    await canvas.mouse.click();
    await canvas.mouse.move(5, 10);
    await canvas.mouse.click();
    await canvas.mouse.move(10, 10);
    await canvas.mouse.click();
    await canvas.mouse.move(10, 5);
    await canvas.mouse.click();
    await canvas.mouse.move(7, 5);
    await canvas.mouse.dblclick();

    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("multisegment-line-02.png");
  });
});
