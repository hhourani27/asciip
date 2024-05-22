import type { Page, Locator } from "@playwright/test";
import { CELL_WIDTH, CELL_HEIGHT } from "../../src/components/canvas/draw";

export class Canvas {
  private readonly page: Page;
  public readonly mouse: CanvasMouse;

  constructor(page: Page) {
    this.page = page;
    this.mouse = new CanvasMouse(page);
  }

  locator(): Locator {
    return this.page.locator("#canvas-container");
  }
}

class CanvasMouse {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async move(r: number, c: number) {
    await this.page.mouse.move(...(await this.coords(r, c)), { steps: 30 });
  }

  async down() {
    await this.page.mouse.down();
  }

  async up() {
    await this.page.mouse.up();
  }

  async leave() {
    this.page.mouse.move(0, 0, { steps: 30 });
  }

  private async coords(r: number, c: number): Promise<[number, number]> {
    // Select the canvas element
    const canvas = await this.page.$("canvas");
    if (!canvas) {
      throw new Error("Canvas element not found");
    }

    // Get the bounding box of the canvas
    const canvasBB = await canvas.boundingBox();
    if (!canvasBB) {
      throw new Error("Bounding box not found");
    }

    const canvasX = c * CELL_WIDTH + 0.5 * CELL_WIDTH;
    const canvasY = r * CELL_HEIGHT + 0.5 * CELL_HEIGHT;

    return [canvasBB.x + canvasX, canvasBB.y + canvasY];
  }
}
