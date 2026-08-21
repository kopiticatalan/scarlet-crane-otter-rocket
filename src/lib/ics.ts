import { matterCaption, caseLabel, short } from "@/lib/utils";
import type { Matter } from "@/lib/types";
import { parseDmy } from "@/lib/dates";

function esc(s: string) {
  return (s || "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export function buildIcs(matters: Matter[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Bombay HC Matter Tracker//EN",
    "CALSCALE:GREGORIAN",
  ];
  let n = 0;
  for (const m of matters) {
    const name = short(matterCaption(m.petitioner, m.respondent), 80);
    const caseno = caseLabel(m);
    const seen = new Set<string>();
    for (const [field, label] of [
      ["next_listing", "Listing"],
      ["next_hearing", "Hearing"],
    ] as const) {
      const d = parseDmy(m[field]);
      if (!d || d < today) continue;
      const key = d.toISOString().slice(0, 10);
      if (seen.has(key)) continue;
      seen.add(key);
      n += 1;
      const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
      const uid = `bhc-${m.id.replace(/\W/g, "")}-${field}-${ymd}@bhcmt`;
      lines.push(
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${ymd}`,
        `SUMMARY:${esc(`${label} — ${name} (${caseno})`)}`,
        `DESCRIPTION:${esc(`Bombay HC Matter Tracker · ${caseno}`)}`,
        "END:VEVENT",
      );
    }
  }
  lines.push("END:VCALENDAR");
  return { ics: lines.join("\r\n") + "\r\n", events: n };
}

export function downloadIcs(filename: string, ics: string) {
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
