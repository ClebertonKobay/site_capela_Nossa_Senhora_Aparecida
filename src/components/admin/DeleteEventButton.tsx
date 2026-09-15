"use client";

import { Button } from "@/components/ui";

export function DeleteEventButton({
  id,
  action,
}: {
  id: number;
  action: (formData: FormData) => void;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Excluir este evento? Essa ação não pode ser desfeita.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="cancel">
        Excluir
      </Button>
    </form>
  );
}
