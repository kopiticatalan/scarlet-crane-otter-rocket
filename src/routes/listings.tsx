import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTracker } from "@/lib/store/tracker";
import { runCauselistScan } from "@/lib/scan";
import { downloadCauselistPdf, resolveListing } from "@/lib/court/actions";
import { matterFromLookup } from "@/lib/store/tracker";
import { pullMissingOrders } from "@/lib/orders";
import { toast } from "sonner";
import { downloadBuffer } from "@/lib/store/pdfs";
import { fieldSelect, cn } from "@/lib/utils";
import { useState } from "react";

export const Route = createFileRoute("/listings")({ component: ListingsPage });

function ListingsPage() {
  const listings = useTracker((s) => s.listings);
  const settings = useTracker((s) => s.settings);
  const setSettings = useTracker((s) => s.setSettings);
  const upsertMatter = useTracker((s) => s.upsertMatter);
  const log = useTracker((s) => s.log);
  const [filter, setFilter] = useState<"all" | "mine" | "watch">("all");
  const rows = listings.rows.filter((r) => {
    if (filter === "mine") return r.tracked;
    if (filter === "watch") return !r.tracked;
    return true;
  });
  const mine = listings.rows.filter((r) => r.tracked).length;

  return (
    <AppShell>
      <PageHeader
        title="Cause lists"
        subtitle={
          listings.generated_at
            ? `${listings.range_label || "Range"} · last scanned ${listings.generated_at}`
            : "Tracked matters and watched firms for the next few court days."
        }
        action={
          <>
            <select
              className={fieldSelect + " w-auto"}
              value={String(settings.scan_days)}
              onChange={(e) => setSettings({ scan_days: Number(e.target.value) })}
            >
              {[3, 5, 7, 10, 14].map((n) => (
                <option key={n} value={n}>
                  {n} days
                </option>
              ))}
            </select>
            <Button
              disabled={listings.scanning}
              onClick={async () => {
                toast.message("Scanning published boards. This can take a minute.");
                const r = await runCauselistScan(settings.scan_days);
                if (r.ok) toast.success("Cause lists updated.");
                else toast.error(r.error);
              }}
            >
              {listings.scanning ? "Scanning…" : "Update"}
            </Button>
          </>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <p className="text-sm text-muted">
          {listings.scanning
            ? "Scan running. Rows appear as each court day finishes."
            : rows.length
              ? `${mine} of your matters on the board.`
              : "No results yet. Tap Update to scan published lists."}
        </p>
        <div className="ml-auto flex gap-1 rounded-full bg-surface-2 p-1">
          {(["all", "mine", "watch"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-medium text-muted",
                filter === k && "bg-surface text-ink shadow-sm",
              )}
            >
              {k === "all" ? "All" : k === "mine" ? "Mine" : "Watch"}
            </button>
          ))}
        </div>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-[15px]">
          <thead>
            <tr className="border-b border-line/80 text-xs font-medium text-muted">
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Matter</th>
              <th className="px-5 py-3">Number</th>
              <th className="px-5 py-3">Board</th>
              <th className="px-5 py-3">Before</th>
              <th className="px-5 py-3">Reason</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {!rows.length ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-muted">
                  No listings to display.
                </td>
              </tr>
            ) : (
              rows.map((r, i) => (
                <tr key={i} className="border-b border-line/70 last:border-0 hover:bg-canvas/70">
                  <td className="px-5 py-4 align-top">
                    <div className="font-medium">{r.date}</div>
                    <div className="text-xs text-muted">{r.court ? `Court ${r.court}` : ""}</div>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <div className="max-w-[280px] font-medium leading-snug">{r.matter}</div>
                    <div className="text-xs text-muted">
                      Sr. {r.serial || "—"}
                      {r.connected ? ` · with ${r.connected}` : ""}
                    </div>
                  </td>
                  <td className="px-5 py-4 align-top font-mono text-sm">{r.number}</td>
                  <td className="px-5 py-4 align-top">{r.list_type || "—"}</td>
                  <td className="px-5 py-4 align-top">
                    <div>{r.judge || "—"}</div>
                    <div className="text-xs text-muted">{r.caption}</div>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <div className="flex flex-wrap gap-1">
                      {(r.reasons || []).map((z) => (
                        <Badge key={z} tone={z === "Your matter" ? "accent" : "muted"}>
                          {z}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <div className="flex justify-end gap-3">
                      <button
                        className="text-sm font-medium text-accent"
                        onClick={async () => {
                          const t = toast.loading("Fetching cause list PDF…");
                          const out = await downloadCauselistPdf({
                            data: {
                              date: r.date_ddmm,
                              judge: r.judge,
                              list_type: r.list_type,
                            },
                          });
                          if (!out.ok || !out.file) {
                            toast.error(out.ok ? "Missing file" : out.error, { id: t });
                            return;
                          }
                          const bin = Uint8Array.from(atob(out.file.base64), (c) =>
                            c.charCodeAt(0),
                          );
                          downloadBuffer(out.file.filename, bin.buffer, "application/pdf");
                          toast.success("Downloaded.", { id: t });
                        }}
                      >
                        PDF
                      </button>
                      {r.tracked && r.mid ? (
                        <Link
                          to="/matters/$id"
                          params={{ id: r.mid }}
                          className="text-sm font-medium text-accent"
                        >
                          Matter
                        </Link>
                      ) : r.add ? (
                        <button
                          className="text-sm font-medium text-accent"
                          onClick={async () => {
                            const t = toast.loading("Finding and adding the matter…");
                            const out = await resolveListing({ data: r.add! });
                            if (!out.ok) {
                              toast.error(out.error, { id: t });
                              return;
                            }
                            const matter = matterFromLookup(
                              { ...out.params, type_name: out.type_name },
                              out.lookup,
                            );
                            upsertMatter(matter);
                            log("add", `${matter.petitioner} v ${matter.respondent}`, "From cause list");
                            toast.success("Matter added. Downloading orders…", { id: t });
                            const pulled = await pullMissingOrders(matter);
                            toast.success(`${pulled.added} order(s) downloaded.`);
                          }}
                        >
                          Add
                        </button>
                      ) : null}
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
