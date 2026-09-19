'use client';

import React from 'react';

export const UrgencyTicker: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-white text-[11px] sm:text-xs md:text-sm font-bold py-1.5 shadow-sm z-40 overflow-hidden relative flex items-center">
      <div className="animate-marquee flex items-center space-x-6 whitespace-nowrap">
        <span className="flex items-center space-x-1.5 flex-shrink-0">
          <span className="inline-block w-2 h-2 rounded-full bg-white animate-ping" />
          <span>⚡ FESTIVAL SALE: Extra 20% OFF + Free Express Shipping On All Orders Today!</span>
        </span>
        <span className="flex items-center space-x-1.5 flex-shrink-0">
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-300" />
          <span>🔥 Direct WhatsApp Support &amp; Orders: +91 89288 84526</span>
        </span>
        <span className="flex items-center space-x-1.5 flex-shrink-0">
          <span className="inline-block w-2 h-2 rounded-full bg-white animate-ping" />
          <span>⚡ FESTIVAL SALE: Extra 20% OFF + Free Express Shipping On All Orders Today!</span>
        </span>
        <span className="flex items-center space-x-1.5 flex-shrink-0">
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-300" />
          <span>🔥 Direct WhatsApp Support &amp; Orders: +91 89288 84526</span>
        </span>
      </div>
    </div>
  );
};
