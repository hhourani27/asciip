import { test, expect } from "../fixtures/fixture";

// A single diagram, in ASCII mode, containing 2 rectangles, 4 lines, 2 multi-segment, 2 text
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

    await canvas.mouse.move(3, 3);
    await canvas.mouse.click();

    await expect(page.getByLabel("Arrow head")).toBeDisabled();
  });

  test("03-In ASCII mode, change the arrow head of a line", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Select tool" }).click();

    await canvas.mouse.move(3, 9);
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

    await canvas.mouse.move(3, 15);
    await canvas.mouse.click();
    await page.getByLabel("Arrow head").click();
    await page.locator('li[role="option"][data-value="START_END"]').click();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.click();

    await expect(canvas.locator()).toHaveScreenshot("style-04.png");
  });

  test("05-You cannot change the style of a text", async ({ page, canvas }) => {
    await page.getByRole("button", { name: "Select tool" }).click();

    await canvas.mouse.move(3, 25);
    await canvas.mouse.click();

    await expect(page.getByLabel("Arrow head")).toBeDisabled();
  });
});

test.describe("UNICODE mode", () => {
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

    await canvas.mouse.move(3, 3);
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

    await canvas.mouse.move(3, 9);
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

    await canvas.mouse.move(3, 15);
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

    await canvas.mouse.move(3, 25);
    await canvas.mouse.click();

    await expect(page.getByLabel("Line style")).toBeDisabled();
    await expect(page.getByLabel("Arrow head")).toBeDisabled();
    await expect(page.getByLabel("Head style")).toBeDisabled();
  });
});

test.describe("Multiple shapes, ASCII Mode", () => {
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

  test("10-ASCII mode: Select a line and a rectangle => Cannot change the head style", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Select tool" }).click();

    // Select line
    await canvas.mouse.move(3, 9);
    await canvas.mouse.click();
    // Select rectangle
    await page.keyboard.down("Control");
    await canvas.mouse.move(3, 3);
    await canvas.mouse.click();
    await page.keyboard.up("Control");

    await expect(page.getByLabel("Arrow head")).toBeDisabled();
  });

  test("11-ASCII mode: Select a line and a text => Cannot change the head style", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Select tool" }).click();

    // Select line
    await canvas.mouse.move(3, 9);
    await canvas.mouse.click();
    // Select text
    await page.keyboard.down("Control");
    await canvas.mouse.move(3, 25);
    await canvas.mouse.click();
    await page.keyboard.up("Control");

    await expect(page.getByLabel("Arrow head")).toBeDisabled();
  });

  test("12-ASCII mode: Select a line and a multi-segment line and change their head style", async ({
    page,
    canvas,
  }) => {
    await page.getByRole("button", { name: "Select tool" }).click();

    // Select line
    await canvas.mouse.move(3, 9);
    await canvas.mouse.click();
    // Select multi-line segment
    await page.keyboard.down("Control");
    await canvas.mouse.move(3, 15);
    await canvas.mouse.click();
    await page.keyboard.up("Control");

    // Change the head style
    await page.getByLabel("Arrow head").click();
    await page.locator('li[role="option"][data-value="START_END"]').click();

    await canvas.mouse.move(0, 0);
    await canvas.mouse.click();

    await expect(canvas.locator()).toHaveScreenshot("style-12.png");
  });
});
