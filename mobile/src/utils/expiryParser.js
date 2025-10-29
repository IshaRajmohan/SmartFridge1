// utils/expiryParser.js
export function parseExpiry(expiry) {
  const today = new Date();

  // If expiry contains "/" assume dd/mm/yyyy
  if (expiry.includes("/")) {
    const [day, month, year] = expiry.split("/").map(Number);
    return new Date(year, month - 1, day);
  }

  // If expiry contains "day" or "days"
  if (expiry.toLowerCase().includes("day")) {
    const days = parseInt(expiry);
    return new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
  }

  // If expiry contains "hour" or "hours"
  if (expiry.toLowerCase().includes("hour")) {
    const hours = parseInt(expiry);
    return new Date(today.getTime() + hours * 60 * 60 * 1000);
  }

  // If expiry contains month name, e.g., "November"
  const monthNames = [
    "january", "february", "march", "april", "may", "june",
    "july", "august", "september", "october", "november", "december"
  ];
  const monthIndex = monthNames.findIndex(m => expiry.toLowerCase() === m);
  if (monthIndex !== -1) {
    const year = today.getFullYear();
    return new Date(year, monthIndex + 1, 0); // last day of the month
  }

  // fallback: today
  return today;
}
