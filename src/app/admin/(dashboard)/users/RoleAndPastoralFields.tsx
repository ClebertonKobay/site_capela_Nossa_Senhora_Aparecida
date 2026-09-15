"use client";

import { useState } from "react";
import { Select } from "@/components/ui";

const ROLE_OPTIONS = [
  { value: "admin", label: "Administrador" },
  { value: "chapel_coordinator", label: "Coordenador de Capela" },
  { value: "pastoral_coordinator", label: "Coordenador de Pastoral" },
  { value: "catechesis_coordinator", label: "Coordenador de Catequese" },
  { value: "catechist", label: "Catequista" },
];

export function RoleAndPastoralFields({ pastorals }: { pastorals: { id: number; name: string }[] }) {
  const [role, setRole] = useState("admin");
  const [pastoralId, setPastoralId] = useState("");

  return (
    <>
      <Select label="Papel" name="role" value={role} onValueChange={setRole} options={ROLE_OPTIONS} />
      <Select
        label="Pastoral (só para Coordenador de Pastoral)"
        name="pastoralId"
        value={pastoralId}
        onValueChange={setPastoralId}
        placeholder="— nenhuma —"
        options={pastorals.map((p) => ({ value: String(p.id), label: p.name }))}
      />
    </>
  );
}
