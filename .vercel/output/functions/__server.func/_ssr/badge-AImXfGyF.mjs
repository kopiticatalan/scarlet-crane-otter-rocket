import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { s as cn } from "./router-Bf7uN__Z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-AImXfGyF.js
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", {
	variants: { tone: {
		muted: "bg-surface-2 text-muted",
		accent: "bg-accent-2 text-accent",
		ok: "bg-ok-2 text-ok",
		warn: "bg-warn-2 text-warn",
		bad: "bg-bad-2 text-bad",
		navy: "bg-ink text-navy-fg"
	} },
	defaultVariants: { tone: "muted" }
});
function Badge({ className, tone, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({
			tone,
			className
		})),
		...props
	});
}
//#endregion
export { Badge as t };
