'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  Bookmark,
  Check,
  CreditCard,
  Headphones,
  Lock,
  RefreshCcw,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
  Zap,
} from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { useStore } from '@/context/StoreContext';
import { getProductById } from '@/data/products';
import { formatINR } from '@/lib/format';
import { FREE_SHIPPING_THRESHOLD, computeTotals } from '@/lib/pricing';

function SavedForLaterGrid({
  items,
  onMoveToCart,
  onRemove,
}: {
  items: ReturnType<typeof useStore>['savedForLater'];
  onMoveToCart: (key: string) => void;
  onRemove: (key: string) => void;
}) {
  if (items.length === 0) return null;

  return (
    <section className="rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-space-sm">
        <h2 className="font-headline-md text-headline-md font-semibold tracking-tight text-on-surface">
          Saved For Later
        </h2>
        <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-secondary">
          {items.length} item{items.length === 1 ? '' : 's'}
        </span>
      </div>
      <div className="mt-space-md grid grid-cols-1 gap-space-md sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center gap-space-md rounded-xl border border-line bg-surface-container-low p-space-sm"
          >
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-container-lowest">
              <Image src={item.image} alt={item.name} fill sizes="80px" className="object-contain p-1" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-label-sm text-label-sm uppercase font-semibold text-secondary">
                {item.categoryLabel}
              </span>
              <p className="truncate font-title-md text-title-md font-semibold text-on-surface">
                {item.name}
              </p>
              <p className="font-label-sm text-label-sm text-outline">{formatINR(item.unitPrice)}</p>
            </div>
            <div className="flex shrink-0 flex-col gap-1">
              <button
                type="button"
                onClick={() => onMoveToCart(item.key)}
                className="rounded-full bg-primary px-3 py-1.5 font-label-sm text-label-sm font-semibold text-on-primary transition-colors hover:bg-primary-container"
              >
                Move to bag
              </button>
              <button
                type="button"
                onClick={() => onRemove(item.key)}
                className="rounded-full px-3 py-1.5 font-label-sm text-label-sm font-semibold text-error transition-colors hover:bg-surface-container"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function CartPage() {
  const {
    cart,
    savedForLater,
    hydrated,
    updateQuantity,
    removeFromCart,
    saveForLater,
    removeSavedForLater,
    moveSavedToCart,
  } = useStore();

  const totals = useMemo(() => computeTotals(cart), [cart]);
  const savings = totals.shipping === 0 && totals.subtotal > 0;
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - totals.subtotal, 0);
  const progress = Math.min((totals.subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  const upsells = useMemo(
    () =>
      ['20w-usb-c-adapter', 'magsafe-charger', 'iphone-16-pro-clear-case']
        .map((id) => getProductById(id))
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    [],
  );

  if (!hydrated) {
    return (
      <div className="shell py-space-xl">
        <div className="h-10 w-64 animate-pulse rounded bg-surface-container" />
        <div className="mt-space-lg h-64 animate-pulse rounded-2xl bg-surface-container" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="shell py-space-xl">
        <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs font-label-sm text-label-sm text-outline">
          <Link href="/" className="transition-colors hover:text-primary">
            Store
          </Link>
          <span className="text-outline-variant">/</span>
          <span className="font-semibold text-primary">Shopping Bag</span>
        </nav>

        <div className="mx-auto mt-space-xl max-w-lg rounded-2xl border border-line bg-surface-container-lowest px-space-lg py-space-xl text-center shadow-plate">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-container text-primary">
            <ShoppingBag size={28} aria-hidden="true" />
          </div>
          <h1 className="mt-space-md font-headline-md text-headline-md text-on-surface">
            Your shopping bag is empty
          </h1>
          <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
            Browse the catalogue and configure a device to start an order.
          </p>
          <div className="mt-space-lg flex flex-wrap justify-center gap-space-sm">
            <ButtonLink href="/products" variant="primary">
              Shop all products
            </ButtonLink>
            <ButtonLink href="/wishlist" variant="secondary">
              View wishlist
            </ButtonLink>
          </div>
        </div>

        {savedForLater.length > 0 && (
          <div className="mt-space-xl">
            <SavedForLaterGrid
              items={savedForLater}
              onMoveToCart={moveSavedToCart}
              onRemove={removeSavedForLater}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full pb-space-xl">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute right-1/4 top-0 h-96 w-96 rounded-full bg-primary-fixed/30 blur-3xl" />
      </div>

      <div className="shell">
        <section className="flex flex-col justify-between gap-space-sm pb-space-md pt-space-lg md:flex-row md:items-end">
          <div>
            <div className="mb-space-xs flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant">
              <Link href="/" className="transition-colors hover:text-primary">
                Store
              </Link>
              <span className="text-outline-variant">/</span>
              <span className="font-semibold text-primary">Shopping Bag</span>
            </div>
            <div className="flex flex-wrap items-baseline gap-space-sm">
              <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface">
                Your Shopping Bag
              </h1>
              <span className="rounded-full bg-secondary-container px-2.5 py-0.5 font-label-md text-label-md font-semibold text-on-secondary-container">
                {cart.length} Item{cart.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-space-md font-label-md text-label-md text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={18} aria-hidden="true" className="text-primary" />
              <span>
                Need assistance?{' '}
                <Link href="/order-success" className="font-semibold text-primary hover:underline">
                  Chat with a specialist
                </Link>
              </span>
            </span>
          </div>
        </section>

        {/* Trust milestone bar */}
        <div className="relative mb-space-lg overflow-hidden rounded-xl bg-surface-container-low p-space-md shadow-sm">
          <div className="relative z-10 flex flex-col justify-between gap-space-md md:flex-row md:items-center">
            <div className="flex items-center gap-space-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container shadow-sm">
                <Truck size={20} aria-hidden="true" />
              </div>
              <div>
                <p className="font-title-md text-title-md leading-snug text-on-surface">
                  You&apos;ve unlocked complimentary express delivery &amp; priority setup support
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Qualified tier for orders above {formatINR(FREE_SHIPPING_THRESHOLD)} • same-day
                  dispatch enabled for Mumbai metro
                </p>
              </div>
            </div>

            <div className="w-full shrink-0 flex-col gap-1 md:flex md:w-56">
              <div className="flex justify-between font-label-sm text-label-sm font-semibold">
                <span className="text-primary">Tier Unlocked: Elite</span>
                <span className="text-on-surface">{formatINR(totals.subtotal)}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-highest">
                <div
                  className="h-full rounded-full bg-primary-container transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-space-lg lg:grid-cols-12">
          {/* Items */}
          <div className="flex flex-col gap-space-lg lg:col-span-8">
            <div className="flex flex-col gap-space-md">
              {cart.map((item) => (
                <article
                  key={item.key}
                  className="rounded-xl bg-surface-container-lowest p-space-md shadow-sm transition-all duration-300 hover:shadow-md md:p-space-lg"
                >
                  <div className="flex flex-col gap-space-md sm:flex-row">
                    <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-lg bg-surface-container-low p-space-sm sm:h-44 sm:w-44">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 176px"
                        className="object-contain p-2 transition-transform duration-300 hover:scale-105"
                      />
                      <span className="absolute left-2 top-2 rounded-full bg-surface-container-lowest/90 px-2 py-0.5 font-label-sm text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm">
                        {item.chip ?? item.categoryLabel}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="mb-1 flex flex-wrap items-start justify-between gap-space-sm">
                          <div>
                            <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider text-secondary">
                              {item.categoryLabel}
                            </span>
                            <h2 className="font-headline-sm text-headline-sm font-semibold tracking-tight text-on-surface">
                              <Link href={`/products/${item.productId}`} className="hover:text-primary">
                                {item.name}
                              </Link>
                            </h2>
                          </div>
                          <div className="text-right">
                            <span className="font-price-card text-price-card font-bold tracking-tight text-on-surface">
                              {formatINR(item.unitPrice * item.quantity)}
                            </span>
                            {item.quantity > 1 && (
                              <p className="font-label-sm text-label-sm text-outline">
                                {formatINR(item.unitPrice)} each
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mb-3 mt-2 flex flex-wrap items-center gap-space-xs">
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-container px-2.5 py-1 font-label-md text-label-md text-on-surface">
                            <span
                              className="h-2.5 w-2.5 rounded-full border border-outline-variant/40"
                              style={{ backgroundColor: item.colorHex }}
                            />
                            {item.color}
                          </span>
                          <span className="rounded-md bg-surface-container px-2.5 py-1 font-label-md text-label-md text-on-surface">
                            {item.storage}
                          </span>
                          {item.appleCare && (
                            <span className="rounded-md bg-secondary-container px-2.5 py-1 font-label-md text-label-md font-medium text-on-secondary-container">
                              AppleCare+ included
                            </span>
                          )}
                        </div>

                        {item.appleCare && (
                          <div className="my-2 flex items-start gap-2.5 rounded-lg bg-surface-container-low p-2.5">
                            <ShieldCheck size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
                            <div className="flex-1 text-on-surface">
                              <div className="flex items-center justify-between font-label-md text-label-md font-semibold">
                                <span>AppleCare+ Protection Plan (2 Years) included</span>
                                <span className="font-normal text-on-surface-variant">incl.</span>
                              </div>
                              <p className="font-label-sm text-label-sm text-on-surface-variant">
                                Accidental damage cover, express replacement and priority support.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-space-sm pt-3">
                        <div className="flex flex-wrap items-center gap-space-md">
                          <QuantityStepper
                            value={item.quantity}
                            onChange={(next) => updateQuantity(item.key, next)}
                            size="sm"
                            label={`Quantity for ${item.name}`}
                          />
                          <button
                            type="button"
                            onClick={() => saveForLater(item.key)}
                            className="flex items-center gap-1 font-label-md text-label-md text-secondary transition-colors hover:text-primary"
                          >
                            <Bookmark size={16} aria-hidden="true" />
                            Save for later
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.key)}
                            className="flex items-center gap-1 font-label-md text-label-md text-error transition-colors hover:text-on-error-container"
                          >
                            <Trash2 size={16} aria-hidden="true" />
                            Remove
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 rounded-full bg-primary-fixed/50 px-2.5 py-1 font-label-sm text-label-sm font-semibold text-primary">
                          <Zap size={15} aria-hidden="true" />
                          <span>Express Dispatch: arriving in 24 hours</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Upsells */}
            {upsells.length > 0 && (
              <section className="rounded-2xl bg-surface-container-lowest p-space-lg shadow-sm">
                <h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                  Recommended Accessories for Your Devices
                </h2>
                <div className="no-scrollbar mt-space-md flex gap-space-md overflow-x-auto pb-space-sm">
                  {upsells.map((product) => (
                    <div
                      key={product.id}
                      className="group flex w-52 shrink-0 flex-col rounded-xl bg-surface-container-low p-space-sm"
                    >
                      <div className="relative h-32 w-full overflow-hidden rounded-lg bg-surface-container-lowest">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="208px"
                          className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="mt-2 font-title-md text-body-lg font-semibold leading-tight text-on-surface">
                        {product.name}
                      </h3>
                      <p className="font-price-card text-price-card mt-1 font-semibold text-on-surface">
                        {formatINR(product.price)}
                      </p>
                      <Link
                        href={`/products/${product.id}`}
                        className="mt-3 flex w-full items-center justify-center gap-1 rounded-full bg-surface-container px-3 py-2 font-label-md text-label-md font-semibold text-primary transition-all hover:bg-primary hover:text-on-primary"
                      >
                        Add to bag
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Trade-in banner */}
            <section className="flex flex-col items-start justify-between gap-space-md rounded-2xl bg-secondary-container/40 p-space-lg sm:flex-row sm:items-center">
              <div>
                <h2 className="font-title-md text-title-md font-semibold text-on-surface">
                  Have a device to trade in?
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Get instant credit toward your new device, with doorstep evaluation in metro
                  cities.
                </p>
              </div>
              <Link
                href="/products?category=iphone"
                className="shrink-0 whitespace-nowrap rounded-full bg-surface-container-lowest px-4 py-2 font-label-md text-label-md font-semibold text-on-surface shadow-sm transition-all hover:bg-secondary-container"
              >
                Explore trade-in
              </Link>
            </section>

            {/* Saved for later */}
            <SavedForLaterGrid
              items={savedForLater}
              onMoveToCart={moveSavedToCart}
              onRemove={removeSavedForLater}
            />
          </div>

          {/* Summary */}
          <aside className="lg:col-span-4">
            <div className="sticky top-[80px] overflow-hidden rounded-2xl bg-surface-container-lowest p-space-md shadow-plate md:p-space-lg">
              {/* Ice-blue header band */}
              <div className="absolute left-0 right-0 top-0 h-2 bg-gradient-to-r from-primary via-primary-container to-secondary-fixed" />

              <div className="flex items-center justify-between border-b border-outline-variant/30 pb-space-sm">
                <h2 className="font-headline-sm text-headline-sm font-bold tracking-tight text-on-surface">
                  Order Summary
                </h2>
                <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
                  Fast Track
                </span>
              </div>

              <div className="flex flex-col gap-space-sm py-space-md">
                <div className="flex items-center justify-between font-body-md text-body-md text-on-surface-variant">
                  <span>Subtotal</span>
                  <span className="font-semibold text-on-surface">{formatINR(totals.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between font-body-md text-body-md text-on-surface-variant">
                  <span>Discount</span>
                  <span className="font-semibold text-primary">—</span>
                </div>
                <div className="flex items-center justify-between font-body-md text-body-md text-on-surface-variant">
                  <span>Shipping</span>
                  <span className="font-semibold text-primary">
                    {totals.shipping === 0 ? (
                      'FREE'
                    ) : (
                      formatINR(totals.shipping)
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between font-body-md text-body-md text-on-surface-variant">
                  <span>GST (included)</span>
                  <span className="font-semibold text-on-surface">{formatINR(totals.tax)}</span>
                </div>

                <div className="border-t border-line pt-space-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-title-md text-title-md font-bold text-on-surface">
                      Total Payable
                    </span>
                    <span className="font-price-hero text-price-hero font-bold text-on-surface">
                      {formatINR(totals.total)}
                    </span>
                  </div>
                  <p className="mt-1 font-label-sm text-label-sm text-on-surface-variant">
                    Or 12 monthly installments of{' '}
                    <span className="font-semibold text-on-surface">
                      {formatINR(Math.ceil(totals.total / 12))}/mo
                    </span>{' '}
                    with No Cost EMI on eligible cards.
                  </p>
                </div>

                {!savings && remaining > 0 && (
                  <p className="rounded-lg bg-surface-container px-3 py-2 font-label-sm text-label-sm text-on-surface-variant">
                    Add {formatINR(remaining)} more to unlock free insured express delivery.
                  </p>
                )}

                <ButtonLink href="/checkout" size="lg" className="w-full">
                  <Lock size={18} aria-hidden="true" />
                  Proceed to Order
                </ButtonLink>

                <div className="grid grid-cols-2 gap-space-xs">
                  {[
                    { icon: Lock, label: '256-bit SSL' },
                    { icon: CreditCard, label: 'UPI · Cards · EMI' },
                    { icon: RefreshCcw, label: '14-day returns' },
                    { icon: Truck, label: 'Insured delivery' },
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-2 rounded-lg bg-surface-container-low px-3 py-2"
                    >
                      <Icon size={16} aria-hidden="true" className="shrink-0 text-primary" />
                      <span className="font-label-sm text-label-sm text-on-surface-variant">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-2 rounded-lg border border-line bg-surface-container-low px-3 py-2.5">
                  <Check size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
                  <p className="font-label-sm text-label-sm leading-relaxed text-on-surface-variant">
                    Every device ships sealed with a verifiable serial number and full
                    manufacturer documentation.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom express delivery assurance grid */}
        <section className="mt-space-xl grid grid-cols-1 gap-space-md rounded-2xl bg-surface-container-low px-space-md py-space-lg text-center md:grid-cols-3 md:text-left">
          {[
            {
              icon: Truck,
              title: 'Complimentary Insured Shipping',
              body: 'Air cargo tracked directly with tamper-evident seal packs.',
            },
            {
              icon: ShieldCheck,
              title: 'Genuine Product Guarantee',
              body: 'Manufacturer warranty honoured at every service provider in India.',
            },
            {
              icon: Headphones,
              title: 'AURORA Concierge Support',
              body: '1-on-1 virtual hardware unboxing and device migration guidance.',
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex items-center gap-space-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-container-lowest text-primary shadow-sm">
                <Icon size={24} aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-title-md text-body-lg font-bold text-on-surface">{title}</h2>
                <p className="font-body-md text-label-sm text-on-surface-variant">{body}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
