'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowLeft, MessageCircle, ShieldCheck } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { useStore } from '@/context/StoreContext';
import { WHATSAPP_ORDER_NUMBER } from '@/data/site';
import { formatINR } from '@/lib/format';
import { computeTotals } from '@/lib/pricing';

export default function CheckoutPage() {
  const { cart, hydrated } = useStore();

  const totals = useMemo(() => computeTotals(cart), [cart]);

  const whatsappUrl = useMemo(() => {
    if (cart.length === 0) return '';

    const lines = [
      'Hello AURORA! I would like to place an order:',
      '',
      ...cart.map(
        (item, index) =>
          `${index + 1}. ${item.name} (${item.color}, ${item.storage}) × ${item.quantity} — ${formatINR(item.unitPrice * item.quantity)}`,
      ),
      '',
      `Order total: ${formatINR(totals.total)} (${
        totals.shipping === 0
          ? 'includes free insured express delivery'
          : `includes ${formatINR(totals.shipping)} delivery`
      })`,
      '',
      'Please confirm availability, payment and delivery details. Thank you!',
    ];

    return `https://wa.me/${WHATSAPP_ORDER_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
  }, [cart, totals]);

  /* Avoid a hydration mismatch while the persisted bag is being read. */
  if (!hydrated) {
    return (
      <div className="shell flex min-h-[50vh] items-center justify-center">
        <p className="font-body-lg text-body-lg text-on-surface-variant">Loading your bag…</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="shell flex min-h-[60vh] flex-col items-center justify-center gap-space-md text-center">
        <h1 className="font-headline-lg text-headline-lg text-on-surface">Your bag is empty</h1>
        <ButtonLink href="/products">Continue Shopping</ButtonLink>
      </div>
    );
  }

  return (
    <div className="shell py-space-xl">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-space-md rounded-2xl bg-surface-container-lowest p-space-md shadow-sm sm:p-space-lg">
        {/* Header */}
        <div>
          <h1 className="font-headline-md text-headline-md tracking-tight text-on-surface">
            Place Your Order
          </h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            Your bag summary will be sent to our specialist on WhatsApp.
          </p>
        </div>

        {/* Compact item list */}
        <ul className="divide-y divide-line">
          {cart.map((item) => (
            <li key={item.key} className="flex items-center gap-3 py-2">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container-low p-1">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-label-md text-label-md font-semibold text-on-surface">
                  {item.name}
                  <span className="font-normal text-on-surface-variant"> × {item.quantity}</span>
                </p>
                <p className="truncate font-label-sm text-[11px] text-on-surface-variant">
                  {item.color} • {item.storage}
                </p>
              </div>
              <span className="font-label-md text-label-md font-bold text-on-surface">
                {formatINR(item.unitPrice * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        {/* Total */}
        <div className="flex items-baseline justify-between border-t border-line pt-space-sm">
          <span className="font-label-md text-label-md text-on-surface-variant">
            Total{' '}
            <span className="font-normal text-outline">(incl. delivery &amp; taxes)</span>
          </span>
          <span className="font-headline-sm text-headline-sm font-bold text-primary">
            {formatINR(totals.total)}
          </span>
        </div>

        {/* Single-line actions */}
        <div className="flex items-center gap-space-sm">
          <ButtonLink
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="md"
            className="flex-1"
          >
            <MessageCircle size={18} aria-hidden="true" />
            Send Order on WhatsApp
          </ButtonLink>
          <Link
            href="/cart"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line px-4 py-3 font-label-md text-label-md font-semibold text-on-surface transition-colors hover:bg-surface-container-low"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to bag
          </Link>
        </div>

        <p className="flex items-center justify-center gap-1.5 font-label-sm text-[11px] text-outline">
          <ShieldCheck size={14} aria-hidden="true" className="text-primary" />
          Specialist confirms stock &amp; price before any payment
        </p>
      </div>
    </div>
  );
}
