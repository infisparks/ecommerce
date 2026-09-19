export type ProductCategory = 'all' | 'electronics' | 'security' | 'gadgets' | 'fashion';

export interface Product {
  id: number;
  name: string;
  category: 'electronics' | 'security' | 'gadgets' | 'fashion';
  catLabel: string;
  badge: string;
  badgeColor?: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  features: string[];
  variants: string[];
  glbModel?: string;
  usdzModel?: string;
}

export interface CartItem {
  key: string;
  product: Product;
  variant: string;
  quantity: number;
}

export interface ConsultationForm {
  fullName: string;
  phone: string;
}
