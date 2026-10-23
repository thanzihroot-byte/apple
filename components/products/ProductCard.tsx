'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useStore } from '@/context/StoreContext';
import { formatINR } from '@/lib/format';
import type { Product } from '@/types';

/**
 * Catalogue card — a direct port of the Stitch "All Products" grid card.
 * The first configuration (finish + storage) is what lands in the bag.
 */
export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const saved = isInWishlist(product.id);
  const color = product.colors[0];
  const storage = product.storages[0];

  return (
    <article className="group plate lift relative flex flex-col justify-between rounded-xl p-space-sm">
      <div className="relative w-full overflow-hidden rounded-lg bg-surface-container-low aspect-[4/3] flex items-center justify-center p-space-md">
        <div className="absolute left-2.5 top-2.5 z-10 flex flex-col items-start gap-1">
          {product.badge && (
            <Badge tone={product.badgeTone ?? 'surface'}>{product.badge}</Badge>
          )}
          {product.chip && (
            <span className="rounded-full bg-inverse-surface px-2 py-0.5 font-label-sm text-[10px] uppercase tracking-wider text-inverse-on-surface">
              {color.short}
            </span>
          )}
        </div>

        <button
          type="button"
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={saved}
          onClick={() => toggleWishlist(product)}
          className={`absolute right-2.5 top-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-lowest/85 backdrop-blur-sm shadow-sm transition-colors ${
            saved ? 'text-error' : 'text-outline hover:text-error'
          }`}
        >
          <Heart size={18} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
        </button>

        <Link
          href={`/products/${product.id}`}
          className="flex h-full w-full items-center justify-center"
          aria-label={`View ${product.name}`}
        >
          <Image
            src={product.image}
            alt={product.name}
            width={520}
            height={390}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      </div>

      <div className="flex flex-1 flex-col justify-between pt-space-md px-space-xs pb-space-xs">
        <div>
          <div className="mb-1 flex items-center gap-1.5">
            {product.colors.slice(0, 4).map((item) => (
              <span
                key={item.name}
                className="inline-block h-2.5 w-2.5 rounded-full border border-outline-variant/40"
                style={{ backgroundColor: item.hex }}
                title={item.name}
              />
            ))}
            <span className="ml-1 font-label-sm text-label-sm text-outline">
              {product.colors.length} Finish{product.colors.length > 1 ? 'es' : ''}
            </span>
          </div>

          <h3 className="font-title-md text-title-md font-semibold text-on-surface transition-colors group-hover:text-primary">
            <Link href={`/products/${product.id}`} className="focus:outline-none">
              {product.name}
            </Link>
          </h3>
          <p className="mt-0.5 line-clamp-1 font-body-md text-body-md text-on-surface-variant">
            {product.tagline}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            {product.storages.slice(0, 3).map((item, index) => (
              <span
                key={item.label}
                className={`rounded px-2 py-0.5 font-label-sm text-label-sm ${
                  index === 0
                    ? 'bg-surface-container font-medium text-on-surface'
                    : 'bg-surface-container text-outline'
                }`}
              >
                {item.label}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-space-md border-t border-line pt-space-sm">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <span className="font-price-card text-price-card text-on-surface">
                {formatINR(storage.price)}
              </span>
              <span className="block font-label-sm text-label-sm font-medium text-primary">
                EMI from {formatINR(product.emiMonthly)}/mo*
              </span>
            </div>
            <span className="font-label-sm text-label-sm text-outline">Incl. GST</span>
          </div>

          <button
            type="button"
            onClick={() => addToCart(product, color, storage)}
            className="mt-space-sm flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 font-body-md text-body-md font-semibold text-on-primary shadow-sm transition-all hover:bg-primary-container active:scale-[0.98]"
          >
            <ShoppingBag size={18} aria-hidden="true" />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>
    </article>
  );
}

/** Horizontal variant of the catalogue card, used by the grid/list switcher. */
export function ProductListRow({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const saved = isInWishlist(product.id);
  const color = product.colors[0];
  const storage = product.storages[0];

  return (
    <article className="group plate lift flex flex-col gap-space-md rounded-xl p-space-sm sm:flex-row sm:items-center">
      <div className="relative w-full shrink-0 overflow-hidden rounded-lg bg-surface-container-low sm:w-52">
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, 208px"
            className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        {product.badge && (
          <span className="absolute left-2.5 top-2.5">
            <Badge tone={product.badgeTone ?? 'surface'}>{product.badge}</Badge>
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
          <div className="min-w-0">
            <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-secondary">
              {product.categoryLabel}
            </span>
            <h3 className="truncate font-title-md text-title-md font-semibold text-on-surface">
              <Link href={`/products/${product.id}`} className="hover:text-primary">
                {product.name}
              </Link>
            </h3>
            <p className="line-clamp-1 font-body-md text-body-md text-on-surface-variant">
              {product.tagline}
            </p>
          </div>

          <div className="shrink-0 text-left sm:text-right">
            <span className="font-price-card text-price-card font-semibold text-on-surface">
              {formatINR(storage.price)}
            </span>
            <span className="block font-label-sm text-label-sm text-primary">
              EMI from {formatINR(product.emiMonthly)}/mo
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {product.colors.slice(0, 4).map((item) => (
            <span
              key={item.name}
              title={item.name}
              className="h-4 w-4 rounded-full border border-outline-variant/40"
              style={{ backgroundColor: item.hex }}
            />
          ))}
          <span className="font-label-sm text-label-sm text-outline">
            {product.colors.length} finishes
          </span>
          {product.storages.slice(0, 3).map((item) => (
            <span
              key={item.label}
              className="rounded bg-surface-container px-2 py-0.5 font-label-sm text-label-sm text-on-surface"
            >
              {item.label}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => addToCart(product, color, storage)}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 font-label-md text-label-md font-semibold text-on-primary shadow-sm transition-all hover:bg-primary-container active:scale-[0.98]"
          >
            <ShoppingBag size={18} aria-hidden="true" />
            <span>Add to Bag</span>
          </button>
          <button
            type="button"
            aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
            aria-pressed={saved}
            onClick={() => toggleWishlist(product)}
            className={`inline-flex items-center justify-center gap-2 rounded-full border border-line bg-surface-container-lowest px-4 py-2.5 font-label-md text-label-md font-semibold text-on-surface transition-colors hover:bg-surface-container-low ${
              saved ? 'text-error' : ''
            }`}
          >
            <Heart size={18} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>
          <Link
            href={`/products/${product.id}`}
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-2.5 font-label-md text-label-md font-semibold text-primary transition-colors hover:underline"
          >
            View details
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
