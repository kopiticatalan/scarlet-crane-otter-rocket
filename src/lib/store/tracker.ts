import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ActivityEvent,
  HearingNote,
  ListingsState,
  ListingRow,
  LookupParams,
  Matter,
  NextStep,
  OrderMeta,
  TrackerSettings,
} from "@/lib/types";
import { DEFAULT_SETTINGS, NCLT_BENCHES, SIDE_LABEL, STAMP_LABEL } from "@/lib/types";
import type { CourtLookup } from "@/lib/types";
import { SAMPLE_MATTERS, sampleListings } from "@/lib/sample-data";
import { clockNow, prettyCourtDay } from "@/lib/dates";
import { matterCasenos, uid } from "@/lib/utils";

function seedListings(): ListingsState {
  const days = [0, 1].map((off) => {
    const d = new Date();
    d.setDate(d.getDate() + off);
    return prettyCourtDay(d);
  });
  return {
    generated_at: "",
    days,
    range_label: `${days[0].short} – ${days[1].short}`,
    num_days: 5,
    rows: sampleListings(),
    scanning: false,
  };
}

function annotate(rows: ListingRow[], matters: Matter[]): ListingRow[] {
  const byNo = new Map<string, Matter>();
  for (const m of matters) {
    for (const cn of matterCasenos(m)) byNo.set(cn.toUpperCase(), m);
  }
  return rows.map((row) => {
    const m = byNo.get((row.number || "").toUpperCase());
    const reasons = (row.reasons || []).filter((r) => r !== "Your matter");
    if (m) {
      return {
        ...row,
        tracked: true,
        add: null,
        reasons: ["Your matter", ...reasons],
        mid: m.id,
        matter:
          `${m.petitioner || ""} v ${m.respondent || ""}`.trim().replace(/^v | v$/g, "") ||
          row.matter,
      };
    }
    const mm = (row.number || "").match(/^([A-Z]+)(\(L\))?\/(\d+)\/(\d{4})$/i);
    return {
      ...row,
      tracked: false,
      mid: null,
      reasons,
      add:
        row.source === "sat" || row.source === "nclt"
          ? row.add
          : mm
            ? {
                forum: "bhc" as const,
                abbr: mm[1],
                stampreg: mm[2] ? "S" : "R",
                no: mm[3],
                year: mm[4],
              }
            : row.add,
    };
  });
}

export function matterFromLookup(
  params: LookupParams & { type_name: string },
  lookup: CourtLookup,
  existing?: Matter,
): Matter {
  const newest = [...lookup.orders].sort((a, b) => {
    const pa = a.date.split("/").reverse().join("");
    const pb = b.date.split("/").reverse().join("");
    return pb.localeCompare(pa);
  })[0];
  const forum = params.forum === "sat" ? "sat" : params.forum === "nclt" ? "nclt" : "bhc";
  const caseNo =
    forum === "sat"
      ? String(params.case_no).replace(/\D/g, "").padStart(4, "0")
      : params.case_no;
  const ncltBench = NCLT_BENCHES.find((b) => b.value === (params.bench || "9"))?.label || "Mumbai";
  const id =
    existing?.id ||
    (forum === "sat"
      ? ["sat", params.case_type, caseNo, params.year].join("|")
      : forum === "nclt"
        ? ["nclt", params.bench || "9", params.case_type, caseNo, params.year].join("|")
        : [params.side, params.stampreg, params.case_type, params.case_no, params.year].join("|"));
  const base: Matter = {
    id,
    forum,
    bench: forum === "nclt" ? params.bench || "9" : existing?.bench,
    bench_label: forum === "nclt" ? ncltBench : existing?.bench_label,
    side: (forum === "bhc" ? params.side : "2") as Matter["side"],
    side_label:
      forum === "sat"
        ? "SAT · Mumbai"
        : forum === "nclt"
          ? `NCLT · ${ncltBench}`
          : SIDE_LABEL[params.side as Matter["side"]] || params.side,
    stampreg: params.stampreg,
    stampreg_label:
      forum === "sat"
        ? params.type_name.split(" - ")[0] || "Appeal"
        : forum === "nclt"
          ? params.type_name.split(" (")[0] || "Petition"
          : STAMP_LABEL[params.stampreg],
    case_type: params.case_type,
    type_name: params.type_name,
    case_no: caseNo,
    year: params.year,
    petitioner: lookup.petitioner,
    respondent: lookup.respondent,
    cnr: lookup.cnr,
    filed_on: lookup.filed_on,
    registration_date: lookup.registration_date,
    status: lookup.status,
    disposal_date: lookup.disposal_date,
    lodging: lookup.lodging,
    petitioner_adv: lookup.petitioner_adv,
    respondent_adv: lookup.respondent_adv,
    stage: lookup.stage,
    act: lookup.act,
    partner: existing?.partner || "",
    associates: existing?.associates || "",
    next_hearing: existing?.next_hearing || "",
    next_listing: lookup.next_listing || existing?.next_listing || "",
    last_listing: newest?.date || existing?.last_listing || "",
    last_coram: newest?.coram || lookup.last_coram || existing?.last_coram || "",
    hearing_notes: existing?.hearing_notes || [],
    next_steps: existing?.next_steps || [],
    tags: existing?.tags || [],
    order_count: lookup.orders.length,
    orders: lookup.orders.map((o) => {
      const prev = existing?.orders.find((x) => x.key === o.key);
      return {
        ...o,
        downloaded: prev?.downloaded ?? false,
        excerpt: prev?.excerpt,
      };
    }),
    added_at: existing?.added_at || clockNow(),
    last_refresh: clockNow(),
    last_added: 0,
    sample: false,
  };
  return base;
}

