import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { g as fmtDate, h as dateKind } from "./router-Bf7uN__Z.mjs";
import { t as Badge } from "./badge-AImXfGyF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-pill-Drt2U-fB.js
var import_jsx_runtime = require_jsx_runtime();
function DatePill({ value, label }) {
	const kind = dateKind(value);
	const tone = kind === "overdue" ? "bad" : kind === "today" ? "accent" : kind === "tomorrow" || kind === "soon" ? "warn" : "muted";
	const tag = kind === "overdue" ? "Overdue" : kind === "today" ? "Today" : kind === "tomorrow" ? "Tomorrow" : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
		tone,
		children: [tag ? `${tag} · ` : "", fmtDate(value)]
	}), label ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-1 text-xs text-muted",
		children: label
	}) : null] });
}
function StatusPill({ status }) {
	const s = (status || "").toLowerCase();
	const tone = s.includes("dispos") ? "muted" : s.includes("pending") || s.includes("admission") || s.includes("fresh") ? "ok" : "accent";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		tone,
		children: status || "Unknown"
	});
}
//#endregion
export { StatusPill as n, DatePill as t };
