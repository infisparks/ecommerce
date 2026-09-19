import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { SplashScreen } from '@/components/ui/SplashScreen';
import { UrgencyTicker } from '@/components/layout/UrgencyTicker';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ProductPreviewModal } from '@/components/modals/ProductPreviewModal';
import { ConsultationModal } from '@/components/modals/ConsultationModal';
import { Toast } from '@/components/ui/Toast';
import { StickyMobileBar } from '@/components/ui/StickyMobileBar';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://digitalthemestore.com'),
  title: 'Ashren | Haute Marketplace & Premium E-Commerce Catalog',
  description:
    'Discover verified high-converting product catalogs and automated revenue systems at Ashren Haute Marketplace.',
  keywords: [
    'Ashren',
    'Haute Marketplace',
    'e-commerce catalog',
    'performance marketing',
    'B2B sales funnel',
    'mobile responsive store',
  ],
  openGraph: {
    type: 'website',
    url: 'https://digitalthemestore.com',
    siteName: 'Ashren Haute Marketplace',
    title: 'Ashren | Haute Marketplace',
    description:
      'Predictable growth. Serious inquiries. Real revenue for Manufacturers, Retailers & Brands.',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 800,
        alt: 'Ashren Haute Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ashren | Haute Marketplace',
    description:
      'Predictable growth. Serious inquiries. Real revenue for Manufacturers, Retailers & Brands.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`scroll-smooth h-full antialiased ${plusJakarta.variable}`}>
      <body className="w-full min-h-full bg-[#FAF8F5] text-slate-900 font-sans selection:bg-purple-200 selection:text-purple-950 flex flex-col items-center justify-start min-h-screen antialiased">
        <CartProvider>
          {/* Animated Center Ashren Splash Screen */}
          <SplashScreen />

          {/* Top Urgency Ticker Bar */}
          <UrgencyTicker />

          {/* Sticky Header with Inline Logo */}
          <Navbar />

          {/* Main Body */}
          <main className="w-full flex-1 pb-24 sm:pb-16">{children}</main>

          {/* Footer */}
          <Footer />

          {/* Global Modals & Drawers */}
          <CartDrawer />
          <ProductPreviewModal />
          <ConsultationModal />

          {/* Toast Alert */}
          <Toast />

          {/* Floating Mobile Cart Bar */}
          <StickyMobileBar />
        </CartProvider>
      </body>
    </html>
  );
}
