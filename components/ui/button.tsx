import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/15 disabled:pointer-events-none disabled:opacity-50 [&_svg]:h-4 [&_svg]:w-4",
  {
    variants: {
      variant: {
        default: "border border-primary bg-primary text-primary-foreground hover:bg-primary/92",
        outline: "border border-border bg-white text-foreground hover:bg-muted",
        secondary: "border border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/85",
        ghost: "border border-transparent bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
        destructive: "border border-rose-600 bg-rose-600 text-white hover:bg-rose-700",
        danger: "border border-rose-600 bg-rose-600 text-white hover:bg-rose-700",
        success: "border border-[hsl(var(--success))] bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] hover:opacity-95",
        link: "rounded-none border-transparent bg-transparent px-0 text-primary underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-7 px-2.5 text-xs",
        sm: "h-8 px-3",
        default: "h-9 px-4",
        lg: "h-10 px-4 text-sm",
        icon: "h-9 w-9",
        "icon-sm": "h-8 w-8",
        "icon-lg": "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { Button, buttonVariants };