type TrackerState = {
  matters: Matter[];
  settings: TrackerSettings;
  listings: ListingsState;
  activity: ActivityEvent[];
  onboarded: boolean;
  hydrated: boolean;
  setHydrated: () => void;
  loadSample: () => void;
  clearSample: () => void;
  upsertMatter: (m: Matter) => void;
  updateMatter: (id: string, patch: Partial<Matter>) => void;
  removeMatter: (id: string) => void;
  setOrders: (id: string, orders: OrderMeta[], extra?: Partial<Matter>) => void;
  addNote: (id: string, note: Omit<HearingNote, "id" | "createdAt">) => void;
  setNotes: (id: string, notes: HearingNote[]) => void;
  setSteps: (id: string, steps: NextStep[]) => void;
  toggleStep: (id: string, stepId: string, done: boolean) => void;
  addStep: (id: string, step: Omit<NextStep, "id">) => void;
  setSettings: (s: Partial<TrackerSettings>) => void;
  setListings: (l: Partial<ListingsState>) => void;
  mergeListingRows: (rows: ListingRow[], days: ListingsState["days"], numDays: number) => void;
  log: (kind: ActivityEvent["kind"], title: string, detail?: string) => void;
  importMatters: (incoming: Matter[]) => { added: number; updated: number };
  replaceAll: (payload: {
    matters: Matter[];
    settings?: TrackerSettings;
    listings?: ListingsState;
  }) => void;
  resetAll: () => void;
};

