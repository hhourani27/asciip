import { test, expect } from "../fixtures/fixture";

// A single diagram, in ASCII mode, with 1 text on top of 1 line on top of 1 rectangle
import data_01 from "../fixtures/order.spec.ts/data_01.json";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/");
});

test.afterEach(async ({ page }) => {
  await page.evaluate(() => {
    localStorage.clear();
  });
});

test.describe("Order", () => {
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

  test("01-Creating a rectangle on top of a text => Text is still on top of other shapes", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Create Rectangle" }).click();

    await canvas.mouse.move(8, 6);
    await canvas.mouse.down();
    await canvas.mouse.move(9, 8);
    await canvas.mouse.up();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.click();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("order-01.png");
  });

  test("02-Bring rectangle to front => Rectangle is in front of line and behind text", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Select tool" }).click();

    await canvas.mouse.move(5, 5);
    await canvas.mouse.click();

    await page.getByLabel("bring to front").click();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.click();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("order-02.png");
  });

  test("03-Push line to back => Line is behind rectangle", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Select tool" }).click();

    await canvas.mouse.move(8, 10);
    await canvas.mouse.click();

    await page.getByLabel("push to back").click();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.click();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("order-03.png");
  });

  test("04-Order buttons are disabled if there's no selection", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Select tool" }).click();

    await expect(page.getByLabel("push to back")).toBeDisabled();
    await expect(page.getByLabel("bring to front")).toBeDisabled();
  });
});
