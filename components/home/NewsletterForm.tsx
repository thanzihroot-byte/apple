'use client';

import { useState, type FormEvent } from 'react';
import { Mail } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

/** Homepage newsletter capture. Front-end only — no data leaves the browser. */
export function NewsletterForm() {
  const { showToast } = useStore();
  const [email, setEmail] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      showToast('Please enter a valid email address', undefined, 'info');
      return;
    }
    setEmail('');
    showToast('You are on the list', 'We will only send launch and offer updates.');
  }

  return (
    <section className="w-full bg-surface-container-low py-space-xl lg:py-20">
      <div className="mx-auto max-w-4xl px-margin-mobile text-center md:px-margin-tablet">
        <div className="mb-space-sm inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-lowest text-primary shadow-sm">
          <Mail size={24} aria-hidden="true" />
        </div>
        <h2 className="font-headline-lg text-headline-lg-mobile font-semibold text-on-surface md:text-headline-lg">
          Stay in the Loop
        </h2>
        <p className="mx-auto mt-2 mb-space-lg max-w-xl font-body-lg text-body-lg text-on-surface-variant">
          Get updates on new Apple arrivals, keynote announcements, and exclusive members-only
          reserve discounts.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-lg flex-col items-center justify-center gap-2 sm:flex-row"
        >
          <div className="relative w-full">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email address"
              className="h-12 w-full rounded-full border-0 bg-surface-container-lowest px-5 font-body-md text-body-md text-on-surface shadow-sm placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="submit"
            className="h-12 w-full shrink-0 rounded-full bg-primary px-8 font-label-md text-label-md font-semibold text-on-primary shadow-sm transition-all hover:scale-[1.01] hover:bg-primary-container active:scale-[0.98] sm:w-auto"
          >
            Subscribe
          </button>
        </form>

        <p className="mt-3 font-label-sm text-[11px] text-outline">
          By subscribing, you agree to AURORA&apos;s Privacy Policy and to receive marketing
          communications. No spam, ever.
        </p>
      </div>
    </section>
  );
}
