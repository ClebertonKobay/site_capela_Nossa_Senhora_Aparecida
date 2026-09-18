"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { Toast as RadixToast } from "radix-ui";
import { cn } from "@/lib/cn";

type ToastVariant = "success" | "error";
type ToastItem = { id: number; message: string; variant: ToastVariant };

const ToastContext = createContext<{ showToast: (message: string, variant?: ToastVariant) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, variant: ToastVariant = "success") => {
    setToasts((prev) => [...prev, { id: Date.now(), message, variant }]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <RadixToast.Provider swipeDirection="right" duration={3000}>
        {children}
        {toasts.map((toast) => (
          <RadixToast.Root
            key={toast.id}
            duration={3000}
            onOpenChange={(open) => {
              if (!open) setToasts((prev) => prev.filter((t) => t.id !== toast.id));
            }}
            className={cn(
              "rounded-xl px-4 py-3 text-body font-semibold shadow-lifted",
              toast.variant === "success" ? "bg-primary text-white" : "bg-danger text-white",
            )}
          >
            <RadixToast.Description>{toast.message}</RadixToast.Description>
          </RadixToast.Root>
        ))}
        <RadixToast.Viewport className="fixed right-4 bottom-4 z-100 flex w-full max-w-sm flex-col gap-2 outline-none" />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast precisa estar dentro de <ToastProvider>");
  return ctx;
}
