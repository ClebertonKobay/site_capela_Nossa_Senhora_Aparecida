import { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

const VARIANT_CLASS = {
  default: "btn-confirm",
  cancel: "btn-delete",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  "ghost-danger": "btn-ghost-danger",
} as const;

export function Button({
  variant = "default",
  className,
  ...props
}: {
  variant?: keyof typeof VARIANT_CLASS;
} & ComponentPropsWithoutRef<"button">) {
  return <button className={cn("btn", VARIANT_CLASS[variant], className)} {...props} />;
}
