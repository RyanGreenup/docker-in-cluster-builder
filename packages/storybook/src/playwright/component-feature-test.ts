import { figmaTestId, LIVE_TEST_ID } from "../helpers/visual-parity-ids";

import type { expect as playwrightExpect } from "@playwright/test";
import type { Locator, Page } from "playwright";

import type {
  AccessibilityFeatureContract,
  AnchorFeatureContract,
  ComponentFeatureContract,
  CssBoxContract,
  CssInsetContract,
  CssLength,
  CssPositionContract,
  CssSurfaceContract,
  CssTypographyContract,
  DecorativeFeatureContract,
  DomElementName,
  ElementFeatureContract,
  ElementLocatorContract,
  ImageFeatureContract,
  RequiredDescendantContract,
  TextFeatureContract,
  VisualParityFeatureContract,
} from "../helpers/component-feature-contract";

type TestContext = {
  readonly page: Page;
};

type TestFunction = (
  title: string,
  body: (context: TestContext) => Promise<void>,
) => void;

type ExpectFunction = typeof playwrightExpect;

type AccessibilityResult = {
  readonly violations: readonly unknown[];
};

type VisualParityAssertion = (
  page: Page,
  visualParity: VisualParityFeatureContract,
) => Promise<void>;

type PlaywrightAriaRole = Parameters<Locator["getByRole"]>[0];

export type StorybookComponentFeatureTestOptions<
  Contract extends ComponentFeatureContract<keyof HTMLElementTagNameMap>,
> = {
  readonly analyzeAccessibility?: (
    page: Page,
    accessibility: AccessibilityFeatureContract,
  ) => Promise<AccessibilityResult>;
  readonly contract: Contract;
  readonly expect: ExpectFunction;
  readonly expectVisualParity?: VisualParityAssertion;
  readonly rootLocator?: (page: Page) => Locator;
  readonly storybookIframeUrl: (storyId: string) => string;
  readonly storyId: string;
  readonly test: TestFunction;
};

type NamedElementFeature = {
  readonly feature: ElementFeatureContract<DomElementName>;
  readonly name: string;
};

const cssPropertyNames = {
  aspectRatio: "aspect-ratio",
  backgroundColor: "background-color",
  borderRadius: "border-radius",
  boxShadow: "box-shadow",
  color: "color",
  fontFamily: "font-family",
  fontSize: "font-size",
  fontWeight: "font-weight",
  height: "height",
  left: "left",
  letterSpacing: "letter-spacing",
  lineHeight: "line-height",
  objectFit: "object-fit",
  overflow: "overflow",
  position: "position",
  right: "right",
  textDecorationLine: "text-decoration-line",
  top: "top",
  width: "width",
  zIndex: "z-index",
} as const;

const getRoot = (
  page: Page,
  options: { readonly rootLocator?: (page: Page) => Locator },
): Locator => options.rootLocator?.(page) ?? page.locator("#storybook-root");

const locatorFromContract = (
  root: Locator,
  locator: ElementLocatorContract<DomElementName>,
): Locator => {
  if (locator.testId) return root.getByTestId(locator.testId);
  if (locator.role) {
    return root.getByRole(locator.role as PlaywrightAriaRole, {
      name: locator.accessibleName,
    });
  }
  if (locator.selector) return root.locator(locator.selector);

  const byTag = root.locator(locator.tagName);
  if (!locator.accessibleName) return byTag;

  return byTag.filter({ hasText: locator.accessibleName });
};

const parseAspectRatio = (aspectRatio: string): number => {
  const [width, height] = aspectRatio
    .split("/")
    .map((part) => Number(part.trim()));
  if (!width || !height) {
    throw new Error(
      `Invalid aspect ratio "${aspectRatio}". Expected "width / height".`,
    );
  }
  return width / height;
};

const rootFontSize = async (page: Page): Promise<number> =>
  page.evaluate(() =>
    Number.parseFloat(getComputedStyle(document.documentElement).fontSize),
  );

