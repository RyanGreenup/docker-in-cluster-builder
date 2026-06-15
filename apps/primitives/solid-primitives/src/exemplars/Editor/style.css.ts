import { globalStyle, style } from "@vanilla-extract/css";

import { tokens } from "../../styles/theme.css";

export const editorTheme = style({});

// --- Root / chrome ---

globalStyle(`${editorTheme}[data-part="editor-root"]`, {
  border: `1px solid ${tokens.editor.border.subtle}`,
  borderRadius: tokens.radius.card,
  overflow: "hidden",
  background: tokens.editor.surface.base,
});

globalStyle(`${editorTheme} [data-part="editor-toolbar"]`, {
  borderBottom: `1px solid ${tokens.editor.border.subtle}`,
  background: tokens.editor.surface.raised,
});

globalStyle(`${editorTheme} [data-part="editor-toolbar-divider"]`, {
  background: tokens.editor.border.subtle,
});

globalStyle(`${editorTheme} [data-part="editor-toolbar-btn"]`, {
  color: tokens.editor.fg.secondary,
});

globalStyle(`${editorTheme} [data-part="editor-toolbar-btn"]:hover`, {
  background: tokens.editor.surface.hover,
  color: tokens.editor.fg.primary,
});

globalStyle(`${editorTheme} [data-part="editor-toolbar-btn"][data-active="true"]`, {
  background: tokens.editor.accent.soft,
  color: tokens.editor.accent.base,
});

globalStyle(`${editorTheme} [data-part="textarea"]`, {
  background: tokens.editor.surface.base,
  color: tokens.editor.fg.primary,
  fontFamily: tokens.font.mono,
});

globalStyle(`${editorTheme} [data-part="textarea"]:focus`, {
  boxShadow: `0 0 0 2px ${tokens.editor.accent.border}`,
});

// --- CodeMirror skin ---

globalStyle(`${editorTheme} [data-part="codemirror"]`, {
  background: tokens.editor.surface.base,
});

globalStyle(`${editorTheme} [data-part="codemirror"] .cm-scroller`, {
  fontFamily: tokens.font.mono,
});

globalStyle(`${editorTheme} [data-part="codemirror"] .cm-content`, {
  caretColor: tokens.editor.fg.primary,
});

globalStyle(`${editorTheme} [data-part="codemirror"] .cm-gutters`, {
  background: tokens.editor.surface.raised,
  color: tokens.editor.fg.muted,
  borderRight: `1px solid ${tokens.editor.border.subtle}`,
});

globalStyle(`${editorTheme} [data-part="codemirror"] .cm-foldGutter .cm-gutterElement`, {
  color: tokens.editor.fg.muted,
  cursor: "pointer",
});

globalStyle(`${editorTheme} [data-part="codemirror"] .cm-foldPlaceholder`, {
  background: tokens.editor.surface.sunken,
  border: `1px solid ${tokens.editor.border.subtle}`,
  color: tokens.editor.fg.muted,
});

globalStyle(`${editorTheme} [data-part="codemirror"] .cm-activeLineGutter`, {
  background: `color-mix(in oklch, ${tokens.editor.fg.primary} 8%, transparent)`,
});

globalStyle(`${editorTheme} [data-part="codemirror"] .cm-activeLine`, {
  background: `color-mix(in oklch, ${tokens.editor.fg.primary} 4%, transparent)`,
});

globalStyle(`${editorTheme} [data-part="codemirror"] .cm-cursor`, {
  borderLeftColor: tokens.editor.fg.primary,
});

globalStyle(`${editorTheme} [data-part="codemirror"] .cm-selectionBackground`, {
  background: `color-mix(in oklch, ${tokens.editor.accent.base} 20%, transparent)`,
});

globalStyle(`${editorTheme} [data-part="codemirror"].cm-focused .cm-selectionBackground`, {
  background: `color-mix(in oklch, ${tokens.editor.accent.base} 30%, transparent)`,
});

// --- Rich-content typography (WYSIWYG) ---

globalStyle(`${editorTheme} [data-part="wysiwyg-content"]`, {
  color: tokens.editor.fg.primary,
  fontFamily: tokens.font.serif,
});

// Headings

globalStyle(`${editorTheme} [data-part="wysiwyg-content"] h1`, {
  fontFamily: tokens.font.serif,
  fontSize: "2em",
  fontWeight: "700",
  lineHeight: "1.25",
  marginTop: "1.5em",
  marginBottom: "0.5em",
  color: tokens.editor.fg.primary,
  borderBottom: `1px solid ${tokens.editor.border.subtle}`,
  paddingBottom: "0.25em",
});

