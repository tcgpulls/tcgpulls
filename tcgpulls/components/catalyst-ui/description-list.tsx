import clsx from "clsx";

export function DescriptionList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"dl">) {
  return (
    <dl
      {...props}
      className={clsx(
        className,
        "grid grid-cols-1 text-base/6 sm:grid-cols-[min(50%,theme(spacing.80))_auto] sm:text-sm/6",
      )}
    />
  );
}

export function DescriptionTerm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"dt">) {
  return (
    <dt
      {...props}
      className={clsx(
        className,
        "col-start-1 border-t border-primary-950/5 pt-3 text-primary-500 first:border-none sm:border-t sm:border-primary-950/5 sm:py-3 dark:border-white/5 dark:text-primary-400 sm:dark:border-white/5",
      )}
    />
  );
}

export function DescriptionDetails({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"dd">) {
  return (
    <dd
      {...props}
      className={clsx(
        className,
        "pb-3 pt-1 text-primary-950 sm:border-t sm:border-primary-950/5 sm:py-3 dark:text-white dark:sm:border-white/5 sm:[&:nth-child(2)]:border-none",
      )}
    />
  );
}
