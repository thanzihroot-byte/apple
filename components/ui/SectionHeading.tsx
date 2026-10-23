import type { ReactNode } from 'react';

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  action?: ReactNode;
}) {
  const centered = align === 'center';

  return (
    <div
      className={`flex flex-col gap-space-sm ${
        centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between'
      }`}
    >
      <div className={centered ? 'max-w-2xl' : ''}>
        {eyebrow && (
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
            {eyebrow}
          </span>
        )}
        <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mt-1 tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-md">{description}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
