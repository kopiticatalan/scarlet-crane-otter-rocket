import { useEffect } from "react";
import { useTracker } from "@/lib/store/tracker";

export function HydrateTracker() {
  useEffect(() => {
    void Promise.resolve(useTracker.persist.rehydrate()).then(() => {
      useTracker.getState().setHydrated();
    });
  }, []);
  return null;
}
