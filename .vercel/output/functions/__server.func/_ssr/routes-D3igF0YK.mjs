import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useTracker, g as fmtDate, h as dateKind, l as greeting, o as caseLabel, r as allOpenTasks, s as cn, u as matterCaption, x as todayIso, y as prettyCourtDay } from "./router-Bf7uN__Z.mjs";
import { O as useUi, a as CardHeader, h as PageHeader, i as CardBody, n as Button, o as CardTitle, r as Card, t as AppShell } from "./card-BDUGGpAD.mjs";
import { t as Badge } from "./badge-AImXfGyF.mjs";
import { n as runCauselistScan } from "./scan-eV4xE6y2.mjs";
import { t as DatePill } from "./status-pill-Drt2U-fB.mjs";
import { t as TaskRow } from "./task-row-CrJMWx_7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D3igF0YK.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dashboard, {}) });
}
function Dashboard() {
	const matters = useTracker((s) => s.matters);
	const listings = useTracker((s) => s.listings);
	const settings = useTracker((s) => s.settings);
	const toggleStep = useTracker((s) => s.toggleStep);
	const scanning = listings.scanning;
	const openAdd = useUi((s) => s.openAdd);
	const tasks = allOpenTasks(matters).sort((a, b) => (a.step.due || "9999").localeCompare(b.step.due || "9999"));
	const overdue = tasks.filter((t) => t.step.due && t.step.due < todayIso()).length;
	const today = prettyCourtDay(/* @__PURE__ */ new Date());
	const tomD = /* @__PURE__ */ new Date();
	tomD.setDate(tomD.getDate() + 1);
	const tomorrow = prettyCourtDay(tomD);
	const listedToday = new Set(listings.rows.filter((r) => r.tracked && r.date_full === today.full).map((r) => r.number)).size;
	const listedTom = new Set(listings.rows.filter((r) => r.tracked && r.date_full === tomorrow.full).map((r) => r.number)).size;
	const agenda = [...listings.rows.filter((r) => r.tracked).map((r) => ({
		when: r.date_full,
		title: r.matter,
		meta: `${r.number} · ${r.list_type || "Cause list"} · ${r.judge || "Court"}`,
		kind: r.date_full === today.full ? "today" : "",
		href: r.mid ? `/matters/${encodeURIComponent(r.mid)}` : "/listings"
	})), ...matters.filter((m) => m.next_hearing).map((m) => ({
		when: fmtDate(m.next_hearing),
		title: matterCaption(m.petitioner, m.respondent),
		meta: `Hearing · ${caseLabel(m)}`,
		kind: dateKind(m.next_hearing),
		href: `/matters/${encodeURIComponent(m.id)}`
	}))].sort((a, b) => a.kind === "today" ? -1 : b.kind === "today" ? 1 : a.when.localeCompare(b.when)).slice(0, 8);
	const sample = matters.some((m) => m.sample);
	const dateLine = new Intl.DateTimeFormat("en-IN", {
		weekday: "long",
		day: "numeric",
		month: "long"
	}).format(/* @__PURE__ */ new Date());
	const stats = [
		{
			label: "Matters",
			value: matters.length,
			hint: "Active"
		},
		{
			label: "Today",
			value: listedToday,
			hint: "On the board"
		},
		{
			label: "Tomorrow",
			value: listedTom,
			hint: "Listed"
		},
		{
			label: "Tasks",
			value: tasks.length,
			hint: overdue ? `${overdue} overdue` : "Open"
		}
	];
	const hearings = matters.filter((m) => m.next_hearing || m.next_listing).sort((a, b) => (a.next_hearing || a.next_listing).localeCompare(b.next_hearing || b.next_listing)).slice(0, 6);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "stagger-in space-y-8",
		children: [
			sample ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Sample matters are loaded. Add a real case, or import from Settings."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: greeting(),
				subtitle: listings.generated_at ? `${dateLine}. Cause lists checked ${listings.generated_at}.` : `${dateLine}. Add a matter, then scan the cause lists.`,
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					disabled: scanning,
					onClick: async () => {
						toast.message("Scanning published Bombay HC boards…");
						const r = await runCauselistScan(settings.scan_days);
						if (r.ok) toast.success("Cause lists updated.");
						else toast.error(r.error);
					},
					children: scanning ? "Scanning…" : "Scan lists"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 lg:grid-cols-4",
				children: stats.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("px-6 py-5", i < stats.length - 1 && "lg:border-r lg:border-line/80", i % 2 === 0 && "max-lg:border-r max-lg:border-line/80", i < 2 && "max-lg:border-b max-lg:border-line/80"),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted",
							children: s.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-4xl font-semibold tracking-tight tabular-nums",
							children: s.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-xs text-faint",
							children: s.hint
						})
					]
				}, s.label))
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,.85fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Today" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-sm text-muted",
					children: "Hearings and listings"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/listings",
					className: "text-sm font-medium text-accent",
					children: "See all"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardBody, {
					className: "px-0 pt-0",
					children: !agenda.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-6 py-12 text-center text-[15px] text-muted",
						children: [
							"Nothing on the board.",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "font-medium text-accent",
								onClick: openAdd,
								children: "Add a matter"
							}),
							"."
						]
					}) : agenda.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: a.href,
						className: "grid grid-cols-1 items-start gap-1 border-t border-line/70 px-6 py-4 hover:bg-canvas/80 md:grid-cols-[88px_minmax(0,1fr)_auto] md:gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium text-accent",
								children: a.when
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[15px] font-medium leading-snug",
									children: a.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-0.5 text-xs text-muted",
									children: a.meta
								})]
							}),
							a.kind ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: a.kind === "overdue" ? "bad" : a.kind === "today" ? "accent" : "warn",
								children: a.kind === "today" ? "Today" : a.kind
							}) : null
						]
					}, i))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "To do" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-sm text-muted",
					children: "Next steps"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/tasks",
					className: "text-sm font-medium text-accent",
					children: "See all"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardBody, {
					className: "pt-0",
					children: !tasks.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-12 text-center text-[15px] text-muted",
						children: "No open next steps."
					}) : tasks.slice(0, 7).map(({ matter, step }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskRow, {
						matter,
						step,
						compact: true,
						onToggle: (done) => toggleStep(matter.id, step.id, done)
					}, step.id))
				})] })]
			}),
			hearings.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Upcoming" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardBody, {
				className: "space-y-4 pt-0",
				children: hearings.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/matters/$id",
					params: { id: m.id },
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "truncate text-[15px] font-medium",
							children: matterCaption(m.petitioner, m.respondent)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-xs text-muted",
							children: caseLabel(m)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePill, {
						value: m.next_hearing || m.next_listing,
						label: m.next_hearing ? "Hearing" : "Listing"
					})]
				}, m.id))
			})] }) : null
		]
	});
}
//#endregion
export { Home as component };
