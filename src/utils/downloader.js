import { removefmcsaRecords } from "../helper/storage.js";

export function downloadJSONAsCSV(jsonArray, filename = `data.csv`) {
  if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
    console.warn("Invalid or empty JSON data.");
    return;
  }

  const headers = Object.keys(jsonArray[0]);
  const csvRows = [headers.join(",")];

  for (const row of jsonArray) {
    const values = headers.map((header) => {
      let val = row[header] || "";
      val = val
        .toString()
        .replace(/"/g, '""')
        .replace(/\n/g, " ")
        .replace(/\u00A0/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      return `"${val}"`;
    });
    csvRows.push(values.join(","));
  }

  const csvContent = csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  removefmcsaRecords();
}
