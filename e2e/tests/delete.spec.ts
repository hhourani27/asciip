import { test, expect } from "../fixtures/fixture";

// A single diagram, in ASCII mode, containing 1 rectangle, 1 line, 1 multi-segment, 1 text
import data_01 from "../fixtures/delete.spec.ts/data_01.json";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/");
});

test.afterEach(async ({ page }) => {
  await page.evaluate(() => {
    localStorage.clear();
  });
});

test.describe("Delete shapes", () => {
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

  test("01-Delete a single shape", async ({ page, canvas }) => {
    await page.getByRole("button", { name: "Select tool" }).click();

    await canvas.mouse.move(5, 5);
    await canvas.mouse.click();
    await page.keyboard.press("Delete");

    await expect(canvas.locator()).toHaveScreenshot("delete-01.png");
  });

  test("02-Delete two shapes", async ({ page, canvas }) => {
    await page.getByRole("button", { name: "Select tool" }).click();

    await canvas.mouse.move(5, 5);
    await canvas.mouse.click();
    await page.keyboard.down("Control");
    await canvas.mouse.move(5, 15);
    await canvas.mouse.click();
    await page.keyboard.up("Control");

    await page.keyboard.press("Delete");

    await expect(canvas.locator()).toHaveScreenshot("delete-02.png");
  });

  test("03-Delete all shapes", async ({ page, canvas }) => {
    await page.getByRole("button", { name: "Select tool" }).click();

    await canvas.mouse.move(0, 0); // To remove the tooltip
    await page.keyboard.press("Control+A");
    await page.keyboard.press("Delete");

    await expect(canvas.locator()).toHaveScreenshot("delete-03.png");
  });
});
