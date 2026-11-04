import { Search, X } from "lucide-react";
import type { InputHTMLAttributes } from "react";

type SearchFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "className" | "placeholder"> & {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  label?: string;
  placeholder?: string;
  className?: string;
};

export default function SearchField({ value, onChange, onClear, label = "Search", placeholder, className = "", ...props }: SearchFieldProps) {
  return (
    <label className={`flex h-11 min-w-0 flex-1 items-center gap-2.5 rounded-[var(--radius-sm)] border border-strong bg-surface px-3.5 text-dim transition-colors focus-within:border-acc ${className}`}>
      <Search size={15} className="shrink-0" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
        autoComplete="off"
        enterKeyHint="search"
        className="w-full min-w-0 flex-1 border-0 bg-transparent font-b text-base text-ink outline-none placeholder:text-dim [&::-webkit-search-cancel-button]:hidden"
        {...props}
      />
      {value && onClear && (
        <button type="button" className="mr-[-8px] grid size-8 shrink-0 place-items-center rounded-full text-dim hover:text-ink" onClick={onClear} aria-label="Clear search">
          <X size={14} />
        </button>
      )}
    </label>
  );
}
