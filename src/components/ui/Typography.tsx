import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";

import { cn } from "@/lib/cn";

type Variant = "display" | "title" | "subtitle" | "body" | "caption";

const VARIANT_CLASS: Record<Variant, string> = {
  display: "text-display",
  title: "text-title",
  subtitle: "text-subtitle",
  body: "text-body",
  caption: "text-caption",
};

const DEFAULT_TAG: Record<Variant, ElementType> = {
  display: "h1",
  title: "h2",
  subtitle: "h3",
  body: "p",
  caption: "span",
};

interface TypographyProps extends ComponentPropsWithoutRef<"p"> {
  as?: ElementType;
  variant: Variant;
  className?: string;
  children: ReactNode;
}

export function Typography({
  as,
  variant,
  className,
  children,
  ...props
}: TypographyProps) {
  const Component = as ?? DEFAULT_TAG[variant];
  const classNames = cn(VARIANT_CLASS[variant], className);

  return (
    <Component className={classNames} {...props}>
      {children}
    </Component>
  );
}
