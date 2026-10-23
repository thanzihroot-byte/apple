'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { getNewArrivals } from '@/data/products';
import { formatINR } from '@/lib/format';

/** Homepage "Just Landed" horizontal carousel. */
export function NewArrivalsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const arrivals = getNewArrivals();

  const syncEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setAtStart(track.scrollLeft <= 8);
    setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 8);
  }, []);

  useEffect(() => {
    syncEdges();
    const track = trackRef.current;
    if (!track) return;
    track.addEventListener('scroll', syncEdges, { passive: true });
    window.addEventListener('resize', syncEdges);
    return () => {
      track.removeEventListener('scroll', syncEdges);
      window.removeEventListener('resize', syncEdges);
    };
  }, [syncEdges]);

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * 340, behavior: 'smooth' });
  };

  return (
    <section className="w-full bg-surface-container-low/30 py-space-xl lg:py-24">
      <div className="shell">
        <div className="mb-space-lg flex items-end justify-between gap-space-md">
          <div>
            <span className="font-label-sm text-label-sm font-semibold uppercase tracking-widest text-primary">
              Latest Generation
            </span>
            <h2 className="mt-1 font-headline-lg text-headline-lg-mobile text-on-surface md:text-headline-lg">
              Just Landed
            </h2>
            <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
              Freshly released breakthroughs in Apple engineering.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={atStart}
              aria-label="Previous slide"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-lowest text-on-surface shadow-sm transition-colors hover:bg-surface-container-high disabled:opacity-40"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={atEnd}
              aria-label="Next slide"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-lowest text-on-surface shadow-sm transition-colors hover:bg-surface-container-high disabled:opacity-40"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-space-lg overflow-x-auto pb-space-sm scroll-smooth"
        >
          {arrivals.map((product) => (
            <article
              key={product.id}
              className="group flex w-[300px] shrink-0 snap-start flex-col rounded-2xl bg-surface-container-lowest p-space-sm shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:w-[340px]"
            >
              <div className="relative h-72 w-full overflow-hidden rounded-xl bg-surface-container-low p-4">
                <span className="absolute left-3 top-3 z-10 rounded-full bg-primary px-2.5 py-1 font-label-sm text-[10px] font-bold uppercase tracking-wider text-on-primary shadow-sm">
                  New
                </span>
                <Image
                  src={product.image}
                  alt={product.name}
                  width={680}
                  height={680}
                  className="h-full w-full rounded-lg object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between p-space-sm">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-label-sm text-label-sm font-semibold uppercase text-outline">
                      {product.chip}
                    </span>
                    <span className="font-price-card text-price-card font-bold text-on-surface">
                      {formatINR(product.price)}
                    </span>
                  </div>
                  <h3 className="mt-1 font-title-md text-title-md font-semibold text-on-surface">
                    {product.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 font-body-md text-body-md text-on-surface-variant">
                    {product.description}
                  </p>
                </div>

                <div className="pt-space-md">
                  <Link
                    href={`/products/${product.id}`}
                    className="flex w-full items-center justify-center gap-1.5 rounded-full bg-surface-container-low py-2.5 px-4 font-label-md text-label-md font-semibold text-primary transition-all hover:bg-primary hover:text-on-primary"
                  >
                    <span>Configure &amp; Buy</span>
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
