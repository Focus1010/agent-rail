import { useState, useEffect } from "react";
import { getState, subscribe, type AppState } from "@/lib/store";

export function useStore(): AppState {
  const [, setTick] = useState(0);
  useEffect(() => {
    return subscribe(() => setTick((t) => t + 1));
  }, []);
  return getState();
}
