export type Category = 'iphone' | 'mac' | 'ipad' | 'watch' | 'airpods' | 'accessories';

export type BadgeTone = 'primary' | 'fixed' | 'secondary' | 'inverse' | 'surface';

export interface ProductColor {
  name: string;
  /** Short label used on the compact swatch chips. */
  short: string;
  hex: string;
}

export interface ProductStorage {
  label: string;
  /** Price in INR for this configuration. */
  price: number;
  note?: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  /** Display name of the category, e.g. "Mac & MacBook". */
  categoryLabel: string;
  tagline: string;
  description: string;
  /** Base price in INR (inclusive of GST, as shown in the design). */
  price: number;
  /** Monthly no-cost EMI figure in INR. */
  emiMonthly: number;
  /** Main catalogue image. */
  image: string;
  /** Full gallery, first entry is the hero image. */
  images: string[];
  colors: ProductColor[];
  storages: ProductStorage[];
  specs: ProductSpec[];
  /** Chip shown above the price in listing cards. */
  chip?: string;
  badge?: string;
  badgeTone?: BadgeTone;
  isFeatured: boolean;
  isNew: boolean;
  isBestseller: boolean;
  /** Aggregated rating shown in the design (demonstration data). */
  rating: number;
  reviewCount: number;
  inStock: boolean;
  expressDelivery: boolean;
  /** Extra search terms. */
  keywords: string[];
}

export interface CartItem {
  /** `${productId}::${color}::${storage}` — unique per configuration. */
  key: string;
  productId: string;
  name: string;
  image: string;
  categoryLabel: string;
  color: string;
  colorHex: string;
  storage: string;
  unitPrice: number;
  quantity: number;
  chip?: string;
  /** True when the optional AppleCare+ protection plan is bundled in. */
  appleCare?: boolean;
}

export interface WishlistItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  categoryLabel: string;
}

export interface CheckoutForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
  paymentMethod: PaymentMethodId;
}

export type PaymentMethodId = 'upi' | 'card' | 'netbanking' | 'emi';

export interface PaymentMethod {
  id: PaymentMethodId;
  title: string;
  caption: string;
}

export interface OrderSummary {
  orderId: string;
  placedAt: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  customer: CheckoutForm;
  paymentMethod: PaymentMethodId;
}
