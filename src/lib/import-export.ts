import type { HearingNote, Matter, NextStep } from "@/lib/types";
import { SIDE_LABEL, STAMP_LABEL } from "@/lib/types";
import { uid } from "@/lib/utils";
import { clockNow } from "@/lib/dates";

function asSteps(raw: unknown): NextStep[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((s) => {
      if (typeof s === "string") return { id: uid(), text: s, done: false, due: "" };
      if (s && typeof s === "object") {
        const o = s as Record<string, unknown>;
        return {
          id: String(o.id || uid()),
          text: String(o.text || ""),
          done: Boolean(o.done),
          due: String(o.due || ""),
        };
      }
      return null;
    })
    .filter((s): s is NextStep => !!s && !!s.text);
}

function asNotes(raw: unknown): HearingNote[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((n) => {
      if (typeof n === "string") {
        return { id: uid(), text: n, date: "", createdAt: clockNow() };
      }
      if (n && typeof n === "object") {
        const o = n as Record<string, unknown>;
        const text = String(o.text || n);
        return {
          id: String(o.id || uid()),
          text,
          date: String(o.date || ""),
          createdAt: String(o.createdAt || clockNow()),
        };
      }
      return null;
    })
    .filter((n): n is HearingNote => !!n && !!n.text);
}

export function normalizeImportedMatter(raw: Record<string, unknown>): Matter | null {
  const side = String(raw.side || "2") as Matter["side"];
  const stampreg = String(raw.stampreg || "R") as Matter["stampreg"];
  const case_type = String(raw.case_type || "");
  const case_no = String(raw.case_no || "");
  const year = String(raw.year || "");
  if (!case_type || !case_no || !year) return null;
  const id =
    String(raw.id || "") ||
    [side, stampreg, case_type, case_no, year].join("|");
  return {
    id,
    side: side === "1" ? "1" : "2",
    side_label: String(raw.side_label || SIDE_LABEL[side === "1" ? "1" : "2"]),
    stampreg: stampreg === "S" ? "S" : "R",
    stampreg_label: String(raw.stampreg_label || STAMP_LABEL[stampreg === "S" ? "S" : "R"]),
    case_type,
    type_name: String(raw.type_name || ""),
    case_no,
    year,
    petitioner: String(raw.petitioner || ""),
    respondent: String(raw.respondent || ""),
    cnr: String(raw.cnr || ""),
    filed_on: String(raw.filed_on || ""),
    registration_date: String(raw.registration_date || ""),
    status: String(raw.status || ""),
    disposal_date: String(raw.disposal_date || ""),
    lodging: String(raw.lodging || ""),
    petitioner_adv: String(raw.petitioner_adv || ""),
    respondent_adv: String(raw.respondent_adv || ""),
    stage: String(raw.stage || ""),
    act: String(raw.act || ""),
    partner: String(raw.partner || ""),
    associates: String(raw.associates || ""),
    next_hearing: String(raw.next_hearing || ""),
    next_listing: String(raw.next_listing || ""),
    last_listing: String(raw.last_listing || ""),
    last_coram: String(raw.last_coram || ""),
    hearing_notes: asNotes(raw.hearing_notes),
    next_steps: asSteps(raw.next_steps),
    tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
    order_count: Number(raw.order_count || 0),
    orders: Array.isArray(raw.orders)
      ? raw.orders.map((o) => {
          const x = (o || {}) as Record<string, unknown>;
          return {
            key: String(x.key || `${x.date || ""}|${x.doc || ""}`),
            srl: String(x.srl || ""),
            date: String(x.date || ""),
            doc: String(x.doc || ""),
            coram: String(x.coram || ""),
            downloaded: Boolean(x.downloaded),
            excerpt: x.excerpt ? String(x.excerpt) : undefined,
          };
        })
      : [],
    added_at: String(raw.added_at || clockNow()),
    last_refresh: String(raw.last_refresh || ""),
    last_added: Number(raw.last_added || 0),
    sample: false,
  };
}

export function parseImportPayload(json: unknown): Matter[] {
  const list = Array.isArray(json)
    ? json
    : json && typeof json === "object" && Array.isArray((json as { matters?: unknown }).matters)
      ? ((json as { matters: unknown[] }).matters)
      : [];
  return list
    .map((row) =>
      row && typeof row === "object"
        ? normalizeImportedMatter(row as Record<string, unknown>)
        : null,
    )
    .filter((m): m is Matter => !!m);
}
