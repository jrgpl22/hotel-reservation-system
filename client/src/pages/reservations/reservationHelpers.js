// Small formatting/date helpers used only by the reservations module.
// (utils/formatters.js is Jerome's file and is empty, so these live here.)

const PESO = '\u20B1';

export const formatPeso = (amount) => `${PESO}${Number(amount || 0).toLocaleString()}`;

// Reservation dates are stored as UTC midnight, so display them in UTC
// to avoid showing the previous day.
export const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('en-PH', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : '';

// createdAt is a real timestamp, so show it in the viewer's own timezone.
export const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString('en-PH', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : '';

// Today as "YYYY-MM-DD" in the user's local timezone (for <input type="date" min>).
export const todayISO = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// "2026-09-30" + 1 -> "2026-10-01"
export const addDaysISO = (iso, days) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};