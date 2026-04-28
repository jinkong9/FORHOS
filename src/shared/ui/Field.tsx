import { type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: Array<{ label: string; value: string }>;
  error?: string;
};

type TextareaFieldProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

const controlClassName =
  "mt-2 h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100";

export function Field({ label, error, className, ...props }: FieldProps) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <input className={cn(controlClassName, className)} {...props} />
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

export function SelectField({ label, options, error, className, ...props }: SelectFieldProps) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <select className={cn(controlClassName, className)} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
    </label>
  );
}

export function TextareaField({ label, error, className, ...props }: TextareaFieldProps) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <textarea
        className={cn(
          "mt-2 min-h-28 w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100",
          className,
        )}
        {...props}
      />
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
