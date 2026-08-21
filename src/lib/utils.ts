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

export function forumOf(m: { forum?: string }) {
  if (m.forum === "sat") return "sat";
  if (m.forum === "nclt") return "nclt";
  return "bhc";
}

export function caseLabel(m: {
  forum?: string;
  type_name?: string;
  case_no?: string;
  year?: string;
  stampreg?: string;
  lodging?: string;
  bench_label?: string;
}) {
  if (forumOf(m) === "nclt") {
    return m.lodging || `${(m.type_name || "NCLT").split(" (")[0]} ${m.case_no}/${m.year}`;
  }
  const no = m.case_no || "—";
  const yr = m.year || "—";
  if (forumOf(m) === "sat") {
    const kind = (m.type_name || "SEBI").split(" - ")[0].trim() || "SEBI";
    return `${kind} ${no}/${yr}`;
  }
  const abbr = (m.type_name || "").split(" - ")[0].trim() || "Case";
  if (m.stampreg === "S") return `${abbr}(L)/${no}/${yr}`;
  return `${abbr}/${no}/${yr}`;
}

export function matterCasenos(m: {
  forum?: string;
  type_name?: string;
  case_no?: string;
  year?: string;
  stampreg?: string;
  cnr?: string;
  lodging?: string;
}) {
  const out = [caseLabel(m).toUpperCase()];
  if (m.cnr) out.push(m.cnr.toUpperCase());
  if (forumOf(m) === "sat") {
    const no = (m.case_no || "").replace(/\D/g, "");
    const yr = m.year || "";
    const kind = (m.type_name || "SEBI").split(" - ")[0].trim().toUpperCase();
    const padded = no.length >= 4 ? no : no.padStart(4, "0");
    if (padded && yr) {
      out.push(`${kind}/${padded}/${yr}`);
      out.push(`${padded}/${yr}`);
      out.push(`APPEAL - ${padded}/${yr}`);
    }
    if (m.lodging) out.push(String(m.lodging).toUpperCase());
  }
  if (forumOf(m) === "nclt") {
    const no = (m.case_no || "").replace(/\D/g, "");
    const yr = m.year || "";
    if (m.lodging) out.push(String(m.lodging).toUpperCase());
    if (no && yr) {
      out.push(`${no}/${yr}`);
      out.push(`${no}(MB)${yr}`);
      out.push(`${no}/MB/${yr}`);
    }
  }
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
