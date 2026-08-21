import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useTracker } from "@/lib/store/tracker";
import { parseImportPayload } from "@/lib/import-export";
import { requestNotify } from "@/lib/scan";
import { fieldSelect } from "@/lib/utils";
import { toast } from "sonner";
import { useState, type ReactNode } from "react";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const settings = useTracker((s) => s.settings);
  const setSettings = useTracker((s) => s.setSettings);
  const loadSample = useTracker((s) => s.loadSample);
  const clearSample = useTracker((s) => s.clearSample);
  const importMatters = useTracker((s) => s.importMatters);
  const matters = useTracker((s) => s.matters);
  const listings = useTracker((s) => s.listings);
  const log = useTracker((s) => s.log);
  const [watch, setWatch] = useState("");
  const [watched, setWatched] = useState(settings.watched);

  return (
    <AppShell>
      <div className="mx-auto max-w-xl">
        <PageHeader title="Settings" subtitle="Scan, watch-list, backup, and notifications." />

        <Section title="Watch list">
          <Card>
            <CardBody className="space-y-3">
              <p className="text-sm text-muted">
                Cause lists also surface matters where these firms appear — Bombay High Court, SAT and NCLT.
              </p>
              {watched.map((w, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={w}
                    onChange={(e) => {
                      const next = [...watched];
                      next[i] = e.target.value;
                      setWatched(next);
                    }}
                  />
                  <Button
                    variant="ghost"
                    onClick={() => setWatched(watched.filter((_, j) => j !== i))}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  placeholder="Firm name"
                  value={watch}
                  onChange={(e) => setWatch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && watch.trim()) {
                      setWatched([...watched, watch.trim()]);
                      setWatch("");
                    }
                  }}
                />
                <Button
                  variant="secondary"
                  onClick={() => {
                    if (!watch.trim()) return;
                    setWatched([...watched, watch.trim()]);
                    setWatch("");
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex justify-end pt-1">
                <Button
                  size="sm"
                  onClick={() => {
                    setSettings({ watched: watched.map((w) => w.trim()).filter(Boolean) });
                    toast.success("Watch list saved.");
                  }}
                >
                  Save
                </Button>
              </div>
            </CardBody>
          </Card>
        </Section>

        <Section title="Cause lists">
          <Card>
            <CardBody className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[15px] font-medium">Scan horizon</div>
                <p className="text-sm text-muted">Days ahead to include.</p>
              </div>
              <select
                className={fieldSelect + " w-28"}
                value={String(settings.scan_days)}
                onChange={(e) => setSettings({ scan_days: Number(e.target.value) })}
              >
                {[3, 5, 7, 10, 14].map((n) => (
                  <option key={n} value={n}>
                    {n} days
                  </option>
                ))}
              </select>
            </CardBody>
          </Card>
        </Section>

        <Section title="Notifications">
          <Card>
            <CardBody className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[15px] font-medium">Alerts</div>
                <p className="text-sm text-muted">When one of your matters is listed today.</p>
              </div>
              <Switch
                checked={settings.notify}
                onCheckedChange={async (v) => {
                  if (v) await requestNotify();
                  setSettings({ notify: v });
                }}
              />
            </CardBody>
          </Card>
        </Section>

        <Section title="Data">
          <Card>
            <CardBody className="space-y-4">
              <p className="text-sm text-muted">
                Matters stay in this browser. Import the original Mac tracker’s{" "}
                <span className="font-mono">matters.json</span>.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    const blob = new Blob(
                      [JSON.stringify({ matters, settings, listings }, null, 2)],
                      { type: "application/json" },
                    );
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "bhc-matters.json";
                    a.click();
                    URL.revokeObjectURL(url);
                    toast.success("Backup downloaded.");
                  }}
                >
                  Export
                </Button>
                <label className="inline-flex h-11 cursor-pointer items-center rounded-full bg-surface-2 px-5 text-[15px] font-medium">
                  Import
                  <input
                    type="file"
                    accept="application/json,.json"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (!file) return;
                      try {
                        const json = JSON.parse(await file.text());
                        const incoming = parseImportPayload(json);
                        if (!incoming.length) {
                          toast.error("No matters found in that file.");
                          return;
                        }
                        const r = importMatters(incoming);
                        log("import", `Imported ${r.added + r.updated} matter(s)`);
                        toast.success(`Imported ${r.added} new, updated ${r.updated}.`);
                      } catch {
                        toast.error("Could not read that JSON file.");
                      }
                    }}
                  />
                </label>
              </div>
            </CardBody>
          </Card>
        </Section>

        <Section title="Mac app">
          <Card>
            <CardBody className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-[15px] font-medium">Matter Tracker for Mac</div>
                <p className="text-sm text-muted">
                  Unzip, drag to Applications, then right-click → Open.
                </p>
              </div>
              <a href="/Matter-Tracker-for-Mac.zip" download="Matter-Tracker-for-Mac.zip">
                <Button>Download</Button>
              </a>
            </CardBody>
          </Card>
        </Section>

        <Section title="Sample">
          <Card>
            <CardBody className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted">Four fictional matters to look around.</p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    loadSample();
                    toast.success("Sample matters added.");
                  }}
                >
                  Load
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    clearSample();
                    toast.success("Sample matters removed.");
                  }}
                >
                  Remove
                </Button>
              </div>
            </CardBody>
          </Card>
        </Section>
      </div>
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-2 px-1 text-xs font-medium tracking-wide text-muted uppercase">
        {title}
      </h2>
      {children}
    </section>
  );
}
