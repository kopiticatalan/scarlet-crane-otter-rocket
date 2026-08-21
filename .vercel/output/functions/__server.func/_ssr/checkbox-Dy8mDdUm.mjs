import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { _ as Check } from "../_libs/lucide-react.mjs";
import { s as cn } from "./router-Bf7uN__Z.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function Checkbox({ className, checked, onCheckedChange, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		role: "checkbox",
		"aria-checked": checked,
		onClick: () => onCheckedChange?.(!checked),
		className: cn("relative grid size-5 shrink-0 place-items-center rounded-md border border-line-strong transition-colors duration-150 after:absolute after:top-1/2 after:left-1/2 after:size-9 after:-translate-x-1/2 after:-translate-y-1/2", checked ? "border-accent bg-accent text-accent-fg" : "bg-surface", className),
		...props,
		children: checked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
			className: "size-3",
			strokeWidth: 3
		}) : null
	});
}
//#endregion
export { Checkbox as t };