globalStyle(`${editorTheme} [data-part="wysiwyg-content"] h2`, {
  fontFamily: tokens.font.serif,
  fontSize: "1.5em",
  fontWeight: "600",
  lineHeight: "1.3",
  marginTop: "1.4em",
  marginBottom: "0.4em",
  color: tokens.editor.fg.primary,
});

globalStyle(`${editorTheme} [data-part="wysiwyg-content"] h3`, {
  fontFamily: tokens.font.serif,
  fontSize: "1.2em",
  fontWeight: "600",
  lineHeight: "1.4",
  marginTop: "1.2em",
  marginBottom: "0.35em",
  color: tokens.editor.fg.primary,
});

globalStyle(
  `${editorTheme} [data-part="wysiwyg-content"] h4, ${editorTheme} [data-part="wysiwyg-content"] h5, ${editorTheme} [data-part="wysiwyg-content"] h6`,
  {
    fontFamily: tokens.font.outfit,
    fontSize: "1em",
    fontWeight: "600",
    lineHeight: "1.5",
    marginTop: "1em",
    marginBottom: "0.3em",
    color: tokens.editor.fg.secondary,
  },
);

globalStyle(
  `${editorTheme} [data-part="wysiwyg-content"] h1:first-child, ${editorTheme} [data-part="wysiwyg-content"] h2:first-child, ${editorTheme} [data-part="wysiwyg-content"] h3:first-child`,
  { marginTop: "0" },
);

// Paragraphs

globalStyle(`${editorTheme} [data-part="wysiwyg-content"] p`, {
  marginTop: "0",
  marginBottom: "1em",
});

globalStyle(`${editorTheme} [data-part="wysiwyg-content"] p:last-child`, {
  marginBottom: "0",
});

// Emphasis

globalStyle(`${editorTheme} [data-part="wysiwyg-content"] strong`, {
  fontWeight: "700",
  color: tokens.editor.fg.primary,
});

globalStyle(`${editorTheme} [data-part="wysiwyg-content"] em`, {
  fontStyle: "italic",
  color: tokens.editor.fg.secondary,
});

// Links

globalStyle(`${editorTheme} [data-part="wysiwyg-content"] a`, {
  color: tokens.editor.accent.base,
  textDecoration: "underline",
  textDecorationColor: tokens.editor.accent.border,
  textUnderlineOffset: "2px",
});

globalStyle(`${editorTheme} [data-part="wysiwyg-content"] a:hover`, {
  textDecorationColor: tokens.editor.accent.base,
});

// Inline code

globalStyle(`${editorTheme} [data-part="wysiwyg-content"] code`, {
  fontFamily: tokens.font.mono,
  fontSize: "0.875em",
  background: tokens.editor.surface.sunken,
  color: tokens.editor.fg.secondary,
  borderRadius: "3px",
  padding: "0.15em 0.35em",
  border: `1px solid ${tokens.editor.border.subtle}`,
});

// Code blocks

globalStyle(`${editorTheme} [data-part="wysiwyg-content"] pre`, {
  fontFamily: tokens.font.mono,
  fontSize: "0.875em",
  lineHeight: "1.6",
  background: tokens.editor.surface.sunken,
  border: `1px solid ${tokens.editor.border.subtle}`,
  borderRadius: "6px",
  padding: "16px 20px",
  overflowX: "auto",
  marginTop: "0",
  marginBottom: "1.25em",
});

globalStyle(`${editorTheme} [data-part="wysiwyg-content"] pre code`, {
  background: "none",
  border: "none",
  padding: "0",
  fontSize: "inherit",
  color: tokens.editor.fg.primary,
});

// Blockquote

globalStyle(`${editorTheme} [data-part="wysiwyg-content"] blockquote`, {
  borderLeft: `3px solid ${tokens.editor.accent.border}`,
  paddingLeft: "1em",
  marginLeft: "0",
  marginRight: "0",
  marginTop: "0",
  marginBottom: "1.25em",
  color: tokens.editor.fg.secondary,
  fontStyle: "italic",
});

globalStyle(`${editorTheme} [data-part="wysiwyg-content"] blockquote p`, {
  marginBottom: "0",
});

// Lists

globalStyle(`${editorTheme} [data-part="wysiwyg-content"] ul`, {
  listStyleType: "disc",
  paddingLeft: "1.5em",
  marginTop: "0",
  marginBottom: "1em",
});

globalStyle(`${editorTheme} [data-part="wysiwyg-content"] ol`, {
  listStyleType: "decimal",
  paddingLeft: "1.5em",
  marginTop: "0",
  marginBottom: "1em",
});

globalStyle(`${editorTheme} [data-part="wysiwyg-content"] li`, {
  marginBottom: "0.35em",
});

