import { style } from '@vanilla-extract/css'
import {
  font,
  fontWeight,
  radius,
  space,
  textSize,
  transition,
  vars,
} from '@rs/ryan-personal-website-design'

// A design-system skin layered over the headless DashboardLayout from
// @rs/layout. The layout package owns the grid, the responsive reflow and the
// drawer mechanics; everything below is colour, type and spacing read from the
// design theme contract (`vars.roles.*`) and tokens, so it flips light/dark for
// free. These class names are passed to DashboardLayout via its `classes` prop.

export const sidebar = style({
  background: vars.roles.bg.surface,
  borderRight: `1px solid ${vars.roles.border.subtle}`,
  gap: space['1'],
  padding: space['3'],
  fontFamily: font.sans,
})

export const navbar = style({
  background: vars.roles.bg.app,
  borderBottom: `1px solid ${vars.roles.border.subtle}`,
  gap: space['3'],
  padding: `0 ${space['4']}`,
  fontFamily: font.sans,
})

export const main = style({
  background: vars.roles.bg.app,
  color: vars.roles.fg.base,
  padding: space['6'],
  fontFamily: font.sans,
})

export const bottomBar = style({
  background: vars.roles.bg.surface,
  borderTop: `1px solid ${vars.roles.border.subtle}`,
})

export const brand = style({
  display: 'flex',
  alignItems: 'center',
  gap: space['2'],
  padding: `${space['1']} ${space['2']} ${space['4']}`,
  color: vars.roles.fg.base,
  fontFamily: font.sans,
  fontSize: textSize.lg,
  fontWeight: fontWeight.bold,
})

export const navItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: space['2'],
  width: '100%',
  padding: `${space['2']} ${space['3']}`,
  border: '1px solid transparent',
  borderRadius: radius.md,
  background: 'transparent',
  color: vars.roles.fg.muted,
  fontFamily: font.sans,
  fontSize: textSize.sm,
  fontWeight: fontWeight.medium,
  textAlign: 'left',
  cursor: 'pointer',
  transition: transition.fast,
  selectors: {
    '&:hover': {
      background: vars.roles.bg.hover,
      color: vars.roles.fg.base,
    },
    // navItemProps() sets aria-current="page" on the active row, so the active
    // skin keys off it: one class, no second active class to thread through.
    '&[aria-current="page"]': {
      background: vars.roles.brand.primarySubtle,
      color: vars.roles.brand.primary,
    },
  },
})

export const navTitle = style({
  color: vars.roles.fg.base,
  fontFamily: font.sans,
  fontSize: textSize.md,
  fontWeight: fontWeight.semibold,
})

// Push everything after it to the right edge of the navbar.
export const navSpacer = style({
  marginLeft: 'auto',
})

// The drawer toggle only earns its place below the desktop breakpoint; above it
// the sidebar is a static column, matching DashboardLayout's 1024px reflow.
export const drawerTrigger = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `${space['1']} ${space['3']}`,
  border: `1px solid ${vars.roles.border.strong}`,
  borderRadius: radius.md,
  background: vars.roles.bg.raised,
  color: vars.roles.fg.base,
  fontFamily: font.sans,
  fontSize: textSize.sm,
  cursor: 'pointer',
  '@media': {
    'screen and (min-width: 1024px)': { display: 'none' },
  },
})

export const tab = style({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: space['1'],
  border: 'none',
  background: 'transparent',
  color: vars.roles.fg.subtle,
  fontFamily: font.sans,
  fontSize: textSize.xs,
  cursor: 'pointer',
  transition: transition.fast,
  selectors: {
    '&[aria-current="page"]': { color: vars.roles.brand.primary },
  },
})

// Content furniture for the default main panel (cards describing the layout).
export const cardGrid = style({
  display: 'grid',
  gap: space['4'],
  maxWidth: '44rem',
})

export const card = style({
  border: `1px solid ${vars.roles.border.base}`,
  borderRadius: radius.xl,
  padding: `${space['4']} ${space['5']}`,
  background: vars.roles.bg.surface,
})

export const cardTitle = style({
  margin: `0 0 ${space['1']}`,
  fontSize: textSize.lg,
  color: vars.roles.fg.base,
})

export const cardBody = style({
  margin: 0,
  lineHeight: '1.5',
  color: vars.roles.fg.muted,
})

export const pageTitle = style({
  margin: `0 0 ${space['4']}`,
  fontSize: textSize['2xl'],
  color: vars.roles.fg.base,
})
