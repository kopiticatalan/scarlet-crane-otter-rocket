import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Checkbox({
  className,
  checked,
  onCheckedChange,
  ...props
}: Omit<React.ComponentProps<"button">, "onChange"> & {
  checked?: boolean;
  onCheckedChange?: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "relative grid size-5 shrink-0 place-items-center rounded-md border border-line-strong transition-colors duration-150 after:absolute after:top-1/2 after:left-1/2 after:size-9 after:-translate-x-1/2 after:-translate-y-1/2",
        checked ? "border-accent bg-accent text-accent-fg" : "bg-surface",
        className,
      )}
      {...props}
    >
      {checked ? <Check className="size-3" strokeWidth={3} /> : null}
    </button>
  );
}
