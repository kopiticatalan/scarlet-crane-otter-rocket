import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      tone: {
        muted: "bg-surface-2 text-muted",
        accent: "bg-accent-2 text-accent",
        ok: "bg-ok-2 text-ok",
        warn: "bg-warn-2 text-warn",
        bad: "bg-bad-2 text-bad",
        navy: "bg-ink text-navy-fg",
      },
    },
    defaultVariants: { tone: "muted" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone, className }))} {...props} />;
}
