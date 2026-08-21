import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell, PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskRow } from "@/components/task-row";
import { allOpenTasks, useTracker } from "@/lib/store/tracker";
import { fieldSelect, matterCaption } from "@/lib/utils";
import { todayIso } from "@/lib/dates";
import { toast } from "sonner";

export const Route = createFileRoute("/tasks")({ component: TasksPage });

function TasksPage() {
  const matters = useTracker((s) => s.matters);
  const toggleStep = useTracker((s) => s.toggleStep);
  const addStep = useTracker((s) => s.addStep);
  const [filter, setFilter] = useState<"open" | "all" | "overdue">("open");
  const [open, setOpen] = useState(false);
  const [mid, setMid] = useState(matters[0]?.id || "");
  const [text, setText] = useState("");
  const [due, setDue] = useState("");

  let items = matters.flatMap((m) => m.next_steps.map((step) => ({ matter: m, step })));
  if (filter === "open") items = items.filter((x) => !x.step.done);
  if (filter === "overdue")
    items = items.filter((x) => !x.step.done && x.step.due && x.step.due < todayIso());
  items.sort(
    (a, b) =>
      Number(a.step.done) - Number(b.step.done) ||
      (a.step.due || "9999").localeCompare(b.step.due || "9999"),
  );

  return (
    <AppShell>
      <div className="mx-auto max-w-2xl">
        <PageHeader
          title="Tasks"
          subtitle="Next steps across every matter."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                if (!matters.length) {
                  toast.error("Add a matter first, then attach a next step to it.");
                  return;
                }
                setMid(matters[0].id);
                setOpen(true);
              }}
            >
              Add task
            </Button>
          }
        />
        <div className="mb-4 flex items-center justify-between gap-3">
          <span className="text-sm text-muted">
            {items.length} {items.length === 1 ? "task" : "tasks"}
            {filter === "open" ? ` · ${allOpenTasks(matters).length} open` : ""}
          </span>
          <select
            className={fieldSelect + " w-auto"}
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
          >
            <option value="open">Open</option>
            <option value="all">All</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
        <Card>
          <CardBody className="py-1">
            {!items.length ? (
              <div className="py-14 text-center text-[15px] text-muted">
                Nothing in this view.
              </div>
            ) : (
              items.map(({ matter, step }) => (
                <TaskRow
                  key={step.id}
                  matter={matter}
                  step={step}
                  onToggle={(done) => toggleStep(matter.id, step.id, done)}
                />
              ))
            )}
          </CardBody>
        </Card>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a next step</DialogTitle>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <div>
              <Label>Matter</Label>
              <select
                className={fieldSelect}
                value={mid}
                onChange={(e) => setMid(e.target.value)}
              >
                {matters.map((m) => (
                  <option key={m.id} value={m.id}>
                    {matterCaption(m.petitioner, m.respondent)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Next step</Label>
              <Input
                placeholder="e.g. Prepare note for counsel"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            <div>
              <Label>Due date</Label>
              <Input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!text.trim()) return toast.error("Enter the next step.");
                addStep(mid, { text: text.trim(), done: false, due });
                setText("");
                setDue("");
                setOpen(false);
                toast.success("Task added.");
              }}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
