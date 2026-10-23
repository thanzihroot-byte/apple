import { Star } from 'lucide-react';

export function Rating({
  value,
  count,
  size = 15,
  className = '',
}: {
  value: number;
  count?: number;
  size?: number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="inline-flex items-center gap-0.5 text-amber-500">
        <Star size={size} fill="currentColor" strokeWidth={0} aria-hidden="true" />
        <span className="ml-1 font-label-sm text-label-sm font-semibold text-on-surface">{value.toFixed(1)}</span>
      </span>
      {typeof count === 'number' && (
        <span className="font-label-sm text-label-sm text-outline">({count} reviews)</span>
      )}
    </span>
  );
}
