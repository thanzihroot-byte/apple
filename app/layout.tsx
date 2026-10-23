import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toast } from '@/components/ui/Toast';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://aurora-store.example'),
  title: {
    default: 'AURORA — Premium Apple Retail Store in India',
    template: '%s | AURORA',
  },
  description:
    'AURORA is a front-end prototype storefront for Apple hardware in India — iPhone, Mac, iPad, Apple Watch, AirPods and accessories with live configuration, a shopping bag and a mock checkout.',
  keywords: ['AURORA', 'Apple store', 'iPhone', 'MacBook', 'iPad', 'Apple Watch', 'AirPods'],
  openGraph: {
    title: 'AURORA — Premium Apple Retail Store in India',
    description:
      'Curated Apple hardware, honest Indian pricing and a fast, responsive shopping experience.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#004ac6',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-surface-container-lowest">
        <StoreProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-primary focus:px-5 focus:py-2.5 focus:font-label-md focus:text-label-md focus:text-on-primary"
          >
            Skip to content
          </a>
          <Header />
          <main id="main-content" className="min-h-[60vh]">
            {children}
          </main>
          <Footer />
          <Toast />
        </StoreProvider>
      </body>
    </html>
  );
}
