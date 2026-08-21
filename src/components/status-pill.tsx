import { Badge } from "@/components/ui/badge";
import { dateKind, fmtDate } from "@/lib/dates";

export function DatePill({ value, label }: { value?: string; label?: string }) {
  const kind = dateKind(value);
  const tone =
    kind === "overdue"
      ? "bad"
      : kind === "today"
        ? "accent"
        : kind === "tomorrow" || kind === "soon"
          ? "warn"
          : "muted";
  const tag =
    kind === "overdue"
      ? "Overdue"
      : kind === "today"
        ? "Today"
        : kind === "tomorrow"
          ? "Tomorrow"
          : null;
  return (
    <div>
      <Badge tone={tone}>
        {tag ? `${tag} · ` : ""}
        {fmtDate(value)}
      </Badge>
      {label ? <div className="mt-1 text-xs text-muted">{label}</div> : null}
    </div>
  );
}

export function StatusPill({ status }: { status?: string }) {
  const s = (status || "").toLowerCase();
  const tone = s.includes("dispos")
    ? "muted"
    : s.includes("pending") || s.includes("admission") || s.includes("fresh")
      ? "ok"
      : "accent";
  return <Badge tone={tone}>{status || "Unknown"}</Badge>;
}
