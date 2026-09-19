'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, ArrowRight, Camera } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { CameraARModal } from '@/components/ar/CameraARModal';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const [isAROpen, setIsAROpen] = useState(false);

  const handleCardClick = () => {
    router.push(`/buy?id=${product.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{
        duration: 0.4,
        delay: Math.min(index * 0.03, 0.3),
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={handleCardClick}
      className="interactive-card bg-white border border-slate-200/90 hover:border-amber-400/80 rounded-3xl p-3 sm:p-4 text-left space-y-2.5 shadow-sm flex flex-col justify-between group cursor-pointer relative overflow-hidden"
    >
      <div className="space-y-2.5">
        {/* Product Image */}
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/80 p-2 flex items-center justify-center shadow-inner group-hover:border-amber-300 transition-colors">
          {/* Quick 3D AR Placement Trigger */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsAROpen(true);
            }}
            className="absolute top-2 right-2 z-10 bg-purple-950/85 hover:bg-purple-900 border border-amber-400/70 text-amber-300 hover:text-white text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer"
            title="Place in Room (AR Camera)"
          >
            <Camera className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
            <span>3D AR</span>
          </button>

          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-2 rounded-xl drop-shadow-md group-hover:scale-105 transition-transform duration-500 ease-out"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>

        {/* Category & Title */}
        <div>
          <span className="text-[9px] sm:text-[10px] uppercase font-extrabold text-amber-600 tracking-wider block">
            {product.catLabel}
          </span>
          <h4
            className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight line-clamp-2 leading-snug group-hover:text-purple-800 transition-colors"
            title={product.name}
          >
            {product.name}
          </h4>
        </div>

        {/* Ratings */}
        <div className="flex items-center space-x-1 text-amber-500 text-[9px] sm:text-[10px]">
          <div className="flex items-center space-x-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
            ))}
          </div>
          <span className="text-slate-500 font-mono font-bold">({product.reviews})</span>
        </div>
      </div>

      {/* Price & Action Buttons */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-baseline space-x-1.5">
          <span className="text-sm sm:text-base lg:text-lg font-black text-amber-600 font-mono">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-slate-400 line-through font-mono">
            ₹{product.originalPrice.toLocaleString('en-IN')}
          </span>
        </div>

        {/* 2 Buttons: Gold-trimmed CART + Imperial Purple & Gold BUY NOW */}
        <div className="grid grid-cols-2 gap-1.5 pt-0.5 items-stretch">
          {/* Cart Button: White card with gold border and purple text */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="w-full h-8 sm:h-9 bg-white hover:bg-amber-50/60 border border-amber-400 hover:border-amber-500 text-purple-950 font-bold px-1 rounded-xl text-[9px] sm:text-xs uppercase tracking-tight flex items-center justify-center gap-1 shadow-xs transition-colors whitespace-nowrap overflow-hidden cursor-pointer active:scale-95"
          >
            <ShoppingCart className="w-3 h-3 flex-shrink-0 text-amber-600" />
            <span className="truncate">
              <span className="hidden sm:inline">Add To </span>Cart
            </span>
          </button>

          {/* Buy Now Button: Deep Imperial Purple with gold border & gold arrow */}
          <Link
            href={`/buy?id=${product.id}`}
            onClick={(e) => e.stopPropagation()}
            className="w-full h-8 sm:h-9 bg-gradient-to-r from-purple-800 to-purple-900 hover:from-purple-900 hover:to-purple-950 border border-amber-400/70 text-white font-bold px-1 rounded-xl text-[9px] sm:text-xs uppercase tracking-tight flex items-center justify-center gap-1 shadow-sm text-center whitespace-nowrap overflow-hidden active:scale-95 transition-all"
          >
            <span>Buy Now</span>
            <ArrowRight className="w-2.5 h-2.5 flex-shrink-0 text-amber-300" />
          </Link>
        </div>
      </div>

      {/* AR Camera Room Placement Modal */}
      <CameraARModal
        product={product}
        isOpen={isAROpen}
        onClose={() => setIsAROpen(false)}
      />
    </motion.div>
  );
};
