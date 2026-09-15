import { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type IconButtonProps = {
  "aria-label": string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"button">, "aria-label">;

export function IconButton({
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button className={cn("btn-icon", className)} {...props}>
      {children}
    </button>
  );
}
