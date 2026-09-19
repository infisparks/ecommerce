'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { bannerSlides } from '@/data/products';

export const BannerSlider: React.FC<{ onSlideClick?: () => void }> = ({ onSlideClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isSwiping = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = bannerSlides.length;

  const getSlideWidthPercentage = () => {
    if (typeof window === 'undefined') return 80;
    if (window.innerWidth < 640) return 92;
    if (window.innerWidth < 1024) return 86;
    return 80;
  };

  const [slideWidth, setSlideWidth] = useState(80);

  const handleResize = useCallback(() => {
    setSlideWidth(getSlideWidthPercentage());
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const startAutoplay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 4500);
  }, [totalSlides]);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoplay]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    startAutoplay();
  };

  const handleCardClick = (index: number) => {
    if (index === currentIndex) {
      if (onSlideClick) {
        onSlideClick();
      } else {
        const catalogEl = document.getElementById('catalogSection');
        if (catalogEl) {
          catalogEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      goToSlide(index);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = touchStartX.current;
    isSwiping.current = true;
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping.current) return;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!isSwiping.current) return;
    isSwiping.current = false;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
      } else {
        setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
      }
    }
    startAutoplay();
  };

  const peekOffset = (100 - slideWidth) / 2;
  const translateX = peekOffset - currentIndex * slideWidth;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-2 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div
        className="relative w-full overflow-hidden rounded-2xl sm:rounded-3xl py-1 cursor-grab select-none shadow-sm"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Track */}
        <div
          className="flex items-center transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform"
          style={{ transform: `translateX(${translateX}%)` }}
        >
          {bannerSlides.map((slide, index) => {
            const isActive = index === currentIndex;
            return (
              <div
                key={slide.id}
                onClick={() => handleCardClick(index)}
                className="w-[92%] sm:w-[86%] md:w-[80%] flex-shrink-0 px-1 sm:px-2 transition-all duration-500 cursor-pointer"
              >
                <div
                  className={`relative w-full aspect-[2.25/1] max-h-[260px] rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 bg-slate-900 ${
                    isActive
                      ? 'shadow-2xl border-2 border-amber-400 scale-100 opacity-100 ring-4 ring-amber-400/20'
                      : 'shadow-md border border-slate-300/70 scale-95 opacity-50 hover:opacity-80'
                  }`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 92vw, 1100px"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Dot Indicators */}
        <div className="absolute bottom-2.5 sm:bottom-3.5 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-20 bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-md">
          {bannerSlides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex ? 'w-6 bg-amber-500 shadow-sm' : 'w-2.5 bg-white/60 hover:bg-white'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
};