globalStyle(
  `${editorTheme} [data-part="wysiwyg-content"] li > ul, ${editorTheme} [data-part="wysiwyg-content"] li > ol`,
  {
    marginTop: "0.35em",
    marginBottom: "0",
  },
);

// Task lists

globalStyle(`${editorTheme} [data-part="wysiwyg-content"] ul[data-type='taskList']`, {
  listStyle: "none",
  paddingLeft: "0.25em",
});

globalStyle(`${editorTheme} [data-part="wysiwyg-content"] ul[data-type='taskList'] li`, {
  display: "flex",
  gap: "0.5em",
  alignItems: "flex-start",
});

globalStyle(
  `${editorTheme} [data-part="wysiwyg-content"] ul[data-type='taskList'] input[type='checkbox']`,
  {
    marginTop: "0.3em",
    accentColor: tokens.editor.accent.base,
    flexShrink: "0",
  },
);

// Horizontal rule

globalStyle(`${editorTheme} [data-part="wysiwyg-content"] hr`, {
  border: "none",
  borderTop: `1px solid ${tokens.editor.border.subtle}`,
  marginTop: "2em",
  marginBottom: "2em",
});

// Highlighted text

globalStyle(`${editorTheme} [data-part="wysiwyg-content"] mark`, {
  background: tokens.editor.accent.soft,
  color: tokens.editor.fg.primary,
  borderRadius: "2px",
  padding: "0.1em 0.2em",
});

// Tables

globalStyle(`${editorTheme} [data-part="wysiwyg-content"] table`, {
  borderCollapse: "collapse",
  width: "100%",
  marginBottom: "1.25em",
  fontSize: "0.9em",
});

globalStyle(`${editorTheme} [data-part="wysiwyg-content"] th`, {
  textAlign: "left",
  fontWeight: "600",
  padding: "8px 12px",
  borderBottom: `2px solid ${tokens.editor.border.default}`,
  color: tokens.editor.fg.secondary,
});

globalStyle(`${editorTheme} [data-part="wysiwyg-content"] td`, {
  padding: "8px 12px",
  borderBottom: `1px solid ${tokens.editor.border.subtle}`,
});

// Placeholder

globalStyle(`${editorTheme} [data-part="wysiwyg-content"] p.is-editor-empty:first-child::before`, {
  content: "attr(data-placeholder)",
  color: tokens.editor.fg.muted,
  fontStyle: "italic",
  pointerEvents: "none",
  float: "left",
  height: "0",
});

// Math (KaTeX node views from @tiptap/extension-mathematics)

globalStyle(`${editorTheme} [data-part="wysiwyg-content"] .tiptap-mathematics-render`, {
  borderRadius: "2px",
  padding: "0.1em 0.2em",
});

globalStyle(`${editorTheme} [data-part="wysiwyg-content"] .tiptap-mathematics-render--editable`, {
  cursor: "pointer",
  transition: "background 0.15s ease",
});

globalStyle(
  `${editorTheme} [data-part="wysiwyg-content"] .tiptap-mathematics-render--editable:hover`,
  {
    background: tokens.editor.surface.hover,
  },
);

globalStyle(
  `${editorTheme} [data-part="wysiwyg-content"] .tiptap-mathematics-render[data-type="block-math"]`,
  {
    display: "block",
    textAlign: "center",
    margin: "1em 0",
    padding: "0.5em 0.75em",
  },
);

// Math edit popover

globalStyle(`${editorTheme} [data-part="math-popover"]`, {
  background: tokens.editor.surface.raised,
  border: `1px solid ${tokens.editor.border.default}`,
  boxShadow: tokens.shadow.card,
});

globalStyle(`${editorTheme} [data-part="math-popover-input"]`, {
  fontFamily: tokens.font.mono,
  background: tokens.editor.surface.base,
  color: tokens.editor.fg.primary,
  border: `1px solid ${tokens.editor.border.subtle}`,
});

globalStyle(`${editorTheme} [data-part="math-popover-input"]:focus`, {
  boxShadow: `0 0 0 2px ${tokens.editor.accent.border}`,
});

globalStyle(`${editorTheme} [data-part="math-popover-preview"]`, {
  color: tokens.editor.fg.primary,
});

// Invalid LaTeX falls back to raw source text; the palette has no danger
// Token yet, so use a literal muted red.
globalStyle(
  `${editorTheme} [data-part="wysiwyg-content"] .inline-math-error, ${editorTheme} [data-part="wysiwyg-content"] .block-math-error`,
  {
    color: "#b3261e",
    fontFamily: tokens.font.mono,
    fontSize: "0.9em",
  },
);
