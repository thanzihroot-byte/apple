import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck, Globe, Lock, MessageCircle, Phone, Mail, MapPin, Share2 } from 'lucide-react';
import { DEMO_NOTICE, FOOTER_COLUMNS } from '@/data/site';

const socialLinks = [
  { label: 'Share', Icon: Share2 },
  { label: 'Website', Icon: Globe },
  { label: 'Chat', Icon: MessageCircle },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-outline-variant/30 bg-surface-container-low pt-space-xl pb-space-lg text-on-surface">
      <div className="shell">
        <div className="grid grid-cols-1 gap-space-lg border-b border-outline-variant/30 pb-space-xl md:grid-cols-2 lg:grid-cols-6">
          <div className="flex flex-col gap-space-md lg:col-span-2">
            <div className="flex items-center gap-space-sm">
              <Image
                src="/images/aurora-logo.png"
                alt="AURORA logo"
                width={28}
                height={28}
                className="h-7 w-7 rounded-md object-cover"
              />
              <span className="font-headline-sm text-headline-sm tracking-tight text-on-surface">AURORA</span>
            </div>
            <p className="max-w-sm font-body-md text-body-md leading-relaxed text-on-surface-variant">
              AURORA — a premier destination for Apple innovation in India. A curated range of
              world-class technology, enterprise solutions, and dedicated customer care.
            </p>
            <div className="flex items-center gap-space-sm pt-space-xs">
              {socialLinks.map(({ label, Icon }) => (
                <span
                  key={label}
                  title={label}
                  aria-label={label}
                  className="cursor-pointer rounded-full bg-surface-container-lowest p-2 text-on-surface-variant transition-colors hover:text-primary"
                >
                  <Icon size={20} aria-hidden="true" />
                </span>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="font-title-md text-title-md text-on-surface mb-space-md">{column.title}</h3>
              <ul className="flex flex-col gap-space-sm font-body-md text-body-md text-on-surface-variant">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="transition-colors hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-title-md text-title-md text-on-surface mb-space-md">Connect</h3>
            <ul className="flex flex-col gap-space-sm font-body-md text-body-md text-on-surface-variant">
              <li className="flex items-center gap-space-xs">
                <Phone size={18} aria-hidden="true" className="text-primary" />
                <span>1800-AURORA-AP</span>
              </li>
              <li className="flex items-center gap-space-xs">
                <Mail size={18} aria-hidden="true" className="text-primary" />
                <span>support@aurora-store.in</span>
              </li>
              <li className="flex items-center gap-space-xs">
                <MapPin size={18} aria-hidden="true" className="text-primary" />
                <span>Mumbai • Bengaluru • Delhi</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-space-md pt-space-lg md:flex-row">
          <div className="flex flex-wrap items-center justify-center gap-space-sm font-label-sm text-label-sm text-on-surface-variant">
            <span className="flex items-center gap-1.5 rounded-full border border-outline-variant/30 bg-surface-container-lowest px-3 py-1.5">
              <BadgeCheck size={16} aria-hidden="true" className="text-primary" />
              <span>100% Genuine Product Guarantee</span>
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-outline-variant/30 bg-surface-container-lowest px-3 py-1.5">
              <Lock size={16} aria-hidden="true" className="text-primary" />
              <span>Secure UPI &amp; 256-Bit SSL Checkout</span>
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-outline-variant/30 bg-surface-container-lowest px-3 py-1.5">
              <Globe size={16} aria-hidden="true" className="text-primary" />
              <span>100+ Cities Served</span>
            </span>
          </div>
          <p className="text-center font-label-sm text-label-sm text-outline md:text-right">
            © 2025 AURORA Premium Retail Ltd. All rights reserved. Apple, iPhone, Mac, iPad and
            AirPods are trademarks of Apple Inc.
          </p>
        </div>

        <p className="mt-space-md rounded-xl border border-line bg-surface-container-lowest px-4 py-3 font-label-sm text-label-sm leading-relaxed text-on-surface-variant">
          <strong className="font-semibold text-on-surface">Demo notice:</strong> {DEMO_NOTICE}
        </p>
      </div>
    </footer>
  );
}
