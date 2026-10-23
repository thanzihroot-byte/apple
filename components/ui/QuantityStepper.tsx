'use client';

import { Minus, Plus } from 'lucide-react';

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  size = 'md',
  label = 'Quantity',
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
  label?: string;
}) {
  const buttonSize = size === 'sm' ? 'h-6 w-6' : 'h-7 w-7';
  const iconSize = size === 'sm' ? 12 : 16;

  return (
    <div
      className="inline-flex items-center rounded-full bg-surface-container p-1"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={`${buttonSize} rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container-lowest disabled:opacity-40 transition-colors`}
      >
        <Minus size={iconSize} aria-hidden="true" />
      </button>
      <span
        aria-live="polite"
        className={`${size === 'sm' ? 'w-6' : 'w-8'} text-center font-label-md text-label-md font-bold text-on-surface tabular`}
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={`${buttonSize} rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container-lowest disabled:opacity-40 transition-colors`}
      >
        <Plus size={iconSize} aria-hidden="true" />
      </button>
    </div>
  );
}
