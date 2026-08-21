import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-24 w-full rounded-xl border-0 bg-surface-2 px-3.5 py-2.5 text-[15px] text-ink placeholder:text-faint outline-none transition-[background-color,box-shadow] duration-150 focus:bg-surface focus:ring-4 focus:ring-accent/20 disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
