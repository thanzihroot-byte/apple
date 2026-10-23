'use client';

import { useMemo, useState } from 'react';
import { ShowcaseCard } from '@/components/products/ShowcaseCard';
import { products } from '@/data/products';

type Filter = 'all' | 'iphone' | 'mac' | 'ipad' | 'wearable';

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All Bestsellers' },
  { key: 'iphone', label: 'iPhones' },
  { key: 'mac', label: 'Macs' },
  { key: 'ipad', label: 'iPads' },
  { key: 'wearable', label: 'Wearables' },
];

function matches(item: { category: string }, filter: Filter) {
  if (filter === 'all') return true;
  if (filter === 'wearable') return item.category === 'watch' || item.category === 'airpods';
  return item.category === filter;
}

/** Homepage "Discover Our Bestsellers" section with the Stitch filter pills. */
export function BestsellersSection() {
  const [filter, setFilter] = useState<Filter>('all');

  const bestsellers = useMemo(() => products.filter((item) => item.isBestseller), []);
  const visible = useMemo(
    () => bestsellers.filter((item) => matches(item, filter)),
    [bestsellers, filter],
  );

  return (
    <section className="w-full bg-surface-container-low/40 py-space-xl lg:py-24">
      <div className="shell">
        <div className="mb-space-lg flex flex-col justify-between gap-space-md md:flex-row md:items-end">
          <div>
            <span className="font-label-sm text-label-sm font-semibold uppercase tracking-widest text-primary">
              Curated Hardware
            </span>
            <h2 className="mt-1 font-headline-lg text-headline-lg-mobile text-on-surface md:text-headline-lg">
              Discover Our Bestsellers
            </h2>
            <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
              The devices everyone is talking about. Handpicked for ultimate performance.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter bestsellers">
            {FILTERS.map((item) => {
              const active = filter === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(item.key)}
                  className={`rounded-full px-4 py-2 font-label-md text-label-md font-semibold shadow-sm transition-all ${
                    active
                      ? 'bg-primary text-on-primary'
                      : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-space-lg sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((product) => (
            <ShowcaseCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
