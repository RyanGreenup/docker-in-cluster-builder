/**
 * Recipe barrel for the personal-website design.
 *
 * These recipes express the editorial portfolio look on top of the shared,
 * lifted colour contract (`vars.roles.*` / `vars.status.*` from theme.css.ts)
 * and the static design tokens (tokens.ts). Components reference only the typed
 * contract and tokens; no raw hex lives here.
 *
 * Layout primitives (flow/spacer/autoGrid) and the generic surface/button/field
 * pieces are reused as-is; the page-specific pieces (hero, cards, header,
 * footer, prose) are the portfolio design layer.
 */

// ---- Layout primitives ----------------------------------------------------
export { autoGrid } from "./auto-grid.css";
export { flow, spacer } from "./layout.css";

// ---- Generic surface / controls -------------------------------------------
export { badge } from "./badge.css";
export { comingSoonBadge } from "./coming-soon-badge.css";
export { button, buttonSpinner } from "./button.css";
export { card, cardBody, cardHead, cardSub, cardTitle } from "./card.css";
export { fieldInput, fieldRoot, fieldLabel, fieldHint, fieldError } from "./field.css";

// ---- Brand ----------------------------------------------------------------
export * as brandLogo from "./brand-logo.css";

// ---- Editorial page furniture ---------------------------------------------
export { kicker } from "./kicker.css";
export { section, sectionHead, sectionTitle, sectionMore } from "./section.css";
export { pageHead, pageHeadTitle, pageHeadLede } from "./page-head.css";

// ---- Hero (default column + optional spec-sheet rail) ---------------------
export {
  hero,
  heroTitle,
  heroLede,
  heroCta,
  heroSplit,
  specSheet,
  specRow,
  specKey,
  specVal,
} from "./hero.css";

// ---- Cards ----------------------------------------------------------------
export {
  projectCard,
  projectCardHead,
  projectCardTitle,
  projectCardNote,
  projectCardDesc,
  projectCardTech,
  projectCardLinks,
  projectCardLink,
} from "./project-card.css";
export {
  postCard,
  postCardLink,
  postCardDate,
  postCardTitle,
  postCardDesc,
  postCardMore,
  postCardTags,
} from "./post-card.css";

// ---- Tag / chip -----------------------------------------------------------
export { chip } from "./chip.css";

// ---- Shell: header + footer -----------------------------------------------
export {
  siteHeader,
  headerInner,
  brand,
  brandMark,
  brandName,
  nav,
  navList,
  navLink,
  headerActions,
  themeToggle,
  navToggle,
  navOverlay,
  navBackdrop,
  navSheet,
  navSheetHead,
  navSheetTitle,
  navSheetClose,
  navIndex,
  navSheetLink,
} from "./site-header.css";
export {
  siteFooter,
  footerInner,
  footerMeta,
  footerName,
  footerDot,
  footerLinks,
  footerLink,
  footerCopy,
} from "./site-footer.css";

// ---- Blog post ------------------------------------------------------------
export {
  postHead,
  postBack,
  postTitle,
  postDesc,
  postMeta,
  postByline,
  postDot,
  postTime,
  postTags,
} from "./post-header.css";
export {
  postNav,
  postNavItem,
  postNavItemNext,
  postNavDir,
  postNavTitle,
} from "./post-nav.css";
export { pager, pagerCount } from "./pagination.css";

// ---- Contact --------------------------------------------------------------
export {
  channel,
  channelIcon,
  channelBody,
  channelTop,
  channelLabel,
  channelValue,
  channelHint,
  channelArrow,
} from "./channel-card.css";

// ---- Long-form prose ------------------------------------------------------
export { prose } from "./prose.css";

// ---- Motion ---------------------------------------------------------------
export { reveal, pushRight } from "./motion.css";

// ---- CV / Resume ----------------------------------------------------------
export { cvFoot } from "./cv-footer.css";
export { resumeSummary } from "./resume-summary.css";
export { eduList, eduRow, eduDegree, eduOrg, eduYear } from "./education-list.css";
export {
  cvSection,
  cvSectionHead,
  cvSectionNo,
  cvSectionTitle,
  cvSectionRule,
  cvSectionCount,
} from "./cv-section.css";

// ---- Resume / CV ----------------------------------------------------------
export {
  identCard,
  identTop,
  identId,
  identPhoto,
  identPhotoFallback,
  identLines,
  identKicker,
  identName,
  identTagline,
  identStatusBadge,
  identPulse,
  identActions,
  identClock,
  identContact,
  identContactLink,
} from "./resume-ident.css";
export {
  tl,
  tlItem,
  tlItemNow,
  tlTop,
  tlPeriod,
  tlTag,
  tlTagAccent,
  tlRole,
  tlOrg,
  tlPoints,
  tlTech,
  tlPrior,
  tlPriorGrid,
  tlPriorRow,
  tlPriorRole,
  tlPriorMeta,
} from "./timeline-item.css";
export {
  matrix,
  mrow,
  mrowLabel,
  mrowNo,
  mrowTitle,
  mrowItems,
} from "./skills-matrix.css";
