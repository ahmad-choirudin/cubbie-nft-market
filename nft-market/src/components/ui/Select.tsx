// options: [[value, label], ...]
import type { SelectHTMLAttributes } from "react";

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange" | "className"> & {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
  className?: string;
};

export default function Select({ label, value, onChange, options, className = "", ...props }: SelectProps) {
  return (
    <select
      className={`h-11 max-w-[44%] flex-none truncate rounded-[var(--radius-sm)] border border-strong bg-surface px-3 font-b text-sm text-ink transition-colors focus-visible:border-acc focus-visible:outline-offset-0 ${className}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      {...props}
    >
      {options.map(([v, text]) => (
        <option key={v} value={v}>
          {text}
        </option>
      ))}
    </select>
  );
}
