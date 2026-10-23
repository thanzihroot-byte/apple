'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowRight, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { useStore } from '@/context/StoreContext';
import { formatINR } from '@/lib/format';
import { getProductById } from '@/data/products';

export default function WishlistPage() {
  const { wishlist, hydrated, moveToCart, toggleWishlist } = useStore();

  // The wishlist only stores a lightweight snapshot, so we look the full
  // product record back up to render storage/finish details.
  const items = useMemo(
    () =>
      wishlist.flatMap((item) => {
        const product = getProductById(item.productId);
        return product ? [{ item, product }] : [];
      }),
    [wishlist],
  );

  const total = useMemo(
    () => items.reduce((sum, entry) => sum + entry.item.price, 0),
    [items],
  );

  if (!hydrated) {
    return (
      <div className="shell py-space-xl">
        <div className="h-10 w-64 animate-pulse rounded bg-surface-container" />
        <div className="mt-space-lg grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="h-72 animate-pulse rounded-xl bg-surface-container" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full pb-space-xl">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/3 top-0 h-[360px] w-[520px] rounded-full bg-secondary-container/20 blur-3xl" />
      </div>

      <div className="shell relative">
        <section className="flex flex-col justify-between gap-space-sm pb-space-md pt-space-lg md:flex-row md:items-end">
          <div>
            <div className="mb-space-xs flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
              <Link href="/" className="transition-colors hover:text-primary">
                Home
              </Link>
              <span className="text-outline-variant">/</span>
              <span className="font-semibold text-primary">Wishlist</span>
            </div>
            <div className="flex flex-wrap items-baseline gap-space-sm">
              <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface">
                Your Wishlist
              </h1>
              <span className="rounded-full bg-surface-container px-2.5 py-0.5 font-label-md text-label-md font-semibold text-on-surface-variant">
                {items.length} Item{items.length === 1 ? '' : 's'}
              </span>
            </div>
            <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
              Products you have saved for later. Move them to your bag whenever you are ready.
            </p>
          </div>

          {items.length > 0 && (
            <ButtonLink href="/products" variant="secondary" size="md">
              Browse the catalogue
              <ArrowRight size={16} aria-hidden="true" />
            </ButtonLink>
          )}
        </section>

        {items.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-2xl border border-line bg-surface-container-lowest px-space-lg py-space-xl text-center shadow-plate">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface-container text-primary">
              <Heart size={26} aria-hidden="true" />
            </div>
            <h2 className="mt-space-md font-headline-md text-headline-md text-on-surface">
              Your wishlist is empty
            </h2>
            <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
              Tap the heart on any product to save it here for later.
            </p>
            <ButtonLink href="/products" size="lg" className="mt-space-lg">
              <ShoppingBag size={18} aria-hidden="true" />
              Start shopping
            </ButtonLink>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-3">
              {items.map(({ item, product }) => (
                <article
                  key={item.productId}
                  className="group plate lift flex flex-col rounded-xl p-space-sm"
                >
                  <div className="relative overflow-hidden rounded-lg bg-surface-container-low">
                    <div className="relative aspect-[4/3] w-full">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-contain p-space-md transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product)}
                      aria-label={`Remove ${product.name} from wishlist`}
                      className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-lowest/85 text-error backdrop-blur-sm shadow-sm transition-colors hover:bg-surface-container-lowest"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                    {product.badge && (
                      <span className="absolute left-2.5 top-2.5 rounded-full bg-inverse-surface px-2 py-0.5 font-label-sm text-[10px] uppercase tracking-wider text-inverse-on-surface">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between pt-space-md">
                    <div>
                      <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-secondary">
                        {product.categoryLabel}
                      </span>
                      <h2 className="mt-0.5 font-title-md text-title-md font-semibold text-on-surface transition-colors group-hover:text-primary">
                        <Link href={`/products/${product.id}`}>{product.name}</Link>
                      </h2>
                      <p className="mt-0.5 line-clamp-2 font-body-md text-body-md text-on-surface-variant">
                        {product.tagline}
                      </p>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {product.colors.slice(0, 4).map((color) => (
                          <span
                            key={color.name}
                            title={color.name}
                            className="h-3 w-3 rounded-full border border-outline-variant/40"
                            style={{ backgroundColor: color.hex }}
                          />
                        ))}
                        <span className="font-label-sm text-label-sm text-outline">
                          {product.colors.length} finishes
                        </span>
                      </div>
                    </div>

                    <div className="mt-space-md border-t border-line pt-space-sm">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-price-card text-price-card text-on-surface">
                          {formatINR(item.price)}
                        </span>
                        <span className="font-label-sm text-label-sm text-outline">Incl. GST</span>
                      </div>
                      <div className="mt-space-sm flex gap-2">
                        <button
                          type="button"
                          onClick={() => moveToCart(product)}
                          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 font-label-md text-label-md font-semibold text-on-primary shadow-sm transition-all hover:bg-primary-container active:scale-[0.98]"
                        >
                          <ShoppingBag size={16} aria-hidden="true" />
                          Move to Bag
                        </button>
                        <Link
                          href={`/products/${product.id}`}
                          className="flex items-center justify-center rounded-full border border-line bg-surface-container-lowest px-4 py-2.5 font-label-md text-label-md font-semibold text-on-surface transition-colors hover:bg-surface-container-low"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-space-lg flex flex-col items-end justify-between gap-3 rounded-2xl border border-line bg-surface-container-lowest px-space-lg py-space-md shadow-plate sm:flex-row sm:items-center">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Total value of saved items
                <span className="ml-2 font-price-card text-price-card font-semibold text-on-surface">
                  {formatINR(total)}
                </span>
              </p>
              <ButtonLink href="/cart" size="md">
                <ShoppingBag size={16} aria-hidden="true" />
                Go to your bag
              </ButtonLink>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