export const useTracker = create<TrackerState>()(
  persist(
    (set, get) => ({
      matters: SAMPLE_MATTERS,
      settings: DEFAULT_SETTINGS,
      listings: seedListings(),
      activity: [],
      onboarded: false,
      hydrated: false,
      setHydrated: () => {
        const s = get();
        if (!s.onboarded && s.matters.length === 0) {
          set({
            hydrated: true,
            onboarded: true,
            matters: SAMPLE_MATTERS,
            listings: seedListings(),
            activity: [
              {
                id: uid(),
                at: clockNow(),
                kind: "import",
                title: "Sample practice loaded",
                detail: "Four Bombay HC matters so you can explore the desk.",
              },
            ],
          });
          return;
        }
        set({
          hydrated: true,
          onboarded: true,
          listings: {
            ...s.listings,
            rows: annotate(s.listings.rows, s.matters),
          },
        });
      },
      loadSample: () => {
        const existing = new Set(get().matters.map((m) => m.id));
        const add = SAMPLE_MATTERS.filter((m) => !existing.has(m.id));
        set({ matters: [...get().matters, ...add] });
        get().log("import", `Loaded ${add.length} sample matter(s)`);
      },
      clearSample: () => {
        set({ matters: get().matters.filter((m) => !m.sample) });
        get().log("import", "Removed sample matters");
      },
      upsertMatter: (m) => {
        const rest = get().matters.filter((x) => x.id !== m.id);
        const matters = [...rest, m];
        set({
          matters,
          listings: {
            ...get().listings,
            rows: annotate(get().listings.rows, matters),
          },
        });
      },
      updateMatter: (id, patch) => {
        set({
          matters: get().matters.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        });
      },
      removeMatter: (id) => {
        const matters = get().matters.filter((m) => m.id !== id);
        set({
          matters,
          listings: {
            ...get().listings,
            rows: annotate(get().listings.rows, matters),
          },
        });
      },
      setOrders: (id, orders, extra) => {
        set({
          matters: get().matters.map((m) =>
            m.id === id
              ? {
                  ...m,
                  orders,
                  order_count: orders.length,
                  last_refresh: clockNow(),
                  ...extra,
                }
              : m,
          ),
        });
      },
      addNote: (id, note) => {
        const n: HearingNote = { ...note, id: uid(), createdAt: clockNow() };
        set({
          matters: get().matters.map((m) =>
            m.id === id ? { ...m, hearing_notes: [n, ...m.hearing_notes] } : m,
          ),
        });
      },
      setNotes: (id, notes) => {
        set({
          matters: get().matters.map((m) =>
            m.id === id ? { ...m, hearing_notes: notes } : m,
          ),
        });
      },
      setSteps: (id, steps) => {
        set({
          matters: get().matters.map((m) =>
            m.id === id ? { ...m, next_steps: steps } : m,
          ),
        });
      },
      toggleStep: (id, stepId, done) => {
        set({
          matters: get().matters.map((m) =>
            m.id === id
              ? {
                  ...m,
                  next_steps: m.next_steps.map((s) =>
                    s.id === stepId ? { ...s, done } : s,
                  ),
                }
              : m,
          ),
        });
      },
      addStep: (id, step) => {
        const s: NextStep = { ...step, id: uid() };
        set({
          matters: get().matters.map((m) =>
            m.id === id ? { ...m, next_steps: [...m.next_steps, s] } : m,
          ),
        });
      },
      setSettings: (s) => set({ settings: { ...get().settings, ...s } }),
      setListings: (l) => set({ listings: { ...get().listings, ...l } }),
      mergeListingRows: (rows, days, numDays) => {
        const prev = get().listings.rows;
        const map = new Map<string, ListingRow>();
        for (const r of prev) {
          map.set([r.date_full, r.judge, r.court, r.serial, r.number].join("|"), r);
        }
        for (const r of rows) {
          map.set([r.date_full, r.judge, r.court, r.serial, r.number].join("|"), r);
        }
        const merged = annotate([...map.values()], get().matters).sort((a, b) => {
          const da = Date.parse(a.date_full) || 0;
          const db = Date.parse(b.date_full) || 0;
          if (da !== db) return da - db;
          const ca = Number(a.court) || 9999;
          const cb = Number(b.court) || 9999;
          if (ca !== cb) return ca - cb;
          return (Number(a.serial) || 9999) - (Number(b.serial) || 9999);
        });
        const label = days.length
          ? `${days[0].short} – ${days[days.length - 1].short}`
          : "";
        set({
          listings: {
            generated_at: clockNow(),
            days,
            range_label: label,
            num_days: numDays,
            rows: merged,
            scanning: false,
          },
        });
      },
      log: (kind, title, detail) => {
        const ev: ActivityEvent = { id: uid(), at: clockNow(), kind, title, detail };
        set({ activity: [ev, ...get().activity].slice(0, 60) });
      },
      importMatters: (incoming) => {
        const byId = new Map(get().matters.map((m) => [m.id, m]));
        let added = 0;
        let updated = 0;
        for (const m of incoming) {
          if (byId.has(m.id)) {
            const old = byId.get(m.id)!;
            byId.set(m.id, {
              ...old,
              ...m,
              partner: m.partner || old.partner,
              associates: m.associates || old.associates,
              hearing_notes: m.hearing_notes?.length ? m.hearing_notes : old.hearing_notes,
              next_steps: m.next_steps?.length ? m.next_steps : old.next_steps,
              sample: false,
            });
            updated += 1;
          } else {
            byId.set(m.id, { ...m, sample: false });
            added += 1;
          }
        }
        const matters = [...byId.values()];
        set({
          matters,
          listings: {
            ...get().listings,
            rows: annotate(get().listings.rows, matters),
          },
        });
        return { added, updated };
      },
      replaceAll: (payload) => {
        set({
          matters: payload.matters,
          settings: payload.settings || get().settings,
          listings: payload.listings
            ? { ...payload.listings, rows: annotate(payload.listings.rows, payload.matters) }
            : get().listings,
        });
      },
      resetAll: () => {
        set({
          matters: [],
          listings: {
            generated_at: "",
            days: [],
            range_label: "",
            num_days: 5,
            rows: [],
            scanning: false,
          },
          activity: [],
          settings: DEFAULT_SETTINGS,
        });
      },
    }),
    {
      name: "bhc-matter-tracker-v1",
      skipHydration: true,
      partialize: (s) => ({
        matters: s.matters,
        settings: s.settings,
        listings: {
          ...s.listings,
          scanning: false,
        },
        activity: s.activity,
        onboarded: s.onboarded,
      }),
    },
  ),
);

export function allOpenTasks(matters: Matter[]) {
  const out: { matter: Matter; step: NextStep }[] = [];
  for (const m of matters) {
    for (const step of m.next_steps) {
      if (!step.done) out.push({ matter: m, step });
    }
  }
  return out;
}
