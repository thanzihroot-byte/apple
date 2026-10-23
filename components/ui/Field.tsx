import type { ComponentProps, ReactNode } from 'react';

const control =
  'w-full rounded-lg border border-line bg-surface-container-lowest px-4 text-on-surface placeholder:text-outline font-body-md text-body-md transition-colors focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15 disabled:opacity-60';

export function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
  className = '',
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={htmlFor} className="font-label-md text-label-md text-on-surface font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p className="font-label-sm text-label-sm text-error">{error}</p>
      ) : hint ? (
        <p className="font-label-sm text-label-sm text-outline">{hint}</p>
      ) : null}
    </div>
  );
}

export function Input({ className = '', ...props }: ComponentProps<'input'>) {
  return <input className={`${control} h-12 ${className}`} {...props} />;
}

export function Textarea({ className = '', ...props }: ComponentProps<'textarea'>) {
  return <textarea className={`${control} min-h-[104px] py-3 resize-y ${className}`} {...props} />;
}

export function Select({ className = '', children, ...props }: ComponentProps<'select'>) {
  return (
    <select className={`${control} h-11 appearance-none pr-10 ${className}`} {...props}>
      {children}
    </select>
  );
}

export function Checkbox({ className = '', ...props }: ComponentProps<'input'>) {
  return (
    <input
      type="checkbox"
      className={`h-4 w-4 shrink-0 rounded border-[1.5px] border-outline-variant accent-primary text-primary focus:ring-2 focus:ring-primary/30 ${className}`}
      {...props}
    />
  );
}
