import { fetchOrderPdfs } from "@/lib/court/actions";
import type { Matter } from "@/lib/types";
import { savePdf } from "@/lib/store/pdfs";
import { useTracker } from "@/lib/store/tracker";
import { toast } from "sonner";

export async function pullMissingOrders(matter: Matter, keys?: string[]) {
  const want = keys ?? matter.orders.filter((o) => !o.downloaded).map((o) => o.key);
  if (!want.length) return { added: 0 };
  let added = 0;
  const chunk = 5;
  let orders = [...matter.orders];
  for (let i = 0; i < want.length; i += chunk) {
    const slice = want.slice(i, i + chunk);
    const res = await fetchOrderPdfs({
      data: {
        forum: matter.forum === "sat" ? "sat" : "bhc",
        side: matter.side,
        stampreg: matter.stampreg,
        case_type: matter.case_type,
        case_no: matter.case_no,
        year: matter.year,
        keys: slice,
        petitioner: matter.petitioner,
        respondent: matter.respondent,
      },
    });
    if (!res.ok) {
      toast.error(res.error);
      break;
    }
    for (const f of res.files) {
      await savePdf({
        matterId: matter.id,
        orderKey: f.key,
        filename: f.filename,
        base64: f.base64,
      });
      added += 1;
      orders = orders.map((o) =>
        o.key === f.key
          ? { ...o, downloaded: true, excerpt: f.excerpt || o.excerpt }
          : o,
      );
    }
    useTracker.getState().setOrders(matter.id, orders, {
      last_added: added,
    });
  }
  return { added };
}

export async function refreshMatter(matter: Matter) {
  const { fetchCase } = await import("@/lib/court/actions");
  const res = await fetchCase({
    data: {
      forum: matter.forum === "sat" ? "sat" : "bhc",
      side: matter.side,
      stampreg: matter.stampreg,
      case_type: matter.case_type,
      case_no: matter.case_no,
      year: matter.year,
    },
  });
  if (!res.ok) return { ok: false as const, error: res.error };
  const { matterFromLookup } = await import("@/lib/store/tracker");
  const next = matterFromLookup(
    {
      forum: matter.forum === "sat" ? "sat" : "bhc",
      side: matter.side,
      stampreg: matter.stampreg,
      case_type: matter.case_type,
      case_no: matter.case_no,
      year: matter.year,
      type_name: matter.type_name,
    },
    res.lookup,
    matter,
  );
  useTracker.getState().upsertMatter(next);
  const missing = next.orders.filter((o) => !o.downloaded).map((o) => o.key);
  const pulled = await pullMissingOrders(next, missing);
  useTracker.getState().log(
    "refresh",
    `${matter.petitioner} v ${matter.respondent}`,
    `${pulled.added} new order(s)`,
  );
  return { ok: true as const, added: pulled.added, matter: next };
}
