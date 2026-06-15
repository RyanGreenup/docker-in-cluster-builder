export type HtmlElementName = keyof HTMLElementTagNameMap;

export type SvgElementName = keyof SVGElementTagNameMap;

export type DomElementName = HtmlElementName | SvgElementName;

export type AriaRoleName =
  | "button"
  | "checkbox"
  | "dialog"
  | "heading"
  | "img"
  | "link"
  | "list"
  | "listitem"
  | "menu"
  | "menuitem"
  | "radio"
  | "region"
  | "searchbox"
  | "tab"
  | "tabpanel"
  | "textbox";

export type ParagraphElementName = "p";

export type ImageElementName = "img";

export type AnchorElementName = "a";

export type SpanElementName = "span";

export type CssPx = `${number}px`;

export type CssRem = `${number}rem`;

export type CssPercent = `${number}%`;

export type CssLength = CssPx | CssRem | CssPercent | "0";

export type CssAspectRatio = `${number} / ${number}`;

export type HexColor = `#${string}`;

export type RgbColor = `rgb(${number}, ${number}, ${number})`;

export type RgbaColor = `rgba(${number}, ${number}, ${number}, ${number})`;

export type CssColor = HexColor | RgbColor | RgbaColor | "transparent";

export type CssFontWeight = `${number}` | number;

export type CssOverflow = "clip" | "hidden" | "visible" | "scroll" | "auto";

export type CssObjectFit = "contain" | "cover" | "fill" | "none" | "scale-down";

export type CssPosition =
  | "absolute"
  | "fixed"
  | "relative"
  | "static"
  | "sticky";

export type CssTextDecoration = "none" | "underline";

export type CssShadow =
  `${string}rgba(${number}, ${number}, ${number}, ${number})${string}`;

export interface CssInsetContract {
  readonly bottom?: CssLength;
  readonly left?: CssLength;
  readonly right?: CssLength;
  readonly top?: CssLength;
}

export interface CssBoxContract extends CssInsetContract {
  readonly aspectRatio?: CssAspectRatio;
  readonly height: CssLength;
  readonly width: CssLength;
}

export interface CssSurfaceContract {
  readonly backgroundColor?: CssColor;
  readonly borderRadius?: CssLength | "50%";
  readonly boxShadow?: CssShadow;
  readonly overflow?: CssOverflow;
}

export interface CssPositionContract extends CssInsetContract {
  readonly position: CssPosition;
  readonly zIndex?: `${number}` | number;
}

export interface CssTypographyContract {
  readonly color: CssColor;
  readonly fontFamily: string | RegExp;
  readonly fontSize: CssLength;
  readonly fontWeight: CssFontWeight;
  readonly letterSpacing: CssLength;
  readonly lineHeight: CssLength;
}

export interface ElementLocatorContract<TagName extends DomElementName> {
  readonly tagName: TagName;
  readonly accessibleName?: string | RegExp;
  readonly role?: AriaRoleName;
  readonly selector?: string;
  readonly testId?: string;
}

export interface AttributeFeatureContract {
  readonly name: string;
  readonly value?: string | RegExp;
}

export interface DescendantCountContract {
  readonly exact?: number;
  readonly maximum?: number;
  readonly minimum?: number;
}

export interface RequiredDescendantContract<
  TagName extends DomElementName = DomElementName,
  FeatureName extends string = string,
> {
  readonly attributes?: readonly AttributeFeatureContract[];
  readonly children?: readonly RequiredDescendantContract[];
  readonly componentName?: string;
  readonly count?: DescendantCountContract;
  readonly featureName: FeatureName;
  readonly locator: ElementLocatorContract<TagName>;
  readonly required: true;
  readonly visible: true;
}

export interface ElementFeatureContract<TagName extends DomElementName> {
  readonly box: CssBoxContract;
  readonly locator: ElementLocatorContract<TagName>;
  readonly position?: CssPositionContract;
  readonly surface?: CssSurfaceContract;
}

export interface TextFeatureContract<
  TagName extends HtmlElementName,
