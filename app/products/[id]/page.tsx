import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/product/ProductDetail';
import { getProductById, products } from '@/data/products';

interface PageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return { title: 'Product not found' };
  }

  return {
    title: product.name,
    description: `${product.tagline} — ${product.categoryLabel} priced from ₹${product.price.toLocaleString(
      'en-IN',
    )} inclusive of GST.`,
    openGraph: {
      title: `${product.name} | AURORA`,
      description: product.tagline,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
