"use client";

type Row = {
  name: string;
  phone: string;
  quantity: number;
  eventName: string;
  createdAtLabel: string;
};

function csvEscape(value: string | number): string {
  const str = String(value);
  return /["\n,]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export function ExportCsvButton({ rows }: { rows: Row[] }) {
  function handleExport() {
    const header = "Nome,Telefone,Quantidade,Evento,Data\n";
    const body = rows
      .map((r) => [r.name, r.phone, r.quantity, r.eventName, r.createdAtLabel].map(csvEscape).join(","))
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pedidos-cartela.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      className="btn btn-secondary"
    >
      Exportar CSV
    </button>
  );
}
