import { useSyncExternalStore } from "react";

// One shared clock for every countdown on the page. It ticks once per second
// and only runs while at least one component is subscribed.
const nowSeconds = () => Math.floor(Date.now() / 1000);

const listeners = new Set<() => void>();
let timer: ReturnType<typeof setTimeout> | null = null;
let current = nowSeconds();

// Wait until just after the next whole second so the display never skips.
const delay = () => 1000 - (Date.now() % 1000) + 5;

function loop() {
  const next = nowSeconds();

  if (next !== current) {
    current = next;
    listeners.forEach((listener) => listener());
  }

  timer = setTimeout(loop, delay());
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  if (timer === null) {
    current = nowSeconds();
    timer = setTimeout(loop, delay());
  }

  return () => {
    listeners.delete(listener);

    if (listeners.size === 0 && timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };
}

const getSnapshot = () => (timer === null ? nowSeconds() : current);

export function useNowSeconds() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

// Seconds left until `target` (a timestamp in ms). Never below 0.
// Returns null when there is no valid target, so callers can show nothing
// instead of an invented time.
export default function useCountdown(target: number | null | undefined) {
  const now = useNowSeconds();

  if (typeof target !== "number" || !Number.isFinite(target)) return null;

  return Math.max(0, Math.floor(target / 1000) - now);
}
