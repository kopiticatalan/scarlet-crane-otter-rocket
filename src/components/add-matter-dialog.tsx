import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchCase, fetchCaseTypes } from "@/lib/court/actions";
import { useUi } from "@/lib/store/ui";
import { matterFromLookup, useTracker } from "@/lib/store/tracker";
import { pullMissingOrders } from "@/lib/orders";
import type { CaseType, StampReg } from "@/lib/types";

export function AddMatterDialog() {
  const open = useUi((s) => s.addOpen);
  const closeAdd = useUi((s) => s.closeAdd);
  const upsertMatter = useTracker((s) => s.upsertMatter);
  const log = useTracker((s) => s.log);
  const matters = useTracker((s) => s.matters);

  const [side, setSide] = useState("2");
  const [stampreg, setStampreg] = useState<StampReg>("R");
  const [types, setTypes] = useState<CaseType[]>([]);
  const [caseType, setCaseType] = useState("");
  const [caseNo, setCaseNo] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoadingTypes(true);
    fetchCaseTypes({ data: { side } }).then((r) => {
      if (cancelled) return;
      setLoadingTypes(false);
      if (!r.ok) {
        toast.error(r.error);
        setTypes([]);
        return;
      }
      setTypes(r.types);
      setCaseType((cur) => cur || r.types[0]?.value || "");
    });
    return () => {
      cancelled = true;
    };
  }, [open, side]);

  async function onSave() {
    const type = types.find((t) => t.value === caseType);
    if (!caseType || !caseNo.trim() || !/^\d{4}$/.test(year)) {
      toast.error("Select a type and enter a case number and four-digit year.");
      return;
    }
    setSaving(true);
    const params = {
      side,
      stampreg,
      case_type: caseType,
      case_no: caseNo.trim(),
      year,
    };
    const res = await fetchCase({ data: params });
    if (!res.ok) {
      toast.error(res.error);
      setSaving(false);
      return;
    }
    const existing = matters.find(
      (m) =>
        m.id ===
        [side, stampreg, caseType, caseNo.trim(), year].join("|"),
    );
    const matter = matterFromLookup(
      { ...params, type_name: type?.label || "" },
      res.lookup,
      existing,
    );
    upsertMatter(matter);
    closeAdd();
    toast.success("Matter saved. Downloading orders…");
    log("add", `${matter.petitioner} v ${matter.respondent}`);
    const pulled = await pullMissingOrders(matter);
    toast.success(
      pulled.added
        ? `${pulled.added} order${pulled.added === 1 ? "" : "s"} downloaded.`
        : "No new orders to download.",
    );
    setSaving(false);
    setCaseNo("");
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? closeAdd() : null)}>
      <DialogContent wide>
        <DialogHeader>
          <DialogTitle>New matter</DialogTitle>
          <DialogDescription>
            Case types load from the court site after you choose the side.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label>Side</Label>
              <Select value={side} onValueChange={setSide}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">Original Side</SelectItem>
                  <SelectItem value="1">Appellate Side</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Register / stamp</Label>
              <Select
                value={stampreg}
                onValueChange={(v) => setStampreg(v as StampReg)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="R">Registered</SelectItem>
                  <SelectItem value="S">Stamp / lodging</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="sm:col-span-2">
              <Label>Case type</Label>
              <select
                className="field-select"
                value={caseType}
                disabled={loadingTypes}
                onChange={(e) => setCaseType(e.target.value)}
              >
                {loadingTypes ? (
                  <option>Loading types…</option>
                ) : (
                  types.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <Label>Case number</Label>
              <Input
                inputMode="numeric"
                placeholder="e.g. 1842"
                value={caseNo}
                onChange={(e) => setCaseNo(e.target.value)}
              />
            </div>
            <div>
              <Label>Year</Label>
              <Input
                inputMode="numeric"
                maxLength={4}
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
          </div>
          <p className="mt-6 text-sm text-muted">
            The court record is fetched live. Every available order is saved in this
            browser. Notes are kept if you add the same case again.
          </p>
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" onClick={closeAdd}>
            Cancel
          </Button>
          <Button onClick={onSave} disabled={saving}>
            {saving ? "Finding…" : "Find and save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