const cssLengthToPx = async (
  page: Page,
  value: CssLength,
): Promise<number | undefined> => {
  if (value === "0") return 0;
  if (value.endsWith("px")) return Number.parseFloat(value);
  if (value.endsWith("rem"))
    return Number.parseFloat(value) * (await rootFontSize(page));
  return undefined;
};

const expectLengthCloseTo = async (
  expect: ExpectFunction,
  page: Page,
  received: number,
  expected: CssLength,
  message: string,
): Promise<void> => {
  const expectedPx = await cssLengthToPx(page, expected);
  if (expectedPx === undefined) return;

  expect(received, message).toBeCloseTo(expectedPx, 1);
};

const assertTagName = async (
  expect: ExpectFunction,
  locator: Locator,
  tagName: DomElementName,
  name: string,
): Promise<void> => {
  const received = await locator.evaluate((element) =>
    element.tagName.toLowerCase(),
  );
  expect(received, `${name} tag name`).toBe(tagName);
};

const assertBox = async (
  expect: ExpectFunction,
  page: Page,
  locator: Locator,
  box: CssBoxContract,
  name: string,
): Promise<void> => {
  const boundingBox = await locator.boundingBox();
  expect(Boolean(boundingBox), `${name} has a layout box`).toBe(true);
  if (!boundingBox) return;

  await expectLengthCloseTo(
    expect,
    page,
    boundingBox.width,
    box.width,
    `${name} width`,
  );
  await expectLengthCloseTo(
    expect,
    page,
    boundingBox.height,
    box.height,
    `${name} height`,
  );

  if (box.aspectRatio) {
    expect(
      boundingBox.width / boundingBox.height,
      `${name} aspect ratio`,
    ).toBeCloseTo(parseAspectRatio(box.aspectRatio), 2);
  }
};

const assertInsetCss = async (
  expect: ExpectFunction,
  locator: Locator,
  inset: CssInsetContract,
): Promise<void> => {
  if (inset.bottom) await expect(locator).toHaveCSS("bottom", inset.bottom);
  if (inset.left) await expect(locator).toHaveCSS("left", inset.left);
  if (inset.right) await expect(locator).toHaveCSS("right", inset.right);
  if (inset.top) await expect(locator).toHaveCSS("top", inset.top);
};

const assertSurface = async (
  expect: ExpectFunction,
  locator: Locator,
  surface: CssSurfaceContract,
): Promise<void> => {
  if (surface.backgroundColor) {
    await expect(locator).toHaveCSS(
      cssPropertyNames.backgroundColor,
      surface.backgroundColor,
    );
  }
  if (surface.borderRadius) {
    await expect(locator).toHaveCSS(
      cssPropertyNames.borderRadius,
      surface.borderRadius,
    );
  }
  if (surface.boxShadow) {
    await expect(locator).toHaveCSS(
      cssPropertyNames.boxShadow,
      surface.boxShadow,
    );
  }
  if (surface.overflow)
    await expect(locator).toHaveCSS(
      cssPropertyNames.overflow,
      surface.overflow,
    );
};

const assertPosition = async (
  expect: ExpectFunction,
  locator: Locator,
  position: CssPositionContract,
): Promise<void> => {
  await expect(locator).toHaveCSS(cssPropertyNames.position, position.position);
  if (position.zIndex !== undefined) {
    await expect(locator).toHaveCSS(
      cssPropertyNames.zIndex,
      String(position.zIndex),
    );
  }
  await assertInsetCss(expect, locator, position);
};

