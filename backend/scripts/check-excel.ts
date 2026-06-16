import ExcelJS from "exceljs";
import path from "path";

async function main() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(path.resolve("/Users/anoop/FY BTECH/Sem-4/TagX/TagX_Financial_Model.xlsx"));

  wb.eachSheet(sheet => {
    console.log(`\n=== ${sheet.name} ===`);
    let n = 0;
    sheet.eachRow((row, i) => {
      const vals: {c: number; v: unknown}[] = [];
      row.eachCell((cell, j) => {
        const v = cell.value;
        if (v === 0 && String(row.getCell(1).value) !== "") vals.push({c: j, v});
        else if (typeof v === "number" && isNaN(v)) vals.push({c: j, v: "NaN"});
        else if (typeof v === "string" && v.includes("NaN")) vals.push({c: j, v: "NaN_in_string"});
      });
      if (vals.length > 0) {
        n++;
        if (n <= 5) console.log(`  Row ${i}: "${row.getCell(1).value}" → ${vals.map(x => `C${x.c}=${x.v}`).join(", ")}`);
      }
    });
    if (n > 5) console.log(`  ... and ${n-5} more rows with unexpected zeros`);
    else if (n === 0) console.log("  (all OK)");
  });

  // Print all cells in Dashboard
  console.log("\n=== DASHBOARD FULL ===");
  const dash = wb.getWorksheet("Dashboard");
  dash.eachRow((row, i) => {
    if (i === 1) return; // header
    const vals: string[] = [];
    row.eachCell((cell, j) => vals.push(String(cell.value)));
    if (vals.some(v => v !== "undefined" && v !== "" && v !== "null"))
      console.log(vals.join("\t"));
  });
}
main().catch(console.error);
