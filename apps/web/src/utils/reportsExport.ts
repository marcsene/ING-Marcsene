
import * as XLSX from "xlsx";

type ExportRow = Record<string, string | number | boolean | null | undefined>;

export function exportToExcel(
  filename: string,
  sheetName: string,
  rows: ExportRow[],
): void {
  if (rows.length === 0) {
    throw new Error("No hay datos para exportar.");
  }

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    sheetName.slice(0, 31),
  );

  XLSX.writeFile(workbook, `${filename}.xlsx`);
}
