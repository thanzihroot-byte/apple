'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronDown, Grid2x2, List, Search, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard, ProductListRow } from '@/components/products/ProductCard';
import { Input, Select } from '@/components/ui/Field';
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  FINISHES,
  MAX_PRICE,
  PROCESSOR_FAMILIES,
  STORAGE_CAPACITIES,
  products,
  processorFamily,
  storageCapacity,
} from '@/data/products';
import { formatCompactINR } from '@/lib/format';
import type { Category } from '@/types';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating';

const PRICE_BRACKETS: { label: string; min: number; max: number }[] = [
  { label: '< ₹25,000', min: 0, max: 25000 },
  { label: '₹25k – ₹75k', min: 25000, max: 75000 },
  { label: '₹75k – ₹1.5L', min: 75000, max: 150000 },
  { label: '> ₹1,50,000', min: 150000, max: MAX_PRICE + 1 },
];

const SORT_LABELS: Record<SortKey, string> = {
  featured: 'Sort by: Featured',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  newest: 'Newest Arrivals',
  rating: 'Customer Rating',
};

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function CatalogClient() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') as Category | null;
  const initialQuery = searchParams.get('q') ?? '';

  const [query, setQuery] = useState(initialQuery);
  const [inStockOnly, setInStockOnly] = useState(true);
  const [expressOnly, setExpressOnly] = useState(false);
  const [categories, setCategories] = useState<Category[]>(
    initialCategory && CATEGORY_ORDER.includes(initialCategory) ? [initialCategory] : [],
  );
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [processors, setProcessors] = useState<string[]>([]);
  const [storages, setStorages] = useState<string[]>([]);
  const [finishes, setFinishes] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>('featured');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Keep the catalogue in sync when the header search pushes a new ?q= value.
  useEffect(() => {
    setQuery(searchParams.get('q') ?? '');
  }, [searchParams]);

  const categoryCounts = useMemo(() => {
    const counts = {} as Record<Category, number>;
    for (const category of CATEGORY_ORDER) {
      counts[category] = products.filter((product) => product.category === category).length;
    }
    return counts;
  }, []);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const filtered = products.filter((product) => {
      if (inStockOnly && !product.inStock) return false;
      if (expressOnly && !product.expressDelivery) return false;
      if (categories.length > 0 && !categories.includes(product.category)) return false;
      if (product.price > maxPrice) return false;
      if (processors.length > 0) {
        const family = processorFamily(product.chip);
        if (!family || !processors.includes(family)) return false;
      }
      if (storages.length > 0) {
        const capacities = product.storages.map((storage) => storageCapacity(storage.label));
        if (!capacities.some((capacity) => capacity && storages.includes(capacity))) return false;
      }
      if (finishes.length > 0) {
        const names = product.colors.map((color) => color.name);
        if (!names.some((name) => finishes.includes(name))) return false;
      }
      if (needle) {
        const haystack = [
          product.name,
          product.tagline,
          product.description,
          product.categoryLabel,
          product.chip ?? '',
          ...product.keywords,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });

    const sorted = [...filtered];
    switch (sort) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
        break;
      default:
        sorted.sort(
          (a, b) => Number(b.isFeatured) - Number(a.isFeatured) || b.reviewCount - a.reviewCount,
        );
    }
    return sorted;
  }, [
    categories,
    expressOnly,
    finishes,
    inStockOnly,
    maxPrice,
    processors,
    query,
    sort,
    storages,
  ]);

  const activeTags = useMemo(() => {
    const tags: { key: string; label: string; clear: () => void }[] = [];
    if (inStockOnly) tags.push({ key: 'stock', label: 'In Stock', clear: () => setInStockOnly(false) });
    if (expressOnly)
      tags.push({ key: 'express', label: 'Express 24h Delivery', clear: () => setExpressOnly(false) });
    categories.forEach((category) =>
      tags.push({
        key: `cat-${category}`,
        label: CATEGORY_LABELS[category],
        clear: () => setCategories((prev) => prev.filter((item) => item !== category)),
      }),
    );
    processors.forEach((processor) =>
      tags.push({
        key: `cpu-${processor}`,
        label: processor,
        clear: () => setProcessors((prev) => prev.filter((item) => item !== processor)),
      }),
    );
    storages.forEach((storage) =>
      tags.push({
        key: `sto-${storage}`,
        label: storage,
        clear: () => setStorages((prev) => prev.filter((item) => item !== storage)),
      }),
    );
    finishes.forEach((finish) =>
      tags.push({
        key: `fin-${finish}`,
        label: finish,
        clear: () => setFinishes((prev) => prev.filter((item) => item !== finish)),
      }),
    );
    if (maxPrice < MAX_PRICE)
      tags.push({
        key: 'price',
        label: `Up to ${formatCompactINR(maxPrice)}`,
        clear: () => setMaxPrice(MAX_PRICE),
      });
    if (query.trim())
      tags.push({ key: 'query', label: `“${query.trim()}”`, clear: () => setQuery('') });
    return tags;
  }, [categories, expressOnly, finishes, inStockOnly, maxPrice, processors, query, storages]);

  const resetAll = () => {
    setInStockOnly(false);
    setExpressOnly(false);
    setCategories([]);
    setMaxPrice(MAX_PRICE);
    setProcessors([]);
    setStorages([]);
    setFinishes([]);
    setQuery('');
  };

  const filterPanel = (
    <div className="flex flex-col gap-space-md">
      <div className="flex items-center justify-between pb-space-xs">
        <div className="flex items-center gap-space-xs">
          <SlidersHorizontal size={20} aria-hidden="true" className="text-primary" />
          <h2 className="font-title-md text-title-md text-on-surface">Filters</h2>
        </div>
        <button
          type="button"
          onClick={resetAll}
          className="font-label-sm text-label-sm text-outline transition-colors hover:text-error"
        >
          Clear All
        </button>
      </div>

      {/* Availability */}
      <div className="flex flex-col gap-space-sm pt-space-xs">
        <label className="group flex cursor-pointer items-center justify-between">
          <span className="font-body-md text-body-md text-on-surface transition-colors group-hover:text-primary">
            In Stock Only
          </span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(event) => setInStockOnly(event.target.checked)}
            className="h-4 w-4 rounded accent-primary"
          />
        </label>
        <label className="group flex cursor-pointer items-center justify-between">
          <span className="font-body-md text-body-md text-on-surface transition-colors group-hover:text-primary">
            Express 24h Delivery
          </span>
          <input
            type="checkbox"
            checked={expressOnly}
            onChange={(event) => setExpressOnly(event.target.checked)}
            className="h-4 w-4 rounded accent-primary"
          />
        </label>
      </div>

      <div className="h-px bg-surface-container-highest" />

      {/* Categories */}
      <div>
        <h3 className="mb-space-sm font-label-md text-label-md font-semibold uppercase tracking-wider text-on-surface">
          Category
        </h3>
        <div className="flex flex-col gap-2">
          {CATEGORY_ORDER.map((category) => (
            <label
              key={category}
              className="flex cursor-pointer items-center justify-between font-body-md text-body-md text-on-surface-variant transition-colors hover:text-on-surface"
            >
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={categories.includes(category)}
                  onChange={() => setCategories((prev) => toggle(prev, category))}
                  className="h-4 w-4 rounded accent-primary"
                />
                <span>{CATEGORY_LABELS[category]}</span>
              </span>
              <span className="rounded-full bg-surface-container px-2 py-0.5 font-label-sm text-label-sm text-outline">
                {categoryCounts[category]}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-surface-container-highest" />

      {/* Price */}
      <div>
        <div className="mb-space-sm flex items-center justify-between">
          <h3 className="font-label-md text-label-md font-semibold uppercase tracking-wider text-on-surface">
            Price Range
          </h3>
          <span className="font-label-sm text-label-sm font-semibold text-primary">
            Up to {formatCompactINR(maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min={1000}
          max={MAX_PRICE}
          step={5000}
          value={maxPrice}
          onChange={(event) => setMaxPrice(Number(event.target.value))}
          aria-label="Maximum price"
          className="h-1.5 w-full cursor-pointer rounded-lg bg-surface-container accent-primary"
        />
        <div className="mt-space-sm grid grid-cols-2 gap-1.5">
          {PRICE_BRACKETS.map((bracket) => (
            <button
              key={bracket.label}
              type="button"
              onClick={() => setMaxPrice(bracket.max > MAX_PRICE ? MAX_PRICE : bracket.max)}
              className="truncate rounded-lg bg-surface-container-low px-2.5 py-1.5 text-left font-label-sm text-label-sm text-on-surface-variant transition-all hover:bg-secondary-container hover:text-on-secondary-container"
            >
              {bracket.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-surface-container-highest" />

      {/* Processor */}
      <div>
        <h3 className="mb-space-sm font-label-md text-label-md font-semibold uppercase tracking-wider text-on-surface">
          Processor
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {PROCESSOR_FAMILIES.map((family) => {
            const active = processors.includes(family);
            return (
              <button
                key={family}
                type="button"
                aria-pressed={active}
                onClick={() => setProcessors((prev) => toggle(prev, family))}
                className={`rounded-full px-3 py-1 font-label-sm text-label-sm font-medium transition-colors ${
                  active
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {family}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-surface-container-highest" />

      {/* Storage */}
      <div>
        <h3 className="mb-space-sm font-label-md text-label-md font-semibold uppercase tracking-wider text-on-surface">
          Storage Capacity
        </h3>
        <div className="grid grid-cols-3 gap-1.5">
          {STORAGE_CAPACITIES.map((capacity) => {
            const active = storages.includes(capacity);
            return (
              <button
                key={capacity}
                type="button"
                aria-pressed={active}
                onClick={() => setStorages((prev) => toggle(prev, capacity))}
                className={`rounded py-1 text-center font-label-sm text-label-sm transition-colors ${
                  active
                    ? 'bg-primary-container text-on-primary-container font-medium'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                {capacity}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-surface-container-highest" />

      {/* Finishes */}
      <div>
        <h3 className="mb-space-sm font-label-md text-label-md font-semibold uppercase tracking-wider text-on-surface">
          Hardware Finishes
        </h3>
        <div className="flex flex-wrap items-center gap-2.5">
          {FINISHES.map((finish) => {
            const active = finishes.includes(finish.name);
            return (
              <button
                key={finish.name}
                type="button"
                title={finish.name}
                aria-label={finish.name}
                aria-pressed={active}
                onClick={() => setFinishes((prev) => toggle(prev, finish.name))}
                className={`flex h-6 w-6 items-center justify-center rounded-full p-0.5 transition-transform ${
                  active ? 'bg-surface-container-high ring-2 ring-primary' : 'bg-surface-container hover:scale-110'
                }`}
              >
                <span
                  className="block h-full w-full rounded-full border border-outline-variant/30"
                  style={{ backgroundColor: finish.hex }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-space-lg items-start lg:grid-cols-12">
      {/* Sidebar filters */}
      <aside className="lg:col-span-3 lg:sticky lg:top-[80px]">
        <div className="hidden rounded-xl bg-surface-container-lowest p-space-md shadow-sm lg:block">
          {filterPanel}
        </div>

        {/* Mobile filter drawer */}
        <div className="lg:hidden">
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-line bg-surface-container-lowest px-5 py-2.5 font-label-md text-label-md font-semibold text-on-surface shadow-sm"
          >
            <SlidersHorizontal size={16} aria-hidden="true" />
            Filters
            {activeTags.length > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 font-label-sm text-[10px] text-on-primary">
                {activeTags.length}
              </span>
            )}
          </button>

          {filtersOpen && (
            <div className="fixed inset-0 z-[55] flex">
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setFiltersOpen(false)}
                className="absolute inset-0 bg-on-surface/40"
              />
              <div className="relative ml-auto flex h-full w-[min(90vw,380px)] flex-col bg-surface-container-lowest shadow-float">
                <div className="flex items-center justify-between border-b border-line px-space-md py-space-sm">
                  <h2 className="font-title-md text-title-md font-semibold text-on-surface">
                    Filters
                  </h2>
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(false)}
                    aria-label="Close filters"
                    className="rounded-full p-1.5 text-outline hover:bg-surface-container hover:text-on-surface"
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto px-space-md py-space-md">{filterPanel}</div>
                <div className="border-t border-line p-space-md">
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(false)}
                    className="w-full rounded-full bg-primary px-6 py-3 font-label-md text-label-md font-semibold text-on-primary shadow-sm"
                  >
                    Show {results.length} product{results.length === 1 ? '' : 's'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Results */}
      <div className="lg:col-span-9">
        {/* Toolbar */}
        <div className="mb-space-md flex flex-col gap-space-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline"
            />
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search this catalogue"
              aria-label="Search this catalogue"
              className="h-11 rounded-full pl-9 pr-9"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-outline transition-colors hover:bg-surface-container hover:text-on-surface"
              >
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-space-sm">
            <div className="relative inline-flex items-center">
              <label htmlFor="sortDropdown" className="sr-only">
                Sort by
              </label>
              <Select
                id="sortDropdown"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="rounded-full pl-4 pr-9 shadow-sm"
              >
                {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                  <option key={key} value={key}>
                    {SORT_LABELS[key]}
                  </option>
                ))}
              </Select>
              <ChevronDown
                size={18}
                aria-hidden="true"
                className="pointer-events-none absolute right-3 text-on-surface-variant"
              />
            </div>

            <div className="flex items-center rounded-full bg-surface-container-low p-1 shadow-sm">
              <button
                type="button"
                aria-label="Grid view"
                aria-pressed={view === 'grid'}
                onClick={() => setView('grid')}
                className={`flex items-center justify-center rounded-full p-1.5 transition-all ${
                  view === 'grid'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                <Grid2x2 size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="List view"
                aria-pressed={view === 'list'}
                onClick={() => setView('list')}
                className={`flex items-center justify-center rounded-full p-1.5 transition-all ${
                  view === 'list'
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-outline hover:text-on-surface'
                }`}
              >
                <List size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Active filters */}
        {activeTags.length > 0 && (
          <div className="no-scrollbar mb-space-lg flex items-center gap-space-xs overflow-x-auto py-1">
            <span className="mr-1 shrink-0 font-label-sm text-label-sm uppercase tracking-wider text-outline">
              Active:
            </span>
            {activeTags.map((tag) => (
              <span
                key={tag.key}
                className="flex shrink-0 items-center gap-1.5 rounded-full bg-surface-container px-3 py-1 font-label-sm text-label-sm text-on-surface"
              >
                <span>{tag.label}</span>
                <button
                  type="button"
                  aria-label={`Remove ${tag.label} filter`}
                  onClick={tag.clear}
                  className="flex items-center transition-colors hover:text-error"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={resetAll}
              className="ml-2 shrink-0 font-label-sm text-label-sm text-primary hover:underline"
            >
              Reset all
            </button>
          </div>
        )}

        {/* Results count */}
        <p className="mb-space-md font-label-sm text-label-sm text-outline" aria-live="polite">
          Showing {results.length} of {products.length} products
        </p>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface-container-lowest px-space-lg py-space-xl text-center shadow-sm">
            <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
              No products match your filters
            </h3>
            <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
              Try widening the price range or clearing a couple of filters.
            </p>
            <button
              type="button"
              onClick={resetAll}
              className="mt-space-md inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 font-label-md text-label-md font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-container"
            >
              Reset all filters
            </button>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 gap-space-md md:grid-cols-2 xl:grid-cols-3">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-space-md">
            {results.map((product) => (
              <ProductListRow key={product.id} product={product} />
            ))}
          </div>
        )}

        <p className="mt-space-lg rounded-xl border border-line bg-surface-container-low px-4 py-3 font-label-sm text-label-sm leading-relaxed text-on-surface-variant">
          Prices shown are the Indian retail MRP for the listed configuration and include GST.
          Availability, ratings and offers in this catalogue are demonstration content for a
          front-end prototype.
        </p>
      </div>
    </div>
  );
}
