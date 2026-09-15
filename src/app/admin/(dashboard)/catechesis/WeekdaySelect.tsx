"use client";

import { useState } from "react";
import { Select } from "@/components/ui";
import { WEEKDAY_LABELS } from "@/lib/schedules";

export function WeekdaySelect() {
  const [weekday, setWeekday] = useState("0");
  return (
    <Select
      label="Dia da semana"
      name="weekday"
      value={weekday}
      onValueChange={setWeekday}
      options={WEEKDAY_LABELS.map((label, index) => ({ value: String(index), label }))}
    />
  );
}
