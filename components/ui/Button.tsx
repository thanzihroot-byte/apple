import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-label-md text-label-md font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-on-primary shadow-sm hover:bg-primary-container hover:scale-[1.01] focus-visible:outline-primary',
  secondary:
    'bg-surface-container-lowest text-on-surface shadow-sm border border-line hover:bg-surface-container-low hover:border-soft',
  ghost:
    'bg-transparent text-on-surface border border-line hover:bg-surface-container-low hover:border-soft',
  inverse:
    'bg-on-surface text-surface-container-lowest shadow-sm hover:bg-primary hover:text-on-primary',
};

const sizes: Record<Size, string> = {
  sm: 'px-4 py-2 text-[13px]',
  md: 'px-6 py-3',
  lg: 'px-8 py-3.5',
};

interface ButtonProps extends ComponentProps<'button'> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}

interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, 'className'> {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </Link>
  );
}