const assertTypography = async (
  expect: ExpectFunction,
  locator: Locator,
  typography: CssTypographyContract,
): Promise<void> => {
  await expect(locator).toHaveCSS(cssPropertyNames.color, typography.color);
  await expect(locator).toHaveCSS(
    cssPropertyNames.fontSize,
    typography.fontSize,
  );
  await expect(locator).toHaveCSS(
    cssPropertyNames.fontWeight,
    String(typography.fontWeight),
  );
  await expect(locator).toHaveCSS(
    cssPropertyNames.letterSpacing,
    typography.letterSpacing,
  );
  await expect(locator).toHaveCSS(
    cssPropertyNames.lineHeight,
    typography.lineHeight,
  );

  const fontFamily = await locator.evaluate(
    (element) => getComputedStyle(element).fontFamily,
  );
  if (typography.fontFamily instanceof RegExp) {
    expect(fontFamily, "font family").toMatch(typography.fontFamily);
  } else {
    expect(fontFamily, "font family").toMatch(typography.fontFamily);
  }
};

const hasTextContract = (
  feature: ElementFeatureContract<DomElementName>,
): feature is TextFeatureContract<keyof HTMLElementTagNameMap> =>
  "text" in feature && "typography" in feature;

const hasImageContract = (
  feature: ElementFeatureContract<DomElementName>,
): feature is ImageFeatureContract =>
  "alt" in feature && "objectFit" in feature;

const hasAnchorContract = (
  feature: ElementFeatureContract<DomElementName>,
): feature is AnchorFeatureContract => "href" in feature;

const hasDecorativeContract = (
  feature: ElementFeatureContract<DomElementName>,
): feature is DecorativeFeatureContract<DomElementName> =>
  "ariaHidden" in feature;

const assertElementFeature = async (
  expect: ExpectFunction,
  page: Page,
  root: Locator,
  name: string,
  feature: ElementFeatureContract<DomElementName>,
): Promise<void> => {
  const locator = locatorFromContract(root, feature.locator).first();

  await expect(locator).toBeVisible();
  await assertTagName(expect, locator, feature.locator.tagName, name);
  await assertBox(expect, page, locator, feature.box, name);

  if (feature.position) await assertPosition(expect, locator, feature.position);
  if (feature.surface) await assertSurface(expect, locator, feature.surface);

  if (hasTextContract(feature)) {
    await expect(locator).toHaveText(feature.text);
    await assertTypography(expect, locator, feature.typography);
    if (feature.textDecoration) {
      await expect(locator).toHaveCSS(
        cssPropertyNames.textDecorationLine,
        feature.textDecoration,
      );
    }
  }

  if (hasImageContract(feature)) {
    await expect(locator).toHaveAttribute("alt", feature.alt);
    await expect(locator).toHaveCSS(
      cssPropertyNames.objectFit,
      feature.objectFit,
    );
  }

  if (hasAnchorContract(feature))
    await expect(locator).toHaveAttribute("href", feature.href);
  if (hasDecorativeContract(feature))
    await expect(locator).toHaveAttribute("aria-hidden", "true");
};

const assertRequiredDescendant = async (
  expect: ExpectFunction,
  root: Locator,
  descendant: RequiredDescendantContract,
  parentName = "component",
): Promise<void> => {
  const name = `${parentName}.${descendant.featureName}`;
  const locator = locatorFromContract(root, descendant.locator);

  if (descendant.count?.exact !== undefined) {
    await expect(locator).toHaveCount(descendant.count.exact);
  }
  if (
    descendant.count?.minimum !== undefined ||
    descendant.count?.maximum !== undefined
  ) {
    const count = await locator.count();
    if (descendant.count.minimum !== undefined) {
      expect(count, `${name} count minimum`).toBeGreaterThanOrEqual(
        descendant.count.minimum,
      );
    }
    if (descendant.count.maximum !== undefined) {
      expect(count, `${name} count maximum`).toBeLessThanOrEqual(
        descendant.count.maximum,
      );
    }
  }

  const first = locator.first();
  await expect(first).toBeVisible();
  await assertTagName(expect, first, descendant.locator.tagName, name);

  for (const attribute of descendant.attributes ?? []) {
    if (attribute.value === undefined) {
      await expect(first).toHaveAttribute(attribute.name);
    } else {
      await expect(first).toHaveAttribute(attribute.name, attribute.value);
    }
  }

  for (const child of descendant.children ?? []) {
    await assertRequiredDescendant(expect, first, child, name);
  }
};

