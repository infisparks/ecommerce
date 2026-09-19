'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, ShieldCheck, RotateCcw, Award, HandCoins, ShoppingCart, Zap, MessageCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getWhatsAppDiscussProductUrl } from '@/utils/whatsapp';

export const ProductPreviewModal: React.FC = () => {
  const router = useRouter();
  const { previewProduct, isPreviewOpen, closePreviewModal, addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (previewProduct) {
      setSelectedVariant(previewProduct.variants[0] || 'Standard');
      setQuantity(1);
    }
  }, [previewProduct]);

  const savings = previewProduct ? previewProduct.originalPrice - previewProduct.price : 0;

  const handleAddToCart = () => {
    if (!previewProduct) return;
    addToCart(previewProduct, selectedVariant, quantity);
    closePreviewModal();
  };

  const handleBuyNow = () => {
    if (!previewProduct) return;
    closePreviewModal();
    router.push(`/buy?id=${previewProduct.id}&variant=${encodeURIComponent(selectedVariant)}&qty=${quantity}`);
  };

  const handleWhatsAppDiscuss = () => {
    if (!previewProduct) return;
    const url = getWhatsAppDiscussProductUrl(previewProduct, selectedVariant, quantity);
    window.open(url, '_blank');
    closePreviewModal();
  };

  return (
    <AnimatePresence>
      {isPreviewOpen && previewProduct && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closePreviewModal}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white text-slate-900 border border-slate-200 w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.25)] relative max-h-[92vh] flex flex-col overflow-hidden z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <span className="bg-amber-500/10 border border-amber-500/30 text-amber-700 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {previewProduct.catLabel}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>In Stock • Ships Today</span>
                </span>
              </div>
              <button
                type="button"
                onClick={closePreviewModal}
                className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-amber-400 flex items-center justify-center text-sm transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar text-left">
              {/* Square Image Container */}
              <div className="relative w-full aspect-square max-h-72 sm:max-h-80 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center p-3 group shadow-inner">
                <Image
                  src={previewProduct.image}
                  alt={previewProduct.name}
                  fill
                  className="object-contain p-2 rounded-xl group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, 400px"
                />
                <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-md border border-slate-200 px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-700 flex items-center gap-1 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>100% Genuine Direct Import</span>
                </div>
              </div>

              {/* Title & Star Ratings */}
              <div className="space-y-1">
                <h3 className="text-base sm:text-xl font-black text-slate-900 leading-snug">
                  {previewProduct.name}
                </h3>
                <div className="flex items-center space-x-2 text-[11px] sm:text-xs">
                  <div className="flex items-center text-amber-500 space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <span className="font-extrabold text-slate-900">{previewProduct.rating}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-amber-700 font-bold">
                    {previewProduct.reviews} Verified Customer Reviews
                  </span>
                </div>
              </div>

              {/* Pricing Box */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/90 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-xl sm:text-2xl font-black text-amber-600 font-mono">
                      ₹{previewProduct.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs sm:text-sm text-slate-400 line-through font-semibold font-mono">
                      ₹{previewProduct.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                    <span>Save ₹{savings.toLocaleString('en-IN')} (Direct Manufacturer Discount)</span>
                  </p>
                </div>
                <div className="text-right text-[10px] text-slate-500 font-medium">
                  <span className="block text-slate-700 font-bold">Free Express Delivery</span>
                  <span>All Taxes Included</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Product Overview
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {previewProduct.description}
                </p>
              </div>

              {/* Key Highlights */}
              <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <h4 className="text-xs font-black text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span>Key Highlights &amp; Specifications</span>
                </h4>
                <ul className="space-y-1.5 text-[11px] sm:text-xs text-slate-700">
                  {previewProduct.features.map((f, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <ShieldCheck className="w-3 h-3 text-amber-500 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Variant Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Select Edition / Color:</label>
                <div className="flex items-center flex-wrap gap-2">
                  {previewProduct.variants.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        v === selectedVariant
                          ? 'bg-amber-500 text-white border border-amber-600 shadow-sm'
                          : 'bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
                <span className="text-xs font-bold text-slate-700">Quantity</span>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-7 h-7 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold flex items-center justify-center text-sm transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-sm font-mono font-black text-slate-900 w-6 text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-7 h-7 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold flex items-center justify-center text-sm transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Assurance Badges */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2">
                  <RotateCcw className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                  <span className="text-[9px] font-bold text-slate-700 block">7 Days Return</span>
                </div>
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2">
                  <Award className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                  <span className="text-[9px] font-bold text-slate-700 block">1 Year Warranty</span>
                </div>
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2">
                  <HandCoins className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <span className="text-[9px] font-bold text-slate-700 block">COD Available</span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-slate-100 pt-3 mt-2 space-y-2 flex-shrink-0">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="bg-white hover:bg-purple-50 border border-purple-300 text-purple-800 font-bold py-2.5 px-3 rounded-2xl text-xs sm:text-sm flex items-center justify-center space-x-1.5 transition-colors shadow-xs cursor-pointer active:scale-95"
                >
                  <ShoppingCart className="w-4 h-4 text-purple-700" />
                  <span>Add To Cart</span>
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="bg-purple-700 hover:bg-purple-800 py-2.5 px-3 rounded-2xl text-white font-bold text-xs sm:text-sm uppercase tracking-tight flex items-center justify-center space-x-1.5 shadow-md cursor-pointer active:scale-95 transition-colors"
                >
                  <Zap className="w-4 h-4 text-white" />
                  <span>Buy Now</span>
                </button>
              </div>
              <button
                type="button"
                onClick={handleWhatsAppDiscuss}
                className="w-full cta-whatsapp-btn py-2.5 px-3 rounded-xl text-white font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Discuss on WhatsApp (+91 89288 84526)</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
