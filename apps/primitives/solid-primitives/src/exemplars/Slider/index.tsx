import { createSignal, mergeProps, splitProps, type Accessor, type JSX } from "solid-js";

const DEFAULT_MIN = 0;
const DEFAULT_MAX = 100;
const DEFAULT_STEP = 1;
const DEFAULT_VALUE = 50;

interface SliderProps extends Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  "onInput" | "type" | "value"
> {
  count: Accessor<number>;
  onCount: (val: number) => void;
}

export const Slider = (rawProps: SliderProps): JSX.Element => {
  const props = mergeProps({ max: DEFAULT_MAX, min: DEFAULT_MIN, step: DEFAULT_STEP }, rawProps);
  const [local, inputProps] = splitProps(props, ["count", "onCount"]);

  return (
    <input
      type="range"
      {...inputProps}
      value={local.count()}
      onInput={(event) => local.onCount(event.currentTarget.valueAsNumber)}
      style={{ width: "100%" }}
    />
  );
};

export const SliderExample = (): JSX.Element => {
  const [count, setCount] = createSignal(DEFAULT_VALUE);

  return (
    <div style={{ display: "flex", "flex-direction": "column", gap: "8px", padding: "16px" }}>
      <label>Value: {count()}</label>
      <Slider count={count} onCount={setCount} />
    </div>
  );
};

export default Slider;
