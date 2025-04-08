import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface ExcelColumn {
  key: string;
  header: string;
  width?: number;
}

export const exportToExcel = (
  data: any[],
  columns: ExcelColumn[],
  sheetName = "Sheet1"
) => {
  const transformedData = data.map((row) => {
    const newRow: Record<string, any> = {};
    columns.forEach((col) => {
      if (col.key.includes(".")) {
        newRow[col.header] = col.key
          .split(".")
          .reduce(
            (obj, key) => (obj && obj[key] !== undefined ? obj[key] : null),
            row
          );
      } else if (col.key.includes("new Date")) {
        try {
          const dateKey = col.key.split("(")[1].split(")")[0];
          newRow[col.header] = row[dateKey]
            ? new Date(row[dateKey]).toLocaleDateString("en-GB")
            : "";
        } catch {
          newRow[col.header] = "";
        }
      } else {
        newRow[col.header] = row[col.key];
      }
    });
    return newRow;
  });

  const ws = XLSX.utils.json_to_sheet(transformedData);

  const colWidths = columns.map((col) => {
    if (col.width) return { width: col.width };
    const maxContentLength = Math.max(
      col.header.length,
      ...data.map((row) => String(row[col.key] || "").length)
    );

    return { width: Math.min(Math.max(maxContentLength + 2, 10), 50) };
  });

  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const dataBlob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(
    dataBlob,
    `${sheetName}_${new Date().toISOString().slice(0, 10)}.xlsx`
  );
};
