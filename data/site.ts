export interface NavLink {
  label: string;
  href: string;
}

export interface CategoryLink extends NavLink {
  key: string;
  description: string;
  from: string;
  image: string;
  featured: string;
}

export const PRIMARY_NAV: NavLink[] = [
  { label: 'Store', href: '/products' },
  { label: 'Mac', href: '/products?category=mac' },
  { label: 'iPad', href: '/products?category=ipad' },
  { label: 'iPhone', href: '/products?category=iphone' },
  { label: 'Watch', href: '/products?category=watch' },
  { label: 'AirPods', href: '/products?category=airpods' },
  { label: 'Accessories', href: '/products?category=accessories' },
];

export const CATEGORIES: CategoryLink[] = [
  {
    key: 'iphone',
    label: 'iPhone',
    href: '/products?category=iphone',
    description: 'Pro camera systems & titanium design. Ceramic Shield durability.',
    from: 'From ₹79,900',
    image: '/images/category-iphone.jpg',
    featured: 'Pro camera systems',
  },
  {
    key: 'mac',
    label: 'MacBook',
    href: '/products?category=mac',
    description: 'Unrivaled M3 & M4 performance. Liquid Retina XDR with up to 22h battery life.',
    from: 'From ₹59,900',
    image: '/images/category-mac.jpg',
    featured: 'M3 & M4 silicon',
  },
  {
    key: 'ipad',
    label: 'iPad',
    href: '/products?category=ipad',
    description: 'Versatile creative powerhouse with Liquid Retina and Apple Pencil Pro support.',
    from: 'From ₹49,900',
    image: '/images/category-ipad.jpg',
    featured: 'Tandem OLED',
  },
  {
    key: 'watch',
    label: 'Apple Watch',
    href: '/products?category=watch',
    description: 'Advanced health sensors, ECG, depth gauge & titanium endurance.',
    from: 'From ₹46,900',
    image: '/images/category-watch.jpg',
    featured: 'Health & fitness',
  },
  {
    key: 'airpods',
    label: 'AirPods',
    href: '/products?category=airpods',
    description: 'Immersive Personalized Spatial Audio & active noise cancellation with USB-C.',
    from: 'From ₹17,900',
    image: '/images/airpods-4-anc.jpg',
    featured: 'Spatial audio',
  },
  {
    key: 'accessories',
    label: 'Accessories',
    href: '/products?category=accessories',
    description: 'MagSafe chargers, MagSafe cases, power adapters & more.',
    from: 'From ₹1,900',
    image: '/images/category-accessories.jpg',
    featured: 'Everyday essentials',
  },
];

export interface TrustCard {
  title: string;
  body: string;
  icon: 'shield' | 'lock' | 'truck' | 'headset';
}

export const TRUST_CARDS: TrustCard[] = [
  {
    title: 'Genuine Product Guarantee',
    body: 'Every device is sourced through the official Indian distribution channel, sealed and fully covered by the manufacturer warranty with a verifiable serial number.',
    icon: 'shield',
  },
  {
    title: 'Secure Payments',
    body: 'Bank-grade 256-bit encrypted checkout. Support for UPI, leading bank debit/credit cards, and Instant No-Cost EMI up to 24 months.',
    icon: 'lock',
  },
  {
    title: 'Express India Delivery',
    body: 'Same-day and next-day insured priority dispatch across Mumbai, Bengaluru, Delhi NCR, and 100+ cities with temperature-monitored transit.',
    icon: 'truck',
  },
  {
    title: 'AppleCare+ Support',
    body: 'Hassle-free 14-day replacement window, seamless AppleCare+ enrollment, and certified technician consultation.',
    icon: 'headset',
  },
];

export const FOOTER_COLUMNS: { title: string; links: NavLink[] }[] = [
  {
    title: 'Explore',
    links: [
      { label: 'iPhone 16 Pro', href: '/products/iphone-16-pro' },
      { label: 'MacBook Pro', href: '/products/macbook-pro-14-m3-pro' },
      { label: 'iPad Pro', href: '/products/ipad-pro-13-m4' },
      { label: 'Apple Watch Series 10', href: '/products/apple-watch-series-10' },
      { label: 'AirPods Pro 2', href: '/products/airpods-pro-2' },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { label: 'Order Status', href: '/order-success' },
      { label: 'Track Delivery', href: '/order-success' },
      { label: 'AppleCare+ Protection', href: '/products/iphone-16-pro' },
      { label: 'Trade-in Program', href: '/products?category=iphone' },
      { label: 'Store Locator', href: '/products' },
    ],
  },
  {
    title: 'Policies',
    links: [
      { label: 'Authenticity Guarantee', href: '/products' },
      { label: 'Shipping Policy', href: '/products' },
      { label: 'Easy 14-Day Returns', href: '/cart' },
      { label: 'Privacy Policy', href: '/products' },
      { label: 'Terms of Sale', href: '/products' },
    ],
  },
];

/**
 * Optional AppleCare+ protection add-on price used by the product configurator.
 * The figure is demonstration content for this front-end prototype.
 */
export const APPLECARE_PRICE = 20900;

/**
 * WhatsApp number (country code + 10-digit Indian mobile) used by the
 * "Place Your Order" flow: the bag summary is sent to this chat on WhatsApp.
 */
export const WHATSAPP_ORDER_NUMBER = '919207041308';

/**
 * Demonstration banner copy. This storefront is a front-end prototype — the
 * commerce copy below is sample content and not a live retail offer.
 */
export const DEMO_NOTICE =
  'Demonstration storefront. Product imagery, prices, ratings, offers and policies shown are illustrative sample content for a front-end prototype and are not a live Apple retail offering.';
