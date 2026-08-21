import { cn } from "@/lib/utils";

export function Switch({
  checked,
  onCheckedChange,
  className,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative h-8 w-14 rounded-full transition-colors duration-200 ease-out",
        checked ? "bg-ok" : "bg-line",
        className,
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 size-7 rounded-full bg-surface shadow-sm transition-transform duration-200 ease-out",
          checked && "translate-x-6",
        )}
      />
    </button>
  );
}
