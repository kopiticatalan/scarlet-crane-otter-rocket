const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function parseDmy(s?: string | null): Date | null {
  const m = String(s || "").match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (!m) return null;
  const d = new Date(+m[3], +m[2] - 1, +m[1]);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function parseIso(s?: string | null): Date | null {
  if (!s) return null;
  const dmy = parseDmy(s);
  if (dmy) return dmy;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  const en = String(s).match(/^(\d{1,2})\s+([A-Za-z]{3,9})\.?\s+(\d{4})$/);
  if (en) {
    const months: Record<string, number> = {
      jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
      jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
    };
    const mon = months[en[2].slice(0, 3).toLowerCase()];
    if (mon != null) return new Date(Number(en[3]), mon, Number(en[1]));
  }
  const dash = String(s).match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (dash) return new Date(Number(dash[3]), Number(dash[2]) - 1, Number(dash[1]));
  return null;
}

export function toIsoDate(s?: string | null): string {
  const d = parseIso(s);
  if (!d) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function fromIsoDate(s?: string | null): string {
  if (!s) return "";
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return s;
  return `${m[3]}/${m[2]}/${m[1]}`;
}

export function fmtDate(s?: string | null): string {
  const d = parseIso(s);
  if (!d) return s || "—";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function fmtDateShort(s?: string | null): string {
  const d = parseIso(s);
  if (!d) return s || "—";
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`;
}

export function todayIso(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function startOfDay(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function daysFromToday(s?: string | null, now = new Date()): number | null {
  const d = parseIso(s);
  if (!d) return null;
  return Math.round((startOfDay(d).getTime() - startOfDay(now).getTime()) / 86400000);
}

export type DateKind = "overdue" | "today" | "tomorrow" | "soon" | "";

export function dateKind(s?: string | null): DateKind {
  const n = daysFromToday(s);
  if (n === null) return "";
  if (n < 0) return "overdue";
  if (n === 0) return "today";
  if (n === 1) return "tomorrow";
  if (n <= 7) return "soon";
  return "";
}

export function courtDateDdMm(d: Date) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${d.getFullYear()}`;
}

export function prettyCourtDay(d: Date) {
  return {
    date: courtDateDdMm(d),
    short: `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`,
    full: `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`,
  };
}

export function clockNow() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export { MONTHS };
