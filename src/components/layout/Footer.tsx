'use client';

import React from 'react';
import Image from 'next/image';
import { MessageCircle, ShieldCheck, Truck, Clock, Sparkles } from 'lucide-react';
import { WHATSAPP_PHONE } from '@/data/products';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto mt-12 pt-8 pb-16 border-t border-purple-100 text-center text-slate-500 text-xs sm:text-sm space-y-5">
      {/* 3 Assurance Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto pb-2">
        <div className="flex items-center justify-center space-x-2 bg-white border border-purple-200/80 rounded-2xl p-3 shadow-xs">
          <ShieldCheck className="w-4 h-4 text-purple-700" />
          <span className="text-xs font-bold text-slate-800">100% Genuine Certified</span>
        </div>
        <div className="flex items-center justify-center space-x-2 bg-white border border-amber-200/80 rounded-2xl p-3 shadow-xs">
          <Truck className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-bold text-slate-800">Free Express Delivery</span>
        </div>
        <div className="flex items-center justify-center space-x-2 bg-white border border-purple-200/80 rounded-2xl p-3 shadow-xs">
          <Clock className="w-4 h-4 text-purple-600" />
          <span className="text-xs font-bold text-slate-800">Direct WhatsApp Concierge</span>
        </div>
      </div>

      {/* Brand & Copyright */}
      <div className="space-y-2 flex flex-col items-center">
        <div className="relative h-6 w-32">
          <Image
            src="/line-logo.png"
            alt="Ashren Haute Marketplace"
            fill
            className="object-contain"
            sizes="128px"
          />
        </div>
        <p className="font-bold text-slate-800 flex items-center justify-center gap-1.5 text-xs sm:text-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Ashren • Haute Marketplace &amp; Revenue Systems</span>
        </p>
        <p className="text-[11px] sm:text-xs text-slate-500">
          © {currentYear} Ashren Haute Marketplace. All Rights Reserved.
        </p>
        <p className="text-[11px] sm:text-xs text-slate-500 flex items-center justify-center space-x-1.5 pt-1">
          <span>Official WhatsApp Support:</span>
          <a
            href={`https://wa.me/${WHATSAPP_PHONE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-700 font-bold hover:underline inline-flex items-center gap-1"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-purple-700 text-purple-700" />
            <span>+91 89288 84526</span>
          </a>
        </p>
      </div>
    </footer>
  );
};
