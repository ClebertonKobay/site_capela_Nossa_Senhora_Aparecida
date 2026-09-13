"use client";

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
      <button type="submit" className="text-base font-semibold text-red-700 underline">
        Excluir
      </button>
    </form>
  );
}