> extends ElementFeatureContract<TagName> {
  readonly text: string | RegExp;
  readonly textDecoration?: CssTextDecoration;
  readonly typography: CssTypographyContract;
}

export interface ParagraphFeatureContract extends TextFeatureContract<ParagraphElementName> {
  readonly locator: ElementLocatorContract<ParagraphElementName>;
  readonly text: string | RegExp;
  readonly typography: CssTypographyContract;
}

export interface AnchorFeatureContract extends TextFeatureContract<AnchorElementName> {
  readonly href: string;
  readonly locator: ElementLocatorContract<AnchorElementName>;
  readonly text: string | RegExp;
  readonly typography: CssTypographyContract;
}

export interface SpanFeatureContract extends TextFeatureContract<SpanElementName> {
  readonly locator: ElementLocatorContract<SpanElementName>;
  readonly text: string | RegExp;
  readonly typography: CssTypographyContract;
}

export interface ImageFeatureContract extends ElementFeatureContract<ImageElementName> {
  readonly alt: string;
  readonly objectFit: CssObjectFit;
}

export interface DecorativeFeatureContract<
  TagName extends DomElementName,
> extends ElementFeatureContract<TagName> {
  readonly ariaHidden: true;
}

export interface AccessibilityFeatureContract {
  readonly axeScope: string;
  readonly decorativeElementsHidden: readonly ElementLocatorContract<DomElementName>[];
  readonly focusableElements: readonly ElementLocatorContract<DomElementName>[];
}

export interface VisualParityFeatureContract {
  readonly expectedStage: CssBoxContract;
  readonly maxDifferingPixels: number;
  readonly referenceLabel: string;
  readonly storyId: string;
}

export interface ComponentFeatureContract<
  RootTagName extends HtmlElementName,
  RequiredDescendants extends readonly RequiredDescendantContract[] =
    readonly RequiredDescendantContract[],
> {
  readonly accessibility: AccessibilityFeatureContract;
  readonly contains: RequiredDescendants;
  readonly root: ElementFeatureContract<RootTagName>;
  readonly visualParity: VisualParityFeatureContract;
}

export interface CtaCornerFeatureContract extends DecorativeFeatureContract<"div"> {
  readonly arrow: ElementFeatureContract<"div">;
  readonly circle: ElementFeatureContract<"div">;
  readonly cornerSvg?: ElementFeatureContract<SvgElementName>;
}

export type ArticleTileRequiredDescendants = readonly [
  RequiredDescendantContract<"img", "image">,
  RequiredDescendantContract<"p", "date">,
  RequiredDescendantContract<"p", "title">,
  RequiredDescendantContract<"p", "body">,
  RequiredDescendantContract<"span", "ctaLabel">,
  RequiredDescendantContract<"svg", "ctaCorner">,
];

export interface ArticleTileFeatureContract extends ComponentFeatureContract<
  "a",
  ArticleTileRequiredDescendants
> {
  readonly body: ParagraphFeatureContract;
  readonly ctaCorner: DecorativeFeatureContract<"svg">;
  readonly ctaLabel: SpanFeatureContract;
  /** Eyebrow metadata line above the title (formatted date / category). */
  readonly date: ParagraphFeatureContract;
  readonly image: ImageFeatureContract;
  readonly imageCrop: ElementFeatureContract<"div">;
  readonly title: ParagraphFeatureContract;
}

export type HomeFeatureWhoRequiredDescendants = readonly [
  RequiredDescendantContract<"img", "image">,
  RequiredDescendantContract<"p", "title">,
  RequiredDescendantContract<"p", "body">,
  RequiredDescendantContract<"a", "ctaLink">,
  RequiredDescendantContract<"div", "ctaCorner">,
];

export interface HomeFeatureWhoFeatureContract extends ComponentFeatureContract<
  "div",
  HomeFeatureWhoRequiredDescendants
> {
  readonly body: ParagraphFeatureContract;
  readonly cta: AnchorFeatureContract;
  readonly ctaCorner: CtaCornerFeatureContract;
  readonly image: ImageFeatureContract;
  readonly imageCrop: ElementFeatureContract<"div">;
  readonly title: ParagraphFeatureContract;
}
