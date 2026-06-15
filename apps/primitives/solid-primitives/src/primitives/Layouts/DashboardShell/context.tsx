import { createContext, createSignal, untrack, useContext, type Accessor, type JSXElement } from "solid-js";

/**
 * The reactive drawer state shared across the shell parts.
 *
 * Only the mobile drawer's open/closed state is genuine shell behaviour, so it
 * is the only thing that lives in context. Which nav item is "active" is
 * application state, so it stays out here: consumers express it with the
 * `active` prop on `NavItem` / `BottomTab`.
 *
 * `drawerOpen` is an `Accessor<boolean>` (call it to read, tracks reactively),
 * mirroring the Accessor-everywhere convention used elsewhere in the library.
 */
export interface DashboardShellContextValue {
  drawerOpen: Accessor<boolean>;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

const DashboardShellContext = createContext<DashboardShellContextValue>();

/** Read the shell drawer state. Throws if used outside `DashboardShell.Root`. */
export const useDashboardShell = (): DashboardShellContextValue => {
  const ctx = useContext(DashboardShellContext);
  if (ctx === undefined) {
    throw new Error("useDashboardShell must be used inside <DashboardShell.Root>");
  }
  return ctx;
};

export interface DrawerStateProps {
  /** Controlled open state. When provided, the shell never owns the value. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Fired on every requested change, in both controlled and uncontrolled modes. */
  onOpenChange?: (open: boolean) => void;
}

/**
 * Controlled/uncontrolled drawer signal, following the same factory shape as the
 * Editor's `makeContentSignal`: when `props.open` is supplied the component is
 * controlled and the internal signal is never read; otherwise the internal
 * signal owns the value. `onOpenChange` fires in both modes.
 */
const makeDrawerSignal = (props: DrawerStateProps): DashboardShellContextValue => {
  const [internal, setInternal] = createSignal(untrack(() => props.defaultOpen ?? false));

  const drawerOpen = (): boolean => props.open ?? internal();

  const set = (next: boolean): void => {
    props.onOpenChange?.(next);
    if (props.open === undefined) {
      setInternal(next);
    }
  };

  return {
    close: () => set(false),
    drawerOpen,
    open: () => set(true),
    toggle: () => set(!untrack(drawerOpen)),
  };
};

interface DashboardShellProviderProps extends DrawerStateProps {
  children: JSXElement;
}

/** Build the drawer state and provide it to the shell parts. */
export const DashboardShellProvider = (props: DashboardShellProviderProps): JSXElement => (
  <DashboardShellContext.Provider value={makeDrawerSignal(props)}>
    {props.children}
  </DashboardShellContext.Provider>
);
