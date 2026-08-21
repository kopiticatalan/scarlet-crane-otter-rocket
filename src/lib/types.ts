export type Side = "1" | "2";
export type StampReg = "R" | "S";

export type LookupParams = {
  side: string;
  stampreg: StampReg;
  case_type: string;
  case_no: string;
  year: string;
};

export type CaseType = {
  value: string;
  label: string;
};

export type NextStep = {
  id: string;
  text: string;
  done: boolean;
  due: string;
};

export type HearingNote = {
  id: string;
  text: string;
  date: string;
  createdAt: string;
};

export type OrderMeta = {
  key: string;
  srl: string;
  date: string;
  doc: string;
  coram: string;
  downloaded: boolean;
  excerpt?: string;
};

export type Matter = {
  id: string;
  side: Side;
  side_label: string;
  stampreg: StampReg;
  stampreg_label: string;
  case_type: string;
  type_name: string;
  case_no: string;
  year: string;
  petitioner: string;
  respondent: string;
  cnr: string;
  filed_on: string;
  registration_date: string;
  status: string;
  disposal_date: string;
  lodging: string;
  petitioner_adv: string;
  respondent_adv: string;
  stage: string;
  act: string;
  partner: string;
  associates: string;
  next_hearing: string;
  next_listing: string;
  last_listing: string;
  last_coram: string;
  hearing_notes: HearingNote[];
  next_steps: NextStep[];
  tags: string[];
  order_count: number;
  orders: OrderMeta[];
  added_at: string;
  last_refresh: string;
  last_added: number;
  sample?: boolean;
};

export type ListingRow = {
  date: string;
  date_full: string;
  date_ddmm: string;
  matter: string;
  number: string;
  serial: string;
  list_type: string;
  judge: string;
  court: string;
  caption: string;
  connected: string;
  reasons: string[];
  tracked: boolean;
  mid?: string | null;
  add?: {
    abbr: string;
    stampreg: StampReg;
    no: string;
    year: string;
  } | null;
};

export type ListingsState = {
  generated_at: string;
  days: { date: string; short: string; full: string }[];
  range_label: string;
  num_days: number;
  rows: ListingRow[];
  scanning?: boolean;
};

export type TrackerSettings = {
  watched: string[];
  scan_days: number;
  notify: boolean;
};

export type ActivityEvent = {
  id: string;
  at: string;
  kind: "add" | "refresh" | "scan" | "task" | "note" | "import" | "download";
  title: string;
  detail?: string;
};

export type CourtLookup = {
  petitioner: string;
  respondent: string;
  cnr: string;
  filed_on: string;
  registration_date: string;
  status: string;
  disposal_date: string;
  lodging: string;
  next_listing: string;
  petitioner_adv: string;
  respondent_adv: string;
  stage: string;
  act: string;
  last_coram: string;
  orders: Omit<OrderMeta, "downloaded" | "excerpt">[];
};

export const SIDE_LABEL: Record<Side, string> = {
  "1": "Appellate Side",
  "2": "Original Side",
};

export const STAMP_LABEL: Record<StampReg, string> = {
  R: "Register",
  S: "Stamp",
};

export const DEFAULT_SETTINGS: TrackerSettings = {
  watched: ["Bharucha & Partners", "Advani & Co.", "Advani Law LLP"],
  scan_days: 5,
  notify: true,
};
