export type ConditionGrade = 'Like New (Flawless)' | 'Excellent (9.5/10)' | 'Very Good (8.5/10)' | 'Good (Minor Marks)';

export type StockStatus = 'Available' | 'Booked' | 'Sold Out';

export type ProductCategory = 'Phones' | 'Watches' | 'Tablets' | 'Laptops' | 'Accessories' | 'Other Gadgets';

export type UserRole = 'customer' | 'sales' | 'admin';

export interface PhoneItem {
  id: string;
  category?: ProductCategory;
  brand: string;
  model: string;
  storage: string;
  colour: string;
  colorHex?: string;
  condition: ConditionGrade;
  conditionDescription: string;
  batteryHealth?: number;
  price: number;
  originalMsp?: number;
  billAvailable?: boolean;
  billAmount?: number;
  priceDrop?: boolean;
  featured?: boolean;
  status: StockStatus;
  bookingCustomer?: {
    name: string;
    phone: string;
    note?: string;
    bookedAt?: string;
  } | null;
  dateAdded: string;
  images: string[];
  inBox: {
    chargerIncluded: boolean;
    originalBox: boolean;
    taxInvoiceProvided: boolean;
    cableIncluded: boolean;
    originalBillIncluded?: boolean;
  };
  keyFeatures: string[];
  inspectionPassed: string[];
  stockTag?: string;
  screenSize?: string;
  ram?: string;
  processor?: string;
}

export interface AccessoryItem {
  id: string;
  name: string;
  category: 'Chargers & Adapters' | 'Cables' | 'Cases & Covers' | 'Screen Protectors' | 'Audio & Earphones' | 'Power Banks & Mounts';
  type: 'Brand New' | 'Pre-Owned Original';
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  compatibleWith: string;
  inStock: boolean;
}

export interface EducationalVideo {
  id: string;
  title: string;
  duration: string;
  topic: string;
  description: string;
  youtubeUrl: string;
  thumbnailGradient: string;
  viewsCount?: string;
}

export interface Testimonial {
  id: string;
  customerName: string;
  city: string;
  devicePurchased: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  isGoogleReview?: boolean;
  reviewerBadge?: string;
  likesCount?: number;
}

export interface FilterOptions {
  searchQuery: string;
  category: string;
  brand: string;
  minPrice: number;
  maxPrice: number;
  storage: string[];
  condition: string[];
  minBatteryHealth: number;
  onlyAvailable: boolean;
  onlyPriceDrop: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'battery-desc' | 'newest';
}

// API response types
export interface ApiProduct {
  id: string;
  category: string;
  brand: string;
  model: string;
  storage: string;
  colour: string;
  color_hex: string | null;
  price_inr: number;
  original_msp: number | null;
  bill_available: boolean;
  bill_amount: number | null;
  condition_grade: string;
  condition_description: string;
  battery_health: number | null;
  screen_size: string | null;
  ram: string | null;
  processor: string | null;
  stock_tag: string;
  price_drop: boolean;
  featured: boolean;
  in_box: {
    charger_included?: boolean;
    original_box?: boolean;
    tax_invoice_provided?: boolean;
    cable_included?: boolean;
    original_bill_included?: boolean;
    chargerIncluded?: boolean;
    originalBox?: boolean;
    taxInvoiceProvided?: boolean;
    cableIncluded?: boolean;
    originalBillIncluded?: boolean;
  };
  key_features: string[];
  inspection_passed?: string[];
  images: Array<{ url: string; alt_text: string }>;
  units: Array<{ id: string; stock_tag: string; status: string }>;
  created_at: string;
  updated_at: string;
}

export interface ApiInventoryUnit {
  id: string;
  product_id: string;
  stock_tag: string;
  status: 'available' | 'reserved' | 'sold' | 'retired';
  sale_price_inr: number | null;
  created_at: string;
  updated_at: string;
}

export interface ApiReservation {
  id: string;
  unit_id: string;
  customer_id: string;
  status: 'pending' | 'active' | 'cancelled' | 'expired' | 'converted_to_sale';
  deposit_amount_inr: number;
  total_amount_inr: number;
  notes: string | null;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface ApiSale {
  id: string;
  unit_id: string;
  reservation_id: string | null;
  customer_id: string;
  sale_price_inr: number;
  discount_inr: number;
  final_amount_inr: number;
  payment_method: string;
  invoice_number: string | null;
  notes: string | null;
  sold_by: string;
  created_at: string;
}

export interface ApiInspection {
  id: string;
  unit_id: string;
  inspector_name: string;
  passed_checks: string[];
  failed_checks: string[];
  notes: string | null;
  created_at: string;
}

export interface ApiCustomer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  created_at: string;
}
