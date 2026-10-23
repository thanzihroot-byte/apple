'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Rating } from '@/components/ui/Rating';
import { useStore } from '@/context/StoreContext';
import { formatINR } from '@/lib/format';
import type { Product } from '@/types';

/**
 * Homepage "Bestsellers" card — ported from the Stitch homepage product grid.
 */
export function ShowcaseCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const saved = isInWishlist(product.id);
  const color = product.colors[0];
  const storage = product.storages[0];

  return (
    <div className="group flex flex-col rounded-2xl bg-surface-container-lowest p-space-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-64 w-full overflow-hidden rounded-xl bg-surface-container-low p-4">
        {product.badge && (
          <span className="absolute left-3 top-3 z-10">
            <Badge tone={product.badgeTone ?? 'surface'}>{product.badge}</Badge>
          </span>
        )}
        <button
          type="button"
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          aria-pressed={saved}
          onClick={() => toggleWishlist(product)}
          className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-lowest/90 text-on-surface-variant shadow-sm backdrop-blur-sm transition-colors ${
            saved ? 'text-error' : 'hover:text-error'
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
            width={560}
            height={560}
            className="h-full w-full rounded-lg object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      </div>

      <div className="flex flex-1 flex-col justify-between p-space-sm">
        <div>
          <div className="mb-1.5">
            <Rating value={product.rating} count={product.reviewCount} />
          </div>
          <h3 className="line-clamp-1 font-title-md text-title-md font-semibold text-on-surface">
            <Link href={`/products/${product.id}`} className="hover:text-primary">
              {product.name}
            </Link>
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            {color.name} • {storage.label}
          </p>

          <div className="my-2 flex items-center gap-2">
            {product.colors.slice(0, 4).map((item, index) => (
              <span
                key={item.name}
                title={item.name}
                className={`h-4 w-4 rounded-full border border-outline-variant/40 ${
                  index === 0 ? 'ring-2 ring-primary ring-offset-2' : ''
                }`}
                style={{ backgroundColor: item.hex }}
              />
            ))}
          </div>
        </div>

        <div className="mt-2 pt-space-xs">
          <div className="mb-1 flex items-baseline justify-between gap-2">
            <span className="font-price-card text-price-card font-bold text-on-surface">
              {formatINR(storage.price)}
            </span>
            <span className="font-label-sm text-[11px] font-medium text-primary">
              From {formatINR(product.emiMonthly)}/mo
            </span>
          </div>
          <p className="mb-3 flex items-center gap-1 font-label-sm text-[11px] text-on-surface-variant">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                product.inStock ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              aria-hidden="true"
            />
            {product.inStock ? 'In Stock • Ships in 24h' : 'Pre-order • Ships in 3 days'}
          </p>
          <button
            type="button"
            onClick={() => addToCart(product, color, storage)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 font-label-md text-label-md font-semibold text-on-primary shadow-sm transition-all hover:bg-primary-container active:scale-[0.98]"
          >
            <ShoppingBag size={18} aria-hidden="true" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
