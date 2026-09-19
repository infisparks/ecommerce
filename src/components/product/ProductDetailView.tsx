'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Star,
  ShieldCheck,
  RotateCcw,
  Award,
  Truck,
  MessageCircle,
  Zap,
  PhoneCall,
  ArrowRight,
  Camera,
  Box,
  Sparkles,
} from 'lucide-react';
import { Product } from '@/types';
import { productsData, DEFAULT_PRODUCT_GLB } from '@/data/products';
import { Model3DViewer } from '@/components/ar/Model3DViewer';
import { CameraARModal } from '@/components/ar/CameraARModal';
import {
  getWhatsAppDirectProductUrl,
  getWhatsAppDiscussProductUrl,
  getWhatsAppBulkOrderUrl,
} from '@/utils/whatsapp';

interface ProductDetailViewProps {
  initialProductId?: number;
  initialVariant?: string;
  initialQty?: number;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  initialProductId = 2,
  initialVariant,
  initialQty = 1,
}) => {
  const router = useRouter();

  const [currentProduct, setCurrentProduct] = useState<Product>(() => {
    return productsData.find((p) => p.id === initialProductId) || productsData[0];
  });

  const [selectedVariant, setSelectedVariant] = useState<string>(() => {
    return (
      initialVariant ||
      currentProduct.variants[0] ||
      'Standard'
    );
  });

  const [quantity, setQuantity] = useState<number>(initialQty);
  const [viewMode, setViewMode] = useState<'photo' | '3d'>('photo');
  const [isARModalOpen, setIsARModalOpen] = useState(false);

  useEffect(() => {
    const prod = productsData.find((p) => p.id === initialProductId);
    if (prod) {
      setCurrentProduct(prod);
      if (!initialVariant || !prod.variants.includes(initialVariant)) {
        setSelectedVariant(prod.variants[0] || 'Standard');
      } else {
        setSelectedVariant(initialVariant);
      }
    }
  }, [initialProductId, initialVariant]);

  const switchProduct = (newId: number) => {
    const prod = productsData.find((p) => p.id === newId);
    if (!prod) return;
    setCurrentProduct(prod);
    setSelectedVariant(prod.variants[0] || 'Standard');
    setQuantity(1);
    router.push(`/buy?id=${newId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const savings = currentProduct.originalPrice - currentProduct.price;
  const totalPrice = currentProduct.price * quantity;

  const handleDirectWhatsApp = () => {
    const url = getWhatsAppDirectProductUrl(currentProduct, selectedVariant, quantity);
    window.open(url, '_blank');
  };

  const handleDiscussWhatsApp = () => {
    const url = getWhatsAppDiscussProductUrl(currentProduct, selectedVariant, quantity);
    window.open(url, '_blank');
  };

  const relatedProducts = productsData.filter((p) => p.id !== currentProduct.id).slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto mt-4 sm:mt-6 space-y-8"
    >
      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* LEFT COLUMN: Image Showcase & In-Depth Specs (7 Cols) */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 space-y-5"
        >
          {/* Main Square Image Showcase */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-6 shadow-sm relative overflow-hidden group space-y-3">
            {/* Top Bar: View Mode Switcher + AR Room Placement Button */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
              <div className="flex items-center p-1 bg-slate-100 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setViewMode('photo')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === 'photo'
                      ? 'bg-white text-purple-950 shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>2D Photos</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('3d')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    viewMode === '3d'
                      ? 'bg-purple-900 text-amber-300 shadow-sm border border-purple-800'
                      : 'text-slate-600 hover:text-purple-900'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  <span>Interactive 3D</span>
                </button>
              </div>

              {/* View in Room (Camera AR) Button */}
              <button
                type="button"
                onClick={() => setIsARModalOpen(true)}
                className="bg-gradient-to-r from-purple-800 to-indigo-900 hover:from-purple-900 hover:to-indigo-950 text-white border border-amber-400/80 px-3.5 py-1.5 rounded-2xl text-xs font-black uppercase tracking-tight flex items-center gap-2 shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <Camera className="w-4 h-4 text-amber-300" />
                <span>Place In Room (AR)</span>
              </button>
            </div>

            {/* Media Viewport */}
            {viewMode === '3d' ? (
              <Model3DViewer
                src={currentProduct.glbModel || DEFAULT_PRODUCT_GLB}
                poster={currentProduct.image}
                alt={currentProduct.name}
                onOpenAR={() => setIsARModalOpen(true)}
              />
            ) : (
              <div className="relative w-full aspect-square max-h-[480px] rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center p-3 overflow-hidden shadow-inner">
                <Image
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  fill
                  className="object-contain p-4 rounded-xl group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 1024px) 100vw, 600px"
                  priority
                />

                <div className="absolute bottom-3.5 left-3.5 bg-white/95 backdrop-blur-md border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>100% Genuine Direct Import</span>
                </div>

                <div className="absolute bottom-3.5 right-3.5 bg-emerald-50 border border-emerald-300/80 px-2.5 py-1 rounded-xl text-[11px] font-extrabold text-emerald-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>In Stock</span>
                </div>
              </div>
            )}

            {/* Quick Template Selector Thumbnails (All 16 products) */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                  All 16 Curated Templates:
                </p>
                <span className="text-[11px] text-amber-700 font-bold font-mono">
                  Tap to switch
                </span>
              </div>
              <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
                {productsData.map((p) => {
                  const isCur = p.id === currentProduct.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => switchProduct(p.id)}
                      className={`flex-shrink-0 w-14 h-14 rounded-xl p-1 bg-white border-2 relative overflow-hidden transition-all cursor-pointer ${
                        isCur
                          ? 'border-amber-500 shadow-md ring-2 ring-amber-400/40 scale-105'
                          : 'border-slate-200 hover:border-amber-400 opacity-70 hover:opacity-100'
                      }`}
                      title={p.name}
                    >
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-contain p-0.5 rounded-lg"
                        sizes="56px"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Description & Highlights Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 text-left">
            <div>
              <span className="bg-amber-500/10 border border-amber-500/30 text-amber-700 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                {currentProduct.catLabel}
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 mt-2 leading-tight">
                {currentProduct.name}
              </h2>

              <div className="flex items-center space-x-2 mt-2 text-xs sm:text-sm">
                <div className="flex items-center text-amber-500 space-x-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span className="font-black text-slate-900">{currentProduct.rating}</span>
                <span className="text-slate-300">•</span>
                <span className="text-amber-700 font-bold">
                  {currentProduct.reviews} Verified Customer Reviews
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
                Product Overview
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {currentProduct.description}
              </p>
            </div>

            {/* Highlights Checklist */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
              <h4 className="text-xs font-black text-amber-700 uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>Key Features &amp; Specifications</span>
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {currentProduct.features.map((f, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2.5 pt-1 text-center">
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3">
                <RotateCcw className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <span className="text-xs font-extrabold text-slate-800 block">7 Days Return</span>
                <span className="text-[10px] text-slate-500">Hassle-Free Replacement</span>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3">
                <Award className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                <span className="text-xs font-extrabold text-slate-800 block">1 Year Warranty</span>
                <span className="text-[10px] text-slate-500">Direct Brand Protection</span>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3">
                <Truck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                <span className="text-xs font-extrabold text-slate-800 block">COD Available</span>
                <span className="text-[10px] text-slate-500">Pay on Safe Delivery</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Fast Order Form & WhatsApp Concierge (5 Cols) */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 space-y-5"
        >
          {/* Sticky Order Box */}
          <div className="bg-white border-2 border-amber-400/90 rounded-3xl p-5 sm:p-6 shadow-[0_12px_35px_rgba(245,158,11,0.14)] space-y-4 text-left">
            {/* Price Summary */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">
                    ₹{currentProduct.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm sm:text-base text-slate-400 line-through font-semibold font-mono">
                    ₹{currentProduct.originalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                  <span>Direct Factory Price • Save ₹{savings.toLocaleString('en-IN')}</span>
                </p>
              </div>
              <div className="text-right text-[11px] text-slate-500">
                <span className="inline-block bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-md text-[10px] mb-0.5">
                  FREE SHIPPING
                </span>
                <p className="font-medium">Taxes Included</p>
              </div>
            </div>

            {/* Edition / Color Variant Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-800 uppercase tracking-wide">
                1. Select Edition / Color:
              </label>
              <div className="flex items-center flex-wrap gap-2">
                {currentProduct.variants.map((v) => {
                  const isSelected = v === selectedVariant;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-white border border-amber-600 shadow-sm'
                          : 'bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-2xl">
              <div>
                <span className="text-xs font-black text-slate-800 block">2. Select Quantity</span>
                <span className="text-[10px] text-slate-500">Subtotal updates automatically</span>
              </div>
              <div className="flex items-center space-x-3 bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-black flex items-center justify-center text-sm transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="text-base font-mono font-black text-slate-900 w-7 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-black flex items-center justify-center text-sm transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Direct WhatsApp Purchase Breakdown */}
            <div className="space-y-3.5 pt-2 border-t border-slate-100">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Unit Price:</span>
                  <span className="font-mono font-bold text-slate-800">
                    ₹{currentProduct.price.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Selected Edition:</span>
                  <span className="font-bold text-slate-900">{selectedVariant}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Quantity:</span>
                  <span className="font-mono font-bold text-slate-800">{quantity}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Express Delivery:</span>
                  <span className="uppercase">FREE (₹0)</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                  <span>Total Payable:</span>
                  <span className="text-amber-600 text-xl font-mono">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-1">
                {/* Direct Purchase via WhatsApp */}
                <button
                  type="button"
                  onClick={handleDirectWhatsApp}
                  className="w-full bg-purple-700 hover:bg-purple-800 py-4 px-4 rounded-2xl text-white font-bold text-xs sm:text-sm uppercase tracking-wide flex items-center justify-center space-x-2 shadow-lg cursor-pointer transition-colors active:scale-95"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-white" />
                  <span>DIRECT PURCHASE VIA WHATSAPP</span>
                </button>

                {/* Discuss on WhatsApp */}
                <button
                  type="button"
                  onClick={handleDiscussWhatsApp}
                  className="w-full cta-whatsapp-btn py-3 px-4 rounded-2xl text-white font-extrabold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>DISCUSS ON WHATSAPP (+91 89288 84526)</span>
                </button>
              </div>

              <div className="flex items-center justify-center space-x-3 text-[10px] text-slate-500 font-medium pt-1">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-500" /> Instant Response
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" /> 100% Genuine
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-blue-600" /> 24h Dispatch
                </span>
              </div>
            </div>
          </div>

          {/* Direct Concierge Contact Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 text-left shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 flex items-center justify-center text-lg flex-shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900">
                  Need Bulk Quantity or Custom Quote?
                </h4>
                <p className="text-[11px] text-slate-500">
                  Chat directly with our B2B manager on WhatsApp
                </p>
              </div>
            </div>
            <a
              href={getWhatsAppBulkOrderUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-black text-xs px-3 py-2 rounded-xl flex-shrink-0 border border-slate-200 transition-colors"
            >
              Chat Now
            </a>
          </div>
        </motion.div>
      </div>

      {/* Recommended Products */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="mt-12 pt-8 border-t border-slate-200 space-y-4 text-left"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-xl lg:text-2xl font-black text-slate-900 tracking-tight">
              Recommended Products
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Browse other verified products &amp; items you may also like
            </p>
          </div>
          <Link
            href="/"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            <span>View All in Catalog</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {relatedProducts.map((p, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
              key={p.id}
              onClick={() => switchProduct(p.id)}
              className="interactive-card bg-white border border-slate-200/90 hover:border-amber-500/80 rounded-3xl p-3.5 text-left space-y-2.5 shadow-sm flex flex-col justify-between transition-all group cursor-pointer"
            >
              <div className="space-y-2">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-200/80 p-2 flex items-center justify-center shadow-inner">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-contain p-2 rounded-xl drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-extrabold text-amber-600 tracking-wider block">
                    {p.catLabel}
                  </span>
                  <h4
                    className="text-xs sm:text-sm font-extrabold text-slate-900 tracking-tight line-clamp-2 leading-snug group-hover:text-amber-600 transition-colors"
                    title={p.name}
                  >
                    {p.name}
                  </h4>
                </div>
                <div className="flex items-center space-x-1 text-amber-500 text-[10px]">
                  <div className="flex items-center space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <span className="text-slate-500 font-mono font-bold">({p.reviews})</span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs sm:text-base font-black text-amber-600 font-mono">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-400 line-through ml-1 font-mono">
                      ₹{p.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    switchProduct(p.id);
                  }}
                  className="w-full cta-gold-btn py-2 px-2 rounded-xl text-slate-950 font-black text-[10px] sm:text-xs uppercase tracking-tight flex items-center justify-center space-x-1 shadow-sm cursor-pointer"
                >
                  <span>BUY NOW</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Mobile Floating Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 shadow-2xl flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2 pl-1 min-w-0">
          <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 p-1 flex-shrink-0">
            <Image
              src={currentProduct.image}
              alt={currentProduct.name}
              fill
              className="object-contain"
              sizes="44px"
            />
          </div>
          <div className="overflow-hidden">
            <span className="text-sm font-black text-amber-600 font-mono block leading-tight">
              ₹{totalPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold block truncate">
              Free Express Delivery
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 flex-shrink-0">
          <button
            type="button"
            onClick={handleDiscussWhatsApp}
            className="cta-whatsapp-btn text-white p-2.5 rounded-xl text-xs flex items-center justify-center shadow-sm cursor-pointer"
            aria-label="Discuss on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
          </button>
          <button
            type="button"
            onClick={handleDirectWhatsApp}
            className="cta-gold-btn shimmer py-2.5 px-3.5 rounded-xl text-slate-950 font-black text-xs uppercase tracking-tight shadow-md flex items-center space-x-1 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-slate-950" />
            <span>Order Now</span>
          </button>
        </div>
      </div>

      {/* AR Camera Room Placement Modal */}
      <CameraARModal
        product={currentProduct}
        isOpen={isARModalOpen}
        onClose={() => setIsARModalOpen(false)}
      />
    </motion.div>
  );
};
