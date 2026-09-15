import { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export function Table({ className, ...props }: ComponentPropsWithoutRef<"table">) {
  return (
    <table
      className={cn("w-full min-w-[560px] border-collapse text-left text-base", className)}
      {...props}
    />
  );
}

export function TableHeader({ className, ...props }: ComponentPropsWithoutRef<"thead">) {
  return <thead className={cn(className)} {...props} />;
}

export function TableBody({ className, ...props }: ComponentPropsWithoutRef<"tbody">) {
  return <tbody className={cn(className)} {...props} />;
}

export function TableRow({
  header,
  className,
  ...props
}: { header?: boolean } & ComponentPropsWithoutRef<"tr">) {
  return (
    <tr
      className={cn(header ? "border-b-2 border-border" : "border-b border-border", className)}
      {...props}
    />
  );
}

export function TableHead({ className, ...props }: ComponentPropsWithoutRef<"th">) {
  return <th className={cn("py-2 pr-3", className)} {...props} />;
}

export function TableCell({ className, ...props }: ComponentPropsWithoutRef<"td">) {
  return <td className={cn("py-2 pr-3", className)} {...props} />;
}
