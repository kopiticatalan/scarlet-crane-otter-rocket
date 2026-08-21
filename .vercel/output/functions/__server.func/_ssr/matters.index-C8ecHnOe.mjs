import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { o as Search } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useTracker, c as fieldSelect, o as caseLabel, u as matterCaption } from "./router-Bf7uN__Z.mjs";
import { O as useUi, T as refreshMatter, h as PageHeader, p as Input, r as Card, t as AppShell } from "./card-BDUGGpAD.mjs";
import { n as StatusPill, t as DatePill } from "./status-pill-Drt2U-fB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/matters.index-C8ecHnOe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MattersPage() {
	const matters = useTracker((s) => s.matters);
	const hydrated = useTracker((s) => s.hydrated);
	const openAdd = useUi((s) => s.openAdd);
	const [q, setQ] = (0, import_react.useState)("");
	const [side, setSide] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("");
	const rows = (0, import_react.useMemo)(() => {
		const term = q.toLowerCase();
		return matters.filter((m) => {
			const hay = [
				matterCaption(m.petitioner, m.respondent),
				caseLabel(m),
				m.partner,
				m.associates,
				m.cnr,
				m.status
			].join(" ").toLowerCase();
			if (term && !hay.includes(term)) return false;
			if (side && m.side !== side) return false;
			if (filter === "upcoming" && !(m.next_hearing || m.next_listing)) return false;
			if (filter === "tasks" && !m.next_steps.some((s) => !s.done)) return false;
			if (filter === "disposed" && !/dispos/i.test(m.status)) return false;
			if (filter === "pending" && /dispos/i.test(m.status)) return false;
			return true;
		}).sort((a, b) => matterCaption(a.petitioner, a.respondent).localeCompare(matterCaption(b.petitioner, b.respondent)));
	}, [
		matters,
		q,
		side,
		filter
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Matters",
			subtitle: "Orders live in this browser. Open a case to read or save the PDFs."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 flex flex-wrap items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative min-w-[220px] flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-faint" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "pl-10",
						placeholder: "Search party, case number, CNR or team",
						value: q,
						onChange: (e) => setQ(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: fieldSelect + " w-auto",
					value: side,
					onChange: (e) => setSide(e.target.value),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "All sides"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "2",
							children: "Original Side"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "1",
							children: "Appellate Side"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: fieldSelect + " w-auto",
					value: filter,
					onChange: (e) => setFilter(e.target.value),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "All matters"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "upcoming",
							children: "Upcoming"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "tasks",
							children: "Open tasks"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "pending",
							children: "Pending"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "disposed",
							children: "Disposed"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted",
					children: hydrated ? `${rows.length} of ${matters.length}` : "…"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[860px] text-left text-[15px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-line/80 text-xs font-medium text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-5 py-3",
							children: "Matter"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-5 py-3",
							children: "Case"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-5 py-3",
							children: "Team"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-5 py-3",
							children: "Next date"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-5 py-3",
							children: "Last order"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-5 py-3",
							children: "Orders"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-5 py-3" })
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: !rows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
					colSpan: 7,
					className: "px-5 py-16 text-center text-muted",
					children: [
						"No matters match this view.",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "font-medium text-accent",
							onClick: openAdd,
							children: "Add a matter"
						}),
						"."
					]
				}) }) : rows.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-line/70 last:border-0 hover:bg-canvas/70",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-5 py-4 align-top",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/matters/$id",
								params: { id: m.id },
								className: "font-medium leading-snug hover:text-accent",
								children: matterCaption(m.petitioner, m.respondent)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-0.5 text-xs text-muted",
								children: [
									m.side_label,
									" · ",
									m.stampreg_label,
									m.sample ? " · sample" : ""
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-5 py-4 align-top",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-sm",
								children: caseLabel(m)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex flex-wrap items-center gap-1.5",
								children: [m.status ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: m.status }) : null, m.cnr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted",
									children: m.cnr
								}) : null]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-5 py-4 align-top",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: m.partner || "—" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted",
								children: m.associates
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-5 py-4 align-top",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePill, {
								value: m.next_hearing || m.next_listing,
								label: m.next_hearing ? "Hearing" : m.next_listing ? "Listing" : ""
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-5 py-4 align-top",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: m.last_listing || "—" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "max-w-[180px] truncate text-xs text-muted",
								children: m.last_coram
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-5 py-4 align-top font-medium tabular-nums",
							children: m.order_count || m.orders.length
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-5 py-4 align-top",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/matters/$id",
									params: { id: m.id },
									className: "text-sm font-medium text-accent",
									children: "Open"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "text-sm font-medium text-accent",
									onClick: async () => {
										const t = toast.loading("Refreshing…");
										const r = await refreshMatter(m);
										if (!r.ok) toast.error(r.error, { id: t });
										else toast.success(`${r.added} new order(s).`, { id: t });
									},
									children: "Refresh"
								})]
							})
						})
					]
				}, m.id)) })]
			})
		})
	] });
}
//#endregion
export { MattersPage as component };
