import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/shadcn";
import clsx from "clsx";

const buttonVariants = cva(
  clsx(
    "inline-flex items-center justify-center whitespace-nowrap text-sm  font-bold ring-offset-white transition-all",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50"
  ),
  {
    variants: {
      variant: {
        primary: clsx(
          "bg-button-primary text-content-primary shadow-[0px_4px_0px_0px_#CAB710]",
          "hover:brightness-90",
          "active:brightness-90 active:translate-y-[4px] active:shadow-none"
        ),
        secondary: clsx(
          "bg-button-secondary text-white",
          "hover:brightness-90",
          "active:brightness-90 active:scale-[98%]"
        ),
        negative: clsx(
          "bg-semantic-negative text-white",
          "hover:brightness-90",
          "active:brightness-90 active:scale-[98%]"
        ),
        ghost: clsx("hover:bg-content-primary/15", "active:scale-[98%]"),
      },
      size: {
        lg: "body-lg h-16 px-8 py-[10px] rounded-full",
        md: "body-md h-[54px] px-6 py-[10px] rounded-full",
        icon: "aspect-square px-[10px] py-[10px] rounded-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "lg",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
