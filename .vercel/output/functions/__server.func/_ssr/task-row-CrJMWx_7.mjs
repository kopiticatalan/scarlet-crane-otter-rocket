import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { s as cn, u as matterCaption, x as todayIso } from "./router-Bf7uN__Z.mjs";
import { t as Checkbox } from "./checkbox-Dy8mDdUm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/task-row-CrJMWx_7.js
var import_jsx_runtime = require_jsx_runtime();
function TaskRow({ matter, step, onToggle, compact }) {
	const late = !step.done && !!step.due && step.due < todayIso();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start gap-3 border-b border-line/70 py-3.5 last:border-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
				checked: step.done,
				onCheckedChange: onToggle,
				className: "mt-0.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("text-[15px] font-medium", step.done && "text-muted line-through"),
					children: step.text || "Untitled next step"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-0.5 text-xs text-muted",
					children: matterCaption(matter.petitioner, matter.respondent)
				})]
			}),
			step.due || !compact ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("shrink-0 text-xs font-medium text-muted", late && "text-bad"),
				children: [late ? "Overdue · " : "", step.due || ""]
			}) : null
		]
	});
}
//#endregion
export { TaskRow as t };
