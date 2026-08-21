import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { d as useRouterState, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime, d as DialogContent$1, f as DialogDescription$1, h as DialogTitle$1, k as Slot, l as Dialog$1, m as DialogPortal, p as DialogOverlay, u as DialogClose } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as object, n as array, o as string, t as _enum } from "../_libs/zod.mjs";
import { n as create } from "../_libs/zustand.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { _ as Check, a as Settings, c as RefreshCw, d as LayoutDashboard, f as Gavel, g as ChevronDown, l as Plus, m as Ellipsis, s as Scale, t as X, u as ListChecks, y as CalendarDays } from "../_libs/lucide-react.mjs";
import { a as Trigger, i as Root2, n as Item2, r as Portal2, t as Content2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
import { a as SelectItemIndicator, c as SelectTrigger$1, i as SelectItem$1, l as SelectValue$1, n as SelectContent$1, o as SelectItemText, r as SelectIcon, s as SelectPortal, t as Select$1, u as SelectViewport } from "../_libs/@radix-ui/react-select+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useTracker, f as short, i as matterFromLookup, o as caseLabel, s as cn, u as matterCaption, v as parseDmy, w as __exportAll } from "./router-Bf7uN__Z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/card-BDUGGpAD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var actions_exports = /* @__PURE__ */ __exportAll({
	downloadCauselistPdf: () => downloadCauselistPdf,
	draftHearingBrief: () => draftHearingBrief,
	fetchCase: () => fetchCase,
	fetchCaseTypes: () => fetchCaseTypes,
	fetchCauselistJudges: () => fetchCauselistJudges,
	fetchOrderPdfs: () => fetchOrderPdfs,
	resolveListing: () => resolveListing,
	scanCauselistBatch: () => scanCauselistBatch
});
var lookupSchema = object({
	side: string(),
	stampreg: _enum(["R", "S"]),
	case_type: string(),
	case_no: string(),
	year: string()
});
var fetchCaseTypes = createServerFn({ method: "POST" }).validator(object({ side: string() })).handler(createSsrRpc("81ee1bb9a9c68ebf0caa59b00c992999cd179f01c477e5503eee98c358e9ac90"));
var fetchCase = createServerFn({ method: "POST" }).validator(lookupSchema).handler(createSsrRpc("3d7c072bc243f937338fe2e4ae8c840004e0ad2b5c30aa19297d6bbe924abf86"));
var fetchOrderPdfs = createServerFn({ method: "POST" }).validator(lookupSchema.extend({
	keys: array(string()),
	petitioner: string().optional(),
	respondent: string().optional()
})).handler(createSsrRpc("9038a791cce0c90f0075e6a2b74abd3aab02fa0ff657c4a85492e37983f3a058"));
var fetchCauselistJudges = createServerFn({ method: "POST" }).validator(object({ date: string() })).handler(createSsrRpc("f77ee6a5de5bd814c06ed71a3dab1143a48cdf5a4f45d35f42705d3837e964ae"));
var scanCauselistBatch = createServerFn({ method: "POST" }).validator(object({
	items: array(object({
		href: string(),
		judge: string(),
		list_type: string()
	})),
	watched: array(string()),
	tracked: array(string())
})).handler(createSsrRpc("9f3c10d81c5cf23986ebd5e17c3b78d002c0af53dd5cc0aa38c80b7b95bf3c02"));
var downloadCauselistPdf = createServerFn({ method: "POST" }).validator(object({
	date: string(),
	judge: string(),
	list_type: string()
})).handler(createSsrRpc("4fc4774d74f2d4f43930d4062427105709e1b663d7ff52b874755775b455ba1a"));
var resolveListing = createServerFn({ method: "POST" }).validator(object({
	abbr: string(),
	stampreg: _enum(["R", "S"]),
	no: string(),
	year: string()
})).handler(createSsrRpc("831a1ec3e7ec0c2d54a8bbcc13cb2199f27e2e216b686607b57d4451538833a2"));
var draftHearingBrief = createServerFn({ method: "POST" }).validator(object({
	caption: string(),
	caseno: string(),
	status: string().optional(),
	listing: string().optional(),
	coram: string().optional(),
	tasks: array(string()),
	notes: array(string()),
	excerpts: array(object({
		date: string(),
		doc: string(),
		text: string()
	}))
})).handler(createSsrRpc("9b8b8048f0a1fca549c198fdaedf0f818980fab6f96dfabcec32fd7068f715d5"));
var buttonVariants = cva("inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full text-[15px] font-medium transition-[background-color,color,opacity,transform] duration-150 ease-out focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent/20 disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:bg-accent/90",
			secondary: "bg-surface-2 text-ink hover:bg-line",
			ghost: "text-accent hover:bg-accent-2",
			subtle: "bg-accent-2 text-accent hover:bg-accent-2/80",
			danger: "bg-bad/10 text-bad hover:bg-bad/15",
			navy: "bg-ink text-navy-fg hover:bg-navy-2",
			link: "rounded-none px-0 text-accent hover:underline"
		},
		size: {
			default: "h-11 px-5",
			sm: "h-9 px-3.5 text-sm",
			lg: "h-12 px-6",
			icon: "size-11",
			"icon-sm": "size-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
function DropdownMenuContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		sideOffset: 8,
		className: cn("z-50 min-w-44 rounded-2xl bg-surface p-1.5 shadow-[var(--shadow-float)]", className),
		...props
	}) });
}
function DropdownMenuItem({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
		className: cn("flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-[15px] outline-none data-highlighted:bg-canvas", className),
		...props
	});
}
var Dialog = Dialog$1;
function DialogContent({ className, children, wide, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 max-h-[min(88vh,900px)] w-[min(92vw,640px)] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-3xl bg-surface shadow-[var(--shadow-float)] outline-none", wide && "w-[min(92vw,880px)]", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-4 right-4 grid size-8 place-items-center rounded-full bg-surface-2 text-muted hover:text-ink",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function DialogHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("px-7 pt-7 pr-14 pb-2", className),
		...props
	});
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("text-2xl font-semibold tracking-tight", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("mt-1 text-[15px] text-muted", className),
		...props
	});
}
function DialogBody({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("px-7 py-5", className),
		...props
	});
}
function DialogFooter({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("sticky bottom-0 flex items-center justify-end gap-2 bg-surface px-7 py-5", className),
		...props
	});
}
function Input({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("flex h-11 w-full rounded-xl border-0 bg-surface-2 px-3.5 text-[15px] text-ink placeholder:text-faint outline-none transition-[background-color,box-shadow] duration-150 focus:bg-surface focus:ring-4 focus:ring-accent/20 disabled:opacity-50", className),
		...props
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("mb-1.5 block text-sm text-muted", className),
		...props
	});
}
var Select = Select$1;
var SelectValue = SelectValue$1;
function SelectTrigger({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
		className: cn("flex h-11 w-full items-center justify-between gap-2 rounded-xl bg-surface-2 px-3.5 text-[15px] text-ink outline-none transition-[background-color,box-shadow] duration-150 focus:bg-surface focus:ring-4 focus:ring-accent/20 disabled:opacity-50 [&>span]:truncate", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 text-muted" }) })]
	});
}
function SelectContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent$1, {
		position: "popper",
		className: cn("z-50 max-h-72 min-w-[var(--radix-select-trigger-width)] overflow-auto rounded-2xl bg-surface p-1.5 shadow-[var(--shadow-float)]", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, { children })
	}) });
}
function SelectItem({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
		className: cn("relative flex cursor-pointer items-center rounded-xl py-2.5 pr-8 pl-3 text-[15px] outline-none data-highlighted:bg-canvas", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, {
			className: "absolute right-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5 text-accent" })
		})]
	});
}
var useUi = create((set) => ({
	addOpen: false,
	scanProgress: "",
	openAdd: () => set({ addOpen: true }),
	closeAdd: () => set({ addOpen: false }),
	setScanProgress: (scanProgress) => set({ scanProgress })
}));
var DB_NAME = "bhc-matter-tracker";
var STORE = "pdfs";
function openDb() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB_NAME, 1);
		req.onupgradeneeded = () => {
			const db = req.result;
			if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}
