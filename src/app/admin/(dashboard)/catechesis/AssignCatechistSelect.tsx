"use client";

import { useState } from "react";
import { Select } from "@/components/ui";

export function AssignCatechistSelect({
  classId,
  defaultCatechistId,
  catechists,
}: {
  classId: number;
  defaultCatechistId: number | null;
  catechists: { id: number; name: string }[];
}) {
  const [catechistId, setCatechistId] = useState(defaultCatechistId ? String(defaultCatechistId) : "");
  return (
    <>
      <input type="hidden" name="classId" value={classId} />
      <Select
        name="catechistId"
        value={catechistId}
        onValueChange={setCatechistId}
        placeholder="— sem catequista —"
        options={catechists.map((c) => ({ value: String(c.id), label: c.name }))}
      />
    </>
  );
}
