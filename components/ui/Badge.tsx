import type { ReactNode } from 'react';
import type { BadgeTone } from '@/types';

const tones: Record<BadgeTone, string> = {
  primary: 'bg-primary text-on-primary',
  fixed: 'bg-primary-fixed text-on-primary-fixed-variant',
  secondary: 'bg-secondary-container text-on-secondary-container',
  inverse: 'bg-inverse-surface text-inverse-on-surface',
  surface: 'bg-surface-container-high text-primary',
};

export function Badge({
  tone = 'surface',
  children,
  className = '',
}: {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 font-label-sm text-[10px] uppercase font-bold tracking-wider ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
