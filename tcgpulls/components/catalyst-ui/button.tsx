import * as Headless from "@headlessui/react";
import clsx from "clsx";
import React, { forwardRef } from "react";
import { Link } from "./link";

const styles = {
  base: [
    // Base
    "relative isolate inline-flex items-center justify-center gap-x-2 rounded-lg border text-base/6 font-semibold",
    // Sizing
    "px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] sm:px-[calc(theme(spacing.3)-1px)] sm:py-[calc(theme(spacing[1.5])-1px)] sm:text-sm/6",
    // Focus
    "focus:outline-none data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500",
    // Disabled
    "data-[disabled]:opacity-50",
    // Icon
    "[&>[data-slot=icon]]:-mx-0.5 [&>[data-slot=icon]]:my-0.5 [&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:text-[--btn-icon] [&>[data-slot=icon]]:sm:my-1 [&>[data-slot=icon]]:sm:size-4 forced-colors:[--btn-icon:ButtonText] forced-colors:data-[hover]:[--btn-icon:ButtonText]",
  ],
  solid: [
    // Optical border, implemented as the button background to avoid corner artifacts
    "border-transparent bg-[--btn-border]",
    // Dark mode: border is rendered on `after` so background is set to button background
    "dark:bg-[--btn-bg]",
    // Button background, implemented as foreground layer to stack on top of pseudo-border layer
    "before:absolute before:inset-0 before:-z-10 before:rounded-[calc(theme(borderRadius.lg)-1px)] before:bg-[--btn-bg]",
    // Drop shadow, applied to the inset `before` layer so it blends with the border
    "before:shadow",
    // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
    "dark:before:hidden",
    // Dark mode: Subtle white outline is applied using a border
    "dark:border-white/5",
    // Shim/overlay, inset to match button foreground and used for hover state + highlight shadow
    "after:absolute after:inset-0 after:-z-10 after:rounded-[calc(theme(borderRadius.lg)-1px)]",
    // Inner highlight shadow
    "after:shadow-[shadow:inset_0_1px_theme(colors.white/15%)]",
    // White overlay on hover
    "after:data-[active]:bg-[--btn-hover-overlay] after:data-[hover]:bg-[--btn-hover-overlay]",
    // Dark mode: `after` layer expands to cover entire button
    "dark:after:-inset-px dark:after:rounded-lg",
    // Disabled
    "before:data-[disabled]:shadow-none after:data-[disabled]:shadow-none",
  ],
  outline: [
    // Base
    "border-primary-950/10 text-primary-950 data-[active]:bg-primary-950/[2.5%] data-[hover]:bg-primary-950/[2.5%]",
    // Dark mode
    "dark:border-white/15 dark:text-white dark:[--btn-bg:transparent] dark:data-[active]:bg-white/5 dark:data-[hover]:bg-white/5",
    // Icon
    "[--btn-icon:theme(colors.zinc.500)] data-[active]:[--btn-icon:theme(colors.zinc.700)] data-[hover]:[--btn-icon:theme(colors.zinc.700)] dark:data-[active]:[--btn-icon:theme(colors.zinc.400)] dark:data-[hover]:[--btn-icon:theme(colors.zinc.400)]",
  ],
  plain: [
    // Base
    "border-transparent text-primary-950 data-[active]:text-accent-500 data-[hover]:text-accent-500",
    // Dark mode
    "dark:text-white",
    // Icon
    "[--btn-icon:theme(colors.zinc.500)] data-[active]:[--btn-icon:theme(colors.zinc.700)] data-[hover]:[--btn-icon:theme(colors.zinc.700)] dark:[--btn-icon:theme(colors.zinc.500)] dark:data-[active]:[--btn-icon:theme(colors.zinc.400)] dark:data-[hover]:[--btn-icon:theme(colors.zinc.400)]",
  ],
  colors: {
    primary: [
      "text-white [--btn-bg:var(--color-primary-500)] [--btn-border:var(--color-primary-600)] [--btn-hover-overlay:var(--color-primary-700)]",
      "dark:text-white dark:[--btn-bg:var(--color-primary-400)] dark:[--btn-hover-overlay:var(--color-primary-500)]",
      "[--btn-icon:var(--color-primary-200)] data-[active]:[--btn-icon:var(--color-primary-100)] data-[hover]:[--btn-icon:var(--color-primary-100)]",
      "data-[focus]:outline-primary-500",
    ],
    secondary: [
      "text-white [--btn-bg:var(--color-secondary-500)] [--btn-border:var(--color-secondary-600)] [--btn-hover-overlay:var(--color-secondary-700)]",
      "dark:text-white dark:[--btn-bg:var(--color-secondary-400)] dark:[--btn-hover-overlay:var(--color-secondary-500)]",
      "[--btn-icon:var(--color-secondary-200)] data-[active]:[--btn-icon:var(--color-secondary-100)] data-[hover]:[--btn-icon:var(--color-secondary-100)]",
      "data-[focus]:outline-secondary-500",
    ],
    accent: [
      "text-white [--btn-bg:var(--color-accent-5700)] [--btn-border:var(--color-accent-800)] [--btn-hover-overlay:var(--color-accent-900)]",
      "dark:text-white dark:[--btn-bg:var(--color-accent-600)] dark:[--btn-hover-overlay:var(--color-accent-700)]",
      "[--btn-icon:var(--color-accent-400)] data-[active]:[--btn-icon:var(--color-accent-300)] data-[hover]:[--btn-icon:var(--color-accent-300)]",
      "data-[focus]:outline-accent-500",
    ],
    "dark/zinc": [
      "text-white [--btn-bg:theme(colors.zinc.900)] [--btn-border:theme(colors.zinc.950/90%)] [--btn-hover-overlay:theme(colors.white/10%)]",
      "dark:text-white dark:[--btn-bg:theme(colors.zinc.600)] dark:[--btn-hover-overlay:theme(colors.white/5%)]",
      "[--btn-icon:theme(colors.zinc.400)] data-[active]:[--btn-icon:theme(colors.zinc.300)] data-[hover]:[--btn-icon:theme(colors.zinc.300)]",
    ],
    light: [
      "text-primary-950 [--btn-bg:white] [--btn-border:theme(colors.zinc.950/10%)] [--btn-hover-overlay:theme(colors.zinc.950/2.5%)] data-[active]:[--btn-border:theme(colors.zinc.950/15%)] data-[hover]:[--btn-border:theme(colors.zinc.950/15%)]",
      "dark:text-white dark:[--btn-hover-overlay:theme(colors.white/5%)] dark:[--btn-bg:theme(colors.zinc.800)]",
      "[--btn-icon:theme(colors.zinc.500)] data-[active]:[--btn-icon:theme(colors.zinc.700)] data-[hover]:[--btn-icon:theme(colors.zinc.700)] dark:[--btn-icon:theme(colors.zinc.500)] dark:data-[active]:[--btn-icon:theme(colors.zinc.400)] dark:data-[hover]:[--btn-icon:theme(colors.zinc.400)]",
    ],
    "dark/white": [
      "text-white [--btn-bg:theme(colors.zinc.900)] [--btn-border:theme(colors.zinc.950/90%)] [--btn-hover-overlay:theme(colors.white/10%)]",
      "dark:text-primary-950 dark:[--btn-bg:white] dark:[--btn-hover-overlay:theme(colors.zinc.950/5%)]",
      "[--btn-icon:theme(colors.zinc.400)] data-[active]:[--btn-icon:theme(colors.zinc.300)] data-[hover]:[--btn-icon:theme(colors.zinc.300)] dark:[--btn-icon:theme(colors.zinc.500)] dark:data-[active]:[--btn-icon:theme(colors.zinc.400)] dark:data-[hover]:[--btn-icon:theme(colors.zinc.400)]",
    ],
    dark: [
      "text-white [--btn-bg:theme(colors.zinc.900)] [--btn-border:theme(colors.zinc.950/90%)] [--btn-hover-overlay:theme(colors.white/10%)]",
      "dark:[--btn-hover-overlay:theme(colors.white/5%)] dark:[--btn-bg:theme(colors.zinc.800)]",
      "[--btn-icon:theme(colors.zinc.400)] data-[active]:[--btn-icon:theme(colors.zinc.300)] data-[hover]:[--btn-icon:theme(colors.zinc.300)]",
    ],
    white: [
      "text-primary-950 [--btn-bg:white] [--btn-border:theme(colors.zinc.950/10%)] [--btn-hover-overlay:theme(colors.zinc.950/2.5%)] data-[active]:[--btn-border:theme(colors.zinc.950/15%)] data-[hover]:[--btn-border:theme(colors.zinc.950/15%)]",
      "dark:[--btn-hover-overlay:theme(colors.zinc.950/5%)]",
      "[--btn-icon:theme(colors.zinc.400)] data-[active]:[--btn-icon:theme(colors.zinc.500)] data-[hover]:[--btn-icon:theme(colors.zinc.500)]",
    ],
    zinc: [
      "text-white [--btn-hover-overlay:theme(colors.white/10%)] [--btn-bg:theme(colors.zinc.600)] [--btn-border:theme(colors.zinc.700/90%)]",
      "dark:[--btn-hover-overlay:theme(colors.white/5%)]",
      "[--btn-icon:theme(colors.zinc.400)] data-[active]:[--btn-icon:theme(colors.zinc.300)] data-[hover]:[--btn-icon:theme(colors.zinc.300)]",
    ],
    indigo: [
      "text-white [--btn-hover-overlay:theme(colors.white/10%)] [--btn-bg:theme(colors.indigo.500)] [--btn-border:theme(colors.indigo.600/90%)]",
      "[--btn-icon:theme(colors.indigo.300)] data-[active]:[--btn-icon:theme(colors.indigo.200)] data-[hover]:[--btn-icon:theme(colors.indigo.200)]",
    ],
    cyan: [
      "text-cyan-950 [--btn-bg:theme(colors.cyan.300)] [--btn-border:theme(colors.cyan.400/80%)] [--btn-hover-overlay:theme(colors.white/25%)]",
      "[--btn-icon:theme(colors.cyan.500)]",
    ],
    red: [
      "text-white [--btn-hover-overlay:theme(colors.white/10%)] [--btn-bg:theme(colors.red.600)] [--btn-border:theme(colors.red.700/90%)]",
      "[--btn-icon:theme(colors.red.300)] data-[active]:[--btn-icon:theme(colors.red.200)] data-[hover]:[--btn-icon:theme(colors.red.200)]",
    ],
    orange: [
      "text-white [--btn-hover-overlay:theme(colors.white/10%)] [--btn-bg:theme(colors.orange.500)] [--btn-border:theme(colors.orange.600/90%)]",
      "[--btn-icon:theme(colors.orange.300)] data-[active]:[--btn-icon:theme(colors.orange.200)] data-[hover]:[--btn-icon:theme(colors.orange.200)]",
    ],
    amber: [
      "text-amber-950 [--btn-hover-overlay:theme(colors.white/25%)] [--btn-bg:theme(colors.amber.400)] [--btn-border:theme(colors.amber.500/80%)]",
      "[--btn-icon:theme(colors.amber.600)]",
    ],
    yellow: [
      "text-yellow-950 [--btn-hover-overlay:theme(colors.white/25%)] [--btn-bg:theme(colors.yellow.300)] [--btn-border:theme(colors.yellow.400/80%)]",
      "[--btn-icon:theme(colors.yellow.600)] data-[active]:[--btn-icon:theme(colors.yellow.700)] data-[hover]:[--btn-icon:theme(colors.yellow.700)]",
    ],
    lime: [
      "text-lime-950 [--btn-hover-overlay:theme(colors.white/25%)] [--btn-bg:theme(colors.lime.300)] [--btn-border:theme(colors.lime.400/80%)]",
      "[--btn-icon:theme(colors.lime.600)] data-[active]:[--btn-icon:theme(colors.lime.700)] data-[hover]:[--btn-icon:theme(colors.lime.700)]",
    ],
    green: [
      "text-white [--btn-hover-overlay:theme(colors.white/10%)] [--btn-bg:theme(colors.green.600)] [--btn-border:theme(colors.green.700/90%)]",
      "[--btn-icon:theme(colors.white/60%)] data-[active]:[--btn-icon:theme(colors.white/80%)] data-[hover]:[--btn-icon:theme(colors.white/80%)]",
    ],
    emerald: [
      "text-white [--btn-hover-overlay:theme(colors.white/10%)] [--btn-bg:theme(colors.emerald.600)] [--btn-border:theme(colors.emerald.700/90%)]",
      "[--btn-icon:theme(colors.white/60%)] data-[active]:[--btn-icon:theme(colors.white/80%)] data-[hover]:[--btn-icon:theme(colors.white/80%)]",
    ],
    teal: [
      "text-white [--btn-hover-overlay:theme(colors.white/10%)] [--btn-bg:theme(colors.teal.600)] [--btn-border:theme(colors.teal.700/90%)]",
      "[--btn-icon:theme(colors.white/60%)] data-[active]:[--btn-icon:theme(colors.white/80%)] data-[hover]:[--btn-icon:theme(colors.white/80%)]",
    ],
    sky: [
      "text-white [--btn-hover-overlay:theme(colors.white/10%)] [--btn-bg:theme(colors.sky.500)] [--btn-border:theme(colors.sky.600/80%)]",
      "[--btn-icon:theme(colors.white/60%)] data-[active]:[--btn-icon:theme(colors.white/80%)] data-[hover]:[--btn-icon:theme(colors.white/80%)]",
    ],
    blue: [
      "text-white [--btn-hover-overlay:theme(colors.white/10%)] [--btn-bg:theme(colors.blue.600)] [--btn-border:theme(colors.blue.700/90%)]",
      "[--btn-icon:theme(colors.blue.400)] data-[active]:[--btn-icon:theme(colors.blue.300)] data-[hover]:[--btn-icon:theme(colors.blue.300)]",
    ],
    violet: [
      "text-white [--btn-hover-overlay:theme(colors.white/10%)] [--btn-bg:theme(colors.violet.500)] [--btn-border:theme(colors.violet.600/90%)]",
      "[--btn-icon:theme(colors.violet.300)] data-[active]:[--btn-icon:theme(colors.violet.200)] data-[hover]:[--btn-icon:theme(colors.violet.200)]",
    ],
    purple: [
      "text-white [--btn-hover-overlay:theme(colors.white/10%)] [--btn-bg:theme(colors.purple.500)] [--btn-border:theme(colors.purple.600/90%)]",
      "[--btn-icon:theme(colors.purple.300)] data-[active]:[--btn-icon:theme(colors.purple.200)] data-[hover]:[--btn-icon:theme(colors.purple.200)]",
    ],
    fuchsia: [
      "text-white [--btn-hover-overlay:theme(colors.white/10%)] [--btn-bg:theme(colors.fuchsia.500)] [--btn-border:theme(colors.fuchsia.600/90%)]",
      "[--btn-icon:theme(colors.fuchsia.300)] data-[active]:[--btn-icon:theme(colors.fuchsia.200)] data-[hover]:[--btn-icon:theme(colors.fuchsia.200)]",
    ],
    pink: [
      "text-white [--btn-hover-overlay:theme(colors.white/10%)] [--btn-bg:theme(colors.pink.500)] [--btn-border:theme(colors.pink.600/90%)]",
      "[--btn-icon:theme(colors.pink.300)] data-[active]:[--btn-icon:theme(colors.pink.200)] data-[hover]:[--btn-icon:theme(colors.pink.200)]",
    ],
    rose: [
      "text-white [--btn-hover-overlay:theme(colors.white/10%)] [--btn-bg:theme(colors.rose.500)] [--btn-border:theme(colors.rose.600/90%)]",
      "[--btn-icon:theme(colors.rose.300)] data-[active]:[--btn-icon:theme(colors.rose.200)] data-[hover]:[--btn-icon:theme(colors.rose.200)]",
    ],
  },
};

