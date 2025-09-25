import { cn } from "@/lib/utils";
import { type HTMLAttributes, forwardRef } from "react";

export interface CompactCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "ghost";
}

const CompactCard = forwardRef<HTMLDivElement, CompactCardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md",
          {
            "border-border": variant === "default",
            "border-border bg-transparent": variant === "outline",
            "border-transparent bg-transparent shadow-none": variant === "ghost",
          },
          className
        )}
        {...props}
      />
    );
  }
);
CompactCard.displayName = "CompactCard";

export interface CompactCardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

const CompactCardHeader = forwardRef<HTMLDivElement, CompactCardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-4", className)}
      {...props}
    />
  )
);
CompactCardHeader.displayName = "CompactCardHeader";

export interface CompactCardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

const CompactCardTitle = forwardRef<HTMLParagraphElement, CompactCardTitleProps>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-sm font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
);
CompactCardTitle.displayName = "CompactCardTitle";

export interface CompactCardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

const CompactCardDescription = forwardRef<HTMLParagraphElement, CompactCardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  )
);
CompactCardDescription.displayName = "CompactCardDescription";

export interface CompactCardContentProps extends HTMLAttributes<HTMLDivElement> {}

const CompactCardContent = forwardRef<HTMLDivElement, CompactCardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("px-4 pb-4", className)} {...props} />
  )
);
CompactCardContent.displayName = "CompactCardContent";

export interface CompactCardFooterProps extends HTMLAttributes<HTMLDivElement> {}

const CompactCardFooter = forwardRef<HTMLDivElement, CompactCardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center px-4 py-3 pt-0", className)}
      {...props}
    />
  )
);
CompactCardFooter.displayName = "CompactCardFooter";

export {
  CompactCard,
  CompactCardHeader,
  CompactCardTitle,
  CompactCardDescription,
  CompactCardContent,
  CompactCardFooter,
};
