import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as createRootRoute, b as useRouter, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as object, i as number, o as string, r as literal, s as union } from "../_libs/zod.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as Provider } from "../_libs/radix-ui__react-tooltip.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Bf7uN__Z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var SIDE_LABEL = {
	"1": "Appellate Side",
	"2": "Original Side"
};
var STAMP_LABEL = {
	R: "Register",
	S: "Stamp"
};
var DEFAULT_SETTINGS = {
	watched: [
		"Bharucha & Partners",
		"Advani & Co.",
		"Advani Law LLP"
	],
	scan_days: 5,
	notify: true
};
var now = "2026-08-21 09:00";
function isoDays(offset) {
	const d = /* @__PURE__ */ new Date();
	d.setDate(d.getDate() + offset);
	return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
}
function iso(offset) {
	const d = /* @__PURE__ */ new Date();
	d.setDate(d.getDate() + offset);
	return d.toISOString().slice(0, 10);
}
var SAMPLE_MATTERS = [
	{
		id: "2|R|560|1842|2024",
		side: "2",
		side_label: "Original Side",
		stampreg: "R",
		stampreg_label: "Register",
		case_type: "560",
		type_name: "WP - WRIT PETITION",
		case_no: "1842",
		year: "2024",
		petitioner: "Meridian Logistics Pvt. Ltd.",
		respondent: "State of Maharashtra & Ors.",
		cnr: "HCBM020184212024",
		filed_on: "12/02/2024",
		registration_date: "18/02/2024",
		status: "Pending",
		disposal_date: "",
		lodging: "WPL/4412/2024",
		petitioner_adv: "Bharucha & Partners",
		respondent_adv: "Government Pleader",
		stage: "Admission",
		act: "Constitution of India",
		partner: "N. Dahiya",
		associates: "A. Shah",
		next_hearing: isoDays(0),
		next_listing: isoDays(0),
		last_listing: isoDays(-21),
		last_coram: "Hon'ble Shri Justice G. S. Patel",
		hearing_notes: [{
			id: "n1",
			text: "Court indicated it will hear the stay application with the connected notice of motion. File the additional affidavit of the transport commissioner before the next date.",
			date: iso(-21),
			createdAt: now
		}],
		next_steps: [{
			id: "t1",
			text: "File additional affidavit of the Transport Commissioner",
			done: false,
			due: iso(0)
		}, {
			id: "t2",
			text: "Serve convenience compilation on GP by 4 pm",
			done: false,
			due: iso(0)
		}],
		tags: ["board today"],
		order_count: 4,
		orders: [{
			key: "12/02/2024|Notice",
			srl: "4",
			date: "12/02/2024",
			doc: "Notice",
			coram: "Hon'ble Shri Justice G. S. Patel",
			downloaded: false
		}, {
			key: `${isoDays(-21)}|Interim Order`,
			srl: "1",
			date: isoDays(-21),
			doc: "Interim Order",
			coram: "Hon'ble Shri Justice G. S. Patel",
			downloaded: false,
			excerpt: "The petition is stood over. Petitioner to file the additional affidavit within two weeks. Ad-interim protection to continue till the next date of hearing."
		}],
		added_at: now,
		last_refresh: now,
		last_added: 0,
		sample: true
	},
	{
		id: "2|R|742|88|2023",
		side: "2",
		side_label: "Original Side",
		stampreg: "R",
		stampreg_label: "Register",
		case_type: "742",
		type_name: "COMS - Commercial Suit",
		case_no: "88",
		year: "2023",
		petitioner: "Harbourline Shipping Ltd.",
		respondent: "Peninsula Ports Ltd.",
		cnr: "HCBM020008882023",
		filed_on: "04/03/2023",
		registration_date: "11/03/2023",
		status: "Pending",
		disposal_date: "",
		lodging: "",
		petitioner_adv: "Advani & Co.",
		respondent_adv: "Wadia Ghandy & Co.",
		stage: "Evidence",
		act: "Commercial Courts Act",
		partner: "N. Dahiya",
		associates: "M. Iyer, R. Kapoor",
		next_hearing: isoDays(1),
		next_listing: isoDays(1),
		last_listing: isoDays(-14),
		last_coram: "Hon'ble Smt. Justice Bharati Dangre",
		hearing_notes: [{
			id: "n2",
			text: "Cross of PW-1 part-heard. Mark the remaining invoices (Ex. P-14 onwards) and keep the original bills of lading ready.",
			date: iso(-14),
			createdAt: now
		}],
		next_steps: [{
			id: "t3",
			text: "Paginate remaining invoices for PW-1 cross",
			done: false,
			due: iso(1)
		}, {
			id: "t4",
			text: "Confirm witness is available at 11 am",
			done: true,
			due: iso(-1)
		}],
		tags: ["commercial"],
		order_count: 9,
		orders: [{
			key: `${isoDays(-14)}|Farad order`,
			srl: "1",
			date: isoDays(-14),
			doc: "Farad order",
			coram: "Hon'ble Smt. Justice Bharati Dangre",
			downloaded: false
		}],
		added_at: now,
		last_refresh: now,
		last_added: 0,
		sample: true
	},
	{
		id: "2|R|743|15|2025",
		side: "2",
		side_label: "Original Side",
		stampreg: "R",
		stampreg_label: "Register",
		case_type: "743",
		type_name: "CARBP - Commercial Arbitration Petition",
		case_no: "15",
		year: "2025",
		petitioner: "Sterling Infra Projects LLP",
		respondent: "Western Grid Corporation",
		cnr: "HCBM020001552025",
		filed_on: "19/01/2025",
		registration_date: "22/01/2025",
		status: "Pending",
		disposal_date: "",
		lodging: "",
		petitioner_adv: "Bharucha & Partners",
		respondent_adv: "Cyril Amarchand Mangaldas",
		stage: "Section 9",
		act: "Arbitration and Conciliation Act",
		partner: "K. Mehta",
		associates: "A. Shah",
		next_hearing: isoDays(5),
		next_listing: isoDays(5),
		last_listing: isoDays(-30),
		last_coram: "Hon'ble Shri Justice B. P. Colabawalla",
		hearing_notes: [],
		next_steps: [{
			id: "t5",
			text: "Update note on bank guarantee invocation",
			done: false,
			due: iso(3)
		}],
		tags: ["arb"],
		order_count: 3,
		orders: [{
			key: `${isoDays(-30)}|Interim Order`,
			srl: "1",
			date: isoDays(-30),
			doc: "Interim Order",
			coram: "Hon'ble Shri Justice B. P. Colabawalla",
			downloaded: false,
			excerpt: "Status quo in respect of the two performance bank guarantees until the next date. Petitioner to serve the complete compilation on the respondent."
		}],
		added_at: now,
		last_refresh: now,
		last_added: 0,
		sample: true
	},
	{
		id: "1|R|621|402|2022",
		side: "1",
		side_label: "Appellate Side",
		stampreg: "R",
		stampreg_label: "Register",
		case_type: "621",
		type_name: "ASWP - APPELLATE SIDE WRIT PETITION",
		case_no: "402",
		year: "2022",
		petitioner: "Smt. Leela Narayan",
		respondent: "Municipal Corporation of Greater Mumbai",
		cnr: "HCBM010040222022",
		filed_on: "08/06/2022",
		registration_date: "14/06/2022",
		status: "Disposed",
		disposal_date: isoDays(-40),
		lodging: "",
		petitioner_adv: "Advani Law LLP",
		respondent_adv: "MCGM Legal",
		stage: "Disposed",
		act: "MMC Act",
		partner: "K. Mehta",
		associates: "",
		next_hearing: "",
		next_listing: "",
		last_listing: isoDays(-40),
		last_coram: "Hon'ble the Chief Justice & Hon'ble Shri Justice M. S. Sonak",
		hearing_notes: [{
			id: "n3",
			text: "Rule made absolute in part. MCGM to re-hear the demolition notice within eight weeks. Collect certified copy.",
			date: iso(-40),
			createdAt: now
		}],
		next_steps: [{
			id: "t6",
			text: "Apply for certified copy of the judgment",
			done: false,
			due: iso(-10)
		}],
		tags: ["disposed"],
		order_count: 6,
		orders: [{
			key: `${isoDays(-40)}|Judgment`,
			srl: "1",
			date: isoDays(-40),
			doc: "Judgment",
			coram: "Hon'ble the Chief Justice",
			downloaded: false
		}],
		added_at: now,
		last_refresh: now,
		last_added: 0,
		sample: true
	}
];
function sampleListings() {
	const t = /* @__PURE__ */ new Date();
	const tom = /* @__PURE__ */ new Date();
	tom.setDate(t.getDate() + 1);
	const fmt = (d) => ({
		short: `${d.getDate()} ${d.toLocaleDateString("en", { month: "short" })}`,
		full: `${d.getDate()} ${d.toLocaleDateString("en", { month: "long" })} ${d.getFullYear()}`,
		ddmm: `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`
	});
	const today = fmt(t);
	const tomorrow = fmt(tom);
	return [
		{
			date: today.short,
			date_full: today.full,
			date_ddmm: today.ddmm,
			matter: "Meridian Logistics Pvt. Ltd. v State of Maharashtra & Ors.",
			number: "WP/1842/2024",
			serial: "12",
			list_type: "Daily Board",
			judge: "Hon'ble Shri Justice G. S. Patel",
			court: "13",
			caption: "FOR ADMISSION",
			connected: "IA/2201/2024",
			reasons: ["Your matter"],
			tracked: true,
			mid: "2|R|560|1842|2024",
			add: null
		},
		{
			date: tomorrow.short,
			date_full: tomorrow.full,
			date_ddmm: tomorrow.ddmm,
			matter: "Harbourline Shipping Ltd. v Peninsula Ports Ltd.",
			number: "COMS/88/2023",
			serial: "4",
			list_type: "Daily Board",
			judge: "Hon'ble Smt. Justice Bharati Dangre",
			court: "18",
			caption: "FOR EVIDENCE",
			connected: "",
			reasons: ["Your matter"],
			tracked: true,
			mid: "2|R|742|88|2023",
			add: null
		},
		{
			date: tomorrow.short,
			date_full: tomorrow.full,
			date_ddmm: tomorrow.ddmm,
			matter: "Aarav Textiles v Union of India",
			number: "WP/991/2025",
			serial: "31",
			list_type: "Daily Board",
			judge: "Hon'ble Shri Justice G. S. Patel",
			court: "13",
			caption: "FOR ADMISSION",
			connected: "",
			reasons: ["Bharucha & Partners"],
			tracked: false,
			mid: null,
			add: {
				abbr: "WP",
				stampreg: "R",
				no: "991",
				year: "2025"
			}
		}
	];
}
var MONTHS = [
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
	"December"
];
function parseDmy(s) {
	const m = String(s || "").match(/(\d{2})\/(\d{2})\/(\d{4})/);
	if (!m) return null;
	const d = new Date(+m[3], +m[2] - 1, +m[1]);
	return Number.isNaN(d.getTime()) ? null : d;
}
function parseIso(s) {
	if (!s) return null;
	const dmy = parseDmy(s);
	if (dmy) return dmy;
	if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
		const [y, m, d] = s.split("-").map(Number);
		return new Date(y, m - 1, d);
	}
	return null;
}
function toIsoDate(s) {
	const d = parseIso(s);
	if (!d) return "";
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function fromIsoDate(s) {
	if (!s) return "";
	const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
	if (!m) return s;
	return `${m[3]}/${m[2]}/${m[1]}`;
}
function fmtDate(s) {
	const d = parseIso(s);
	if (!d) return s || "—";
	return d.toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric"
	});
}
function todayIso(now = /* @__PURE__ */ new Date()) {
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
function startOfDay(d = /* @__PURE__ */ new Date()) {
	return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function daysFromToday(s, now = /* @__PURE__ */ new Date()) {
	const d = parseIso(s);
	if (!d) return null;
	return Math.round((startOfDay(d).getTime() - startOfDay(now).getTime()) / 864e5);
}
function dateKind(s) {
	const n = daysFromToday(s);
	if (n === null) return "";
	if (n < 0) return "overdue";
	if (n === 0) return "today";
	if (n === 1) return "tomorrow";
	if (n <= 7) return "soon";
	return "";
}
function courtDateDdMm(d) {
	return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
}
function prettyCourtDay(d) {
	return {
		date: courtDateDdMm(d),
		short: `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`,
		full: `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
	};
}
function clockNow() {
	const d = /* @__PURE__ */ new Date();
	const pad = (n) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid() {
	if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
	return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
function short(s, n = 55) {
	const t = (s ?? "").trim();
	return t.length > n ? t.slice(0, n).trim() : t;
}
function matterCaption(petitioner, respondent) {
	return `${(petitioner || "—").trim()} v ${(respondent || "—").trim()}`;
}
function caseLabel(m) {
	const abbr = (m.type_name || "").split(" - ")[0].trim() || "Case";
	const no = m.case_no || "—";
	const yr = m.year || "—";
	if (m.stampreg === "S") return `${abbr}(L)/${no}/${yr}`;
	return `${abbr}/${no}/${yr}`;
}
function matterCasenos(m) {
	const out = [caseLabel(m).toUpperCase()];
	if (m.cnr) out.push(m.cnr.toUpperCase());
	return out;
}
function greeting(now = /* @__PURE__ */ new Date()) {
	const hour = Number(new Intl.DateTimeFormat("en-IN", {
		timeZone: "Asia/Kolkata",
		hour: "numeric",
		hour12: false
	}).format(now));
	if (hour < 12) return "Good morning";
	if (hour < 17) return "Good afternoon";
	return "Good evening";
}
var fieldSelect = "field-select max-w-full min-w-0 appearance-none";
function seedListings() {
	const days = [0, 1].map((off) => {
		const d = /* @__PURE__ */ new Date();
		d.setDate(d.getDate() + off);
		return prettyCourtDay(d);
	});
	return {
		generated_at: "",
		days,
		range_label: `${days[0].short} – ${days[1].short}`,
		num_days: 5,
		rows: sampleListings(),
		scanning: false
	};
}
function annotate(rows, matters) {
	const byNo = /* @__PURE__ */ new Map();
	for (const m of matters) for (const cn of matterCasenos(m)) byNo.set(cn.toUpperCase(), m);
	return rows.map((row) => {
		const m = byNo.get((row.number || "").toUpperCase());
		const reasons = (row.reasons || []).filter((r) => r !== "Your matter");
		if (m) return {
			...row,
			tracked: true,
			add: null,
			reasons: ["Your matter", ...reasons],
			mid: m.id,
			matter: `${m.petitioner || ""} v ${m.respondent || ""}`.trim().replace(/^v | v$/g, "") || row.matter
		};
		const mm = (row.number || "").match(/^([A-Z]+)(\(L\))?\/(\d+)\/(\d{4})$/i);
		return {
			...row,
			tracked: false,
			mid: null,
			reasons,
			add: mm ? {
				abbr: mm[1],
				stampreg: mm[2] ? "S" : "R",
				no: mm[3],
				year: mm[4]
			} : row.add
		};
	});
}
function matterFromLookup(params, lookup, existing) {
	const newest = [...lookup.orders].sort((a, b) => {
		const pa = a.date.split("/").reverse().join("");
		return b.date.split("/").reverse().join("").localeCompare(pa);
	})[0];
	return {
		id: [
			params.side,
			params.stampreg,
			params.case_type,
			params.case_no,
			params.year
		].join("|"),
		side: params.side,
		side_label: SIDE_LABEL[params.side] || params.side,
		stampreg: params.stampreg,
		stampreg_label: STAMP_LABEL[params.stampreg],
		case_type: params.case_type,
		type_name: params.type_name,
		case_no: params.case_no,
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
				excerpt: prev?.excerpt
			};
		}),
		added_at: existing?.added_at || clockNow(),
		last_refresh: clockNow(),
		last_added: 0,
		sample: false
	};
}
var useTracker = create()(persist((set, get) => ({
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
				activity: [{
					id: uid(),
					at: clockNow(),
					kind: "import",
					title: "Sample practice loaded",
					detail: "Four Bombay HC matters so you can explore the desk."
				}]
			});
			return;
		}
		set({
			hydrated: true,
			onboarded: true,
			listings: {
				...s.listings,
				rows: annotate(s.listings.rows, s.matters)
			}
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
		const matters = [...get().matters.filter((x) => x.id !== m.id), m];
		set({
			matters,
			listings: {
				...get().listings,
				rows: annotate(get().listings.rows, matters)
			}
		});
	},
	updateMatter: (id, patch) => {
		set({ matters: get().matters.map((m) => m.id === id ? {
			...m,
			...patch
		} : m) });
	},
	removeMatter: (id) => {
		const matters = get().matters.filter((m) => m.id !== id);
		set({
			matters,
			listings: {
				...get().listings,
				rows: annotate(get().listings.rows, matters)
			}
		});
	},
	setOrders: (id, orders, extra) => {
		set({ matters: get().matters.map((m) => m.id === id ? {
			...m,
			orders,
			order_count: orders.length,
			last_refresh: clockNow(),
			...extra
		} : m) });
	},
	addNote: (id, note) => {
		const n = {
			...note,
			id: uid(),
			createdAt: clockNow()
		};
		set({ matters: get().matters.map((m) => m.id === id ? {
			...m,
			hearing_notes: [n, ...m.hearing_notes]
		} : m) });
	},
	setNotes: (id, notes) => {
		set({ matters: get().matters.map((m) => m.id === id ? {
			...m,
			hearing_notes: notes
		} : m) });
	},
	setSteps: (id, steps) => {
		set({ matters: get().matters.map((m) => m.id === id ? {
			...m,
			next_steps: steps
		} : m) });
	},
	toggleStep: (id, stepId, done) => {
		set({ matters: get().matters.map((m) => m.id === id ? {
			...m,
			next_steps: m.next_steps.map((s) => s.id === stepId ? {
				...s,
				done
			} : s)
		} : m) });
	},
	addStep: (id, step) => {
		const s = {
			...step,
			id: uid()
		};
		set({ matters: get().matters.map((m) => m.id === id ? {
			...m,
			next_steps: [...m.next_steps, s]
		} : m) });
	},
	setSettings: (s) => set({ settings: {
		...get().settings,
		...s
	} }),
	setListings: (l) => set({ listings: {
		...get().listings,
		...l
	} }),
	mergeListingRows: (rows, days, numDays) => {
		const prev = get().listings.rows;
		const map = /* @__PURE__ */ new Map();
		for (const r of prev) map.set([
			r.date_full,
			r.judge,
			r.court,
			r.serial,
			r.number
		].join("|"), r);
		for (const r of rows) map.set([
			r.date_full,
			r.judge,
			r.court,
			r.serial,
			r.number
		].join("|"), r);
		const merged = annotate([...map.values()], get().matters).sort((a, b) => {
			const da = Date.parse(a.date_full) || 0;
			const db = Date.parse(b.date_full) || 0;
			if (da !== db) return da - db;
			const ca = Number(a.court) || 9999;
			const cb = Number(b.court) || 9999;
			if (ca !== cb) return ca - cb;
			return (Number(a.serial) || 9999) - (Number(b.serial) || 9999);
		});
		const label = days.length ? `${days[0].short} – ${days[days.length - 1].short}` : "";
		set({ listings: {
			generated_at: clockNow(),
			days,
			range_label: label,
			num_days: numDays,
			rows: merged,
			scanning: false
		} });
	},
	log: (kind, title, detail) => {
		set({ activity: [{
			id: uid(),
			at: clockNow(),
			kind,
			title,
			detail
		}, ...get().activity].slice(0, 60) });
	},
	importMatters: (incoming) => {
		const byId = new Map(get().matters.map((m) => [m.id, m]));
		let added = 0;
		let updated = 0;
		for (const m of incoming) if (byId.has(m.id)) {
			const old = byId.get(m.id);
			byId.set(m.id, {
				...old,
				...m,
				partner: m.partner || old.partner,
				associates: m.associates || old.associates,
				hearing_notes: m.hearing_notes?.length ? m.hearing_notes : old.hearing_notes,
				next_steps: m.next_steps?.length ? m.next_steps : old.next_steps,
				sample: false
			});
			updated += 1;
		} else {
			byId.set(m.id, {
				...m,
				sample: false
			});
			added += 1;
		}
		const matters = [...byId.values()];
		set({
			matters,
			listings: {
				...get().listings,
				rows: annotate(get().listings.rows, matters)
			}
		});
		return {
			added,
			updated
		};
	},
	replaceAll: (payload) => {
		set({
			matters: payload.matters,
			settings: payload.settings || get().settings,
			listings: payload.listings ? {
				...payload.listings,
				rows: annotate(payload.listings.rows, payload.matters)
			} : get().listings
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
				scanning: false
			},
			activity: [],
			settings: DEFAULT_SETTINGS
		});
	}
}), {
	name: "bhc-matter-tracker-v1",
	skipHydration: true,
	partialize: (s) => ({
		matters: s.matters,
		settings: s.settings,
		listings: {
			...s.listings,
			scanning: false
		},
		activity: s.activity,
		onboarded: s.onboarded
	})
}));
function allOpenTasks(matters) {
	const out = [];
	for (const m of matters) for (const step of m.next_steps) if (!step.done) out.push({
		matter: m,
		step
	});
	return out;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function HydrateTracker() {
	(0, import_react.useEffect)(() => {
		Promise.resolve(useTracker.persist.rehydrate()).then(() => {
			useTracker.getState().setHydrated();
		});
	}, []);
	return null;
}
function TooltipProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Provider, {
		delayDuration: 250,
		children
	});
}
var styles_default = "/assets/styles-BxLRe7RT.css";
var APP_NAME = "Matter Tracker";
var Route$7 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#f5f5f7"
			},
			{
				name: "description",
				content: "Track Bombay High Court matters, download orders, and scan cause lists."
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-title",
				content: APP_NAME
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipProvider, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HydrateTracker, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
					position: "bottom-right",
					toastOptions: { className: "font-sans !rounded-2xl !border-0 !bg-surface !text-ink !shadow-[var(--shadow-float)]" }
				})
			] }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$6 = () => import("./routes-D3igF0YK.mjs");
var Route$6 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./listings-C7QBkU93.mjs");
var Route$5 = createFileRoute("/listings")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./matters-DVJwlu6w.mjs");
var Route$4 = createFileRoute("/matters")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./settings-BWXglhdj.mjs");
var Route$3 = createFileRoute("/settings")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./tasks-CfgW-7O7.mjs");
var Route$2 = createFileRoute("/tasks")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./matters.index-C8ecHnOe.mjs");
var Route$1 = createFileRoute("/matters/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./matters._id-zyCypao6.mjs");
var Route = createFileRoute("/matters/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$6.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$7
});
var ListingsRoute = Route$5.update({
	id: "/listings",
	path: "/listings",
	getParentRoute: () => Route$7
});
var MattersRoute = Route$4.update({
	id: "/matters",
	path: "/matters",
	getParentRoute: () => Route$7
});
var SettingsRoute = Route$3.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$7
});
var TasksRoute = Route$2.update({
	id: "/tasks",
	path: "/tasks",
	getParentRoute: () => Route$7
});
var MattersIndexRoute = Route$1.update({
	id: "/",
	path: "/",
	getParentRoute: () => MattersRoute
});
var MattersRouteChildren = {
	MattersIdRoute: Route.update({
		id: "/$id",
		path: "/$id",
		getParentRoute: () => MattersRoute
	}),
	MattersIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	ListingsRoute,
	MattersRoute: MattersRoute._addFileChildren(MattersRouteChildren),
	SettingsRoute,
	TasksRoute
};
var routeTree = Route$7._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { STAMP_LABEL as C, SIDE_LABEL as S, fromIsoDate as _, useTracker as a, toIsoDate as b, fieldSelect as c, matterCasenos as d, short as f, fmtDate as g, dateKind as h, matterFromLookup as i, greeting as l, clockNow as m, Route as n, caseLabel as o, uid as p, allOpenTasks as r, cn as s, router_exports as t, matterCaption as u, parseDmy as v, __exportAll as w, todayIso as x, prettyCourtDay as y };