type ButtonProps = (
  | { color?: keyof typeof styles.colors; outline?: never; plain?: never }
  | { color?: never; outline: true; plain?: never }
  | { color?: never; outline?: never; plain: true }
) & { className?: string; children: React.ReactNode } & (
    | Omit<Headless.ButtonProps, "as" | "className">
    | Omit<React.ComponentPropsWithoutRef<typeof Link>, "className">
  );

export const Button = forwardRef(function Button(
  { color, outline, plain, className, children, ...props }: ButtonProps,
  ref: React.ForwardedRef<HTMLElement>,
) {
  let classes = clsx(
    className,
    styles.base,
    outline
      ? styles.outline
      : plain
        ? styles.plain
        : clsx(styles.solid, styles.colors[color ?? "accent"]),
    props.onClick || ("href" in props && props.href !== "")
      ? "cursor-pointer"
      : "cursor-default",
  );

  return "href" in props ? (
    <Link
      {...props}
      className={classes}
      ref={ref as React.ForwardedRef<HTMLAnchorElement>}
    >
      <TouchTarget>{children}</TouchTarget>
    </Link>
  ) : (
    <Headless.Button
      {...props}
      className={clsx(classes, "cursor-pointer")}
      ref={ref}
    >
      <TouchTarget>{children}</TouchTarget>
    </Headless.Button>
  );
});

/**
 * Expand the hit area to at least 44×44px on touch devices
 */
export function TouchTarget({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span
        className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
        aria-hidden="true"
      />
      {children}
    </>
  );
}
