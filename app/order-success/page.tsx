'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  BadgeCheck,
  CalendarClock,
  Check,
  ChevronRight,
  Copy,
  CreditCard,
  Headphones,
  MapPin,
  Package,
  Receipt,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { useStore } from '@/context/StoreContext';
import { formatINR } from '@/lib/format';
import type { OrderSummary } from '@/types';

const PAYMENT_LABELS: Record<string, { title: string; caption: string }> = {
  upi: { title: 'Instant UPI', caption: 'Paid via UPI request' },
  card: { title: 'Credit / Debit Card', caption: 'Paid via card' },
  netbanking: { title: 'Net Banking', caption: 'Paid via net banking' },
  emi: { title: 'Cardless EMI', caption: 'Paid via No Cost EMI' },
};

const TIMELINE = [
  { icon: Check, title: 'Order placed', body: 'We have received your order.' },
  { icon: CreditCard, title: 'Payment confirmed', body: 'Payment authorised successfully.' },
  { icon: Package, title: 'Packing', body: 'Your order is being packed for dispatch.' },
  { icon: Truck, title: 'Shipped', body: 'Insured courier pickup scheduled.' },
  { icon: MapPin, title: 'Delivered', body: 'Delivery to your address.' },
];

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function OrderSuccessPage() {
  const { getSavedOrder, hydrated, showToast } = useStore();
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [copied, setCopied] = useState(false);

  // The order snapshot lives in localStorage (written by the checkout screen),
  // so it is only readable on the client.
  useEffect(() => {
    setOrder(getSavedOrder());
  }, [getSavedOrder]);

  async function copyOrderId() {
    if (!order) return;
    try {
      await navigator.clipboard.writeText(order.orderId);
      setCopied(true);
      showToast('Order ID copied');
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Could not copy the order ID', undefined, 'info');
    }
  }

  if (!hydrated) {
    return (
      <div className="shell py-space-xl">
        <div className="mx-auto h-96 max-w-3xl animate-pulse rounded-2xl bg-surface-container" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="shell py-space-xl">
        <div className="mx-auto max-w-lg rounded-2xl border border-line bg-surface-container-lowest px-space-lg py-space-xl text-center shadow-plate">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-surface-container text-primary">
            <Receipt size={26} aria-hidden="true" />
          </div>
          <h1 className="mt-space-md font-headline-md text-headline-md text-on-surface">
            No recent order found
          </h1>
          <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
            Once you complete a checkout, the confirmation for your order will appear here.
          </p>
          <ButtonLink href="/products" size="lg" className="mt-space-lg">
            <ShoppingBag size={18} aria-hidden="true" />
            Browse the catalogue
          </ButtonLink>
        </div>
      </div>
    );
  }

  const payment = PAYMENT_LABELS[order.paymentMethod] ?? PAYMENT_LABELS.upi;
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="relative w-full pb-space-xl">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-secondary-container/25 blur-3xl" />
      </div>

      <div className="shell relative">
        {/* Confirmation banner */}
        <section className="mt-space-lg overflow-hidden rounded-2xl border border-line bg-surface-container-lowest shadow-plate">
          <div className="flex flex-col items-center gap-space-md bg-gradient-to-b from-surface-container-low to-surface-container-lowest px-space-lg py-space-xl text-center">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary text-on-primary shadow-lift">
              <Check size={32} strokeWidth={3} aria-hidden="true" />
              <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" aria-hidden="true" />
            </div>

            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">
                Order confirmed
              </span>
              <h1 className="mt-1 font-headline-lg text-headline-lg-mobile md:text-headline-lg tracking-tight text-on-surface">
                Thank you, {order.customer.fullName.split(' ')[0]}!
              </h1>
              <p className="mx-auto mt-2 max-w-xl font-body-md text-body-md text-on-surface-variant">
                Your order has been placed successfully. A confirmation summary has been saved in this
                browser for your reference.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-space-sm">
              <div className="flex items-center gap-2 rounded-full border border-line bg-surface-container-lowest px-4 py-2">
                <Receipt size={16} aria-hidden="true" className="text-primary" />
                <span className="font-label-sm text-label-sm text-on-surface-variant">Order ID</span>
                <span className="font-label-md text-label-md font-bold text-on-surface">
                  {order.orderId}
                </span>
                <button
                  type="button"
                  onClick={copyOrderId}
                  aria-label="Copy order ID"
                  className="rounded-full p-1 text-outline transition-colors hover:bg-surface-container hover:text-primary"
                >
                  {copied ? (
                    <BadgeCheck size={16} aria-hidden="true" className="text-primary" />
                  ) : (
                    <Copy size={16} aria-hidden="true" />
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-line bg-surface-container-lowest px-4 py-2">
                <CalendarClock size={16} aria-hidden="true" className="text-primary" />
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Placed on {formatDate(order.placedAt)}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-space-lg grid grid-cols-1 items-start gap-space-lg lg:grid-cols-12">
          {/* LEFT: items + timeline */}
          <div className="flex flex-col gap-space-lg lg:col-span-7">
            <section className="rounded-2xl border border-line bg-surface-container-lowest p-space-lg shadow-plate">
              <div className="mb-space-md flex items-center justify-between gap-3">
                <h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                  Items in this order
                </h2>
                <span className="rounded-full bg-surface-container px-2.5 py-0.5 font-label-md text-label-md font-semibold text-on-surface-variant">
                  {itemCount} item{itemCount === 1 ? '' : 's'}
                </span>
              </div>

              <ul className="flex flex-col divide-y divide-line">
                {order.items.map((item) => (
                  <li key={item.key} className="flex items-center gap-space-sm py-space-sm first:pt-0">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-container-low">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-contain p-1.5"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/products/${item.productId}`}
                        className="font-label-md text-label-md font-semibold text-on-surface hover:text-primary"
                      >
                        {item.name}
                      </Link>
                      <p className="truncate font-label-sm text-label-sm text-outline">
                        {item.color} • {item.storage} • Qty {item.quantity}
                        {item.appleCare ? ' • AppleCare+' : ''}
                      </p>
                    </div>
                    <span className="font-label-md text-label-md font-semibold text-on-surface">
                      {formatINR(item.unitPrice * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-space-md flex flex-col gap-space-sm border-t border-line pt-space-md">
                <div className="flex items-center justify-between font-body-md text-body-md text-on-surface-variant">
                  <span>Subtotal</span>
                  <span className="font-semibold text-on-surface">{formatINR(order.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between font-body-md text-body-md text-on-surface-variant">
                  <span>Discount</span>
                  <span className="font-semibold text-primary">
                    {order.discount > 0 ? `- ${formatINR(order.discount)}` : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between font-body-md text-body-md text-on-surface-variant">
                  <span>Shipping</span>
                  <span className="font-semibold text-primary">
                    {order.shipping === 0 ? 'FREE' : formatINR(order.shipping)}
                  </span>
                </div>
                <div className="flex items-center justify-between font-body-md text-body-md text-on-surface-variant">
                  <span>GST (included)</span>
                  <span className="font-semibold text-on-surface">{formatINR(order.tax)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-line pt-space-sm">
                  <span className="font-title-md text-title-md font-bold text-on-surface">Total paid</span>
                  <span className="font-price-hero text-price-hero font-bold text-on-surface">
                    {formatINR(order.total)}
                  </span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-line bg-surface-container-lowest p-space-lg shadow-plate">
              <h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                Order journey
              </h2>
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                A simulated tracking timeline for this prototype order.
              </p>

              <ol className="mt-space-md flex flex-col">
                {TIMELINE.map((step, index) => {
                  const Icon = step.icon;
                  const done = index <= 1;
                  const last = index === TIMELINE.length - 1;
                  return (
                    <li key={step.title} className="flex gap-space-sm">
                      <div className="flex flex-col items-center">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            done ? 'bg-primary text-on-primary' : 'bg-surface-container text-outline'
                          }`}
                        >
                          <Icon size={16} aria-hidden="true" />
                        </span>
                        {!last && (
                          <span
                            className={`w-0.5 flex-1 ${done ? 'bg-primary/30' : 'bg-line'}`}
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <div className={`pb-space-md ${last ? 'pb-0' : ''}`}>
                        <p
                          className={`font-label-md text-label-md font-semibold ${
                            done ? 'text-on-surface' : 'text-outline'
                          }`}
                        >
                          {step.title}
                        </p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">{step.body}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>
          </div>

          {/* RIGHT: delivery + payment + CTA */}
          <aside className="flex flex-col gap-space-lg lg:col-span-5">
            <section className="rounded-2xl border border-line bg-surface-container-lowest p-space-lg shadow-plate">
              <div className="mb-space-sm flex items-center gap-space-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-fixed text-primary">
                  <MapPin size={18} aria-hidden="true" />
                </div>
                <h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                  Delivery address
                </h2>
              </div>
              <address className="not-italic font-body-md text-body-md text-on-surface-variant">
                <span className="block font-label-md text-label-md font-semibold text-on-surface">
                  {order.customer.fullName}
                </span>
                {order.customer.address}
                <br />
                {order.customer.city}
                {order.customer.city ? ', ' : ''}
                {order.customer.state} {order.customer.pincode}
                <br />
                {order.customer.phone} • {order.customer.email}
              </address>
              {order.customer.notes ? (
                <p className="mt-space-sm rounded-lg bg-surface-container-low px-3 py-2 font-label-sm text-label-sm text-on-surface-variant">
                  <span className="font-semibold text-on-surface">Note:</span>{' '}
                  {order.customer.notes}
                </p>
              ) : null}
            </section>

            <section className="rounded-2xl border border-line bg-surface-container-lowest p-space-lg shadow-plate">
              <div className="mb-space-sm flex items-center gap-space-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-fixed text-primary">
                  <CreditCard size={18} aria-hidden="true" />
                </div>
                <h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                  Payment
                </h2>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-surface-container-low px-space-sm py-space-sm">
                <div>
                  <p className="font-label-md text-label-md font-semibold text-on-surface">
                    {payment.title}
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    {payment.caption}
                  </p>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-primary-fixed px-2.5 py-1 font-label-sm text-label-sm font-semibold text-primary">
                  <Check size={13} aria-hidden="true" />
                  Paid
                </span>
              </div>
              <p className="mt-space-sm font-label-sm text-label-sm text-outline">
                This is a simulated payment. No real transaction was processed and no money was
                charged.
              </p>
            </section>

            <section className="rounded-2xl border border-line bg-surface-container-lowest p-space-lg shadow-plate">
              <h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface">
                What happens next
              </h2>
              <ul className="mt-space-sm flex flex-col gap-space-sm">
                {[
                  { icon: Package, text: 'Your order is packed within 24 hours.' },
                  { icon: Truck, text: 'Insured dispatch with tracking details.' },
                  { icon: Headphones, text: 'Demo support available 9am – 9pm IST.' },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-2">
                    <Icon size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-primary" />
                    <span className="font-body-md text-body-md text-on-surface-variant">{text}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-space-lg flex flex-col gap-space-sm">
                <ButtonLink href="/products" size="lg" className="w-full">
                  Continue shopping
                  <ChevronRight size={18} aria-hidden="true" />
                </ButtonLink>
                <ButtonLink href="/products" variant="secondary" size="md" className="w-full">
                  <ShoppingBag size={16} aria-hidden="true" />
                  Browse all products
                </ButtonLink>
                <Link
                  href="/"
                  className="mt-1 text-center font-label-sm text-label-sm text-outline transition-colors hover:text-primary"
                >
                  Back to home
                </Link>
              </div>
            </section>

            <div className="grid grid-cols-2 gap-space-xs">
              {[
                { icon: ShieldCheck, label: 'Genuine guarantee' },
                { icon: BadgeCheck, label: '14-day returns' },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-lg bg-surface-container-low px-3 py-2"
                >
                  <Icon size={16} aria-hidden="true" className="shrink-0 text-primary" />
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{label}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
