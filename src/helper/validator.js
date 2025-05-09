import { getFieldValue } from "./scapper.js";

export const validationChecks = {
  "Entity Type": "CARRIER",
  "USDOT Status": "ACTIVE",
  "Operating Authority Status": "AUTHORIZED FOR Property",
};

export const requiredValues = [
  "Entity Type",
  "USDOT Status",
  "USDOT Number",
  "MCS-150 Form Date",
  "Operating Authority Status",
  "MC/MX/FF Number(s)",
  "Legal Name",
  "Physical Address",
  "Phone",
  "Mailing Address",
];

export function validateActiveTable(el) {
  for (const [key, value] of Object.entries(validationChecks)) {
    const actual = getFieldValue(el, key);
    if (!actual || !actual.trim().includes(value.toUpperCase())) {
      return false;
    }
  }

  const phone = getFieldValue(el, "Phone");
  if (!phone || phone.trim().length < 2) {
    return false;
  }

  return true;
}