function pdfKey(matterId, orderKey) {
	return `${matterId}::${orderKey}`;
}
async function savePdf(input) {
	const binary = atob(input.base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
	const rec = {
		key: pdfKey(input.matterId, input.orderKey),
		matterId: input.matterId,
		filename: input.filename,
		mime: "application/pdf",
		data: bytes.buffer,
		savedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	const db = await openDb();
	await new Promise((resolve, reject) => {
		const tx = db.transaction(STORE, "readwrite");
		tx.objectStore(STORE).put(rec, rec.key);
		tx.oncomplete = () => resolve();
		tx.onerror = () => reject(tx.error);
	});
	db.close();
	return rec.key;
}
async function getPdf(matterId, orderKey) {
	const db = await openDb();
	const rec = await new Promise((resolve, reject) => {
		const req = db.transaction(STORE, "readonly").objectStore(STORE).get(pdfKey(matterId, orderKey));
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
	db.close();
	return rec;
}
function downloadBuffer(filename, data, mime) {
	const blob = new Blob([data], { type: mime });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
function objectUrlFor(data, mime = "application/pdf") {
	return URL.createObjectURL(new Blob([data], { type: mime }));
}
async function pullMissingOrders(matter, keys) {
	const want = keys ?? matter.orders.filter((o) => !o.downloaded).map((o) => o.key);
	if (!want.length) return { added: 0 };
	let added = 0;
	const chunk = 5;
	let orders = [...matter.orders];
	for (let i = 0; i < want.length; i += chunk) {
		const slice = want.slice(i, i + chunk);
		const res = await fetchOrderPdfs({ data: {
			side: matter.side,
			stampreg: matter.stampreg,
			case_type: matter.case_type,
			case_no: matter.case_no,
			year: matter.year,
			keys: slice,
			petitioner: matter.petitioner,
			respondent: matter.respondent
		} });
		if (!res.ok) {
			toast.error(res.error);
			break;
		}
		for (const f of res.files) {
			await savePdf({
				matterId: matter.id,
				orderKey: f.key,
				filename: f.filename,
				base64: f.base64
			});
			added += 1;
			orders = orders.map((o) => o.key === f.key ? {
				...o,
				downloaded: true,
				excerpt: f.excerpt || o.excerpt
			} : o);
		}
		useTracker.getState().setOrders(matter.id, orders, { last_added: added });
	}
	return { added };
}
async function refreshMatter(matter) {
	const { fetchCase } = await Promise.resolve().then(() => actions_exports);
	const res = await fetchCase({ data: {
		side: matter.side,
		stampreg: matter.stampreg,
		case_type: matter.case_type,
		case_no: matter.case_no,
		year: matter.year
	} });
	if (!res.ok) return {
		ok: false,
		error: res.error
	};
	const { matterFromLookup } = await import("./tracker--53M7Iod.mjs");
	const next = matterFromLookup({
		side: matter.side,
		stampreg: matter.stampreg,
		case_type: matter.case_type,
		case_no: matter.case_no,
		year: matter.year,
		type_name: matter.type_name
	}, res.lookup, matter);
	useTracker.getState().upsertMatter(next);
	const pulled = await pullMissingOrders(next, next.orders.filter((o) => !o.downloaded).map((o) => o.key));
	useTracker.getState().log("refresh", `${matter.petitioner} v ${matter.respondent}`, `${pulled.added} new order(s)`);
	return {
		ok: true,
		added: pulled.added,
		matter: next
	};
}
function AddMatterDialog() {
	const open = useUi((s) => s.addOpen);
	const closeAdd = useUi((s) => s.closeAdd);
	const upsertMatter = useTracker((s) => s.upsertMatter);
	const log = useTracker((s) => s.log);
	const matters = useTracker((s) => s.matters);
	const [side, setSide] = (0, import_react.useState)("2");
	const [stampreg, setStampreg] = (0, import_react.useState)("R");
	const [types, setTypes] = (0, import_react.useState)([]);
	const [caseType, setCaseType] = (0, import_react.useState)("");
	const [caseNo, setCaseNo] = (0, import_react.useState)("");
	const [year, setYear] = (0, import_react.useState)(String((/* @__PURE__ */ new Date()).getFullYear()));
	const [loadingTypes, setLoadingTypes] = (0, import_react.useState)(false);
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		let cancelled = false;
		setLoadingTypes(true);
		fetchCaseTypes({ data: { side } }).then((r) => {
			if (cancelled) return;
			setLoadingTypes(false);
			if (!r.ok) {
				toast.error(r.error);
				setTypes([]);
				return;
			}
			setTypes(r.types);
			setCaseType((cur) => cur || r.types[0]?.value || "");
		});
		return () => {
			cancelled = true;
		};
	}, [open, side]);
	async function onSave() {
		const type = types.find((t) => t.value === caseType);
		if (!caseType || !caseNo.trim() || !/^\d{4}$/.test(year)) {
			toast.error("Select a type and enter a case number and four-digit year.");
			return;
		}
		setSaving(true);
		const params = {
			side,
			stampreg,
			case_type: caseType,
			case_no: caseNo.trim(),
			year
		};
		const res = await fetchCase({ data: params });
		if (!res.ok) {
			toast.error(res.error);
			setSaving(false);
			return;
		}
		const existing = matters.find((m) => m.id === [
			side,
			stampreg,
			caseType,
			caseNo.trim(),
			year
		].join("|"));
		const matter = matterFromLookup({
			...params,
			type_name: type?.label || ""
		}, res.lookup, existing);
		upsertMatter(matter);
		closeAdd();
		toast.success("Matter saved. Downloading orders…");
		log("add", `${matter.petitioner} v ${matter.respondent}`);
		const pulled = await pullMissingOrders(matter);
		toast.success(pulled.added ? `${pulled.added} order${pulled.added === 1 ? "" : "s"} downloaded.` : "No new orders to download.");
		setSaving(false);
		setCaseNo("");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (v) => !v ? closeAdd() : null,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			wide: true,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New matter" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Case types load from the court site after you choose the side." })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogBody, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Side" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: side,
							onValueChange: setSide,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "2",
								children: "Original Side"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "1",
								children: "Appellate Side"
							})] })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Register / stamp" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: stampreg,
							onValueChange: (v) => setStampreg(v),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "R",
								children: "Registered"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "S",
								children: "Stamp / lodging"
							})] })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Case type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "field-select",
								value: caseType,
								disabled: loadingTypes,
								onChange: (e) => setCaseType(e.target.value),
								children: loadingTypes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Loading types…" }) : types.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: t.value,
									children: t.label
								}, t.value))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Case number" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							inputMode: "numeric",
							placeholder: "e.g. 1842",
							value: caseNo,
							onChange: (e) => setCaseNo(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Year" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							inputMode: "numeric",
							maxLength: 4,
							value: year,
							onChange: (e) => setYear(e.target.value)
						})] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-sm text-muted",
					children: "The court record is fetched live. Every available order is saved in this browser. Notes are kept if you add the same case again."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					onClick: closeAdd,
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: onSave,
					disabled: saving,
					children: saving ? "Finding…" : "Find and save"
				})] })
			]
		})
	});
}
function esc(s) {
	return (s || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}
function buildIcs(matters) {
	const today = /* @__PURE__ */ new Date();
	today.setHours(0, 0, 0, 0);
	const stamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
	const lines = [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		"PRODID:-//Bombay HC Matter Tracker//EN",
		"CALSCALE:GREGORIAN"
	];
	let n = 0;
	for (const m of matters) {
		const name = short(matterCaption(m.petitioner, m.respondent), 80);
		const caseno = caseLabel(m);
		const seen = /* @__PURE__ */ new Set();
		for (const [field, label] of [["next_listing", "Listing"], ["next_hearing", "Hearing"]]) {
			const d = parseDmy(m[field]);
			if (!d || d < today) continue;
			const key = d.toISOString().slice(0, 10);
			if (seen.has(key)) continue;
			seen.add(key);
			n += 1;
			const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
			const uid = `bhc-${m.id.replace(/\W/g, "")}-${field}-${ymd}@bhcmt`;
			lines.push("BEGIN:VEVENT", `UID:${uid}`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${ymd}`, `SUMMARY:${esc(`${label} — ${name} (${caseno})`)}`, `DESCRIPTION:${esc(`Bombay HC Matter Tracker · ${caseno}`)}`, "END:VEVENT");
		}
	}
	lines.push("END:VCALENDAR");
	return {
		ics: lines.join("\r\n") + "\r\n",
		events: n
	};
}
function downloadIcs(filename, ics) {
	const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
var NAV = [
	{
		to: "/",
		label: "Today",
		icon: LayoutDashboard
	},
	{
		to: "/matters",
		label: "Matters",
		icon: Scale
	},
	{
		to: "/listings",
		label: "Lists",
		icon: Gavel
	},
	{
		to: "/tasks",
		label: "Tasks",
		icon: ListChecks
	},
	{
		to: "/settings",
		label: "Settings",
		icon: Settings
	}
];
function PageHeader({ title, subtitle, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-8 flex flex-wrap items-end justify-between gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-4xl font-semibold tracking-tight text-ink",
				children: title
			}), subtitle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-xl text-[15px] text-muted",
				children: subtitle
			}) : null]
		}), action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex shrink-0 flex-wrap items-center gap-2",
			children: action
		}) : null]
	});
}
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const openAdd = useUi((s) => s.openAdd);
	const scanProgress = useUi((s) => s.scanProgress);
	const matters = useTracker((s) => s.matters);
	const log = useTracker((s) => s.log);
	async function refreshAll() {
		if (!matters.length) {
			toast.error("Add a matter first.");
			return;
		}
		const t = toast.loading("Refreshing court records…");
		let added = 0;
		for (const m of matters.filter((x) => !x.sample)) {
			const r = await refreshMatter(m);
			if (r.ok) added += r.added;
		}
		log("refresh", "Refresh all", `${added} new order(s)`);
		toast.success(`Refresh complete: ${added} new order(s).`, { id: t });
	}
	function exportCal() {
		const { ics, events } = buildIcs(matters);
		if (!events) {
			toast.error("No upcoming dates to export.");
			return;
		}
		downloadIcs("BHC hearings.ics", ics);
		toast.success(`${events} event(s) exported.`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-svh overflow-x-hidden bg-canvas text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-30 border-b border-line/70 bg-canvas/80 backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:h-16 sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "shrink-0 text-[17px] font-semibold tracking-tight",
							children: "Matter Tracker"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex",
							children: NAV.map((item) => {
								const active = item.to === "/" ? pathname === "/" : pathname === item.to || pathname.startsWith(item.to + "/");
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: item.to,
									className: cn("rounded-full px-3.5 py-1.5 text-sm font-medium text-muted transition-colors duration-150 hover:text-ink", active && "bg-surface text-ink shadow-sm"),
									children: item.label
								}, item.to);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-1.5",
							children: [
								scanProgress ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden max-w-[200px] truncate text-xs text-muted md:inline",
									children: scanProgress
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "secondary",
										size: "icon-sm",
										"aria-label": "More",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" })
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onSelect: exportCal,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "size-4 text-muted" }), "Calendar"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onSelect: () => void refreshAll(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4 text-muted" }), "Refresh all"]
								})] })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									onClick: openAdd,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "New"]
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto w-full max-w-6xl px-4 pt-8 pb-28 sm:px-6 sm:pt-10 lg:pb-16",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed right-0 bottom-0 left-0 z-30 border-t border-line/70 bg-canvas/90 px-2 pt-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-5",
					children: NAV.map((item) => {
						const active = item.to === "/" ? pathname === "/" : pathname === item.to || pathname.startsWith(item.to + "/");
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex min-h-12 flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-faint", active && "text-accent"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, {
								className: "size-5",
								strokeWidth: active ? 2.2 : 1.75
							}), item.label]
						}, item.to);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddMatterDialog, {})
		]
	});
}
function Card({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-2xl bg-surface shadow-[var(--shadow-card)]", className),
		...props
	});
}
function CardHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-wrap items-start justify-between gap-3 px-6 pt-5 pb-3", className),
		...props
	});
}
function CardTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: cn("text-[17px] font-semibold tracking-tight", className),
		...props
	});
}
function CardBody({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("px-6 py-4", className),
		...props
	});
}
//#endregion
export { objectUrlFor as C, scanCauselistBatch as D, resolveListing as E, useUi as O, getPdf as S, refreshMatter as T, downloadBuffer as _, CardHeader as a, draftHearingBrief as b, DialogBody as c, DialogHeader as d, DialogTitle as f, buildIcs as g, PageHeader as h, CardBody as i, DialogContent as l, Label as m, Button as n, CardTitle as o, Input as p, Card as r, Dialog as s, AppShell as t, DialogFooter as u, downloadCauselistPdf as v, pullMissingOrders as w, fetchCauselistJudges as x, downloadIcs as y };
