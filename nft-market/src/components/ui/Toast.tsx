import { Check, AlertCircle } from "lucide-react";
import type { ToastState } from "../../types";

export default function Toast({ toast }: { toast: ToastState | null }) {
  if (!toast) return null;

  return (
    <div
      className={`fixed bottom-[calc(env(safe-area-inset-bottom,0px)+24px)] left-1/2 z-[var(--z-toast)] flex max-w-[min(92vw,460px)] -translate-x-1/2 items-center gap-2.5 rounded-[var(--radius-md)] border bg-card px-[18px] py-3 text-t-sm text-ink shadow-[var(--shadow-lg)] animate-[toast-in_var(--dur-base)_var(--ease)] [&_svg]:shrink-0 ${toast.ok ? "border-acc [&_svg]:text-acc" : "border-danger [&_svg]:text-danger"}`}
      role="status" aria-live="polite"
    >
      {toast.ok ? (
        <Check size={16} aria-hidden="true" />
      ) : (
        <AlertCircle size={16} aria-hidden="true" />
      )}

      {toast.msg}
    </div>
  );
}