import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePill, StatusPill } from "@/components/status-pill";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTracker } from "@/lib/store/tracker";
import { caseLabel, matterCaption, uid } from "@/lib/utils";
import { fromIsoDate, toIsoDate } from "@/lib/dates";
import { refreshMatter, pullMissingOrders } from "@/lib/orders";
import { draftHearingBrief } from "@/lib/court/actions";
import { buildIcs, downloadIcs } from "@/lib/ics";
import { downloadBuffer, getPdf, objectUrlFor } from "@/lib/store/pdfs";
import { toast } from "sonner";
import { ArrowLeft, Calendar, Download, FileText, Sparkles, Trash2 } from "lucide-react";
import type { OrderMeta } from "@/lib/types";

export const Route = createFileRoute("/matters/$id")({ component: MatterPage });

function MatterPage() {
  const { id } = Route.useParams();
  const decoded = decodeURIComponent(id);
  const matter = useTracker((s) => s.matters.find((m) => m.id === decoded));
  const updateMatter = useTracker((s) => s.updateMatter);
  const removeMatter = useTracker((s) => s.removeMatter);
  const setNotes = useTracker((s) => s.setNotes);
  const setSteps = useTracker((s) => s.setSteps);
  const navigate = useNavigate();
  const [partner, setPartner] = useState(matter?.partner || "");
  const [associates, setAssociates] = useState(matter?.associates || "");
  const [hearing, setHearing] = useState(toIsoDate(matter?.next_hearing));
  const [brief, setBrief] = useState("");
  const [briefing, setBriefing] = useState(false);
  const [viewer, setViewer] = useState<{ url: string; name: string } | null>(null);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    setPartner(matter?.partner || "");
    setAssociates(matter?.associates || "");
    setHearing(toIsoDate(matter?.next_hearing));
  }, [matter?.id, matter?.partner, matter?.associates, matter?.next_hearing]);

  useEffect(() => {
    return () => {
      if (viewer) URL.revokeObjectURL(viewer.url);
    };
  }, [viewer]);

  if (!matter) {
    return (
      <AppShell>
        <div className="py-20 text-center text-muted">
          Matter not found.{" "}
          <Link to="/matters" className="font-medium text-accent">
            Back to list
          </Link>
        </div>
      </AppShell>
    );
  }

  const current = matter;

  async function openOrder(o: OrderMeta) {
    const rec = await getPdf(current.id, o.key);
    if (!rec) {
      toast.error("PDF is not downloaded yet. Refresh the matter.");
      return;
    }
    if (viewer) URL.revokeObjectURL(viewer.url);
    setViewer({ url: objectUrlFor(rec.data), name: rec.filename });
  }

  async function saveOrder(o: OrderMeta) {
    const rec = await getPdf(current.id, o.key);
    if (!rec) {
      toast.error("PDF is not downloaded yet.");
      return;
    }
    downloadBuffer(rec.filename, rec.data, rec.mime);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <Link
              to="/matters"
              className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-accent"
            >
              <ArrowLeft className="size-3.5" /> Matters
            </Link>
            <h1 className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
              {matterCaption(matter.petitioner, matter.respondent)}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted">
              <span className="font-mono text-ink">{caseLabel(matter)}</span>
              {matter.status ? <StatusPill status={matter.status} /> : null}
              {matter.cnr ? <span>{matter.cnr}</span> : null}
              {matter.sample ? <span>sample</span> : null}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={async () => {
                const t = toast.loading("Refreshing court record…");
                const r = await refreshMatter(matter);
                if (!r.ok) toast.error(r.error, { id: t });
                else toast.success(`${r.added} new order(s).`, { id: t });
              }}
            >
              Refresh
            </Button>
            <Button
              variant="subtle"
              onClick={() => {
                const { ics, events } = buildIcs([matter]);
                if (!events) {
                  toast.error("No upcoming dates to export.");
                  return;
                }
                downloadIcs("BHC hearing.ics", ics);
                toast.success(`${events} event(s) exported.`);
              }}
            >
              <Calendar className="size-3.5" />
              Calendar
            </Button>
            <Button variant="danger" onClick={() => setConfirm(true)}>
              <Trash2 className="size-3.5" />
              Remove
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-line/70 shadow-[var(--shadow-card)]">
          <div className="grid gap-px sm:grid-cols-3">
            <Meta label="Filed" value={matter.filed_on || "—"} />
            <Meta label="Registered" value={matter.registration_date || "—"} />
            <Meta
              label="Stage / act"
              value={[matter.stage, matter.act].filter(Boolean).join(" · ") || "—"}
            />
            <Meta label="Petitioner’s advocate" value={matter.petitioner_adv || "—"} />
            <Meta label="Respondent’s advocate" value={matter.respondent_adv || "—"} />
            <div className="bg-surface px-5 py-4">
              <div className="text-sm text-muted">Next date</div>
              <div className="mt-1">
                <DatePill
                  value={matter.next_hearing || matter.next_listing}
                  label={
                    matter.next_hearing
                      ? "Hearing (manual)"
                      : matter.next_listing
                        ? "Listing (court)"
                        : ""
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="record">
          <TabsList>
            <TabsTrigger value="record">Court record</TabsTrigger>
            <TabsTrigger value="orders">Orders ({matter.orders.length})</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="tasks">Next steps</TabsTrigger>
            <TabsTrigger value="brief">Hearing brief</TabsTrigger>
          </TabsList>

          <TabsContent value="record" className="mt-4">
            <Card>
              <CardBody className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label>Partner</Label>
                  <Input value={partner} onChange={(e) => setPartner(e.target.value)} />
                </div>
                <div>
                  <Label>Associates</Label>
                  <Input value={associates} onChange={(e) => setAssociates(e.target.value)} />
                </div>
                <div>
                  <Label>Next hearing (manual)</Label>
                  <Input type="date" value={hearing} onChange={(e) => setHearing(e.target.value)} />
                </div>
                <div>
                  <Label>Last coram</Label>
                  <Input disabled value={matter.last_coram || "—"} />
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <Button
                    onClick={() => {
                      updateMatter(matter.id, {
                        partner,
                        associates,
                        next_hearing: fromIsoDate(hearing),
                      });
                      toast.success("Details saved.");
                    }}
                  >
                    Save changes
                  </Button>
                </div>
              </CardBody>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-4 space-y-4">
            <div className="flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={async () => {
                  const t = toast.loading("Downloading missing orders…");
                  const r = await pullMissingOrders(matter);
                  toast.success(`${r.added} order(s) saved.`, { id: t });
                }}
              >
                <Download className="size-3.5" />
                Download missing
              </Button>
            </div>
            {viewer ? (
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="truncate text-sm">{viewer.name}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setViewer(null)}>
                    Close
                  </Button>
                </CardHeader>
                <iframe title={viewer.name} src={viewer.url} className="h-[70vh] w-full bg-surface-2" />
              </Card>
            ) : null}
            <Card>
              <CardBody className="px-0 py-1">
                {!matter.orders.length ? (
                  <div className="px-5 py-10 text-center text-sm text-muted">
                    No orders on the court record yet.
                  </div>
                ) : (
                  [...matter.orders]
                    .sort((a, b) =>
                      b.date.split("/").reverse().join("").localeCompare(
                        a.date.split("/").reverse().join(""),
                      ),
                    )
                    .map((o) => (
                      <div
                        key={o.key}
                        className="flex items-start justify-between gap-3 border-b border-line px-5 py-3 last:border-0"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <FileText className="size-4 text-muted" />
                            <span className="font-semibold">{o.doc || "Order"}</span>
                            <span className="text-xs text-muted">{o.date}</span>
                          </div>
                          <div className="mt-0.5 truncate text-xs text-muted">{o.coram}</div>
                          {o.excerpt ? (
                            <p className="mt-1 line-clamp-2 text-xs text-muted">{o.excerpt}</p>
                          ) : null}
                        </div>
                        <div className="flex shrink-0 gap-2">
                          <button
                            className="text-sm font-medium text-accent"
                            onClick={() => openOrder(o)}
                          >
                            View
                          </button>
                          <button
                            className="text-sm font-medium text-accent"
                            onClick={() => saveOrder(o)}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </CardBody>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="mt-4">
            <Card>
              <CardBody className="space-y-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    setNotes(matter.id, [
                      {
                        id: uid(),
                        text: "",
                        date: new Date().toISOString().slice(0, 10),
                        createdAt: new Date().toISOString(),
                      },
                      ...matter.hearing_notes,
                    ])
                  }
                >
                  Add note
                </Button>
                {matter.hearing_notes.map((n) => (
                  <div key={n.id} className="grid gap-2 sm:grid-cols-[140px_minmax(0,1fr)_auto]">
                    <Input
                      type="date"
                      value={n.date}
                      onChange={(e) =>
                        setNotes(
                          matter.id,
                          matter.hearing_notes.map((x) =>
                            x.id === n.id ? { ...x, date: e.target.value } : x,
                          ),
                        )
                      }
                    />
                    <Textarea
                      value={n.text}
                      placeholder="Brief hearing note…"
                      onChange={(e) =>
                        setNotes(
                          matter.id,
                          matter.hearing_notes.map((x) =>
                            x.id === n.id ? { ...x, text: e.target.value } : x,
                          ),
                        )
                      }
                    />
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setNotes(
                          matter.id,
                          matter.hearing_notes.filter((x) => x.id !== n.id),
                        )
                      }
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                {!matter.hearing_notes.length ? (
                  <p className="text-sm text-muted">No notes yet.</p>
                ) : null}
              </CardBody>
            </Card>
          </TabsContent>

          <TabsContent value="tasks" className="mt-4">
            <Card>
              <CardBody className="space-y-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    setSteps(matter.id, [
                      ...matter.next_steps,
                      { id: uid(), text: "", done: false, due: "" },
                    ])
                  }
                >
                  Add next step
                </Button>
                {matter.next_steps.map((s) => (
                  <div key={s.id} className="grid grid-cols-[20px_minmax(0,1fr)_140px_auto] items-center gap-2">
                    <Checkbox
                      checked={s.done}
                      onCheckedChange={(v) =>
                        setSteps(
                          matter.id,
                          matter.next_steps.map((x) =>
                            x.id === s.id ? { ...x, done: v } : x,
                          ),
                        )
                      }
                    />
                    <Input
                      value={s.text}
                      placeholder="What needs to happen?"
                      onChange={(e) =>
                        setSteps(
                          matter.id,
                          matter.next_steps.map((x) =>
                            x.id === s.id ? { ...x, text: e.target.value } : x,
                          ),
                        )
                      }
                    />
                    <Input
                      type="date"
                      value={s.due}
                      onChange={(e) =>
                        setSteps(
                          matter.id,
                          matter.next_steps.map((x) =>
                            x.id === s.id ? { ...x, due: e.target.value } : x,
                          ),
                        )
                      }
                    />
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setSteps(
                          matter.id,
                          matter.next_steps.filter((x) => x.id !== s.id),
                        )
                      }
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                {!matter.next_steps.length ? (
                  <p className="text-sm text-muted">No next steps yet.</p>
                ) : null}
              </CardBody>
            </Card>
          </TabsContent>

          <TabsContent value="brief" className="mt-4">
            <Card>
              <CardHeader>
                <div>
                  <CardTitle>Counsel briefing note</CardTitle>
                  <p className="mt-1 text-xs text-muted">
                    Drafted from the last orders, open tasks and hearing notes.
                    You start it — it is never run in the background.
                  </p>
                </div>
                <Button
                  disabled={briefing}
                  onClick={async () => {
                    setBriefing(true);
                    const res = await draftHearingBrief({
                      data: {
                        caption: matterCaption(matter.petitioner, matter.respondent),
                        caseno: caseLabel(matter),
                        status: matter.status,
                        listing: matter.next_hearing || matter.next_listing,
                        coram: matter.last_coram,
                        tasks: matter.next_steps.filter((s) => !s.done).map((s) => s.text),
                        notes: matter.hearing_notes.map((n) => n.text).filter(Boolean),
                        excerpts: matter.orders
                          .filter((o) => o.excerpt)
                          .slice(0, 3)
                          .map((o) => ({
                            date: o.date,
                            doc: o.doc,
                            text: o.excerpt || "",
                          })),
                      },
                    });
                    setBriefing(false);
                    if (!res.ok) {
                      toast.error(res.error);
                      return;
                    }
                    setBrief(res.text);
                  }}
                >
                  <Sparkles className="size-3.5" />
                  {briefing ? "Drafting…" : "Draft brief"}
                </Button>
              </CardHeader>
              <CardBody>
                {brief ? (
                  <pre className="font-sans text-sm leading-relaxed whitespace-pre-wrap">
                    {brief}
                  </pre>
                ) : (
                  <p className="text-sm text-muted">
                    Download orders first so the brief can quote the last operative directions.
                  </p>
                )}
              </CardBody>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={confirm} onOpenChange={setConfirm}>
        <AlertDialogContent>
          <AlertDialogTitle>Remove this matter?</AlertDialogTitle>
          <AlertDialogDescription>
            It leaves the tracker. Downloaded PDFs in this browser stay until you
            clear site data.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                removeMatter(matter.id);
                toast.success("Matter removed.");
                void navigate({ to: "/matters" });
              }}
            >
              Remove matter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface px-5 py-4">
      <div className="text-sm text-muted">{label}</div>
      <div className="mt-1 text-[15px] leading-snug">{value}</div>
    </div>
  );
}
