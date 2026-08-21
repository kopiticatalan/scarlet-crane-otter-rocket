import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { P as require_jsx_runtime, a as Overlay2, c as Title2, i as Description2, n as Cancel, o as Portal2, r as Content2, s as Root2, t as Action } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { b as ArrowLeft, h as Download, i as Sparkles, p as FileText, r as Trash2, v as Calendar } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as fromIsoDate, a as useTracker, b as toIsoDate, n as Route, o as caseLabel, p as uid, s as cn, u as matterCaption } from "./router-Bf7uN__Z.mjs";
import { C as objectUrlFor, S as getPdf, T as refreshMatter, _ as downloadBuffer, a as CardHeader, b as draftHearingBrief, g as buildIcs, i as CardBody, m as Label, n as Button, o as CardTitle, p as Input, r as Card, t as AppShell, w as pullMissingOrders, y as downloadIcs } from "./card-BDUGGpAD.mjs";
import { t as Checkbox } from "./checkbox-Dy8mDdUm.mjs";
import { n as StatusPill, t as DatePill } from "./status-pill-Drt2U-fB.mjs";
import { i as Trigger, n as List, r as Root2$1, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/matters._id-zyCypao6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-24 w-full rounded-xl border-0 bg-surface-2 px-3.5 py-2.5 text-[15px] text-ink placeholder:text-faint outline-none transition-[background-color,box-shadow] duration-150 focus:bg-surface focus:ring-4 focus:ring-accent/20 disabled:opacity-50", className),
		...props
	});
}
var Tabs = Root2$1;
function TabsList({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
		className: cn("inline-flex flex-wrap gap-1 rounded-full bg-surface-2 p-1", className),
		...props
	});
}
function TabsTrigger({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
		className: cn("rounded-full px-3.5 py-1.5 text-sm font-medium text-muted transition-colors duration-150 data-[state=active]:bg-surface data-[state=active]:text-ink data-[state=active]:shadow-sm", className),
		...props
	});
}
var TabsContent = Content;
var AlertDialog = Root2;
function AlertDialogContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Portal2, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overlay2, { className: "fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[min(92vw,400px)] -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-surface p-7 text-center shadow-[var(--shadow-float)]", className),
		...props
	})] });
}
function AlertDialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Title2, {
		className: cn("text-xl font-semibold tracking-tight", className),
		...props
	});
}
function AlertDialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Description2, {
		className: cn("mt-2 text-[15px] text-muted", className),
		...props
	});
}
function AlertDialogFooter({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("mt-6 flex justify-center gap-2", className),
		...props
	});
}
var AlertDialogCancel = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cancel, {
	asChild: true,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		variant: "secondary",
		className,
		...props
	})
});
var AlertDialogAction = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Action, {
	asChild: true,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		variant: "danger",
		className,
		...props
	})
});
function MatterPage() {
	const { id } = Route.useParams();
	const decoded = decodeURIComponent(id);
	const matter = useTracker((s) => s.matters.find((m) => m.id === decoded));
	const updateMatter = useTracker((s) => s.updateMatter);
	const removeMatter = useTracker((s) => s.removeMatter);
	const setNotes = useTracker((s) => s.setNotes);
	const setSteps = useTracker((s) => s.setSteps);
	const navigate = useNavigate();
	const [partner, setPartner] = (0, import_react.useState)(matter?.partner || "");
	const [associates, setAssociates] = (0, import_react.useState)(matter?.associates || "");
	const [hearing, setHearing] = (0, import_react.useState)(toIsoDate(matter?.next_hearing));
	const [brief, setBrief] = (0, import_react.useState)("");
	const [briefing, setBriefing] = (0, import_react.useState)(false);
	const [viewer, setViewer] = (0, import_react.useState)(null);
	const [confirm, setConfirm] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setPartner(matter?.partner || "");
		setAssociates(matter?.associates || "");
		setHearing(toIsoDate(matter?.next_hearing));
	}, [
		matter?.id,
		matter?.partner,
		matter?.associates,
		matter?.next_hearing
	]);
	(0, import_react.useEffect)(() => {
		return () => {
			if (viewer) URL.revokeObjectURL(viewer.url);
		};
	}, [viewer]);
	if (!matter) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-20 text-center text-muted",
		children: [
			"Matter not found.",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/matters",
				className: "font-medium text-accent",
				children: "Back to list"
			})
		]
	}) });
	const current = matter;
	async function openOrder(o) {
		const rec = await getPdf(current.id, o.key);
		if (!rec) {
			toast.error("PDF is not downloaded yet. Refresh the matter.");
			return;
		}
		if (viewer) URL.revokeObjectURL(viewer.url);
		setViewer({
			url: objectUrlFor(rec.data),
			name: rec.filename
		});
	}
	async function saveOrder(o) {
		const rec = await getPdf(current.id, o.key);
		if (!rec) {
			toast.error("PDF is not downloaded yet.");
			return;
		}
		downloadBuffer(rec.filename, rec.data, rec.mime);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/matters",
							className: "mb-3 inline-flex items-center gap-1 text-sm font-medium text-accent",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-3.5" }), " Matters"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-3xl leading-tight font-semibold tracking-tight sm:text-4xl",
							children: matterCaption(matter.petitioner, matter.respondent)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex flex-wrap items-center gap-2 text-sm text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-ink",
									children: caseLabel(matter)
								}),
								matter.status ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: matter.status }) : null,
								matter.cnr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: matter.cnr }) : null,
								matter.sample ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "sample" }) : null
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							onClick: async () => {
								const t = toast.loading("Refreshing court record…");
								const r = await refreshMatter(matter);
								if (!r.ok) toast.error(r.error, { id: t });
								else toast.success(`${r.added} new order(s).`, { id: t });
							},
							children: "Refresh"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "subtle",
							onClick: () => {
								const { ics, events } = buildIcs([matter]);
								if (!events) {
									toast.error("No upcoming dates to export.");
									return;
								}
								downloadIcs("BHC hearing.ics", ics);
								toast.success(`${events} event(s) exported.`);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "size-3.5" }), "Calendar"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "danger",
							onClick: () => setConfirm(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), "Remove"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-2xl bg-line/70 shadow-[var(--shadow-card)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-px sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
							label: "Filed",
							value: matter.filed_on || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
							label: "Registered",
							value: matter.registration_date || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
							label: "Stage / act",
							value: [matter.stage, matter.act].filter(Boolean).join(" · ") || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
							label: "Petitioner’s advocate",
							value: matter.petitioner_adv || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meta, {
							label: "Respondent’s advocate",
							value: matter.respondent_adv || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-surface px-5 py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-muted",
								children: "Next date"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DatePill, {
									value: matter.next_hearing || matter.next_listing,
									label: matter.next_hearing ? "Hearing (manual)" : matter.next_listing ? "Listing (court)" : ""
								})
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "record",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "record",
							children: "Court record"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "orders",
							children: [
								"Orders (",
								matter.orders.length,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "notes",
							children: "Notes"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "tasks",
							children: "Next steps"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "brief",
							children: "Hearing brief"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "record",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardBody, {
							className: "grid gap-3 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Partner" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: partner,
									onChange: (e) => setPartner(e.target.value)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Associates" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: associates,
									onChange: (e) => setAssociates(e.target.value)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Next hearing (manual)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: hearing,
									onChange: (e) => setHearing(e.target.value)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Last coram" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									disabled: true,
									value: matter.last_coram || "—"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "sm:col-span-2 flex justify-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: () => {
											updateMatter(matter.id, {
												partner,
												associates,
												next_hearing: fromIsoDate(hearing)
											});
											toast.success("Details saved.");
										},
										children: "Save changes"
									})
								})
							]
						}) })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "orders",
						className: "mt-4 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "secondary",
									size: "sm",
									onClick: async () => {
										const t = toast.loading("Downloading missing orders…");
										const r = await pullMissingOrders(matter);
										toast.success(`${r.added} order(s) saved.`, { id: t });
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), "Download missing"]
								})
							}),
							viewer ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "overflow-hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
									className: "truncate text-sm",
									children: viewer.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: () => setViewer(null),
									children: "Close"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
									title: viewer.name,
									src: viewer.url,
									className: "h-[70vh] w-full bg-surface-2"
								})]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardBody, {
								className: "px-0 py-1",
								children: !matter.orders.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "px-5 py-10 text-center text-sm text-muted",
									children: "No orders on the court record yet."
								}) : [...matter.orders].sort((a, b) => b.date.split("/").reverse().join("").localeCompare(a.date.split("/").reverse().join(""))).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-3 border-b border-line px-5 py-3 last:border-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "size-4 text-muted" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold",
														children: o.doc || "Order"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs text-muted",
														children: o.date
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-0.5 truncate text-xs text-muted",
												children: o.coram
											}),
											o.excerpt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 line-clamp-2 text-xs text-muted",
												children: o.excerpt
											}) : null
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex shrink-0 gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "text-sm font-medium text-accent",
											onClick: () => openOrder(o),
											children: "View"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "text-sm font-medium text-accent",
											onClick: () => saveOrder(o),
											children: "Save"
										})]
									})]
								}, o.key))
							}) })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "notes",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardBody, {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "secondary",
									size: "sm",
									onClick: () => setNotes(matter.id, [{
										id: uid(),
										text: "",
										date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
										createdAt: (/* @__PURE__ */ new Date()).toISOString()
									}, ...matter.hearing_notes]),
									children: "Add note"
								}),
								matter.hearing_notes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2 sm:grid-cols-[140px_minmax(0,1fr)_auto]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											value: n.date,
											onChange: (e) => setNotes(matter.id, matter.hearing_notes.map((x) => x.id === n.id ? {
												...x,
												date: e.target.value
											} : x))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											value: n.text,
											placeholder: "Brief hearing note…",
											onChange: (e) => setNotes(matter.id, matter.hearing_notes.map((x) => x.id === n.id ? {
												...x,
												text: e.target.value
											} : x))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											onClick: () => setNotes(matter.id, matter.hearing_notes.filter((x) => x.id !== n.id)),
											children: "Remove"
										})
									]
								}, n.id)),
								!matter.hearing_notes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: "No notes yet."
								}) : null
							]
						}) })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "tasks",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardBody, {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "secondary",
									size: "sm",
									onClick: () => setSteps(matter.id, [...matter.next_steps, {
										id: uid(),
										text: "",
										done: false,
										due: ""
									}]),
									children: "Add next step"
								}),
								matter.next_steps.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-[20px_minmax(0,1fr)_140px_auto] items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
											checked: s.done,
											onCheckedChange: (v) => setSteps(matter.id, matter.next_steps.map((x) => x.id === s.id ? {
												...x,
												done: v
											} : x))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: s.text,
											placeholder: "What needs to happen?",
											onChange: (e) => setSteps(matter.id, matter.next_steps.map((x) => x.id === s.id ? {
												...x,
												text: e.target.value
											} : x))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											value: s.due,
											onChange: (e) => setSteps(matter.id, matter.next_steps.map((x) => x.id === s.id ? {
												...x,
												due: e.target.value
											} : x))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											onClick: () => setSteps(matter.id, matter.next_steps.filter((x) => x.id !== s.id)),
											children: "Remove"
										})
									]
								}, s.id)),
								!matter.next_steps.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: "No next steps yet."
								}) : null
							]
						}) })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "brief",
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Counsel briefing note" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: "Drafted from the last orders, open tasks and hearing notes. You start it — it is never run in the background."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							disabled: briefing,
							onClick: async () => {
								setBriefing(true);
								const res = await draftHearingBrief({ data: {
									caption: matterCaption(matter.petitioner, matter.respondent),
									caseno: caseLabel(matter),
									status: matter.status,
									listing: matter.next_hearing || matter.next_listing,
									coram: matter.last_coram,
									tasks: matter.next_steps.filter((s) => !s.done).map((s) => s.text),
									notes: matter.hearing_notes.map((n) => n.text).filter(Boolean),
									excerpts: matter.orders.filter((o) => o.excerpt).slice(0, 3).map((o) => ({
										date: o.date,
										doc: o.doc,
										text: o.excerpt || ""
									}))
								} });
								setBriefing(false);
								if (!res.ok) {
									toast.error(res.error);
									return;
								}
								setBrief(res.text);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), briefing ? "Drafting…" : "Draft brief"]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardBody, { children: brief ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
							className: "font-sans text-sm leading-relaxed whitespace-pre-wrap",
							children: brief
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Download orders first so the brief can quote the last operative directions."
						}) })] })
					})
				]
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
		open: confirm,
		onOpenChange: setConfirm,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "Remove this matter?" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "It leaves the tracker. Downloaded PDFs in this browser stay until you clear site data." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "Cancel" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
				onClick: () => {
					removeMatter(matter.id);
					toast.success("Matter removed.");
					navigate({ to: "/matters" });
				},
				children: "Remove matter"
			})] })
		] })
	})] });
}
function Meta({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-surface px-5 py-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-sm text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 text-[15px] leading-snug",
			children: value
		})]
	});
}
//#endregion
export { MatterPage as component };
