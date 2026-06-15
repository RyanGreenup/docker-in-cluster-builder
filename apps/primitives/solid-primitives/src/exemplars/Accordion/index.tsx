/*
 * The brand skin lives in the consuming design system. The exemplar simply
 * re-exports the headless primitive, which carries no aesthetics of its own.
 */
export {
  Accordion,
  AccordionItem,
  Root,
  type AccordionItemProps,
} from "../../primitives/Accordion";

export { AccordionItem as default } from "../../primitives/Accordion";
