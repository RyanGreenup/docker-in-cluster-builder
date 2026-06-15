import { expect, test, type Locator, type Page } from "@playwright/test";
import { Buffer } from "node:buffer";

import { figmaTestId, LIVE_TEST_ID } from "../helpers/visual-parity-ids";

const screenshotOptions = {
  animations: "disabled",
  omitBackground: true,
  scale: "css",
} as const;

export type VisualParityContext = {
  actual: Locator;
  expected: Locator;
  page: Page;
  root: Locator;
};

export type VisualParityCase = {
  /** Live-specimen test id. Defaults to the option's `actualTestId`. */
  actualTestId?: string;
  /** Figma-reference test id. Defaults to `figmaTestId(<case index>)`. */
  expectedTestId?: string;
  hover?: true | string;
  label: string;
  /**
   * Allowed differing-pixel count for this case. Defaults to the option's
   * `maxDifferingPixels` (itself `0`). A small budget absorbs sub-pixel
   * antialiasing between an `<img>`-rendered SVG and the live DOM SVG.
   */
  maxDifferingPixels?: number;
  prepare?: (context: VisualParityContext) => Promise<void>;
  waitForCss?: readonly {
    property: string;
    selector: string;
    value: RegExp | string;
  }[];
};

export type StorybookVisualParityOptions = {
  /** Live-specimen test id shared by all cases. Defaults to `LIVE_TEST_ID`. */
  actualTestId?: string;
  cases: readonly VisualParityCase[];
  /** Default allowed differing-pixel count across cases. Defaults to `0` (exact). */
  maxDifferingPixels?: number;
  storyId: string;
  title?: string;
};

type PixelDiff = {
  differingPixels: number;
  expectedHeight: number;
  expectedWidth: number;
  receivedHeight: number;
  receivedWidth: number;
};

export const storybookIframeUrl = (storyId: string): string =>
  `/iframe.html?id=${storyId}&viewMode=story`;

export const storybookRoot = (page: Page): Locator =>
  page.locator("#storybook-root");

const expectPngParity = async (
  page: Page,
  received: Buffer,
  expected: Buffer,
  label: string,
  maxDifferingPixels: number,
): Promise<void> => {
  const diff = await page.evaluate(
    async ({ expectedBase64, receivedBase64 }): Promise<PixelDiff> => {
      const decode = async (base64: string): Promise<ImageBitmap> => {
        const response = await fetch(`data:image/png;base64,${base64}`);
        return createImageBitmap(await response.blob());
      };

      const [receivedImage, expectedImage] = await Promise.all([
        decode(receivedBase64),
        decode(expectedBase64),
      ]);

      if (
        receivedImage.width !== expectedImage.width ||
        receivedImage.height !== expectedImage.height
      ) {
        return {
          differingPixels: Number.POSITIVE_INFINITY,
          expectedHeight: expectedImage.height,
          expectedWidth: expectedImage.width,
          receivedHeight: receivedImage.height,
          receivedWidth: receivedImage.width,
        };
      }

      const canvas = document.createElement("canvas");
      canvas.width = receivedImage.width;
      canvas.height = receivedImage.height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Unable to create a 2D canvas context");

      const readPixels = (image: ImageBitmap): Uint8ClampedArray => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0);
        return context.getImageData(0, 0, canvas.width, canvas.height).data;
      };

      const receivedPixels = readPixels(receivedImage);
      const expectedPixels = readPixels(expectedImage);
      let differingPixels = 0;
      for (let index = 0; index < receivedPixels.length; index += 4) {
        if (
          receivedPixels[index] !== expectedPixels[index] ||
          receivedPixels[index + 1] !== expectedPixels[index + 1] ||
          receivedPixels[index + 2] !== expectedPixels[index + 2] ||
          receivedPixels[index + 3] !== expectedPixels[index + 3]
        ) {
          differingPixels += 1;
        }
      }

      return {
        differingPixels,
        expectedHeight: expectedImage.height,
        expectedWidth: expectedImage.width,
        receivedHeight: receivedImage.height,
        receivedWidth: receivedImage.width,
      };
    },
    {
      expectedBase64: expected.toString("base64"),
      receivedBase64: received.toString("base64"),
    },
  );

  expect(diff.receivedWidth, `${label} screenshot widths differ`).toBe(
    diff.expectedWidth,
  );
  expect(diff.receivedHeight, `${label} screenshot heights differ`).toBe(
    diff.expectedHeight,
  );
  expect(
    diff.differingPixels,
    `${label} pixels differ from the Figma reference (allowed ${maxDifferingPixels})`,
  ).toBeLessThanOrEqual(maxDifferingPixels);
};

export const expectStorybookVisualParity = async (
  page: Page,
  options: StorybookVisualParityOptions,
): Promise<void> => {
  await page.goto(storybookIframeUrl(options.storyId));

  const root = storybookRoot(page);
  const actualTestId = options.actualTestId ?? LIVE_TEST_ID;
  for (const [index, parityCase] of options.cases.entries()) {
    const actual = root.getByTestId(parityCase.actualTestId ?? actualTestId);
    const expected = root.getByTestId(
      parityCase.expectedTestId ?? figmaTestId(index),
    );

    await expect(actual).toBeVisible();
    await expect(expected).toBeVisible();

    await parityCase.prepare?.({ actual, expected, page, root });
    if (parityCase.hover) {
      const hoverTarget =
        parityCase.hover === true ? actual : actual.locator(parityCase.hover);
      await hoverTarget.hover();
    } else {
      // Cases run sequentially against one live specimen, so drop any hover a
      // prior case left active before measuring this case's resting state.
      await page.mouse.move(0, 0);
    }
    for (const cssExpectation of parityCase.waitForCss ?? []) {
      await expect(actual.locator(cssExpectation.selector)).toHaveCSS(
        cssExpectation.property,
        cssExpectation.value,
      );
    }

    const actualPng = await actual.screenshot(screenshotOptions);
    const expectedPng = await expected.screenshot(screenshotOptions);
    await expectPngParity(
      page,
      actualPng,
      expectedPng,
      parityCase.label,
      parityCase.maxDifferingPixels ?? options.maxDifferingPixels ?? 0,
    );
  }
};

/**
 * Defines a Storybook iframe visual-parity test for a `<VisualParity>` story:
 * one live component stage plus one or more Figma SVG stages, identified by the
 * shared `LIVE_TEST_ID` / `figmaTestId(i)` contract. Ids therefore default —
 * the Nth case compares the live specimen against `figmaTestId(n)`, matching the
 * Nth Figma reference passed to `<VisualParity>`.
 *
 * Cases run sequentially against the single live specimen, so order matters: a
 * hovering case leaves the pointer engaged; each non-hover case resets it first.
 *
 * Typical usage:
 *
 * ```ts
 * testStorybookVisualParity({
 *   storyId: "ni-button--design-spec",
 *   cases: [
 *     { label: "Default button" },
 *     { label: "Hovered button", hover: true },
 *   ],
 * });
 * ```
 */
export const testStorybookVisualParity = (
  options: StorybookVisualParityOptions,
): void => {
  test(
    options.title ?? "visually matches the Figma SVG spec",
    async ({ page }) => {
      await expectStorybookVisualParity(page, options);
    },
  );
};
