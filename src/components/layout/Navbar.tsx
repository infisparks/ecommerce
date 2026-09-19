'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, MessageCircle, Calendar } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getWhatsAppGeneralInquiryUrl } from '@/utils/whatsapp';

export const Navbar: React.FC = () => {
  const { totalCount, openCart, openBookingModal } = useCart();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-7xl px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 sticky top-0 bg-white/95 backdrop-blur-md z-30 border-b border-slate-200/90 shadow-sm mx-auto gpu-layer"
    >
      <div className="flex items-center justify-between gap-3">
        {/* Directly show clean Line Logo - No box, No border, No duplicate text */}
        <Link href="/" className="flex items-center group flex-shrink-0">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="relative h-9 sm:h-11 md:h-12 w-36 sm:w-48 md:w-56"
          >
            <Image
              src="/line-logo.png"
              alt="Ashren Haute Marketplace"
              fill
              className="object-contain object-left"
              sizes="(max-width: 640px) 144px, (max-width: 768px) 192px, 224px"
              priority
            />
          </motion.div>
        </Link>

        {/* Right CTA Actions */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 flex-shrink-0">
          {/* WhatsApp Direct Chat */}
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href={getWhatsAppGeneralInquiryUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-whatsapp-btn text-white font-extrabold text-[11px] sm:text-xs px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl flex items-center space-x-1.5 shadow-md"
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white" />
            <span className="hidden md:inline">+91 89288 84526</span>
            <span className="md:hidden">WhatsApp</span>
          </motion.a>

          {/* Cart Trigger */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={openCart}
            aria-label="Open Cart"
            className="relative bg-purple-50/70 hover:bg-purple-100/90 border border-purple-200 hover:border-amber-400 p-1.5 sm:px-3 sm:py-2 rounded-xl text-purple-950 flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 text-purple-700" />
            <span className="text-xs font-black hidden sm:inline text-purple-900">Cart</span>
            <motion.span
              key={totalCount}
              initial={{ scale: 1.4 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              id="cartCountBadge"
              className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md border border-white"
            >
              {totalCount}
            </motion.span>
          </motion.button>

          {/* Consult Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={openBookingModal}
            className="cta-gold-btn shimmer px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-white font-black text-[11px] sm:text-xs uppercase tracking-tight shadow-md hidden sm:inline-flex items-center space-x-1 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            <span>Consult</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};
