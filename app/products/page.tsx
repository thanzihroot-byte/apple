import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { Home } from 'lucide-react';
import { CatalogClient } from '@/components/catalog/CatalogClient';
import { products } from '@/data/products';

export const metadata: Metadata = {
  title: 'Apple Catalog',
  description:
    'Browse the full AURORA catalogue — iPhone, Mac, iPad, Apple Watch, AirPods and accessories with filters for price, processor, storage and finish.',
};

export default function ProductsPage() {
  return (
    <div className="relative w-full overflow-hidden pb-space-xl">
      <div className="pointer-events-none absolute -top-40 right-1/4 h-[650px] w-[650px] rounded-full bg-surface-container-high/60 opacity-70 blur-[130px]" />
      <div className="pointer-events-none absolute top-[400px] -left-20 h-[500px] w-[500px] rounded-full bg-secondary-fixed/40 opacity-50 blur-[110px]" />

      <div className="shell">
        <section className="flex flex-col justify-between gap-space-md pb-space-lg pt-space-md md:flex-row md:items-end">
          <div className="flex flex-col gap-space-xs">
            <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs font-label-sm text-label-sm text-outline">
              <Link href="/" className="flex items-center gap-1 transition-colors hover:text-primary">
                <Home size={14} aria-hidden="true" />
                <span>Home</span>
              </Link>
              <span className="font-normal text-outline-variant">/</span>
              <span className="font-semibold text-on-surface">All Products</span>
            </nav>

            <div className="mt-space-xs flex flex-wrap items-baseline gap-space-sm">
              <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface">
                Apple Catalog
              </h1>
              <span className="rounded-full bg-surface-container-high px-3 py-1 font-label-sm text-label-sm uppercase tracking-wider text-primary">
                Showing {products.length} Apple Products
              </span>
            </div>
          </div>

          <p className="max-w-md font-body-md text-body-md text-on-surface-variant">
            Filter by category, price, processor, storage or hardware finish — every card links
            straight into a full configuration page.
          </p>
        </section>

        <Suspense fallback={<CatalogSkeleton />}>
          <CatalogClient />
        </Suspense>
      </div>
    </div>
  );
}

function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
      <div className="hidden rounded-xl bg-surface-container-lowest p-space-md shadow-sm lg:col-span-3 lg:block">
        <div className="h-5 w-24 animate-pulse rounded bg-surface-container" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-4 w-full animate-pulse rounded bg-surface-container" />
          ))}
        </div>
      </div>
      <div className="lg:col-span-9">
        <div className="grid grid-cols-1 gap-space-md md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-96 animate-pulse rounded-xl bg-surface-container-low"
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
