import { useEffect, useRef, useState } from "react";
import { readJSON, writeJSON } from "../utils/storage";
import type { Dispatch, SetStateAction } from "react";

// useState that mirrors its value to localStorage.
// `onWriteError` runs when the browser refuses the write (quota, private mode).
export default function usePersist<T>(
  key: string,
  init: T,
  ok: (value: unknown) => boolean = () => true,
  onWriteError?: () => void
): [T, Dispatch<SetStateAction<T>>] {
  const [v, setV] = useState<T>(() => {
    try {
      const p = readJSON<unknown>(key, init);

      return Array.isArray(init) ? (Array.isArray(p) ? p.filter(ok) as T : init) : p as T;
    } catch {
      return init;
    }
  });

  const first = useRef(true);
  const errorRef = useRef(onWriteError);
  errorRef.current = onWriteError;

  useEffect(() => {
    // Nothing changed on the first run, so there is nothing to save yet.
    if (first.current) {
      first.current = false;
      return;
    }

    if (!writeJSON(key, v)) errorRef.current?.();
  }, [key, v]);

  return [v, setV];
}
