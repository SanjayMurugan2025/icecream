/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FLAVORS, TOPPINGS } from './data/flavors';
import { Flavor, CartItem, OrderDetails } from './types/creamery';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FlavorMenu } from './components/FlavorMenu';
import { CraftStorySection } from './components/CraftStorySection';
import { LocationsSection } from './components/LocationsSection';
import { Studio3DModal } from './components/Studio3DModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { Footer } from './components/Footer';
import { Sparkles, Check, ArrowUp } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Cart state initialized with 1 delicious curated sample item so the cart isn't an empty void
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'initial-sample-1',
      type: 'custom-scoop',
      vessel: 'waffle-cone',
      scoops: [FLAVORS[0], FLAVORS[1]], // Bronte Pistachio + Bourbon Vanilla
      sauces: [TOPPINGS[0]], // Fleur de Sel Caramel
      toppings: [TOPPINGS[4]], // Toasted Pistachio Crumb
      quantity: 1,
      unitPrice: 11.25,
    },
  ]);

  // Modal & Drawer UI states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [studioFlavor, setStudioFlavor] = useState<Flavor | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<OrderDetails | null>(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [preselectedStoreId, setPreselectedStoreId] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Cart operations
  const handleAddToCart = (newItem: CartItem) => {
    setCart((prev) => {
      // Check if identical item exists
      const existingIdx = prev.findIndex(
        (item) =>
          item.type === newItem.type &&
          item.vessel === newItem.vessel &&
          item.pintFlavor?.id === newItem.pintFlavor?.id &&
          item.scoops.map((s) => s.id).join(',') === newItem.scoops.map((s) => s.id).join(',') &&
          item.sauces.map((s) => s.id).join(',') === newItem.sauces.map((s) => s.id).join(',') &&
          item.toppings.map((t) => t.id).join(',') === newItem.toppings.map((t) => t.id).join(',')
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, newItem];
    });

    showToast('Added to your creamery bag!');
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
    showToast('Item removed from bag');
  };

  // Quick action: Add single scoop to cart from menu
  const handleQuickAddScoop = (flavor: Flavor) => {
    const item: CartItem = {
      id: 'quick-scoop-' + Date.now(),
      type: 'custom-scoop',
      vessel: 'waffle-cone',
      scoops: [flavor],
      sauces: [],
      toppings: [],
      quantity: 1,
      unitPrice: flavor.priceScoop + 1.25, // includes waffle cone
    };
    handleAddToCart(item);
  };

  // Quick action: Add pint to cart
  const handleQuickAddPint = (flavor: Flavor) => {
    const item: CartItem = {
      id: 'pint-' + Date.now(),
      type: 'pint',
      vessel: 'artisan-cup',
      scoops: [flavor],
      sauces: [],
      toppings: [],
      pintFlavor: flavor,
      quantity: 1,
      unitPrice: flavor.pricePint,
    };
    handleAddToCart(item);
  };

  // Open 3D Studio with specific flavor pre-selected
  const handleOpenStudioWithFlavor = (flavor: Flavor) => {
    setStudioFlavor(flavor);
    setIsStudioOpen(true);
  };

  // Navigation smoothly scrolls to anchor
  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'studio') {
      setIsStudioOpen(true);
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Order placed
  const handleOrderPlaced = (order: OrderDetails) => {
    setActiveOrder(order);
    setIsCheckoutOpen(false);
    setCart([]); // Clear cart
    setIsTrackerOpen(true);
  };

  const handleSelectStoreForOrder = (storeId: string) => {
    setPreselectedStoreId(storeId);
    if (cart.length > 0) {
      setIsCheckoutOpen(true);
    } else {
      showToast('Store selected! Choose your flavors to order.');
      const menuEl = document.getElementById('menu');
      if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#241D17]">
      {/* Top Bar Navigation */}
      <Navbar
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenStudio={() => {
          setStudioFlavor(FLAVORS[0]);
          setIsStudioOpen(true);
        }}
        onNavigate={handleNavigate}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section with Live 3D Scoop Inspector */}
        <HeroSection
          onOpenStudioWithFlavor={handleOpenStudioWithFlavor}
          onQuickAdd={handleQuickAddScoop}
          onExploreMenu={() => handleNavigate('menu')}
        />

        {/* Interactive Flavor Menu with Real-time Filtering */}
        <FlavorMenu
          onSelectFlavorFor3D={handleOpenStudioWithFlavor}
          onAddScoopToCart={handleQuickAddScoop}
          onAddPintToCart={handleQuickAddPint}
        />

        {/* 3D Customizer Teaser Banner */}
        <section className="py-12 bg-[#241D17] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <span className="text-xs uppercase font-mono tracking-wider text-[#F3C398]">
                Bespoke Ice Cream Engineering
              </span>
              <h3 className="text-2xl font-serif font-bold text-white">
                Stack up to 3 custom scoops with molten glazes &amp; crunches.
              </h3>
              <p className="text-xs text-[#A69989]">
                Rotate in 360°, trigger elastic scoop physics, and order your creation.
              </p>
            </div>

            <button
              onClick={() => {
                setStudioFlavor(FLAVORS[0]);
                setIsStudioOpen(true);
              }}
              className="px-6 py-3 text-xs font-bold text-[#241D17] bg-[#FAF7F2] hover:bg-white rounded-xl shadow-md transition-all flex items-center gap-2 whitespace-nowrap active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-[#C86438]" />
              <span>Launch 3D Customizer</span>
            </button>
          </div>
        </section>

        {/* Craft, Milk Origin & Waffle Bakery Section */}
        <CraftStorySection />

        {/* Shop Locations & Pickup Counter */}
        <LocationsSection onSelectStoreForOrder={handleSelectStoreForOrder} />
      </main>

      {/* Footer */}
      <Footer />

      {/* 3D Customizer Studio Modal */}
      <Studio3DModal
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        initialFlavor={studioFlavor}
        onAddToCart={handleAddToCart}
      />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        onOpenStudio={() => {
          setStudioFlavor(FLAVORS[0]);
          setIsStudioOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        preselectedStoreId={preselectedStoreId}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Live Order Tracker Modal */}
      <OrderTrackerModal
        order={activeOrder}
        onClose={() => setIsTrackerOpen(false)}
      />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#241D17] text-white px-4 py-2.5 rounded-full shadow-lg text-xs font-semibold flex items-center gap-2 border border-white/10 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-3.5 h-3.5 text-[#8EA66E]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
