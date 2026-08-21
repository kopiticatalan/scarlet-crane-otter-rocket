import { Checkbox } from "@/components/ui/checkbox";
import type { Matter, NextStep } from "@/lib/types";
import { matterCaption } from "@/lib/utils";
import { todayIso } from "@/lib/dates";
import { cn } from "@/lib/utils";

export function TaskRow({
  matter,
  step,
  onToggle,
  compact,
}: {
  matter: Matter;
  step: NextStep;
  onToggle: (done: boolean) => void;
  compact?: boolean;
}) {
  const late = !step.done && !!step.due && step.due < todayIso();
  return (
    <div className="flex items-start gap-3 border-b border-line/70 py-3.5 last:border-0">
      <Checkbox checked={step.done} onCheckedChange={onToggle} className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <div className={cn("text-[15px] font-medium", step.done && "text-muted line-through")}>
          {step.text || "Untitled next step"}
        </div>
        <div className="mt-0.5 text-xs text-muted">
          {matterCaption(matter.petitioner, matter.respondent)}
        </div>
      </div>
      {step.due || !compact ? (
        <div className={cn("shrink-0 text-xs font-medium text-muted", late && "text-bad")}>
          {late ? "Overdue · " : ""}
          {step.due || ""}
        </div>
      ) : null}
    </div>
  );
}
