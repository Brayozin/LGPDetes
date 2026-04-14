"use client";

import * as React from "react";

import { cn } from "@/lib/utils/cn";

function Switch({
  checked,
  defaultChecked,
  onCheckedChange,
  className,
  disabled,
  size = "default",
  ...props
}: Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: "sm" | "default";
}) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false);
  const isControlled = checked !== undefined;
  const current = isControlled ? checked : internalChecked;

  function toggle() {
    if (disabled) {
      return;
    }

    const next = !current;
    if (!isControlled) {
      setInternalChecked(next);
    }
    onCheckedChange?.(next);
  }

  return (
    <button
      aria-checked={current}
      className={cn(
        "relative inline-flex rounded-full border border-transparent bg-slate-300 transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",
        current && "bg-primary",
        size === "sm" ? "h-5 w-9" : "h-6 w-11",
        className
      )}
      disabled={disabled}
      onClick={toggle}
      role="switch"
      type="button"
      {...props}
    >
      <span
        className={cn(
          "absolute left-0.5 top-0.5 rounded-full bg-white shadow-sm transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]",
          size === "sm" ? "h-4 w-4" : "h-5 w-5",
          current && (size === "sm" ? "translate-x-4" : "translate-x-5")
        )}
      />
    </button>
  );
}

export { Switch };
