import { ComponentPropsWithoutRef, useId } from "react";
import { cn } from "@/lib/cn";

export function Input({
  label,
  error,
  id: explicitId,
  className,
  ...props
}: {
  label?: string;
  error?: string;
} & ComponentPropsWithoutRef<"input">) {
  const generatedId = useId();
  const resolvedId = explicitId || (label ? generatedId : undefined);

  return (
    <>
      {label && (
        <label htmlFor={resolvedId} className="text-body font-semibold text-foreground">
          {label}
        </label>
      )}
      <input id={resolvedId} className={cn("field", label && "mt-1", className)} {...props} />
      {error && <p className="mt-1 text-caption text-danger">{error}</p>}
    </>
  );
}
