import { createSignal } from "solid-js";
import { MdxRenderer } from "@rs/solid-primitives";
import type { Meta, StoryObj } from "storybook-solidjs-vite";
// KaTeX stylesheet so the math in the GfmAndMath story renders typeset.
import "katex/dist/katex.min.css";

const DEFAULT_MDX = `# Hello from MDX

> A blockquote rendered client-side via \`@mdx-js/mdx\` and \`@babel/standalone\`.

Plain **bold**, _italic_, and \`inline code\` all work.

Expressions evaluate too: {2 + 2} is four.

## List

- Alpha
- Beta
- Gamma
`;

interface MdxArgs {
  source: string;
}

const MdxDemo = (props: MdxArgs) => {
  const [source, setSource] = createSignal(props.source);

  return (
    <div
      style={{
        display: "grid",
        "grid-template-columns": "1fr 1fr",
        gap: "1rem",
        "max-width": "60rem",
        "font-family": "sans-serif",
      }}
    >
      <div>
        <p style={{ margin: "0 0 0.5rem", "font-size": "0.75rem", opacity: "0.6" }}>
          MDX source
        </p>
        <textarea
          style={{
            width: "100%",
            height: "18rem",
            "font-family": "monospace",
            "font-size": "0.8rem",
            padding: "0.5rem",
            border: "1px dashed #cbd5e1",
            "border-radius": "6px",
            resize: "vertical",
            "box-sizing": "border-box",
          }}
          value={source()}
          onInput={(e) => setSource(e.currentTarget.value)}
        />
      </div>
      <div>
        <p style={{ margin: "0 0 0.5rem", "font-size": "0.75rem", opacity: "0.6" }}>
          Rendered output
        </p>
        <div
          style={{
            border: "1px dashed #cbd5e1",
            "border-radius": "6px",
            padding: "1rem",
            "min-height": "18rem",
          }}
        >
          <MdxRenderer source={source} />
        </div>
      </div>
    </div>
  );
};

const meta = {
  title: "Primitives/MdxRenderer",
  component: MdxDemo,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    source: { control: "text" },
  },
  args: {
    source: DEFAULT_MDX,
  },
  render: (args) => <MdxDemo source={args.source} />,
} satisfies Meta<MdxArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithExpression: Story = {
  args: {
    source: "# Expression\n\nResult: {Math.PI.toFixed(4)}\n",
  },
};

export const InvalidMdx: Story = {
  args: {
    source: "# Broken\n\n{unclosedBrace",
  },
};

export const RichDocument: Story = {
  args: {
    source: `# Hello from MDX

> A blockquote rendered client-side via \`@mdx-js/mdx\` and \`@babel/standalone\`.

Plain **bold**, _italic_, and \`inline code\` all work.

Expressions evaluate too: {2 + 2} is four.

## List

- Alpha
- Beta
- Gamma

{x = 3}

The value of variable x is {x}`,
  },
};

export const GfmAndMath: Story = {
  args: {
    source: `# GFM and math

A GFM pipe table:

| Feature | Status |
| ------- | ------ |
| tables  | yes    |
| ~~old~~ | gone   |

A task list:

- [x] strikethrough
- [ ] autolink https://example.com

Inline math $E = mc^2$ and a fraction $\\frac{a}{b}$ render via KaTeX.`,
  },
};
