import { getFieldValue, goToSnapshot, submitQuery } from "./helper/scapper.js";
import {
  clearAllStorage,
  getCurrent,
  getfmcsaRecords,
  getRange,
  saveCurrent,
  STORAGE,
} from "./helper/storage.js";
import { addFloatingToolbar, showRangeForm } from "./helper/ui.js";
import { requiredValues, validateActiveTable } from "./helper/validator.js";
import { downloadJSONAsCSV } from "./utils/downloader.js";

addFloatingToolbar();

const shouldRun = localStorage.getItem(STORAGE.runFlag) === "true";
const rangeSet = localStorage.getItem(STORAGE.rangeSetFlag) === "true";

function handleSnapshotPage() {
  if (shouldRun && !rangeSet) {
    showRangeForm();
    return;
  }

  if (shouldRun && rangeSet) {
    const { start, end } = getRange();
    const current = getCurrent();

    if (current <= end) {
      setTimeout(() => submitQuery(current), 2000);
    } else {
      alert("✅ Completed MX/MC range.");
      downloadJSONAsCSV(
        getfmcsaRecords(),
        `Record of ${start}-${end} at ${new Date().toLocaleDateString()}.csv`
      );
      clearAllStorage();
    }
  }
}

function handleQueryPage() {
  const { end } = getRange();
  let current = getCurrent();
  const table = document.querySelector("table");
  if (!table) return;

  const text = table.innerText;

  if (text.includes("Record Inactive") || text.includes("Record Not Found")) {
    // console.log(`❌ MX ${current} is inactive.`);

    current++;
    saveCurrent(current);
    setTimeout(() => goToSnapshot(), 2000);
  } else if (text.includes("USDOT INFORMATION")) {
    // console.log(`✅ Active record found for MX ${current}`);
    const isValid = validateActiveTable(table);

    if (isValid) {
      const data = {};
      requiredValues.forEach((key) => {
        data[key] = getFieldValue(table, key) || "NOT FOUND";
      });

      const allData = getfmcsaRecords();
      const isDuplicate = allData.some(
        (item) => item["USDOT Number"] === data["USDOT Number"]
      );
      if (!isDuplicate) {
        allData.push(data);
        localStorage.setItem("fmcsa_records", JSON.stringify(allData));
      }
    }

    current++;
    saveCurrent(current);
  }

  if (current <= end) {
    setTimeout(() => submitQuery(current), 1500);
  } else {
    const { start, end } = getRange();
    downloadJSONAsCSV(
      getfmcsaRecords(),
      `Record of ${start}-${end} at ${new Date().toLocaleDateString()}.csv`
    );
    alert("✅ Finished checking all numbers.");
    clearAllStorage();
    setTimeout(() => goToSnapshot(), 2000);
  }
}

if (location.href.includes("CompanySnapshot.aspx")) {
  handleSnapshotPage();
} else if (location.href.includes("query.asp") && shouldRun && rangeSet) {
  handleQueryPage();
}
