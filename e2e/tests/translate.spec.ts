import { test, expect } from "../fixtures/fixture";

// A single diagram, in ASCII mode, containing 1 rectangle, 1 line, 1 multi-segment, 1 text
import data_01 from "../fixtures/translate.spec.ts/data_01.json";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/");
});

test.afterEach(async ({ page }) => {
  await page.evaluate(() => {
    localStorage.clear();
  });
});

test.describe("Translate", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");

    await page.evaluate(
      ([data_01]) => {
        localStorage.setItem("appState", JSON.stringify(data_01));
      },
      [data_01]
    );

    await page.reload();
  });

  test("01-Grab a rectangle from bottom and drag mouse to top => Rectangle is not translated beyond the top canvas border", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Select tool" }).click();

    await canvas.mouse.move(10, 8);
    await canvas.mouse.click();
    await canvas.mouse.down();
    await canvas.mouse.move(0, 8);
    await canvas.mouse.up();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.click();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("translate-01.png");
  });

  test("02-Select 2 shapes and translate them together", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Select tool" }).click();

    // Select a rectangle and a line
    await canvas.mouse.move(5, 5);
    await canvas.mouse.click();
    await page.keyboard.down("Control");
    await canvas.mouse.move(5, 15);
    await canvas.mouse.click();
    await page.keyboard.up("Control");

    // Translate them until rectangle touches the left border
    await canvas.mouse.down();
    await canvas.mouse.move(5, 10);
    await canvas.mouse.up();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.click();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("translate-02.png");
  });
});
