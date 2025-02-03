import React from "react";
import DatePicker, { DatePickerProps } from "react-datepicker";
import clsx from "clsx";
import "react-datepicker/dist/react-datepicker.css";

// Define the allowed color keys
type Color =
  | "primary"
  | "secondary"
  | "accent"
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose"
  | "zinc";

// Extend the DatePicker props by omitting some keys and adding a color prop.
export type CustomDatePickerProps = Omit<
  DatePickerProps,
  "selected" | "onChange" | "className" | "dateFormat" | "selectsRange"
> & {
  selected: Date;
  onChange: (date: Date | null, event?: React.SyntheticEvent<any>) => void;
  dateFormat?: string;
  className?: string;
  color?: Color;
};

// Base classes similar to your Input theming (sans background/text color)
const defaultClasses = [
  "relative",
  "block",
  "w-full",
  "appearance-none",
  "rounded-lg",
  "px-[calc(theme(spacing[3.5])-1px)]",
  "py-[calc(theme(spacing[2.5])-1px)]",
  "sm:px-[calc(theme(spacing[3])-1px)]",
  "sm:py-[calc(theme(spacing[1.5])-1px)]",
  "text-sm",
  "border",
  "border-primary-950/10",
  "data-[hover]:border-primary-950/20",
  "dark:border-white/10",
  "dark:data-[hover]:border-white/20",
  "focus:outline-none",
];

// Color mapping inspired by your badge.tsx styling
const datepickerColors: Record<Color, string> = {
  primary:
    "bg-primary-600/10 text-primary-700 group-hover:bg-primary-600/20 dark:bg-white/5 dark:text-primary-100 dark:group-hover:bg-white/10",
  secondary:
    "bg-secondary-600/10 text-secondary-700 group-hover:bg-secondary-600/20 dark:bg-white/5 dark:text-secondary-400 dark:group-hover:bg-white/10",
  accent:
    "bg-accent-600/10 text-accent-700 group-hover:bg-accent-600/20 dark:bg-white/5 dark:text-accent-400 dark:group-hover:bg-white/10",
  red: "bg-red-500/15 text-red-700 group-hover:bg-red-500/25 dark:bg-red-500/10 dark:text-red-400 dark:group-hover:bg-red-500/20",
  orange:
    "bg-orange-500/15 text-orange-700 group-hover:bg-orange-500/25 dark:bg-orange-500/10 dark:text-orange-400 dark:group-hover:bg-orange-500/20",
  amber:
    "bg-amber-400/20 text-amber-700 group-hover:bg-amber-400/30 dark:bg-amber-400/10 dark:text-amber-400 dark:group-hover:bg-amber-400/15",
  yellow:
    "bg-yellow-400/20 text-yellow-700 group-hover:bg-yellow-400/30 dark:bg-yellow-400/10 dark:text-yellow-300 dark:group-hover:bg-yellow-400/15",
  lime: "bg-lime-400/20 text-lime-700 group-hover:bg-lime-400/30 dark:bg-lime-400/10 dark:text-lime-300 dark:group-hover:bg-lime-400/15",
  green:
    "bg-green-500/15 text-green-700 group-hover:bg-green-500/25 dark:bg-green-500/10 dark:text-green-400 dark:group-hover:bg-green-500/20",
  emerald:
    "bg-emerald-500/15 text-emerald-700 group-hover:bg-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400 dark:group-hover:bg-emerald-500/20",
  teal: "bg-teal-500/15 text-teal-700 group-hover:bg-teal-500/25 dark:bg-teal-500/10 dark:text-teal-300 dark:group-hover:bg-teal-500/20",
  cyan: "bg-cyan-400/20 text-cyan-700 group-hover:bg-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-300 dark:group-hover:bg-cyan-400/15",
  sky: "bg-sky-500/15 text-sky-700 group-hover:bg-sky-500/25 dark:bg-sky-500/10 dark:text-sky-300 dark:group-hover:bg-sky-500/20",
  blue: "bg-blue-500/15 text-blue-700 group-hover:bg-blue-500/25 dark:text-blue-400 dark:group-hover:bg-blue-500/25",
  indigo:
    "bg-indigo-500/15 text-indigo-700 group-hover:bg-indigo-500/25 dark:text-indigo-400 dark:group-hover:bg-indigo-500/20",
  violet:
    "bg-violet-500/15 text-violet-700 group-hover:bg-violet-500/25 dark:text-violet-400 dark:group-hover:bg-violet-500/20",
  purple:
    "bg-purple-500/15 text-purple-700 group-hover:bg-purple-500/25 dark:text-purple-400 dark:group-hover:bg-purple-500/20",
  fuchsia:
    "bg-fuchsia-400/15 text-fuchsia-700 group-hover:bg-fuchsia-400/25 dark:bg-fuchsia-400/10 dark:text-fuchsia-400 dark:group-hover:bg-fuchsia-400/20",
  pink: "bg-pink-400/15 text-pink-700 group-hover:bg-pink-400/25 dark:bg-pink-400/10 dark:text-pink-400 dark:group-hover:bg-pink-400/20",
  rose: "bg-rose-400/15 text-rose-700 group-hover:bg-rose-400/25 dark:bg-rose-400/10 dark:text-rose-400 dark:group-hover:bg-rose-400/20",
  zinc: "bg-zinc-600/10 text-zinc-700 group-hover:bg-zinc-600/20 dark:bg-white/5 dark:text-zinc-400 dark:group-hover:bg-white/10",
};

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selected,
  name,
  onChange,
  dateFormat = "yyyy-MM-dd",
  className,
  color = "primary",
}) => {
  return (
    <DatePicker
      name={name}
      selected={selected}
      onChange={(date, event) => onChange(date as Date | null, event)}
      dateFormat={dateFormat}
      // Apply our default classes and our datepicker color classes for theming.
      className={clsx(defaultClasses, datepickerColors[color], className)}
    />
  );
};

export default CustomDatePicker;
