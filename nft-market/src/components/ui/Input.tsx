import { useId } from "react";
import type { InputHTMLAttributes } from "react";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "id"> & {
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
  id?: string;
};

export default function Input({ label, hint, error, className = "", id, ...props }: InputProps) {
  const auto = useId();
  const fieldId = id || auto;
  const noteId = `${fieldId}-note`;
  const note = error || hint;

  return (
    <div className={`grid gap-2 ${className}`}>
      {label && (
        <label htmlFor={fieldId} className="font-m text-t-xs font-medium uppercase leading-[1.4] tracking-[0.14em] text-dim">
          {label}
        </label>
      )}
      <input
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={note ? noteId : undefined}
        className="min-h-[var(--field-h)] w-full rounded-[var(--radius-sm)] border border-strong bg-surface px-4 font-b text-base text-ink transition-colors focus-visible:border-acc focus-visible:outline-offset-0 aria-[invalid=true]:border-danger"
        {...props}
      />
      {note && (
        <p id={noteId} className={`m-0 text-t-xs ${error ? "text-[var(--color-danger-text)]" : "text-dim"}`}>
          {note}
        </p>
      )}
    </div>
  );
}
