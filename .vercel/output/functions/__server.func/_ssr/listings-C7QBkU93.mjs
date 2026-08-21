import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useTracker, c as fieldSelect, i as matterFromLookup, s as cn } from "./router-Bf7uN__Z.mjs";
import { E as resolveListing, _ as downloadBuffer, h as PageHeader, n as Button, r as Card, t as AppShell, v as downloadCauselistPdf, w as pullMissingOrders } from "./card-BDUGGpAD.mjs";
import { t as Badge } from "./badge-AImXfGyF.mjs";
import { n as runCauselistScan } from "./scan-eV4xE6y2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/listings-C7QBkU93.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ListingsPage() {
	const listings = useTracker((s) => s.listings);
	const settings = useTracker((s) => s.settings);
	const setSettings = useTracker((s) => s.setSettings);
	const upsertMatter = useTracker((s) => s.upsertMatter);
	const log = useTracker((s) => s.log);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const rows = listings.rows.filter((r) => {
		if (filter === "mine") return r.tracked;
		if (filter === "watch") return !r.tracked;
		return true;
	});
	const mine = listings.rows.filter((r) => r.tracked).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Cause lists",
			subtitle: listings.generated_at ? `${listings.range_label || "Range"} · last scanned ${listings.generated_at}` : "Tracked matters and watched firms for the next few court days.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
				className: fieldSelect + " w-auto",
				value: String(settings.scan_days),
				onChange: (e) => setSettings({ scan_days: Number(e.target.value) }),
				children: [
					3,
					5,
					7,
					10,
					14
				].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
					value: n,
					children: [n, " days"]
				}, n))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				disabled: listings.scanning,
				onClick: async () => {
					toast.message("Scanning published boards. This can take a minute.");
					const r = await runCauselistScan(settings.scan_days);
					if (r.ok) toast.success("Cause lists updated.");
					else toast.error(r.error);
				},
				children: listings.scanning ? "Scanning…" : "Update"
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-5 flex flex-wrap items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: listings.scanning ? "Scan running. Rows appear as each court day finishes." : rows.length ? `${mine} of your matters on the board.` : "No results yet. Tap Update to scan published lists."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "ml-auto flex gap-1 rounded-full bg-surface-2 p-1",
				children: [
					"all",
					"mine",
					"watch"
				].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setFilter(k),
					className: cn("rounded-full px-3.5 py-1.5 text-sm font-medium text-muted", filter === k && "bg-surface text-ink shadow-sm"),
					children: k === "all" ? "All" : k === "mine" ? "Mine" : "Watch"
				}, k))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[980px] text-left text-[15px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-line/80 text-xs font-medium text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-5 py-3",
							children: "Date"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-5 py-3",
							children: "Matter"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-5 py-3",
							children: "Number"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-5 py-3",
							children: "Board"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-5 py-3",
							children: "Before"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-5 py-3",
							children: "Reason"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-5 py-3" })
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: !rows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					colSpan: 7,
					className: "px-5 py-16 text-center text-muted",
					children: "No listings to display."
				}) }) : rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-line/70 last:border-0 hover:bg-canvas/70",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-5 py-4 align-top",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: r.date
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted",
								children: r.court ? `Court ${r.court}` : ""
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-5 py-4 align-top",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "max-w-[280px] font-medium leading-snug",
								children: r.matter
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted",
								children: [
									"Sr. ",
									r.serial || "—",
									r.connected ? ` · with ${r.connected}` : ""
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-5 py-4 align-top font-mono text-sm",
							children: r.number
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-5 py-4 align-top",
							children: r.list_type || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-5 py-4 align-top",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: r.judge || "—" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted",
								children: r.caption
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-5 py-4 align-top",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1",
								children: (r.reasons || []).map((z) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: z === "Your matter" ? "accent" : "muted",
									children: z
								}, z))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-5 py-4 align-top",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "text-sm font-medium text-accent",
									onClick: async () => {
										const t = toast.loading("Fetching cause list PDF…");
										const out = await downloadCauselistPdf({ data: {
											date: r.date_ddmm,
											judge: r.judge,
											list_type: r.list_type
										} });
										if (!out.ok || !out.file) {
											toast.error(out.ok ? "Missing file" : out.error, { id: t });
											return;
										}
										const bin = Uint8Array.from(atob(out.file.base64), (c) => c.charCodeAt(0));
										downloadBuffer(out.file.filename, bin.buffer, "application/pdf");
										toast.success("Downloaded.", { id: t });
									},
									children: "PDF"
								}), r.tracked && r.mid ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/matters/$id",
									params: { id: r.mid },
									className: "text-sm font-medium text-accent",
									children: "Matter"
								}) : r.add ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "text-sm font-medium text-accent",
									onClick: async () => {
										const t = toast.loading("Finding and adding the matter…");
										const out = await resolveListing({ data: r.add });
										if (!out.ok) {
											toast.error(out.error, { id: t });
											return;
										}
										const matter = matterFromLookup({
											...out.params,
											type_name: out.type_name
										}, out.lookup);
										upsertMatter(matter);
										log("add", `${matter.petitioner} v ${matter.respondent}`, "From cause list");
										toast.success("Matter added. Downloading orders…", { id: t });
										const pulled = await pullMissingOrders(matter);
										toast.success(`${pulled.added} order(s) downloaded.`);
									},
									children: "Add"
								}) : null]
							})
						})
					]
				}, i)) })]
			})
		})
	] });
}
//#endregion
export { ListingsPage as component };
