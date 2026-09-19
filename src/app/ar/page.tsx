'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { productsData } from '@/data/products';
import { CameraARModal } from '@/components/ar/CameraARModal';

function ARContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const productId = idParam ? parseInt(idParam, 10) : 2;

  const product = productsData.find((p) => p.id === productId) || productsData[0];

  return (
    <CameraARModal
      product={product}
      isOpen={true}
      onClose={() => {
        router.push(`/buy?id=${product.id}`);
      }}
    />
  );
}

export default function ARPage() {
  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-3">
          <div className="w-10 h-10 border-3 border-amber-400/20 border-t-amber-400 rounded-full animate-spin" />
          <p className="text-xs font-bold text-amber-400 tracking-wide uppercase">
            Loading AR Experience...
          </p>
        </div>
      }
    >
      <ARContent />
    </Suspense>
  );
}
