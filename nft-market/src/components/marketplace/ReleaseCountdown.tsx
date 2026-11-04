import { splitDhms } from "../../utils/format";
import useCountdown from "../../hooks/useCountdown";

function Ring({ s }: { s: number }) {
  const r = 84;
  const c = 2 * Math.PI * r;

  return (
    <svg viewBox="0 0 200 200" className="pointer-events-none absolute right-0 top-1/2 size-[72px] -translate-y-1/2 opacity-90 max-[560px]:hidden" aria-hidden="true">
      <circle cx="100" cy="100" r={r} className="fill-none stroke-edge stroke-[6]" />
      <circle
        cx="100"
        cy="100"
        r={r}
        className="fill-none stroke-acc stroke-[6] [stroke-linecap:round] [transition:stroke-dashoffset_1s_linear]"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - s / 60)}
        transform="rotate(-90 100 100)"
      />
    </svg>
  );
}

// Countdown to a real release time (ms timestamp). Renders nothing without one.
export default function ReleaseCountdown({ until }: { until: number | null | undefined }) {
  const left = useCountdown(until);

  if (left === null) return null;

  const [d, h, m, s] = splitDhms(left);

  if (left === 0) {
    return <p className="my-6 font-m text-sm font-medium uppercase tracking-[0.14em] text-acc" role="status">Live now</p>;
  }

  const parts: [string | number, string][] = [];
  if (d > 0) parts.push([d, "days"]);
  parts.push([h, "hrs"], [m, "min"], [s, "sec"]);

  return (
    <div className="relative my-6 grid justify-items-start gap-4" role="timer" aria-label={`Time until release: ${d > 0 ? `${d} days, ` : ""}${h} hours, ${m} minutes`}>
      <div className="flex flex-wrap gap-2" aria-hidden="true">
        {parts.map(([value, label]) => (
          <div className="min-w-[68px] rounded-lg border border-strong bg-card px-3 pb-2 pt-3 text-center" key={label}>
            <b className="block font-d text-t-2xl font-semibold leading-none tabular-nums">{value}</b>
            <small className="mt-1.5 block font-m text-t-xs font-medium uppercase tracking-[0.14em] text-dim">{label}</small>
          </div>
        ))}
      </div>

      <Ring s={+s} />
    </div>
  );
}
