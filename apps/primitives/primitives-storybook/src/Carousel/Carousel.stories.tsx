import { Carousel } from "@rs/solid-primitives";
import { Carousel as ExemplarCarousel } from "@rs/solid-primitives/exemplars";

import type { AtLeastThreeImages } from "@rs/solid-primitives";
import type { Meta, StoryObj } from "storybook-solidjs-vite";

interface CarouselArgs {
  images: AtLeastThreeImages;
  scrollable: boolean;
}

const getRandomNumber = () => Math.floor(Math.random() * 1000);
const meta = {
  title: "Primitives/Carousel",
  component: Carousel,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    images: { control: "object" },
    scrollable: { control: "boolean" },
  },
  args: {
    images: [
      {
        src: `https://picsum.photos/id/${getRandomNumber()}/200/300`,
        alt: "A quiet mountain lake with forested slopes",
      },
      {
        src: `https://picsum.photos/id/${getRandomNumber()}/200/300`,
        alt: "A winding road through a misty landscape",
      },
      {
        src: `https://picsum.photos/id/${getRandomNumber()}/200/300`,
        alt: "A textured architectural detail in warm light",
      },
    ],
    scrollable: true,
  },
  render: (args) => (
    <Carousel
      key="primitives-carousel-default"
      images={args.images}
      scrollable={args.scrollable}
    />
  ),
} satisfies Meta<CarouselArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PrimitiveAndExemplar: Story = {
  render: (args: CarouselArgs) => (
    <div
      style={{
        display: "grid",
        gap: "2rem",
        "grid-template-columns": "repeat(auto-fit, minmax(18rem, 1fr))",
        width: "min(100%, 72rem)",
      }}
    >
      <Carousel
        key="primitives-carousel-comparison-raw"
        images={args.images}
        scrollable={args.scrollable}
        style={{ border: "1px dashed #cbd5e1" }}
      />
      <ExemplarCarousel
        key="primitives-carousel-comparison-exemplar"
        images={args.images}
        scrollable={args.scrollable}
      />
    </div>
  ),
};
