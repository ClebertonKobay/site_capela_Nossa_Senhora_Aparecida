"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui";

export function QueryToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();

  useEffect(() => {
    if (searchParams.get("created")) {
      showToast("Usuário criado com sucesso!");
      router.replace(pathname);
    } else if (searchParams.get("error") === "username_exists") {
      showToast("Nome de usuário já existe.", "error");
      router.replace(pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
