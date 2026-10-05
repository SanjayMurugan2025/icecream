export type DietaryTag = 'vegan' | 'gluten-free' | 'nut-free' | 'dairy-free' | 'organic';

export type FlavorCategory = 'all' | 'classic' | 'botanical' | 'chocolate' | 'sorbetto' | 'seasonal';

export type VesselType = 'waffle-cone' | 'charcoal-cone' | 'waffle-bowl' | 'artisan-cup';

export interface Flavor {
  id: string;
  name: string;
  italianName: string;
  tagline: string;
  description: string;
  category: FlavorCategory;
  colorHex: string;
  secondaryColorHex: string;
  roughness: number;
  sheen: number;
  particlesType: 'vanilla-specks' | 'pistachio-nuts' | 'cocoa-nibs' | 'fruit-seeds' | 'caramel-swirl' | 'herb-flakes' | 'none';
  ingredients: string[];
  origin: string;
  allergens: string[];
  dietary: DietaryTag[];
  sweetness: number; // 1 to 5
  richness: number;  // 1 to 5
  priceScoop: number;
  pricePint: number;
  featured?: boolean;
  seasonalBadge?: string;
}

export interface Topping {
  id: string;
  name: string;
  price: number;
  color: string;
  category: 'sauce' | 'crunch' | 'fresh';
  description: string;
}

export interface CartItem {
  id: string;
  type: 'custom-scoop' | 'pint';
  vessel: VesselType;
  scoops: Flavor[];
  toppings: Topping[];
  sauces: Topping[];
  pintFlavor?: Flavor;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface StoreLocation {
  id: string;
  name: string;
  neighborhood: string;
  address: string;
  hours: string;
  phone: string;
  status: 'Open Now' | 'Closes at 11 PM' | 'Open Today';
  scoopMasterToday: string;
  currentWaitTime: string;
}

export interface OrderDetails {
  orderId: string;
  placedAt: string;
  fulfillmentType: 'pickup' | 'delivery';
  storeId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress?: string;
  deliveryNotes?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  tip: number;
  total: number;
  paymentMethod: 'card' | 'apple-pay' | 'cash';
  status: 'confirmed' | 'churning' | 'packing' | 'ready';
  estimatedArrivalMinutes: number;
}
