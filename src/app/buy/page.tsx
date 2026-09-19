'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductDetailView } from '@/components/product/ProductDetailView';

function BuyContent() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const variantParam = searchParams.get('variant') || undefined;
  const qtyParam = searchParams.get('qty');

  const productId = idParam ? parseInt(idParam, 10) : 2;
  const quantity = qtyParam ? parseInt(qtyParam, 10) : 1;

  return (
    <ProductDetailView
      initialProductId={productId}
      initialVariant={variantParam}
      initialQty={quantity}
    />
  );
}

export default function BuyPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-7xl mx-auto min-h-[50vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500" />
        </div>
      }
    >
      <BuyContent />
    </Suspense>
  );
}
