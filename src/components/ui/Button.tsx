import { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export function Button({
  variant = "default",
  className,
  ...props
}: {
  variant?: "default" | "cancel" | "secondary";
} & ComponentPropsWithoutRef<"button">) {
  const variantClass = { default: "btn-confirm", cancel: "btn-delete", secondary: "btn-secondary" }[variant];
  return <button className={cn("btn", variantClass, className)} {...props} />;
}
