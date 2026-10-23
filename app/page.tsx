import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  CreditCard,
  Headset,
  Lock,
  ShieldCheck,
  Truck,
  Zap,
} from 'lucide-react';
import { BestsellersSection } from '@/components/home/BestsellersSection';
import { NewArrivalsCarousel } from '@/components/home/NewArrivalsCarousel';
import { NewsletterForm } from '@/components/home/NewsletterForm';
import { CATEGORIES, TRUST_CARDS } from '@/data/site';

const TRUST_ICONS = {
  shield: ShieldCheck,
  lock: Lock,
  truck: Truck,
  headset: Headset,
} as const;

const HERO_BADGES = [
  { icon: BadgeCheck, label: 'Genuine Product Guarantee' },
  { icon: Zap, label: 'Free Express Delivery over ₹50,000' },
  { icon: CreditCard, label: 'No Cost EMI up to 24 Months' },
];

export default function HomePage() {
  return (
    <>
      {/* 1. HERO */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-surface-container-lowest via-surface-container-low/40 to-surface-container-lowest py-space-xl lg:py-24">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[460px] w-[780px] -translate-x-1/2 rounded-full bg-secondary-container/40 blur-[110px]" />
        <div className="pointer-events-none absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-primary-fixed/30 blur-[90px]" />

        <div className="shell flex flex-col items-center text-center">
          <div className="mb-space-md inline-flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-surface-container-high/60 px-3.5 py-1.5 shadow-sm backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" aria-hidden="true" />
              <span className="font-label-sm text-label-sm font-semibold uppercase tracking-widest text-on-surface">
                Premium Portfolio 2025
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/40 bg-surface-container-lowest px-3 py-1.5 font-label-sm text-label-sm font-semibold uppercase tracking-wider text-primary">
              Demo storefront
            </span>
          </div>

          <h1 className="max-w-4xl font-display-hero text-display-hero-mobile text-on-surface tracking-tight leading-tight md:text-display-hero">
            Discover the Apple Experience.
          </h1>

          <p className="mt-space-sm mb-space-lg max-w-2xl font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
            Explore the latest Apple devices. Designed to inspire. Built to perform. Unrivaled
            performance meets timeless industrial craftsmanship.
          </p>

          <div className="mb-space-xl flex flex-wrap items-center justify-center gap-space-sm sm:gap-space-md">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 font-label-md text-label-md font-semibold text-on-primary shadow-sm transition-all hover:scale-[1.01] hover:bg-primary-container active:scale-[0.98]"
            >
              Shop All Products
            </Link>
            <Link
              href="/products?category=iphone"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-surface-container-lowest px-7 py-3.5 font-label-md text-label-md font-semibold text-on-surface shadow-sm transition-all hover:bg-surface-container-low"
            >
              <span>Explore iPhone</span>
              <ArrowRight
                size={18}
                aria-hidden="true"
                className="text-primary transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="relative w-full max-w-5xl rounded-3xl bg-surface-container-low p-3 shadow-xl sm:p-6">
            <div className="relative flex h-[320px] w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-surface-container-lowest to-surface-container-low sm:h-[460px] lg:h-[520px]">
              <Image
                src="/images/hero-panorama.jpg"
                alt="Panoramic studio presentation of Apple flagship devices arranged on an ice-white sculpted pedestal."
                fill
                priority
                sizes="(max-width: 1440px) 100vw, 1200px"
                className="object-cover object-center transition-transform duration-700 hover:scale-[1.02]"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-surface-container-lowest/80 via-transparent to-transparent" />
            </div>

            <div className="grid grid-cols-1 gap-space-sm pt-space-md sm:grid-cols-3">
              {HERO_BADGES.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center justify-center gap-2 rounded-xl bg-surface-container-lowest px-3 py-2 shadow-sm"
                >
                  <Icon size={20} aria-hidden="true" className="shrink-0 text-primary" />
                  <span className="font-label-sm text-label-sm text-on-surface">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY */}
      <section className="w-full bg-surface-container-lowest py-space-xl lg:py-24">
        <div className="shell">
          <div className="mb-space-xl flex flex-col justify-between gap-space-sm md:flex-row md:items-end">
            <div>
              <span className="font-label-sm text-label-sm font-semibold uppercase tracking-widest text-primary">
                Architectural Precision
              </span>
              <h2 className="mt-1 font-headline-lg text-headline-lg-mobile text-on-surface md:text-headline-lg">
                Shop by Category
              </h2>
            </div>
            <p className="max-w-md font-body-md text-body-md text-on-surface-variant">
              Select from meticulously engineered personal computing, audio, and wearable lines
              crafted for uncompromising workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category) => (
              <Link
                key={category.key}
                href={category.href}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex h-56 w-full items-center justify-center overflow-hidden bg-surface-container-low p-4">
                  <Image
                    src={category.image}
                    alt={`${category.label} collection`}
                    width={720}
                    height={540}
                    className="h-full w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between bg-surface-container-lowest p-space-lg">
                  <div>
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <h3 className="font-title-md text-title-md font-semibold text-on-surface">
                        {category.label}
                      </h3>
                      <span className="shrink-0 font-label-sm text-label-sm font-semibold text-primary">
                        {category.from}
                      </span>
                    </div>
                    <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
                      {category.description}
                    </p>
                  </div>
                  <div className="mt-space-md flex items-center gap-1 font-label-md text-label-md font-semibold text-primary transition-all group-hover:gap-2">
                    <span>Explore {category.label}</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BESTSELLERS */}
      <BestsellersSection />

      {/* 4. TRADE-IN EDITORIAL BANNER */}
      <section className="w-full bg-surface-container-lowest py-space-xl lg:py-20">
        <div className="shell">
          <div className="relative w-full overflow-hidden rounded-3xl bg-secondary-container/40 p-8 shadow-sm sm:p-12 lg:p-16">
            <div className="pointer-events-none absolute -right-20 -top-20 h-[420px] w-[420px] rounded-full bg-primary-fixed/40 blur-[90px]" />

            <div className="relative grid grid-cols-1 items-center gap-space-xl lg:grid-cols-12">
              <div className="flex flex-col items-start lg:col-span-7">
                <span className="mb-space-md inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 font-label-sm text-label-sm font-semibold uppercase text-on-primary">
                  AURORA Trade-In Advantage
                </span>
                <h2 className="font-display-hero text-display-hero-mobile font-bold tracking-tight text-on-surface md:text-headline-lg lg:text-display-hero">
                  Power Meets Possibility.
                </h2>
                <p className="mt-space-sm mb-space-lg max-w-xl font-body-lg text-body-lg leading-relaxed text-on-surface-variant">
                  Find the right Apple device for your everyday life — with instant trade-in
                  bonuses on your existing phone or laptop. Doorstep evaluation across all metro
                  locations.
                </p>

                <div className="flex flex-wrap items-center gap-space-sm sm:gap-space-md">
                  <Link
                    href="/products"
                    className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3.5 font-label-md text-label-md font-semibold text-on-primary shadow-sm transition-all hover:scale-[1.01] hover:bg-primary-container active:scale-[0.98]"
                  >
                    Shop Now
                  </Link>
                  <Link
                    href="/products?category=iphone"
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-surface-container-lowest px-7 py-3.5 font-label-md text-label-md font-semibold text-on-surface shadow-sm transition-all hover:bg-surface-container-low"
                  >
                    <span>Calculate Trade-In Value</span>
                    <ArrowRight
                      size={18}
                      aria-hidden="true"
                      className="text-primary transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>

                <div className="mt-space-xl grid grid-cols-2 gap-space-md border-t border-outline-variant/30 pt-space-md sm:grid-cols-3">
                  <div>
                    <p className="font-headline-sm text-headline-sm font-bold text-primary">₹25,000</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      Max trade-in bonus
                    </p>
                  </div>
                  <div>
                    <p className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      15 Mins
                    </p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      Doorstep evaluation
                    </p>
                  </div>
                  <div>
                    <p className="font-headline-sm text-headline-sm font-bold text-on-surface">
                      100% Data
                    </p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">
                      Secure wiping certified
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative flex items-center justify-center lg:col-span-5">
                <div className="relative aspect-square w-full max-w-md rounded-2xl bg-surface-container-lowest/80 p-4 shadow-xl backdrop-blur-md">
                  <Image
                    src="/images/editorial-workstation.jpg"
                    alt="Editorial arrangement of a MacBook Pro and iPad Pro with Apple Pencil Pro on an ice-blue slate."
                    fill
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className="rounded-xl object-cover"
                  />
                  <div className="absolute -bottom-3 -left-3 flex items-center gap-2 rounded-xl bg-surface-container-lowest px-4 py-2.5 shadow-md">
                    <Zap size={20} aria-hidden="true" className="text-primary" />
                    <div>
                      <p className="font-label-sm text-[11px] font-semibold uppercase text-on-surface-variant">
                        Immediate Credit
                      </p>
                      <p className="font-label-md text-label-md font-bold text-on-surface">
                        Adjusted on Checkout
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. JUST LANDED */}
      <NewArrivalsCarousel />

      {/* 6. WHY SHOP WITH US */}
      <section className="w-full bg-surface-container-lowest py-space-xl lg:py-24">
        <div className="shell">
          <div className="mx-auto mb-space-xl max-w-2xl text-center">
            <span className="font-label-sm text-label-sm font-semibold uppercase tracking-widest text-primary">
              The AURORA Guarantee
            </span>
            <h2 className="mt-1 font-headline-lg text-headline-lg-mobile text-on-surface md:text-headline-lg">
              Why Shop With Us
            </h2>
            <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
              Experience seamless premium retail backed by certified Apple expertise and
              comprehensive consumer security.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-space-lg sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_CARDS.map((card) => {
              const Icon = TRUST_ICONS[card.icon];
              return (
                <div
                  key={card.title}
                  className="flex flex-col rounded-2xl bg-surface-container-low p-space-lg shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-space-md flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-container-lowest text-primary shadow-sm">
                    <Icon size={26} aria-hidden="true" />
                  </div>
                  <h3 className="mb-2 font-title-md text-title-md font-semibold text-on-surface">
                    {card.title}
                  </h3>
                  <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
                    {card.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. NEWSLETTER */}
      <NewsletterForm />
    </>
  );
}
