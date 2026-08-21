import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as useTracker, c as fieldSelect, r as allOpenTasks, u as matterCaption, x as todayIso } from "./router-Bf7uN__Z.mjs";
import { c as DialogBody, d as DialogHeader, f as DialogTitle, h as PageHeader, i as CardBody, l as DialogContent, m as Label, n as Button, p as Input, r as Card, s as Dialog, t as AppShell, u as DialogFooter } from "./card-BDUGGpAD.mjs";
import { t as TaskRow } from "./task-row-CrJMWx_7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tasks-CfgW-7O7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TasksPage() {
	const matters = useTracker((s) => s.matters);
	const toggleStep = useTracker((s) => s.toggleStep);
	const addStep = useTracker((s) => s.addStep);
	const [filter, setFilter] = (0, import_react.useState)("open");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [mid, setMid] = (0, import_react.useState)(matters[0]?.id || "");
	const [text, setText] = (0, import_react.useState)("");
	const [due, setDue] = (0, import_react.useState)("");
	let items = matters.flatMap((m) => m.next_steps.map((step) => ({
		matter: m,
		step
	})));
	if (filter === "open") items = items.filter((x) => !x.step.done);
	if (filter === "overdue") items = items.filter((x) => !x.step.done && x.step.due && x.step.due < todayIso());
	items.sort((a, b) => Number(a.step.done) - Number(b.step.done) || (a.step.due || "9999").localeCompare(b.step.due || "9999"));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Tasks",
				subtitle: "Next steps across every matter.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					onClick: () => {
						if (!matters.length) {
							toast.error("Add a matter first, then attach a next step to it.");
							return;
						}
						setMid(matters[0].id);
						setOpen(true);
					},
					children: "Add task"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-sm text-muted",
					children: [
						items.length,
						" ",
						items.length === 1 ? "task" : "tasks",
						filter === "open" ? ` · ${allOpenTasks(matters).length} open` : ""
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					className: fieldSelect + " w-auto",
					value: filter,
					onChange: (e) => setFilter(e.target.value),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "open",
							children: "Open"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "All"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "overdue",
							children: "Overdue"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardBody, {
				className: "py-1",
				children: !items.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-14 text-center text-[15px] text-muted",
					children: "Nothing in this view."
				}) : items.map(({ matter, step }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskRow, {
					matter,
					step,
					onToggle: (done) => toggleStep(matter.id, step.id, done)
				}, step.id))
			}) })
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add a next step" }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogBody, {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Matter" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: fieldSelect,
						value: mid,
						onChange: (e) => setMid(e.target.value),
						children: matters.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: m.id,
							children: matterCaption(m.petitioner, m.respondent)
						}, m.id))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Next step" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "e.g. Prepare note for counsel",
						value: text,
						onChange: (e) => setText(e.target.value)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Due date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: due,
						onChange: (e) => setDue(e.target.value)
					})] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				onClick: () => setOpen(false),
				children: "Cancel"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => {
					if (!text.trim()) return toast.error("Enter the next step.");
					addStep(mid, {
						text: text.trim(),
						done: false,
						due
					});
					setText("");
					setDue("");
					setOpen(false);
					toast.success("Task added.");
				},
				children: "Add"
			})] })
		] })
	})] });
}
//#endregion
export { TasksPage as component };
