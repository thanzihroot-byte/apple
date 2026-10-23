import type { CartItem } from '@/types';

/** Free insured shipping threshold (INR). */
export const FREE_SHIPPING_THRESHOLD = 50000;
/** Flat shipping fee below the threshold (INR). */
export const SHIPPING_FEE = 499;
/** GST rate used to extract the tax component from an MRP-inclusive total. */
export const GST_RATE = 0.18;

export interface Totals {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

/**
 * All catalogue prices are MRP-inclusive (GST already inside the number), so the
 * tax line is derived from the taxable value rather than added on top.
 */
export function computeTotals(items: CartItem[], discount = 0): Totals {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const taxable = Math.max(subtotal - discount, 0);
  const shipping = taxable === 0 || taxable >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const tax = Math.round(taxable - taxable / (1 + GST_RATE));
  const total = taxable + shipping;
  return { subtotal, discount, shipping, tax, total };
}

export interface Coupon {
  code: string;
  label: string;
  /** Discount amount for the given subtotal (never more than the subtotal). */
  compute: (subtotal: number) => number;
}

/**
 * Demo coupon table. The storefront is a front-end prototype, so no real
 * promotion is applied — the codes simply demonstrate the checkout flow.
 */
export const DEMO_COUPONS: Record<string, Coupon> = {
  AURORA10: {
    code: 'AURORA10',
    label: '10% demo discount',
    compute: (subtotal) => Math.round(subtotal * 0.1),
  },
  AURORA5K: {
    code: 'AURORA5K',
    label: '₹5,000 demo discount',
    compute: () => 5000,
  },
};

export function resolveCoupon(code: string): Coupon | null {
  return DEMO_COUPONS[code.trim().toUpperCase()] ?? null;
}
