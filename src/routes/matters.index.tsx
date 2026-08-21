import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { DatePill, StatusPill } from "@/components/status-pill";
import { useTracker } from "@/lib/store/tracker";
import { useUi } from "@/lib/store/ui";
import { caseLabel, fieldSelect, matterCaption } from "@/lib/utils";
import { refreshMatter } from "@/lib/orders";
import { toast } from "sonner";
import { Search } from "lucide-react";

export const Route = createFileRoute("/matters/")({ component: MattersPage });

function MattersPage() {
  const matters = useTracker((s) => s.matters);
  const hydrated = useTracker((s) => s.hydrated);
  const openAdd = useUi((s) => s.openAdd);
  const [q, setQ] = useState("");
  const [side, setSide] = useState("");
  const [filter, setFilter] = useState("");

  const rows = useMemo(() => {
    const term = q.toLowerCase();
    return matters
      .filter((m) => {
        const hay = [
          matterCaption(m.petitioner, m.respondent),
          caseLabel(m),
          m.partner,
          m.associates,
          m.cnr,
          m.status,
        ]
          .join(" ")
          .toLowerCase();
        if (term && !hay.includes(term)) return false;
        if (side && m.side !== side) return false;
        if (filter === "upcoming" && !(m.next_hearing || m.next_listing)) return false;
        if (filter === "tasks" && !m.next_steps.some((s) => !s.done)) return false;
        if (filter === "disposed" && !/dispos/i.test(m.status)) return false;
        if (filter === "pending" && /dispos/i.test(m.status)) return false;
        return true;
      })
      .sort((a, b) =>
        matterCaption(a.petitioner, a.respondent).localeCompare(
          matterCaption(b.petitioner, b.respondent),
        ),
      );
  }, [matters, q, side, filter]);

  return (
    <AppShell>
      <PageHeader
        title="Matters"
        subtitle="Orders live in this browser. Open a case to read or save the PDFs."
      />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-faint" />
          <Input
            className="pl-10"
            placeholder="Search party, case number, CNR or team"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select className={fieldSelect + " w-auto"} value={side} onChange={(e) => setSide(e.target.value)}>
          <option value="">All sides</option>
          <option value="2">Original Side</option>
          <option value="1">Appellate Side</option>
        </select>
        <select
          className={fieldSelect + " w-auto"}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All matters</option>
          <option value="upcoming">Upcoming</option>
          <option value="tasks">Open tasks</option>
          <option value="pending">Pending</option>
          <option value="disposed">Disposed</option>
        </select>
        <span className="text-xs text-muted">
          {hydrated ? `${rows.length} of ${matters.length}` : "…"}
        </span>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-[15px]">
          <thead>
            <tr className="border-b border-line/80 text-xs font-medium text-muted">
              <th className="px-5 py-3">Matter</th>
              <th className="px-5 py-3">Case</th>
              <th className="px-5 py-3">Team</th>
              <th className="px-5 py-3">Next date</th>
              <th className="px-5 py-3">Last order</th>
              <th className="px-5 py-3">Orders</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {!rows.length ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-muted">
                  No matters match this view.{" "}
                  <button className="font-medium text-accent" onClick={openAdd}>
                    Add a matter
                  </button>
                  .
                </td>
              </tr>
            ) : (
              rows.map((m) => (
                <tr key={m.id} className="border-b border-line/70 last:border-0 hover:bg-canvas/70">
                  <td className="px-5 py-4 align-top">
                    <Link
                      to="/matters/$id"
                      params={{ id: m.id }}
                      className="font-medium leading-snug hover:text-accent"
                    >
                      {matterCaption(m.petitioner, m.respondent)}
                    </Link>
                    <div className="mt-0.5 text-xs text-muted">
                      {m.side_label} · {m.stampreg_label}
                      {m.sample ? " · sample" : ""}
                    </div>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <div className="font-mono text-sm">{caseLabel(m)}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      {m.status ? <StatusPill status={m.status} /> : null}
                      {m.cnr ? <span className="text-xs text-muted">{m.cnr}</span> : null}
                    </div>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <div>{m.partner || "—"}</div>
                    <div className="text-xs text-muted">{m.associates}</div>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <DatePill
                      value={m.next_hearing || m.next_listing}
                      label={m.next_hearing ? "Hearing" : m.next_listing ? "Listing" : ""}
                    />
                  </td>
                  <td className="px-5 py-4 align-top">
                    <div>{m.last_listing || "—"}</div>
                    <div className="max-w-[180px] truncate text-xs text-muted">{m.last_coram}</div>
                  </td>
                  <td className="px-5 py-4 align-top font-medium tabular-nums">
                    {m.order_count || m.orders.length}
                  </td>
                  <td className="px-5 py-4 align-top">
                    <div className="flex justify-end gap-3">
                      <Link
                        to="/matters/$id"
                        params={{ id: m.id }}
                        className="text-sm font-medium text-accent"
                      >
                        Open
                      </Link>
                      <button
                        className="text-sm font-medium text-accent"
                        onClick={async () => {
                          const t = toast.loading("Refreshing…");
                          const r = await refreshMatter(m);
                          if (!r.ok) toast.error(r.error, { id: t });
                          else toast.success(`${r.added} new order(s).`, { id: t });
                        }}
                      >
                        Refresh
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </AppShell>
  );
}
