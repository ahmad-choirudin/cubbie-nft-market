import { useCallback, useEffect, useRef, useState } from "react";
import type { ToastState } from "../types";

// Toast state: one message at a time, cleared automatically.
export default function useToast(duration = 3200): { toast: ToastState | null; say: (message: string, ok?: boolean) => void } {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const say = useCallback(
    (message: string, ok = true) => {
      setToast({ msg: message, ok });

      if (timer.current !== null) clearTimeout(timer.current);
      timer.current = setTimeout(() => setToast(null), duration);
    },
    [duration]
  );

  useEffect(() => () => {
    if (timer.current !== null) clearTimeout(timer.current);
  }, []);

  return { toast, say };
}