const isElementFeature = (
  value: unknown,
): value is ElementFeatureContract<DomElementName> => {
  if (!value || typeof value !== "object") return false;
  return "box" in value && "locator" in value;
};

const featureEntries = <
  Contract extends ComponentFeatureContract<keyof HTMLElementTagNameMap>,
>(
  contract: Contract,
): readonly NamedElementFeature[] => {
  const entries: NamedElementFeature[] = [];
  const visit = (value: unknown, path: readonly string[]): void => {
    if (!value || typeof value !== "object") return;

    if (isElementFeature(value)) {
      entries.push({ feature: value, name: path.join(".") });
    }

    for (const [childName, childValue] of Object.entries(value)) {
      if (childName === "box" || childName === "locator") continue;
      visit(childValue, [...path, childName]);
    }
  };

  for (const [name, value] of Object.entries(contract)) {
    if (
      name === "accessibility" ||
      name === "contains" ||
      name === "root" ||
      name === "visualParity"
    ) {
      continue;
    }
    visit(value, [name]);
  }

  return entries;
};

export function defineStorybookComponentFeatureTests<
  Contract extends ComponentFeatureContract<keyof HTMLElementTagNameMap>,
>(options: StorybookComponentFeatureTestOptions<Contract>): void {
  const { contract, expect, test } = options;

  test("matches the root design contract", async ({ page }) => {
    await page.goto(options.storybookIframeUrl(options.storyId));
    const root = getRoot(page, options);
    const rootElement = locatorFromContract(
      root,
      contract.root.locator,
    ).first();

    await assertElementFeature(expect, page, root, "root", contract.root);
    await assertTagName(
      expect,
      rootElement,
      contract.root.locator.tagName,
      "root",
    );
  });

  test("renders every required descendant", async ({ page }) => {
    await page.goto(options.storybookIframeUrl(options.storyId));
    const root = getRoot(page, options);

    for (const descendant of contract.contains) {
      await assertRequiredDescendant(expect, root, descendant);
    }
  });

  for (const { feature, name } of featureEntries(contract)) {
    test(`matches the ${name} design contract`, async ({ page }) => {
      await page.goto(options.storybookIframeUrl(options.storyId));
      await assertElementFeature(
        expect,
        page,
        getRoot(page, options),
        name,
        feature,
      );
    });
  }

  test("matches the visual parity story contract", async ({ page }) => {
    await page.goto(options.storybookIframeUrl(contract.visualParity.storyId));
    const root = getRoot(page, options);
    const expected = root.getByTestId(figmaTestId(0));
    const actual = root.getByTestId(LIVE_TEST_ID);

    await assertBox(
      expect,
      page,
      expected,
      contract.visualParity.expectedStage,
      `${contract.visualParity.referenceLabel} visual parity stage`,
    );
    await assertBox(
      expect,
      page,
      actual,
      contract.visualParity.expectedStage,
      "live visual parity stage",
    );

    await options.expectVisualParity?.(page, contract.visualParity);
  });

  test("matches the accessibility feature contract", async ({ page }) => {
    await page.goto(options.storybookIframeUrl(options.storyId));
    const root = getRoot(page, options);

    for (const locator of contract.accessibility.decorativeElementsHidden) {
      await expect(locatorFromContract(root, locator).first()).toHaveAttribute(
        "aria-hidden",
        "true",
      );
    }

    for (const locator of contract.accessibility.focusableElements) {
      const element = locatorFromContract(root, locator).first();
      await element.focus();
      await expect(element).toBeFocused();
    }

    if (options.analyzeAccessibility) {
      const result = await options.analyzeAccessibility(
        page,
        contract.accessibility,
      );
      expect(result.violations).toEqual([]);
    }
  });
}
