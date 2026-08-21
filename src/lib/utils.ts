import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function short(s: string | undefined | null, n = 55) {
  const t = (s ?? "").trim();
  return t.length > n ? t.slice(0, n).trim() : t;
}

export function matterCaption(petitioner?: string, respondent?: string) {
  const a = (petitioner || "—").trim();
  const b = (respondent || "—").trim();
  return `${a} v ${b}`;
}

export function caseLabel(m: {
  type_name?: string;
  case_no?: string;
  year?: string;
  stampreg?: string;
}) {
  const abbr = (m.type_name || "").split(" - ")[0].trim() || "Case";
  const no = m.case_no || "—";
  const yr = m.year || "—";
  if (m.stampreg === "S") return `${abbr}(L)/${no}/${yr}`;
  return `${abbr}/${no}/${yr}`;
}

export function matterCasenos(m: {
  type_name?: string;
  case_no?: string;
  year?: string;
  stampreg?: string;
  cnr?: string;
}) {
  const out = [caseLabel(m).toUpperCase()];
  if (m.cnr) out.push(m.cnr.toUpperCase());
  return out;
}

export function greeting(now = new Date()) {
  const hour = Number(
    new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      hour12: false,
    }).format(now),
  );
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export const fieldSelect =
  "field-select max-w-full min-w-0 appearance-none";
