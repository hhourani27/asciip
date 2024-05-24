import { test, expect } from "../fixtures/fixture";

// A single diagram, in ASCII mode, containing 1 rectangle, 1 line, 1 multi-segment, 1 text
import data_01 from "../fixtures/select.spec.ts/data_01.json";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/");
});

test.afterEach(async ({ page }) => {
  await page.evaluate(() => {
    localStorage.clear();
  });
});

test.describe("Select shape", () => {
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

  test("01-I select a rectangle => It is colored blue with 4 resize points visible", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Select tool" }).click();

    await canvas.mouse.move(5, 5);
    await canvas.mouse.click();

    await expect(canvas.locator()).toHaveScreenshot("select-01.png");
  });

  test("02-Select two shapes => They are colored blue with no resize point visible", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Select tool" }).click();

    await canvas.mouse.move(5, 5);
    await canvas.mouse.click();
    await page.keyboard.down("Control");
    await canvas.mouse.move(5, 15);
    await canvas.mouse.click();
    await page.keyboard.up("Control");

    await expect(canvas.locator()).toHaveScreenshot("select-02.png");
  });

  test("03-Select two shapes => Then unselect one shape => one shape is selected", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Select tool" }).click();

    // Select rectangle
    await canvas.mouse.move(5, 5);
    await canvas.mouse.click();
    // Select line
    await page.keyboard.down("Control");
    await canvas.mouse.move(5, 15);
    await canvas.mouse.click();
    // Unselect rectangle
    await canvas.mouse.move(5, 5);
    await canvas.mouse.click();

    await page.keyboard.up("Control");

    await expect(canvas.locator()).toHaveScreenshot("select-03.png");
  });

  test("04-Select all shapes with Ctrl+A", async ({ page, canvas }) => {
    await page.getByRole("button", { name: "Select tool" }).click();

    await canvas.mouse.move(0, 0); // To remove the tooltip
    await page.keyboard.press("Control+A");

    await expect(canvas.locator()).toHaveScreenshot("select-04.png");
  });
});
