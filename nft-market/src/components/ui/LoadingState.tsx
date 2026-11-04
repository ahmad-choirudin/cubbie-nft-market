export default function LoadingState({ label = "Loading…" }) {
  return (
    <div role="status" aria-live="polite" className="grid justify-items-center gap-3 px-5 py-14 text-dim">
      <span className="h-1 w-24 animate-pulse rounded-[var(--radius-pill)] bg-acc" aria-hidden="true" />
      <span className="font-m text-xs">{label}</span>
    </div>
  );
}
