import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-primary/30 bg-primary text-primary-foreground shadow-sm shadow-primary/20",
        secondary: "border-white/[0.06] bg-secondary text-secondary-foreground",
        destructive: "border-red-500/20 bg-red-500/15 text-red-400",
        success: "border-emerald-500/20 bg-emerald-500/15 text-emerald-400",
        warning: "border-amber-500/20 bg-amber-500/15 text-amber-400",
        outline: "border-white/[0.08] text-muted-foreground hover:border-white/[0.12] hover:text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
