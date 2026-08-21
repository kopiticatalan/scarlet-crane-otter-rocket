import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as STAMP_LABEL, S as SIDE_LABEL, a as useTracker, c as fieldSelect, m as clockNow, p as uid, s as cn } from "./router-Bf7uN__Z.mjs";
import { h as PageHeader, i as CardBody, n as Button, p as Input, r as Card, t as AppShell } from "./card-BDUGGpAD.mjs";
import { t as requestNotify } from "./scan-eV4xE6y2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-BWXglhdj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Switch({ checked, onCheckedChange, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		role: "switch",
		"aria-checked": checked,
		onClick: () => onCheckedChange(!checked),
		className: cn("relative h-8 w-14 rounded-full transition-colors duration-200 ease-out", checked ? "bg-ok" : "bg-line", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("absolute top-0.5 left-0.5 size-7 rounded-full bg-surface shadow-sm transition-transform duration-200 ease-out", checked && "translate-x-6") })
	});
}
function asSteps(raw) {
	if (!Array.isArray(raw)) return [];
	return raw.map((s) => {
		if (typeof s === "string") return {
			id: uid(),
			text: s,
			done: false,
			due: ""
		};
		if (s && typeof s === "object") {
			const o = s;
			return {
				id: String(o.id || uid()),
				text: String(o.text || ""),
				done: Boolean(o.done),
				due: String(o.due || "")
			};
		}
		return null;
	}).filter((s) => !!s && !!s.text);
}
function asNotes(raw) {
	if (!Array.isArray(raw)) return [];
	return raw.map((n) => {
		if (typeof n === "string") return {
			id: uid(),
			text: n,
			date: "",
			createdAt: clockNow()
		};
		if (n && typeof n === "object") {
			const o = n;
			const text = String(o.text || n);
			return {
				id: String(o.id || uid()),
				text,
				date: String(o.date || ""),
				createdAt: String(o.createdAt || clockNow())
			};
		}
		return null;
	}).filter((n) => !!n && !!n.text);
}
function normalizeImportedMatter(raw) {
	const side = String(raw.side || "2");
	const stampreg = String(raw.stampreg || "R");
	const case_type = String(raw.case_type || "");
	const case_no = String(raw.case_no || "");
	const year = String(raw.year || "");
	if (!case_type || !case_no || !year) return null;
	return {
		id: String(raw.id || "") || [
			side,
			stampreg,
			case_type,
			case_no,
			year
		].join("|"),
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
		orders: Array.isArray(raw.orders) ? raw.orders.map((o) => {
			const x = o || {};
			return {
				key: String(x.key || `${x.date || ""}|${x.doc || ""}`),
				srl: String(x.srl || ""),
				date: String(x.date || ""),
				doc: String(x.doc || ""),
				coram: String(x.coram || ""),
				downloaded: Boolean(x.downloaded),
				excerpt: x.excerpt ? String(x.excerpt) : void 0
			};
		}) : [],
		added_at: String(raw.added_at || clockNow()),
		last_refresh: String(raw.last_refresh || ""),
		last_added: Number(raw.last_added || 0),
		sample: false
	};
}
function parseImportPayload(json) {
	return (Array.isArray(json) ? json : json && typeof json === "object" && Array.isArray(json.matters) ? json.matters : []).map((row) => row && typeof row === "object" ? normalizeImportedMatter(row) : null).filter((m) => !!m);
}
function SettingsPage() {
	const settings = useTracker((s) => s.settings);
	const setSettings = useTracker((s) => s.setSettings);
	const loadSample = useTracker((s) => s.loadSample);
	const clearSample = useTracker((s) => s.clearSample);
	const importMatters = useTracker((s) => s.importMatters);
	const matters = useTracker((s) => s.matters);
	const listings = useTracker((s) => s.listings);
	const log = useTracker((s) => s.log);
	const [watch, setWatch] = (0, import_react.useState)("");
	const [watched, setWatched] = (0, import_react.useState)(settings.watched);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Settings",
				subtitle: "Scan, watch-list, backup, and notifications."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Watch list",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardBody, {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Cause lists also surface matters where these firms appear."
						}),
						watched.map((w, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: w,
								onChange: (e) => {
									const next = [...watched];
									next[i] = e.target.value;
									setWatched(next);
								}
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => setWatched(watched.filter((_, j) => j !== i)),
								children: "Remove"
							})]
						}, i)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Firm name",
								value: watch,
								onChange: (e) => setWatch(e.target.value),
								onKeyDown: (e) => {
									if (e.key === "Enter" && watch.trim()) {
										setWatched([...watched, watch.trim()]);
										setWatch("");
									}
								}
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "secondary",
								onClick: () => {
									if (!watch.trim()) return;
									setWatched([...watched, watch.trim()]);
									setWatch("");
								},
								children: "Add"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-end pt-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: () => {
									setSettings({ watched: watched.map((w) => w.trim()).filter(Boolean) });
									toast.success("Watch list saved.");
								},
								children: "Save"
							})
						})
					]
				}) })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Cause lists",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardBody, {
					className: "flex items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[15px] font-medium",
						children: "Scan horizon"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Days ahead to include."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: fieldSelect + " w-28",
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
					})]
				}) })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Notifications",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardBody, {
					className: "flex items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[15px] font-medium",
						children: "Alerts"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "When one of your matters is listed today."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: settings.notify,
						onCheckedChange: async (v) => {
							if (v) await requestNotify();
							setSettings({ notify: v });
						}
					})]
				}) })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Data",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardBody, {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							"Matters stay in this browser. Import the original Mac tracker’s",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono",
								children: "matters.json"
							}),
							"."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: () => {
								const blob = new Blob([JSON.stringify({
									matters,
									settings,
									listings
								}, null, 2)], { type: "application/json" });
								const url = URL.createObjectURL(blob);
								const a = document.createElement("a");
								a.href = url;
								a.download = "bhc-matters.json";
								a.click();
								URL.revokeObjectURL(url);
								toast.success("Backup downloaded.");
							},
							children: "Export"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "inline-flex h-11 cursor-pointer items-center rounded-full bg-surface-2 px-5 text-[15px] font-medium",
							children: ["Import", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: "application/json,.json",
								className: "hidden",
								onChange: async (e) => {
									const file = e.target.files?.[0];
									e.target.value = "";
									if (!file) return;
									try {
										const incoming = parseImportPayload(JSON.parse(await file.text()));
										if (!incoming.length) {
											toast.error("No matters found in that file.");
											return;
										}
										const r = importMatters(incoming);
										log("import", `Imported ${r.added + r.updated} matter(s)`);
										toast.success(`Imported ${r.added} new, updated ${r.updated}.`);
									} catch {
										toast.error("Could not read that JSON file.");
									}
								}
							})]
						})]
					})]
				}) })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Sample",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardBody, {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Four fictional matters to look around."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							size: "sm",
							onClick: () => {
								loadSample();
								toast.success("Sample matters added.");
							},
							children: "Load"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => {
								clearSample();
								toast.success("Sample matters removed.");
							},
							children: "Remove"
						})]
					})]
				}) })
			})
		]
	}) });
}
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mb-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-2 px-1 text-xs font-medium tracking-wide text-muted uppercase",
			children: title
		}), children]
	});
}
//#endregion
export { SettingsPage as component };
