import { CartItem, Product } from '@/types';
import { WHATSAPP_PHONE } from '@/data/products';

export function getWhatsAppDirectProductUrl(product: Product, variant: string, quantity: number = 1): string {
  const total = product.price * quantity;
  const msg = `*NEW ORDER - DIGITAL THEME STORE*
━━━━━━━━━━━━━━━━━━━━━━
📦 *ORDER DETAILS:*
• Product: ${product.name}
• Edition/Variant: ${variant || product.variants[0] || 'Standard'}
• Quantity: ${quantity}
• Unit Price: ₹${product.price.toLocaleString('en-IN')}
• *Total Payable:* ₹${total.toLocaleString('en-IN')} (Free Express Delivery)

━━━━━━━━━━━━━━━━━━━━━━
Hi Digital Theme Store, I would like to place an order for this item. Please share payment details and confirm dispatch!`;

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
}

export function getWhatsAppDiscussProductUrl(product: Product, variant: string, quantity: number = 1): string {
  const msg = `Hello Digital Theme Store,

I would like to discuss this product before placing an order:
• Product: ${product.name}
• Selected Edition: ${variant || product.variants[0] || 'Standard'}
• Unit Price: ₹${product.price.toLocaleString('en-IN')}
• Quantity: ${quantity}

Please share delivery timeline and payment confirmation!`;

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
}

export function getWhatsAppCartCheckoutUrl(cart: CartItem[]): string {
  const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  let msg = `*NEW CART ORDER - DIGITAL THEME STORE*\n━━━━━━━━━━━━━━━━━━━━━━\n📦 *ORDER SUMMARY:*\n`;

  cart.forEach((item) => {
    const itemTotal = item.product.price * item.quantity;
    msg += `• ${item.product.name} ${item.variant ? `(${item.variant})` : ''} x ${item.quantity} = ₹${itemTotal.toLocaleString('en-IN')}\n`;
  });

  msg += `\nSubtotal: ₹${totalPrice.toLocaleString('en-IN')}\nExpress Delivery: FREE (₹0)\n*Estimated Total:* ₹${totalPrice.toLocaleString('en-IN')}\n━━━━━━━━━━━━━━━━━━━━━━\nPlease confirm my order and dispatch details!`;

  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
}

export function getWhatsAppConsultationUrl(name: string, phone: string): string {
  const msg = `Hi Digital Theme Store, my name is ${name} (+91 ${phone}). I would like to schedule a 1-on-1 Growth Strategy Consultation.`;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
}

export function getWhatsAppGeneralInquiryUrl(): string {
  const msg = `Hello Digital Theme Store, I would like to inquire about your products and services.`;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
}

export function getWhatsAppBulkOrderUrl(): string {
  const msg = `Hi Digital Theme, I would like to discuss bulk orders and commercial templates.`;
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;
}
