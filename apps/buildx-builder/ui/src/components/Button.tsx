import { Show, splitProps } from 'solid-js'
import type { JSX, ParentComponent } from 'solid-js'
import { button, buttonSpinner } from '@rs/ryan-personal-website-design/recipes'
import type { RecipeVariants } from '@vanilla-extract/recipes'

/**
 * Exemplar component: a Button styled entirely by the design system.
 *
 * It is a thin wrapper over the `button` recipe exported from
 * `@rs/ryan-personal-website-design/recipes`. No colours or spacing are
 * hard-coded here. The recipe owns every visual decision (and flips light/dark
 * via the theme contract), so this component's only job is to map props to
 * recipe variants and render the markup. This is the pattern to copy when
 * adding further design-system-backed components.
 */

// The recipe's own variant groups (`variant`, `size`, `fullWidth`), derived
// straight from the recipe so the prop types stay in sync with the design source.
type ButtonVariants = NonNullable<RecipeVariants<typeof button>>

export interface ButtonProps
  extends
    Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'classList'>,
    ButtonVariants {
  /** Show a spinner and block interaction while an action is in flight. */
  loading?: boolean
}

export const Button: ParentComponent<ButtonProps> = (props) => {
  const [variants, local, rest] = splitProps(
    props,
    ['variant', 'size', 'fullWidth'],
    ['class', 'children', 'loading', 'disabled'],
  )

  return (
    <button
      {...rest}
      class={[button(variants), local.class].filter(Boolean).join(' ')}
      disabled={local.disabled || local.loading}
      aria-busy={local.loading ? 'true' : undefined}
    >
      <Show when={local.loading}>
        <span class={buttonSpinner} aria-hidden="true" />
      </Show>
      {local.children}
    </button>
  )
}
