import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetailView } from '@/components/product/ProductDetailView';
import { productsData } from '@/data/products';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  return productsData.map((p) => ({
    id: p.id.toString(),
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const id = parseInt(params.id, 10);
  const product = productsData.find((p) => p.id === id);

  if (!product) {
    return {
      title: 'Product Not Found | Digital Theme Store',
    };
  }

  return {
    title: `Buy ${product.name} | Digital Theme Store`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Digital Theme Store`,
      description: product.description,
      images: [
        {
          url: product.image,
          alt: product.name,
        },
      ],
    },
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const id = parseInt(params.id, 10);
  const product = productsData.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return <ProductDetailView initialProductId={id} />;
}
