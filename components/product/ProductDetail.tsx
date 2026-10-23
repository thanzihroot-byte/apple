'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  Check,
  Heart,
  MapPin,
  MessageCircle,
  RefreshCcw,
  Rotate3d,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Truck,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { Rating } from '@/components/ui/Rating';
import { useStore } from '@/context/StoreContext';
import { APPLECARE_PRICE } from '@/data/site';
import { getProductById } from '@/data/products';
import { formatINR } from '@/lib/format';
import type { Product } from '@/types';

const GALLERY_LABELS = ['Hero', 'Front', 'Back', 'Control', 'Camera', 'In-Hand', 'Studio', 'Detail'];

type TabKey = 'highlights' | 'specs' | 'box' | 'reviews';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'highlights', label: 'Overview & Highlights' },
  { key: 'specs', label: 'Technical Specifications' },
  { key: 'box', label: "What's in the Box" },
  { key: 'reviews', label: 'Customer Reviews' },
];

export function ProductDetail({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isInWishlist, showToast } = useStore();

  const [imageIndex, setImageIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [storageIndex, setStorageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [tradeIn, setTradeIn] = useState<'yes' | 'no' | null>(null);
  const [appleCare, setAppleCare] = useState(false);
  const [tab, setTab] = useState<TabKey>('highlights');
  const [pincode, setPincode] = useState('400001');
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [imei, setImei] = useState('');

  const color = product.colors[colorIndex] ?? product.colors[0];
  const storage = product.storages[storageIndex] ?? product.storages[0];
  const saved = isInWishlist(product.id);

  const total = useMemo(
    () => storage.price + (appleCare ? APPLECARE_PRICE : 0),
    [storage.price, appleCare],
  );

  const gallery = product.images.length > 0 ? product.images : [product.image];

  function handleAddToBag() {
    addToCart(product, color, storage, quantity, appleCare);
  }

  async function handleShare() {
    const url = typeof window === 'undefined' ? '' : window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      showToast('Link copied to clipboard', 'Share this configuration with someone.');
    } catch {
      showToast('Copy the page URL to share', undefined, 'info');
    }
  }

  function checkPincode() {
    if (!/^\d{6}$/.test(pincode.trim())) {
      showToast('Enter a valid 6-digit pincode', undefined, 'info');
      return;
    }
    setPincodeChecked(true);
  }

  const bundleItems = bundleCatalogue;

  const bundleTotal =
    storage.price + bundleItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      {/* Breadcrumb + context bar */}
      <div className="shell flex flex-col justify-between gap-space-sm pb-space-sm pt-space-lg sm:flex-row sm:items-center">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2">
          <Link
            href="/"
            className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary"
          >
            Home
          </Link>
          <span className="font-label-md text-label-md text-outline-variant">/</span>
          <Link
            href={`/products?category=${product.category}`}
            className="font-label-md text-label-md text-on-surface-variant transition-colors hover:text-primary"
          >
            {product.categoryLabel}
          </Link>
          <span className="font-label-md text-label-md text-outline-variant">/</span>
          <span className="font-label-md text-label-md font-semibold text-on-surface">
            {product.name}
          </span>
        </nav>

        <div className="flex items-center gap-space-xs self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-high px-3 py-1 font-label-sm text-label-sm text-primary shadow-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" aria-hidden="true" />
            {product.inStock ? 'In Stock • Ships in 24 hours' : 'Pre-order • Ships in 3 days'}
          </span>
        </div>
      </div>

      {/* Main configurator */}
      <section className="shell pb-space-xl pt-space-sm">
        <div className="grid grid-cols-1 items-start gap-space-lg lg:grid-cols-12 lg:gap-space-xl">
          {/* LEFT: gallery */}
          <div className="flex flex-col gap-space-md lg:col-span-7 lg:sticky lg:top-[80px]">
            <div className="group relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl bg-surface-container-low p-space-md shadow-sm sm:aspect-[16/11]">
              <div className="absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-lowest/90 px-3 py-1.5 font-label-sm text-label-sm text-on-surface shadow-sm backdrop-blur-md">
                  <Rotate3d size={16} aria-hidden="true" className="text-primary" />
                  360° Orbit View
                </span>
                <button
                  type="button"
                  onClick={() =>
                    showToast(
                      'AR preview is not part of this prototype',
                      'Use the thumbnail ribbon to explore every angle.',
                      'info',
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-lowest/90 px-3 py-1.5 font-label-sm text-label-sm text-on-surface shadow-sm backdrop-blur-md transition-colors hover:text-primary"
                >
                  <Store size={16} aria-hidden="true" className="text-primary" />
                  View in your room
                </button>
              </div>

              {product.chip && (
                <div className="absolute right-4 top-4 z-10">
                  <span className="rounded-full bg-surface-container-highest/80 px-3 py-1 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant backdrop-blur-md">
                    {product.chip}
                  </span>
                </div>
              )}

              <div className="relative flex h-full w-full items-center justify-center">
                <Image
                  src={gallery[imageIndex]}
                  alt={`${product.name} — ${GALLERY_LABELS[imageIndex] ?? 'view'}`}
                  width={900}
                  height={700}
                  priority
                  className="h-full w-full max-w-[84%] object-contain drop-shadow-2xl transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
              </div>

              <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-surface-container-lowest/80 px-3 py-1 font-label-sm text-label-sm text-on-surface backdrop-blur-md">
                <span
                  className="h-2.5 w-2.5 rounded-full border border-outline-variant/40"
                  style={{ backgroundColor: color.hex }}
                />
                <span className="font-semibold">{color.name}</span>
              </div>

              <div className="absolute bottom-4 right-4 hidden items-center gap-1.5 rounded-full bg-surface-container-lowest/80 px-2.5 py-1 font-label-sm text-[10px] text-on-surface-variant backdrop-blur-md sm:flex">
                <Sparkles size={14} aria-hidden="true" />
                Hover to examine micro-blasted texture
              </div>
            </div>

            {/* Thumbnail ribbon — small, compact thumbnails */}
            <div className="no-scrollbar -mx-space-xs flex gap-space-xs overflow-x-auto px-space-xs py-1 lg:flex-wrap lg:overflow-x-visible">
              {gallery.map((image, index) => (
                <button
                  key={image + index}
                  type="button"
                  onClick={() => setImageIndex(index)}
                  aria-label={`Show ${GALLERY_LABELS[index] ?? `view ${index + 1}`}`}
                  aria-pressed={imageIndex === index}
                  className={`group relative h-16 w-16 shrink-0 overflow-hidden rounded-lg p-1.5 shadow-sm transition-all duration-200 focus:outline-none sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-[120px] lg:w-[120px] ${
                    imageIndex === index
                      ? 'bg-surface-container-highest ring-2 ring-primary'
                      : 'bg-surface-container-low hover:-translate-y-0.5 hover:bg-surface-container-high'
                  }`}
                >
                  <Image
                    src={image}
                    alt=""
                    width={240}
                    height={240}
                    className="h-full w-full rounded-md object-contain"
                  />
                  <span className="pointer-events-none absolute bottom-0.5 left-0 right-0 text-center font-label-sm text-[9px] uppercase tracking-wider text-outline group-hover:text-on-surface-variant">
                    {GALLERY_LABELS[index] ?? index + 1}
                  </span>
                </button>
              ))}
            </div>

            {/* Micro feature plate */}
            <div className="mt-space-xs flex flex-col items-center justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-md shadow-sm sm:flex-row">
              <div className="flex items-center gap-space-sm">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-container/50 text-primary">
                  <RefreshCcw size={20} aria-hidden="true" />
                </div>
                <div>
                  <p className="font-title-md text-title-md text-on-surface">
                    Crafted for everyday performance
                  </p>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Every configuration ships sealed with a verifiable serial number.
                  </p>
                </div>
              </div>
              <a
                href="#tech-specs"
                className="flex shrink-0 items-center gap-1 rounded-full bg-surface-container-low px-4 py-2 font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container-high"
              >
                Explore Specs
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>

            {/* Authenticity assurance */}
            <div className="grid grid-cols-3 gap-space-xs pt-space-xs text-center">
              <div className="rounded-lg bg-surface-container-low/60 p-space-sm">
                <BadgeCheck size={18} aria-hidden="true" className="mx-auto text-primary" />
                <p className="mt-1 font-label-sm text-label-sm font-semibold text-on-surface">
                  Genuine Stock
                </p>
                <p className="font-label-sm text-[10px] text-outline">Sealed retail box</p>
              </div>
              <div className="rounded-lg bg-surface-container-low/60 p-space-sm">
                <ShieldCheck size={18} aria-hidden="true" className="mx-auto text-primary" />
                <p className="mt-1 font-label-sm text-label-sm font-semibold text-on-surface">
                  Warranty
                </p>
                <p className="font-label-sm text-[10px] text-outline">Manufacturer cover</p>
              </div>
              <div className="rounded-lg bg-surface-container-low/60 p-space-sm">
                <CalendarClock size={18} aria-hidden="true" className="mx-auto text-primary" />
                <p className="mt-1 font-label-sm text-label-sm font-semibold text-on-surface">
                  14-Day Returns
                </p>
                <p className="font-label-sm text-[10px] text-outline">Hassle-free policy</p>
              </div>
            </div>
          </div>

          {/* RIGHT: configurator */}
          <div className="flex flex-col gap-space-lg lg:col-span-5">
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="font-label-sm text-label-sm font-bold uppercase tracking-widest text-primary">
                  {product.categoryLabel}
                </span>
                <div className="flex items-center gap-1 text-secondary">
                  <Rating value={product.rating} size={16} />
                  <span className="font-body-md text-body-md text-on-surface-variant">
                    ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <h1 className="font-headline-lg text-headline-lg tracking-tight text-on-surface">
                {product.name}
              </h1>
              <p className="font-body-lg text-body-lg leading-snug text-on-surface-variant">
                {product.tagline}
              </p>

              <div className="flex items-baseline gap-space-sm pt-space-xs">
                <span className="font-price-hero text-price-hero font-bold tracking-tight text-on-surface">
                  {formatINR(total)}
                </span>
                <span className="font-label-md text-label-md text-outline">MRP (Incl. of all taxes)</span>
              </div>
              {product.badge && (
                <div className="pt-1">
                  <Badge tone={product.badgeTone ?? 'surface'}>{product.badge}</Badge>
                </div>
              )}
            </div>

            {/* Privileges plate */}
            <div className="flex flex-col gap-space-sm rounded-xl bg-surface-container-low p-space-md shadow-sm">
              <div className="flex items-center gap-space-xs font-title-md text-title-md text-primary">
                <Zap size={20} aria-hidden="true" />
                <span>Exclusive AURORA Privileges</span>
              </div>
              <div className="grid grid-cols-1 gap-space-xs text-left sm:grid-cols-2">
                <div className="flex flex-col justify-between rounded-lg bg-surface-container-lowest p-space-sm shadow-sm">
                  <div>
                    <span className="mb-1 inline-block rounded bg-primary-fixed px-2 py-0.5 font-label-sm text-[10px] font-bold uppercase text-on-primary-fixed-variant">
                      No Cost EMI
                    </span>
                    <p className="font-body-md text-body-md font-semibold text-on-surface">
                      From {formatINR(product.emiMonthly)}/mo
                    </p>
                    <p className="mt-0.5 font-label-sm text-[11px] text-on-surface-variant">
                      Up to 24 months with leading banks
                    </p>
                  </div>
                </div>
                <div className="flex flex-col justify-between rounded-lg bg-surface-container-lowest p-space-sm shadow-sm">
                  <div>
                    <span className="mb-1 inline-block rounded bg-secondary-container px-2 py-0.5 font-label-sm text-[10px] font-bold uppercase text-on-secondary-container">
                      Genuine Guarantee
                    </span>
                    <p className="font-body-md text-body-md font-semibold text-on-surface">
                      Sealed retail box
                    </p>
                    <p className="mt-0.5 font-label-sm text-[11px] text-on-surface-variant">
                      Verifiable serial number on every unit
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 1 — finish */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="font-title-md text-title-md text-on-surface">Step 1: Select Finish</span>
                <span className="font-label-md text-label-md font-semibold text-primary">
                  {color.name}
                </span>
              </div>
              <div
                className="grid gap-space-xs pt-1"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(product.colors.length, 4)}, minmax(0, 1fr))`,
                }}
              >
                {product.colors.map((item, index) => {
                  const active = index === colorIndex;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setColorIndex(index)}
                      className={`flex flex-col items-center gap-2 rounded-xl p-3 shadow-sm transition-all ${
                        active
                          ? 'bg-surface-container-highest ring-2 ring-primary'
                          : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                    >
                      <span
                        className="h-6 w-6 rounded-full shadow-inner ring-2 ring-surface-container-lowest"
                        style={{ backgroundColor: item.hex }}
                      />
                      <span className="text-center font-label-sm text-label-sm font-medium text-on-surface">
                        {item.short}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2 — storage */}
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="font-title-md text-title-md text-on-surface">Step 2: Choose Storage</span>
                <span className="font-label-sm text-label-sm text-outline">
                  How much capacity do you need?
                </span>
              </div>
              <div className="grid grid-cols-1 gap-space-xs pt-1 sm:grid-cols-2">
                {product.storages.map((item, index) => {
                  const active = index === storageIndex;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setStorageIndex(index)}
                      className={`flex flex-col rounded-xl p-3 text-left shadow-sm transition-all sm:p-4 ${
                        active
                          ? 'bg-surface-container-highest ring-2 ring-primary'
                          : 'bg-surface-container-low hover:bg-surface-container-high'
                      }`}
                    >
                      <div className="flex min-w-0 items-start justify-between gap-2 sm:gap-3">
                        <span className="min-w-0 flex-1 font-headline-sm text-headline-sm font-bold leading-tight text-on-surface">
                          {item.label}
                        </span>
                        {index === 1 && (
                          <span className="shrink-0 rounded-full bg-primary-container px-2 py-1 font-label-sm text-[10px] font-bold uppercase leading-none text-on-primary-container">
                            Popular
                          </span>
                        )}
                      </div>
                      <span className="mt-1 block font-label-sm text-label-sm text-on-surface-variant">
                        {item.note}
                      </span>
                      <span className="mt-2 font-label-md text-label-md font-semibold text-on-surface">
                        {formatINR(item.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3 — trade-in */}
            <div className="flex flex-col gap-space-xs rounded-xl bg-surface-container-low p-space-md shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <RefreshCcw size={20} aria-hidden="true" className="text-primary" />
                  <span className="font-title-md text-title-md text-on-surface">Step 3: Trade-in</span>
                </div>
                <span className="font-label-sm text-label-sm font-bold text-primary">Instant credit</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Trade in your current device for credit toward this purchase. Doorstep evaluation is
                available in metro cities.
              </p>
              <div className="grid grid-cols-2 gap-space-xs pt-1">
                <button
                  type="button"
                  aria-pressed={tradeIn === 'yes'}
                  onClick={() => setTradeIn(tradeIn === 'yes' ? null : 'yes')}
                  className={`flex flex-col items-center rounded-lg p-3 text-center shadow-sm transition-all ${
                    tradeIn === 'yes'
                      ? 'bg-surface-container-highest ring-2 ring-primary'
                      : 'bg-surface-container-lowest hover:bg-surface-container-high'
                  }`}
                >
                  <span className="font-label-md text-label-md font-semibold text-on-surface">
                    Yes, evaluate device
                  </span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant">
                    Instant discount voucher
                  </span>
                </button>
                <button
                  type="button"
                  aria-pressed={tradeIn === 'no'}
                  onClick={() => setTradeIn(tradeIn === 'no' ? null : 'no')}
                  className={`flex flex-col items-center rounded-lg p-3 text-center shadow-sm transition-all ${
                    tradeIn === 'no'
                      ? 'bg-surface-container-highest ring-2 ring-primary'
                      : 'bg-surface-container-lowest hover:bg-surface-container-high'
                  }`}
                >
                  <span className="font-label-md text-label-md font-semibold text-on-surface">
                    No trade-in
                  </span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant">
                    Continue with direct buy
                  </span>
                </button>
              </div>

              {tradeIn === 'yes' && (
                <div className="mt-2 flex flex-col gap-2 rounded-lg bg-surface-container-lowest p-space-sm">
                  <div className="flex items-center justify-between font-label-md text-label-md text-on-surface">
                    <span>Select brand: iPhone / Samsung / Pixel</span>
                    <span className="cursor-pointer text-primary hover:underline">Eligibility check</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={imei}
                      onChange={(event) => setImei(event.target.value)}
                      placeholder="Enter IMEI or model number…"
                      aria-label="IMEI or model number"
                      className="flex-1 rounded-md bg-surface-container-low px-3 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        showToast(
                          imei.trim() ? 'Trade-in request noted' : 'Enter an IMEI or model number',
                          imei.trim()
                            ? 'A specialist will confirm eligibility at checkout.'
                            : 'Demo flow — no data is transmitted.',
                          imei.trim() ? 'success' : 'info',
                        )
                      }
                      className="rounded-md bg-secondary-container px-3 py-2 font-label-sm text-label-sm font-semibold text-on-secondary-container transition-colors hover:bg-primary hover:text-on-primary"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 4 — AppleCare+ */}
            <div className="flex flex-col gap-space-xs rounded-xl bg-surface-container-low p-space-md shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} aria-hidden="true" className="text-primary" />
                  <span className="font-title-md text-title-md text-on-surface">
                    Step 4: AppleCare+
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-outline">Optional add-on</span>
              </div>
              <label
                className={`relative flex cursor-pointer items-start gap-space-sm rounded-lg p-space-sm shadow-sm transition-colors ${
                  appleCare ? 'bg-surface-container-highest' : 'bg-surface-container-lowest hover:bg-surface-container-high'
                }`}
              >
                <input
                  type="checkbox"
                  checked={appleCare}
                  onChange={(event) => setAppleCare(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded bg-surface text-primary accent-primary focus:ring-primary"
                />
                <span className="flex-1">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="font-title-md text-title-md font-semibold text-on-surface">
                      2 Years AppleCare+ with Theft &amp; Loss
                    </span>
                    <span className="font-title-md text-title-md font-bold text-on-surface">
                      {formatINR(APPLECARE_PRICE)}
                    </span>
                  </span>
                  <span className="mt-1 block font-body-md text-body-md text-on-surface-variant">
                    Accidental damage cover, priority technical support and express battery
                    replacement.
                  </span>
                  <span className="mt-2 flex items-center gap-3 font-label-sm text-[11px] text-primary">
                    <span className="flex items-center gap-1">
                      <Zap size={14} aria-hidden="true" /> Instant Replacement
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck size={14} aria-hidden="true" /> Loss Protection
                    </span>
                  </span>
                </span>
              </label>
            </div>

            {/* Quantity + actions */}
            <div className="flex flex-col gap-space-sm pt-space-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="font-title-md text-title-md text-on-surface">Quantity</span>
                <QuantityStepper value={quantity} onChange={setQuantity} />
              </div>

              <button
                type="button"
                onClick={handleAddToBag}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-primary-container px-6 py-4 font-headline-sm text-headline-sm font-semibold text-on-primary shadow-lg transition-all hover:bg-primary active:scale-[0.99]"
              >
                <ShoppingBag size={24} aria-hidden="true" />
                Add to Bag • {formatINR(total * quantity)}
              </button>

              <div className="grid grid-cols-1 gap-space-xs sm:grid-cols-12">
                <Link
                  href="/checkout"
                  className="flex items-center justify-center gap-2 rounded-full bg-surface-container-lowest px-5 py-3 font-title-md text-title-md font-semibold text-on-surface shadow-sm transition-all hover:bg-surface-container-low sm:col-span-8"
                >
                  <MessageCircle size={20} aria-hidden="true" className="text-primary" />
                  Order Now on WhatsApp
                </Link>
                <div className="flex items-center justify-center gap-space-xs sm:col-span-4">
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    aria-pressed={saved}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-full bg-surface-container-lowest px-3 py-3 font-label-md text-label-md text-on-surface shadow-sm transition-colors hover:bg-surface-container-low ${
                      saved ? 'text-error' : ''
                    }`}
                  >
                    <Heart size={18} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
                    {saved ? 'Saved' : 'Wishlist'}
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label="Share this product"
                    className="flex items-center justify-center rounded-full bg-surface-container-lowest px-3 py-3 text-on-surface shadow-sm transition-colors hover:bg-surface-container-low"
                  >
                    <Share2 size={18} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            {/* Pincode checker */}
            <div className="flex flex-col gap-space-sm rounded-xl bg-surface-container-low p-space-md shadow-sm">
              <div className="flex items-center gap-2 font-title-md text-title-md text-on-surface">
                <Truck size={20} aria-hidden="true" className="text-primary" />
                <span>Express Logistics &amp; Availability</span>
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin
                    size={18}
                    aria-hidden="true"
                    className="absolute left-3 top-3 text-outline"
                  />
                  <input
                    value={pincode}
                    onChange={(event) => {
                      setPincode(event.target.value.replace(/\D/g, '').slice(0, 6));
                      setPincodeChecked(false);
                    }}
                    inputMode="numeric"
                    aria-label="6-digit pincode"
                    placeholder="Enter 6-digit Pincode"
                    className="w-full rounded-lg bg-surface-container-lowest py-2.5 pl-9 pr-3 font-body-md text-body-md text-on-surface shadow-inner focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <button
                  type="button"
                  onClick={checkPincode}
                  className="rounded-lg bg-surface-container-highest px-5 py-2.5 font-label-md text-label-md font-semibold text-on-surface shadow-sm transition-all hover:bg-primary hover:text-on-primary"
                >
                  Check
                </button>
              </div>

              {pincodeChecked && (
                <div className="flex items-start gap-space-xs rounded-lg bg-surface-container-lowest p-space-sm">
                  <Truck size={20} aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
                  <div>
                    <p className="font-body-md text-body-md font-semibold text-on-surface">
                      Free Express Delivery by tomorrow, 2:00 PM
                    </p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      Demo estimate for pincode {pincode}. Same-day store pickup is also available.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Frequently bought together */}
      <section className="shell py-space-xl">
        <div className="flex flex-col gap-space-lg rounded-2xl bg-surface-container-low p-space-md shadow-sm sm:p-space-xl">
          <div className="flex flex-col justify-between gap-space-xs sm:flex-row sm:items-center">
            <div>
              <span className="font-label-sm text-label-sm font-bold uppercase tracking-wider text-primary">
                Complete Your Setup
              </span>
              <h2 className="font-headline-md text-headline-md text-on-surface">
                Frequently Bought Together
              </h2>
            </div>
            <span className="self-start rounded-full bg-primary-fixed px-3 py-1 font-label-sm text-label-sm font-semibold text-on-primary-fixed-variant sm:self-auto">
              Bundle &amp; save
            </span>
          </div>

          <div className="grid grid-cols-1 items-center gap-space-md lg:grid-cols-12">
            <div className="grid grid-cols-1 items-center gap-space-sm sm:grid-cols-3 lg:col-span-8">
              <div className="relative flex flex-col items-center rounded-xl bg-surface-container-lowest p-space-md text-center shadow-sm">
                <span className="absolute left-2 top-2 rounded bg-surface-container-high px-2 py-0.5 font-label-sm text-[10px] font-semibold text-on-surface">
                  This item
                </span>
                <Image
                  src={product.image}
                  alt={product.name}
                  width={240}
                  height={240}
                  className="my-2 h-24 w-24 object-contain"
                />
                <p className="w-full truncate font-title-md text-title-md font-semibold text-on-surface">
                  {product.name}
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  {color.name} • {storage.label}
                </p>
                <p className="mt-2 font-price-card text-price-card font-bold text-on-surface">
                  {formatINR(storage.price)}
                </p>
              </div>

              {bundleItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center rounded-xl bg-surface-container-lowest p-space-md text-center shadow-sm"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={240}
                    height={240}
                    className="my-2 h-24 w-24 object-contain"
                  />
                  <p className="w-full truncate font-title-md text-title-md font-semibold text-on-surface">
                    {item.name}
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">{item.tagline}</p>
                  <p className="mt-2 font-price-card text-price-card font-bold text-on-surface">
                    {formatINR(item.price)}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col justify-between gap-space-md rounded-xl bg-surface-container-lowest p-space-lg shadow-sm lg:col-span-4">
              <div>
                <p className="font-label-sm text-label-sm font-semibold uppercase text-on-surface-variant">
                  Total Bundle Price
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-headline-md text-headline-md font-bold text-primary">
                    {formatINR(bundleTotal)}
                  </span>
                  <span className="font-body-md text-body-md text-outline line-through">
                    {formatINR(bundleTotal + 1500)}
                  </span>
                </div>
                <p className="mt-1 font-label-sm text-label-sm text-on-surface-variant">
                  Authentic accessories and full drop protection, added in one tap.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  addToCart(product, color, storage, 1, appleCare);
                  bundleItems.forEach((item) =>
                    addToCart(item, item.colors[0], item.storages[0]),
                  );
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-on-surface px-6 py-3.5 font-title-md text-title-md font-semibold text-surface-container-lowest shadow-md transition-colors hover:bg-primary"
              >
                <ShoppingBag size={20} aria-hidden="true" />
                Add all {bundleItems.length + 1} to bag
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section id="tech-specs" className="shell scroll-mt-32 py-space-xl">
        <div className="no-scrollbar flex items-center gap-space-xs overflow-x-auto pb-space-sm">
          {TABS.map((item) => {
            const active = tab === item.key;
            const label =
              item.key === 'reviews'
                ? `Customer Reviews (${product.reviewCount})`
                : item.label;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setTab(item.key)}
                aria-pressed={active}
                className={`whitespace-nowrap rounded-full px-6 py-3 font-label-md text-label-md font-semibold shadow-sm transition-all ${
                  active
                    ? 'bg-on-surface text-surface-container-lowest'
                    : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="mt-space-lg">
          {tab === 'highlights' && <HighlightsPanel product={product} />}
          {tab === 'specs' && <SpecsPanel product={product} />}
          {tab === 'box' && <BoxPanel product={product} />}
          {tab === 'reviews' && <ReviewsPanel product={product} />}
        </div>

        <p className="mt-space-lg rounded-xl border border-line bg-surface-container-low px-4 py-3 font-label-sm text-label-sm leading-relaxed text-on-surface-variant">
          <strong className="font-semibold text-on-surface">Demo notice:</strong> ratings, review
          counts, AppleCare+ pricing and promotional copy on this page are sample content created
          for a front-end prototype and are not a live retail offering.
        </p>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Tab panels                                                          */
/* ------------------------------------------------------------------ */

function HighlightsPanel({ product }: { product: Product }) {
  const stats = product.specs.slice(0, 3);

  return (
    <div className="grid grid-cols-1 gap-space-md md:grid-cols-12">
      <div className="relative flex min-h-[320px] flex-col justify-between overflow-hidden rounded-2xl bg-surface-container-low p-space-lg shadow-sm md:col-span-8">
        <div className="relative z-10 max-w-md">
          <span className="mb-3 inline-block rounded-full bg-surface-container-lowest px-3 py-1 font-label-sm text-label-sm font-bold text-primary">
            {product.chip ?? 'Pro Display Architecture'}
          </span>
          <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
            {product.tagline}
          </h3>
          <p className="mt-2 font-body-lg text-body-lg text-on-surface-variant">
            {product.description}
          </p>
        </div>
        <div className="relative z-10 mt-space-md grid grid-cols-3 gap-2">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl bg-surface-container-lowest/80 p-3 backdrop-blur-md">
              <span className="block font-headline-sm text-headline-sm font-bold text-on-surface">
                {stat.value}
              </span>
              <span className="mt-0.5 block font-label-sm text-label-sm text-on-surface-variant">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
        <div className="pointer-events-none absolute -bottom-16 -right-8 h-80 w-80 opacity-20">
          <svg viewBox="0 0 200 200" fill="currentColor" className="h-full w-full text-primary">
            <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeDasharray="20 10" strokeWidth="8" />
            <rect height="140" rx="16" width="100" x="50" y="30" fill="none" stroke="currentColor" strokeWidth="6" />
          </svg>
        </div>
      </div>

      <div className="flex min-h-[320px] flex-col justify-between rounded-2xl bg-surface-container-low p-space-lg shadow-sm md:col-span-4">
        <div>
          <span className="mb-3 inline-block rounded-full bg-surface-container-lowest px-3 py-1 font-label-sm text-label-sm font-bold text-primary">
            Configuration
          </span>
          <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
            {product.colors.length} finishes · {product.storages.length} capacities
          </h3>
          <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
            Every {product.name} ships in a sealed retail box with a verifiable serial number and a
            full set of manufacturer documentation.
          </p>
        </div>
        <div className="mt-space-md flex items-center justify-between rounded-xl bg-surface-container-lowest p-space-sm">
          <div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Starting at</span>
            <p className="font-title-md text-title-md font-bold text-on-surface">
              {formatINR(product.storages[0].price)}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-fixed font-bold text-primary">
            {product.colors.length}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-2xl bg-surface-container-low p-space-lg shadow-sm md:col-span-6">
        <div>
          <span className="mb-3 inline-block rounded-full bg-surface-container-lowest px-3 py-1 font-label-sm text-label-sm font-bold text-primary">
            Build &amp; Performance
          </span>
          <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
            Silicon built for real work
          </h3>
          <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
            {product.specs
              .filter((spec) => /chip|cpu|gpu|neural|memory|silicon/i.test(spec.label))
              .map((spec) => `${spec.label}: ${spec.value}`)
              .join(' · ') || product.description}
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-2xl bg-surface-container-low p-space-lg shadow-sm md:col-span-6">
        <div>
          <span className="mb-3 inline-block rounded-full bg-surface-container-lowest px-3 py-1 font-label-sm text-label-sm font-bold text-primary">
            In the box
          </span>
          <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
            Ready out of the box
          </h3>
          <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
            {product.name}, USB-C to USB-C braided cable, documentation and SIM tool. Power adapter
            sold separately for most configurations.
          </p>
        </div>
      </div>
    </div>
  );
}

function SpecsPanel({ product }: { product: Product }) {
  return (
    <div className="plate overflow-hidden rounded-2xl">
      <div className="border-b border-line bg-surface-container-low px-space-lg py-space-md">
        <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
          Technical specifications
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Hardware and platform details for the {product.name}.
        </p>
      </div>
      <dl className="divide-y divide-line">
        {product.specs.map((spec) => (
          <div key={spec.label} className="grid grid-cols-1 gap-1 px-space-lg py-space-sm sm:grid-cols-3">
            <dt className="font-label-md text-label-md font-medium text-on-surface-variant">
              {spec.label}
            </dt>
            <dd className="font-body-md text-body-md text-on-surface sm:col-span-2">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function BoxPanel({ product }: { product: Product }) {
  const items = [
    `${product.name} (${product.colors[0].name})`,
    'USB-C to USB-C braided cable (1 m)',
    'Documentation and quick start guide',
    'SIM ejector tool',
  ];

  return (
    <div className="grid grid-cols-1 gap-space-md md:grid-cols-2">
      <div className="plate rounded-2xl p-space-lg">
        <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
          In the box
        </h3>
        <ul className="mt-space-md flex flex-col gap-space-sm">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2 font-body-md text-body-md text-on-surface">
              <Check size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="plate rounded-2xl p-space-lg">
        <h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
          Shipping &amp; returns
        </h3>
        <ul className="mt-space-md flex flex-col gap-space-sm">
          {[
            'Insured, temperature-monitored transit across 100+ Indian cities.',
            'Free express delivery on orders above ₹50,000.',
            '14-day return window from the day of delivery.',
            'Manufacturer warranty honoured with the original invoice.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 font-body-md text-body-md text-on-surface">
              <Check size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ReviewsPanel({ product }: { product: Product }) {
  const samples = [
    {
      name: 'Sample review 1',
      rating: 5,
      title: 'Exactly as described',
      body: 'Configuration matched the listing, packaging was sealed and the delivery window was met.',
    },
    {
      name: 'Sample review 2',
      rating: 4,
      title: 'Great device, quick dispatch',
      body: 'Setup took a couple of minutes and the finish looks even better in person.',
    },
    {
      name: 'Sample review 3',
      rating: 5,
      title: 'Worth the upgrade',
      body: 'Battery life and the camera on low light are the two things I notice every day.',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-space-md lg:grid-cols-3">
      <div className="plate rounded-2xl p-space-lg lg:col-span-1">
        <p className="font-price-hero text-price-hero font-bold text-on-surface">
          {product.rating.toFixed(1)}
        </p>
        <Rating value={product.rating} size={18} className="mt-1" />
        <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
          {product.reviewCount} reviews
        </p>
        <div className="mt-space-md flex flex-col gap-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const share = stars === 5 ? 68 : stars === 4 ? 22 : stars === 3 ? 6 : stars === 2 ? 3 : 1;
            return (
              <div key={stars} className="flex items-center gap-2">
                <span className="w-8 font-label-sm text-label-sm text-outline">{stars}★</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-container">
                  <span
                    className="block h-full rounded-full bg-primary"
                    style={{ width: `${share}%` }}
                  />
                </span>
                <span className="w-8 text-right font-label-sm text-label-sm text-outline">{share}%</span>
              </div>
            );
          })}
        </div>
        <p className="mt-space-md font-label-sm text-label-sm leading-relaxed text-outline">
          Ratings and reviews shown here are demonstration content for a front-end prototype.
        </p>
      </div>

      <div className="flex flex-col gap-space-md lg:col-span-2">
        {samples.map((sample) => (
          <article key={sample.name} className="plate rounded-2xl p-space-lg">
            <div className="flex items-center justify-between gap-3">
              <span className="font-title-md text-title-md font-semibold text-on-surface">
                {sample.name}
              </span>
              <Rating value={sample.rating} size={14} />
            </div>
            <h4 className="mt-1 font-body-md text-body-md font-semibold text-on-surface">
              {sample.title}
            </h4>
            <p className="mt-1 font-body-md text-body-md text-on-surface-variant">{sample.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

/* Small local catalogue used for the "frequently bought together" bundle. */
const bundleCatalogue: Product[] = [
  '20w-usb-c-adapter',
  'iphone-16-pro-clear-case',
  'magsafe-charger',
]
  .map((id) => getProductById(id))
  .filter((item): item is Product => Boolean(item));
