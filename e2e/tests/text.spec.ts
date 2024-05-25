import { test, expect } from "../fixtures/fixture";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/");
});

test.afterEach(async ({ page }) => {
  await page.evaluate(() => {
    localStorage.clear();
  });
});

test.describe("Create text", () => {
  test("01-Create a one-line text", async ({ page, canvas }) => {
    await page.getByRole("button", { name: "Add Text" }).click();

    await canvas.mouse.move(5, 5);
    await canvas.mouse.click();
    await page.locator("#text-shape-input").waitFor();
    await page.keyboard.type("Hello world!"); // Use page.keyboard.type to make sure that the text input is already focused
    await page.keyboard.press("Control+Enter");

    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("text-01.png");
  });

  test("02-Create a one-line text with the shortcut key t", async ({
    page,
    canvas,
  }) => {
    await page.keyboard.press("t");

    await canvas.mouse.move(5, 5);
    await canvas.mouse.click();
    await page.locator("#text-shape-input").waitFor();
    await page.keyboard.type("Hello world!"); // Use page.keyboard.type to make sure that the text input is already focused
    await page.keyboard.press("Control+Enter");

    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("text-02.png");
  });

  test("03-Create a two-line text", async ({ page, canvas }) => {
    await page.getByRole("button", { name: "Add Text" }).click();

    await canvas.mouse.move(5, 5);
    await canvas.mouse.click();
    await page.locator("#text-shape-input").waitFor();
    await page.keyboard.type("Hello");
    await page.keyboard.press("Enter");
    await page.keyboard.type("world!");
    await page.keyboard.press("Control+Enter");

    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("text-03.png");
  });
});

test.describe("Edit text", () => {
  test.beforeEach(async ({ page, canvas }) => {
    await page.getByRole("button", { name: "Add Text" }).click();

    await canvas.mouse.move(5, 5);
    await canvas.mouse.click();
    await page.locator("#text-shape-input").waitFor();
    await page.keyboard.type("Hello"); // Use page.keyboard.type to make sure that the text input is already focused
    await page.keyboard.press("Control+Enter");

    await canvas.mouse.leave();
  });

  test("04-Edit a text", async ({ page, canvas }) => {
    await page.getByRole("button", { name: "Select tool" }).click();

    await canvas.mouse.move(5, 5);
    await canvas.mouse.dblclick();
    await page.locator("#text-shape-input").waitFor();
    await page.keyboard.type(" world!");
    await page.keyboard.press("Control+Enter");

    await canvas.mouse.move(0, 0);
    await canvas.mouse.click();
    await canvas.mouse.leave();

    await expect(canvas.locator()).toHaveScreenshot("text-04.png");
  });

  test("05-Fix: Edit a text => Text should still appear in blue as selected", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Select tool" }).click();

    await canvas.mouse.move(5, 5);
    await canvas.mouse.dblclick();

    await expect(canvas.locator()).toHaveScreenshot("text-05.png");
  });
});
