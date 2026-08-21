import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  CalendarDays,
  Gavel,
  LayoutDashboard,
  ListChecks,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Scale,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddMatterDialog } from "@/components/add-matter-dialog";
import { useUi } from "@/lib/store/ui";
import { useTracker } from "@/lib/store/tracker";
import { refreshMatter } from "@/lib/orders";
import { buildIcs, downloadIcs } from "@/lib/ics";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Today", icon: LayoutDashboard },
  { to: "/matters", label: "Matters", icon: Scale },
  { to: "/listings", label: "Lists", icon: Gavel },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-4xl font-semibold tracking-tight text-ink">{title}</h1>
        {subtitle ? <p className="mt-1 max-w-xl text-[15px] text-muted">{subtitle}</p> : null}
      </div>
      {action ? <div className="flex shrink-0 flex-wrap items-center gap-2">{action}</div> : null}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const openAdd = useUi((s) => s.openAdd);
  const scanProgress = useUi((s) => s.scanProgress);
  const matters = useTracker((s) => s.matters);
  const log = useTracker((s) => s.log);

  async function refreshAll() {
    if (!matters.length) {
      toast.error("Add a matter first.");
      return;
    }
    const t = toast.loading("Refreshing court records…");
    let added = 0;
    for (const m of matters.filter((x) => !x.sample)) {
      const r = await refreshMatter(m);
      if (r.ok) added += r.added;
    }
    log("refresh", "Refresh all", `${added} new order(s)`);
    toast.success(`Refresh complete: ${added} new order(s).`, { id: t });
  }

  function exportCal() {
    const { ics, events } = buildIcs(matters);
    if (!events) {
      toast.error("No upcoming dates to export.");
      return;
    }
    downloadIcs("BHC hearings.ics", ics);
    toast.success(`${events} event(s) exported.`);
  }

  return (
    <div className="min-h-svh overflow-x-hidden bg-canvas text-ink">
      <header className="sticky top-0 z-30 border-b border-line/70 bg-canvas/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:h-16 sm:px-6">
          <Link to="/" className="shrink-0 text-[17px] font-semibold tracking-tight">
            Matter Tracker
          </Link>
          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex">
            {NAV.map((item) => {
              const active =
                item.to === "/"
                  ? pathname === "/"
                  : pathname === item.to || pathname.startsWith(item.to + "/");
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-sm font-medium text-muted transition-colors duration-150 hover:text-ink",
                    active && "bg-surface text-ink shadow-sm",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-1.5">
            {scanProgress ? (
              <span className="hidden max-w-[200px] truncate text-xs text-muted md:inline">
                {scanProgress}
              </span>
            ) : null}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon-sm" aria-label="More">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onSelect={exportCal}>
                  <CalendarDays className="size-4 text-muted" />
                  Calendar
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => void refreshAll()}>
                  <RefreshCw className="size-4 text-muted" />
                  Refresh all
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" onClick={openAdd}>
              <Plus className="size-3.5" />
              New
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pt-8 pb-28 sm:px-6 sm:pt-10 lg:pb-16">
        {children}
      </main>

      <nav className="fixed right-0 bottom-0 left-0 z-30 border-t border-line/70 bg-canvas/90 px-2 pt-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-5">
          {NAV.map((item) => {
            const active =
              item.to === "/"
                ? pathname === "/"
                : pathname === item.to || pathname.startsWith(item.to + "/");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center gap-0.5 text-[10px] font-medium text-faint",
                  active && "text-accent",
                )}
              >
                <item.icon className="size-5" strokeWidth={active ? 2.2 : 1.75} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
      <AddMatterDialog />
    </div>
  );
}
