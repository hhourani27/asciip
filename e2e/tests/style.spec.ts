import { test, expect } from "../fixtures/fixture";

// A single diagram, in ASCII mode, containing 1 rectangle, 1 line, 1 multi-segment, 1 text
import data_01 from "../fixtures/style.spec.ts/data_01.json";
// Same as data_01 but with styleMode = UNICODE
import data_02 from "../fixtures/style.spec.ts/data_02.json";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000/");
});

test.afterEach(async ({ page }) => {
  await page.evaluate(() => {
    localStorage.clear();
  });
});

test.describe("ASCII mode", () => {
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

  test("01-In ASCII mode, only Arrow head style is available", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Select tool" }).click();

    await expect(page.getByLabel("Arrow head")).toHaveCount(1);
    await expect(page.getByLabel("Line style")).toHaveCount(0);
    await expect(page.getByLabel("Head style")).toHaveCount(0);
  });

  test("02-In ASCII mode, you cannot change the style of a rectangle", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Select tool" }).click();

    await canvas.mouse.move(5, 5);
    await canvas.mouse.click();

    await expect(page.getByLabel("Arrow head")).toBeDisabled();
  });

  test("03-In ASCII mode, change the arrow head of a line", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Select tool" }).click();

    await canvas.mouse.move(5, 15);
    await canvas.mouse.click();
    await page.getByLabel("Arrow head").click();
    await page.locator('li[role="option"][data-value="START_END"]').click();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.click();

    await expect(canvas.locator()).toHaveScreenshot("style-03.png");
  });

  test("04-In ASCII mode, change the arrow head of a multi-segment line", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Select tool" }).click();

    await canvas.mouse.move(15, 5);
    await canvas.mouse.click();
    await page.getByLabel("Arrow head").click();
    await page.locator('li[role="option"][data-value="START_END"]').click();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.click();

    await expect(canvas.locator()).toHaveScreenshot("style-04.png");
  });

  test("05-You cannot change the style of a text", async ({ page, canvas }) => {
    await page.getByRole("button", { name: "Select tool" }).click();

    await canvas.mouse.move(15, 15);
    await canvas.mouse.click();

    await expect(page.getByLabel("Arrow head")).toBeDisabled();
  });
});

test.describe("ASCII mode", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");

    await page.evaluate(
      ([data_02]) => {
        localStorage.setItem("appState", JSON.stringify(data_02));
      },
      [data_02]
    );

    await page.reload();
  });

  test("06-In UNICODE mode, you can only change the line style of a rectangle", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Select tool" }).click();

    await canvas.mouse.move(5, 5);
    await canvas.mouse.click();

    await expect(page.getByLabel("Line style")).toBeEnabled();
    await expect(page.getByLabel("Arrow head")).toBeDisabled();
    await expect(page.getByLabel("Head style")).toBeDisabled();

    await page.getByLabel("Line style").click();
    await page.locator('li[role="option"][data-value="DOUBLE"]').click();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.click();

    await expect(canvas.locator()).toHaveScreenshot("style-06.png");
  });

  test("07-In UNICODE mode, you can change the line, arrow and head style of a line", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Select tool" }).click();

    await canvas.mouse.move(5, 15);
    await canvas.mouse.click();

    await expect(page.getByLabel("Line style")).toBeEnabled();
    await expect(page.getByLabel("Arrow head")).toBeEnabled();
    await expect(page.getByLabel("Head style")).toBeEnabled();

    await page.getByLabel("Line style").click();
    await page.locator('li[role="option"][data-value="DOUBLE"]').click();

    await page.getByLabel("Arrow head").click();
    await page.locator('li[role="option"][data-value="START_END"]').click();

    await page.getByLabel("Head style").click();
    await page.locator('li[role="option"][data-value="OUTLINED"]').click();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.click();

    await expect(canvas.locator()).toHaveScreenshot("style-07.png");
  });

  test("08-In UNICODE mode, you can change the line, arrow and head style of a multi-segment line", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Select tool" }).click();

    await canvas.mouse.move(15, 5);
    await canvas.mouse.click();

    await expect(page.getByLabel("Line style")).toBeEnabled();
    await expect(page.getByLabel("Arrow head")).toBeEnabled();
    await expect(page.getByLabel("Head style")).toBeEnabled();

    await page.getByLabel("Line style").click();
    await page.locator('li[role="option"][data-value="DOUBLE"]').click();

    await page.getByLabel("Arrow head").click();
    await page.locator('li[role="option"][data-value="START_END"]').click();

    await page.getByLabel("Head style").click();
    await page.locator('li[role="option"][data-value="OUTLINED"]').click();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.click();

    await expect(canvas.locator()).toHaveScreenshot("style-08.png");
  });

  test("09-In UNICODE mode, you cannot change the style of a text", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Select tool" }).click();

    await canvas.mouse.move(15, 15);
    await canvas.mouse.click();

    await expect(page.getByLabel("Line style")).toBeDisabled();
    await expect(page.getByLabel("Arrow head")).toBeDisabled();
    await expect(page.getByLabel("Head style")).toBeDisabled();
  });
});
