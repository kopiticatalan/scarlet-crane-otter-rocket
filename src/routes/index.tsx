import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaskRow } from "@/components/task-row";
import { Badge } from "@/components/ui/badge";
import { DatePill } from "@/components/status-pill";
import { allOpenTasks, useTracker } from "@/lib/store/tracker";
import { useUi } from "@/lib/store/ui";
import { greeting, matterCaption, caseLabel, cn } from "@/lib/utils";
import { dateKind, fmtDate, prettyCourtDay, todayIso } from "@/lib/dates";
import { runCauselistScan } from "@/lib/scan";
import { toast } from "sonner";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <AppShell>
      <Dashboard />
    </AppShell>
  );
}

function Dashboard() {
  const matters = useTracker((s) => s.matters);
  const listings = useTracker((s) => s.listings);
  const settings = useTracker((s) => s.settings);
  const toggleStep = useTracker((s) => s.toggleStep);
  const scanning = listings.scanning;
  const openAdd = useUi((s) => s.openAdd);

  const tasks = allOpenTasks(matters).sort((a, b) =>
    (a.step.due || "9999").localeCompare(b.step.due || "9999"),
  );
  const overdue = tasks.filter((t) => t.step.due && t.step.due < todayIso()).length;
  const today = prettyCourtDay(new Date());
  const tomD = new Date();
  tomD.setDate(tomD.getDate() + 1);
  const tomorrow = prettyCourtDay(tomD);
  const listedToday = new Set(
    listings.rows.filter((r) => r.tracked && r.date_full === today.full).map((r) => r.number),
  ).size;
  const listedTom = new Set(
    listings.rows.filter((r) => r.tracked && r.date_full === tomorrow.full).map((r) => r.number),
  ).size;

  const agenda = [
    ...listings.rows
      .filter((r) => r.tracked)
      .map((r) => ({
        when: r.date_full,
        title: r.matter,
        meta: `${r.number} · ${r.list_type || "Cause list"} · ${r.judge || "Court"}`,
        kind: r.date_full === today.full ? "today" : "",
        href: r.mid ? `/matters/${encodeURIComponent(r.mid)}` : "/listings",
      })),
    ...matters
      .filter((m) => m.next_hearing)
      .map((m) => ({
        when: fmtDate(m.next_hearing),
        title: matterCaption(m.petitioner, m.respondent),
        meta: `Hearing · ${caseLabel(m)}`,
        kind: dateKind(m.next_hearing),
        href: `/matters/${encodeURIComponent(m.id)}`,
      })),
  ]
    .sort((a, b) => (a.kind === "today" ? -1 : b.kind === "today" ? 1 : a.when.localeCompare(b.when)))
    .slice(0, 8);

  const sample = matters.some((m) => m.sample);
  const dateLine = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  const stats = [
    { label: "Matters", value: matters.length, hint: "Active" },
    { label: "Today", value: listedToday, hint: "On the board" },
    { label: "Tomorrow", value: listedTom, hint: "Listed" },
    { label: "Tasks", value: tasks.length, hint: overdue ? `${overdue} overdue` : "Open" },
  ];

  const hearings = matters
    .filter((m) => m.next_hearing || m.next_listing)
    .sort((a, b) =>
      (a.next_hearing || a.next_listing).localeCompare(b.next_hearing || b.next_listing),
    )
    .slice(0, 6);

  return (
    <div className="stagger-in space-y-8">
      {sample ? (
        <p className="text-sm text-muted">
          Sample matters are loaded. Add a real case, or import from Settings.
        </p>
      ) : null}

      <PageHeader
        title={greeting()}
        subtitle={
          listings.generated_at
            ? `${dateLine}. Cause lists checked ${listings.generated_at}.`
            : `${dateLine}. Add a matter, then scan the cause lists.`
        }
        action={
          <Button
            variant="secondary"
            disabled={scanning}
            onClick={async () => {
              toast.message("Scanning published Bombay HC boards…");
              const r = await runCauselistScan(settings.scan_days);
              if (r.ok) toast.success("Cause lists updated.");
              else toast.error(r.error);
            }}
          >
            {scanning ? "Scanning…" : "Scan lists"}
          </Button>
        }
      />

      <Card>
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={cn(
                "px-6 py-5",
                i < stats.length - 1 && "lg:border-r lg:border-line/80",
                i % 2 === 0 && "max-lg:border-r max-lg:border-line/80",
                i < 2 && "max-lg:border-b max-lg:border-line/80",
              )}
            >
              <div className="text-sm text-muted">{s.label}</div>
              <div className="mt-1 text-4xl font-semibold tracking-tight tabular-nums">
                {s.value}
              </div>
              <div className="mt-1 text-xs text-faint">{s.hint}</div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,.85fr)]">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Today</CardTitle>
              <p className="mt-0.5 text-sm text-muted">Hearings and listings</p>
            </div>
            <Link to="/listings" className="text-sm font-medium text-accent">
              See all
            </Link>
          </CardHeader>
          <CardBody className="px-0 pt-0">
            {!agenda.length ? (
              <div className="px-6 py-12 text-center text-[15px] text-muted">
                Nothing on the board.{" "}
                <button className="font-medium text-accent" onClick={openAdd}>
                  Add a matter
                </button>
                .
              </div>
            ) : (
              agenda.map((a, i) => (
                <a
                  key={i}
                  href={a.href}
                  className="grid grid-cols-1 items-start gap-1 border-t border-line/70 px-6 py-4 hover:bg-canvas/80 md:grid-cols-[88px_minmax(0,1fr)_auto] md:gap-4"
                >
                  <div className="text-sm font-medium text-accent">{a.when}</div>
                  <div className="min-w-0">
                    <div className="text-[15px] font-medium leading-snug">{a.title}</div>
                    <div className="mt-0.5 text-xs text-muted">{a.meta}</div>
                  </div>
                  {a.kind ? (
                    <Badge
                      tone={
                        a.kind === "overdue" ? "bad" : a.kind === "today" ? "accent" : "warn"
                      }
                    >
                      {a.kind === "today" ? "Today" : a.kind}
                    </Badge>
                  ) : null}
                </a>
              ))
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>To do</CardTitle>
              <p className="mt-0.5 text-sm text-muted">Next steps</p>
            </div>
            <Link to="/tasks" className="text-sm font-medium text-accent">
              See all
            </Link>
          </CardHeader>
          <CardBody className="pt-0">
            {!tasks.length ? (
              <div className="py-12 text-center text-[15px] text-muted">
                No open next steps.
              </div>
            ) : (
              tasks.slice(0, 7).map(({ matter, step }) => (
                <TaskRow
                  key={step.id}
                  matter={matter}
                  step={step}
                  compact
                  onToggle={(done) => toggleStep(matter.id, step.id, done)}
                />
              ))
            )}
          </CardBody>
        </Card>
      </div>

      {hearings.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4 pt-0">
            {hearings.map((m) => (
              <Link
                key={m.id}
                to="/matters/$id"
                params={{ id: m.id }}
                className="flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="truncate text-[15px] font-medium">
                    {matterCaption(m.petitioner, m.respondent)}
                  </div>
                  <div className="font-mono text-xs text-muted">{caseLabel(m)}</div>
                </div>
                <DatePill
                  value={m.next_hearing || m.next_listing}
                  label={m.next_hearing ? "Hearing" : "Listing"}
                />
              </Link>
            ))}
          </CardBody>
        </Card>
      ) : null}
    </div>
  );
}
