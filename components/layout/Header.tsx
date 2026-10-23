'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useUrlSearch } from './useUrlSearch';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useUrlSearch();
  const { cartCount, wishlist } = useStore();

  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const searchParams = useMemo(() => new URLSearchParams(search), [search]);

  // Keep the header search box in sync with the ?q= parameter of the catalogue.
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setQuery(q);
  }, [searchParams]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/products?q=${encodeURIComponent(trimmed)}` : '/products');
    setMenuOpen(false);
  }

  function isActive(href: string) {
    if (href === '/products') return pathname === '/products' && !searchParams.get('category');
    const [, queryString] = href.split('?');
    if (!queryString) return false;
    const category = new URLSearchParams(queryString).get('category');
    return pathname === '/products' && searchParams.get('category') === category;
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b border-line bg-surface-container-lowest/95 backdrop-blur-md transition-shadow ${
        scrolled ? 'shadow-plate' : ''
      }`}
    >
      {/* Main bar */}
      <div className="shell">
        <div className="flex h-16 items-center gap-3">
          <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="AURORA home">
            <Image
              src="/images/aurora-logo.png"
              alt="AURORA"
              width={28}
              height={28}
              className="h-7 w-7 rounded-md object-cover"
              priority
            />
            <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface">AURORA</span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            <Link
              href="/products"
              aria-current={isActive('/products') ? 'page' : undefined}
              className={`rounded-full px-3 py-2 font-label-md text-label-md transition-colors ${
                isActive('/products')
                  ? 'bg-surface-container text-primary font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              Store
            </Link>
          </nav>

          <div className="flex-1" />

          {/* Desktop search */}
          <form onSubmit={submitSearch} role="search" className="hidden md:block">
            <div className="relative">
              <Search
                size={16}
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline"
              />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search products"
                aria-label="Search products"
                className="h-10 w-44 rounded-full border border-line bg-surface-container-lowest pl-9 pr-9 font-body-md text-body-md text-on-surface placeholder:text-outline transition-all focus:w-64 focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15 lg:w-52"
              />
              {query && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => {
                    setQuery('');
                    if (pathname === '/products') router.push('/products');
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-outline transition-colors hover:bg-surface-container hover:text-on-surface"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              )}
            </div>
          </form>

          <Link
            href="/wishlist"
            aria-label={`Wishlist with ${wishlist.length} items`}
            className="relative hidden h-10 w-10 items-center justify-center rounded-full border border-line bg-surface-container-lowest text-on-surface transition-colors hover:bg-primary hover:text-on-primary hover:border-primary sm:flex"
          >
            <Heart size={18} aria-hidden="true" />
            {wishlist.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 font-label-sm text-[10px] font-bold text-on-primary">
                {wishlist.length}
              </span>
            )}
          </Link>

          <Link
            href="/cart"
            aria-label={`Shopping bag with ${cartCount} items`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface-container-lowest text-on-surface transition-colors hover:bg-primary hover:text-on-primary hover:border-primary"
          >
            <ShoppingBag size={18} aria-hidden="true" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 font-label-sm text-[10px] font-bold text-on-primary">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface-container-lowest text-on-surface transition-colors hover:bg-surface-container lg:hidden"
          >
            {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-surface-container-lowest lg:hidden">
          <div className="shell py-space-lg">
            <form onSubmit={submitSearch} role="search" className="mb-space-lg">
              <div className="relative">
                <Search
                  size={16}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search products"
                  aria-label="Search products"
                  className="h-12 w-full rounded-full border border-line bg-surface-container-lowest pl-9 pr-9 font-body-md text-body-md text-on-surface placeholder:text-outline focus:border-primary focus:outline-none focus:ring-[3px] focus:ring-primary/15"
                />
                {query && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-outline hover:bg-surface-container"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                )}
              </div>
            </form>

            <nav aria-label="Mobile primary" className="flex flex-col">
              <Link
                href="/products"
                className="border-b border-line py-3 font-title-md text-title-md text-on-surface transition-colors hover:text-primary"
              >
                Store
              </Link>
              <Link
                href="/wishlist"
                className="border-b border-line py-3 font-title-md text-title-md text-on-surface transition-colors hover:text-primary"
              >
                Wishlist {wishlist.length > 0 ? `(${wishlist.length})` : ''}
              </Link>
              <Link
                href="/cart"
                className="border-b border-line py-3 font-title-md text-title-md text-on-surface transition-colors hover:text-primary"
              >
                Shopping Bag ({cartCount})
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
