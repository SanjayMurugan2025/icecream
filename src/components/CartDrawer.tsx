import React, { useState } from 'react';
import { CartItem } from '../types/creamery';
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, Sparkles, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onProceedToCheckout: () => void;
  onOpenStudio: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onOpenStudio,
}) => {
  const [addInsulatedTote, setAddInsulatedTote] = useState(true);

  if (!isOpen) return null;

  const FREE_DELIVERY_THRESHOLD = 35;
  const rawSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const toteCost = addInsulatedTote && cart.length > 0 ? 3.5 : 0;
  const subtotal = rawSubtotal + toteCost;
  const progressToFreeDelivery = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);
  const amountToFree = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#FAF7F2] h-full shadow-2xl flex flex-col justify-between border-l border-[#E8DEC8]">
        {/* Header */}
        <div className="p-5 border-b border-[#E8DEC8] flex items-center justify-between bg-white/70">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#C86438]" />
            <h2 className="text-lg font-serif font-bold text-[#241D17]">
              Your Creamery Bag
            </h2>
            <span className="text-xs font-mono text-[#7C6E61] bg-[#F0E8DC] px-2 py-0.5 rounded-full">
              {cart.reduce((a, b) => a + b.quantity, 0)} items
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-100"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Meter */}
        {cart.length > 0 && (
          <div className="px-5 py-3 bg-[#F3ECE0] border-b border-[#E8DEC8] text-xs">
            <div className="flex items-center justify-between text-[#5E5145] mb-1.5 font-medium">
              {amountToFree <= 0 ? (
                <span className="text-emerald-800 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Unlocked Free Local Courier Delivery!
                </span>
              ) : (
                <span>Add ${amountToFree.toFixed(2)} more for Free Courier Delivery</span>
              )}
              <span className="font-mono tabular-nums">{Math.round(progressToFreeDelivery)}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#E4D9C8] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C86438] transition-all duration-300 rounded-full"
                style={{ width: `${progressToFreeDelivery}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F3ECE0] text-[#A69584] mx-auto flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-base font-serif font-bold text-[#241D17]">Your bag is currently empty</p>
              <p className="text-xs text-[#7C6E61] max-w-xs mx-auto">
                Explore our churned flavors in the interactive menu or customize a 3D waffle cone stack.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onOpenStudio();
                }}
                className="px-4 py-2.5 text-xs font-semibold text-white bg-[#241D17] rounded-xl hover:bg-[#3D3228] transition-all"
              >
                Customize a 3D Scoop
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const isPint = item.type === 'pint';
              const title = isPint
                ? `${item.pintFlavor?.name || 'Artisan'} (Insulated Pint)`
                : `${item.scoops.map((s) => s.name.split(' ')[0]).join(' + ')}`;

              return (
                <div
                  key={item.id}
                  className="p-4 bg-white rounded-2xl border border-[#E8DEC8] shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      {/* Color swatches */}
                      <div className="flex items-center gap-1 mb-1.5">
                        {isPint && item.pintFlavor ? (
                          <span
                            className="w-3 h-3 rounded-full shadow-xs"
                            style={{ backgroundColor: item.pintFlavor.colorHex }}
                          />
                        ) : (
                          item.scoops.map((s, idx) => (
                            <span
                              key={idx}
                              className="w-3 h-3 rounded-full shadow-xs"
                              style={{ backgroundColor: s.colorHex }}
                            />
                          ))
                        )}
                        <span className="text-[11px] font-semibold text-[#8B3B18] ml-1 uppercase tracking-wider">
                          {isPint ? '16 oz Pint' : item.vessel.replace('-', ' ')}
                        </span>
                      </div>

                      <h4 className="text-sm font-serif font-bold text-[#241D17]">
                        {title}
                      </h4>

                      {/* Toppings / Sauces list */}
                      {!isPint && (item.sauces.length > 0 || item.toppings.length > 0) && (
                        <p className="text-[11px] text-[#7C6E61] mt-1 line-clamp-2">
                          {[...item.sauces, ...item.toppings].map((t) => t.name).join(', ')}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="pt-2 border-t border-[#F5EFE6] flex items-center justify-between">
                    {/* Stepper */}
                    <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#E4D9C8] rounded-lg px-2 py-1">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="text-stone-600 hover:text-stone-900 p-0.5"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono font-semibold text-[#241D17] min-w-4 text-center tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="text-stone-600 hover:text-stone-900 p-0.5"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-sm font-bold font-mono text-[#241D17] tabular-nums">
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })
          )}

          {/* Insulated Dry-Ice Tote Addon */}
          {cart.length > 0 && (
            <div className="p-3.5 bg-[#FAF5EB] rounded-2xl border border-[#E5DAC8] flex items-center justify-between text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addInsulatedTote}
                  onChange={(e) => setAddInsulatedTote(e.target.checked)}
                  className="rounded text-[#C86438] focus:ring-[#C86438] mt-0.5"
                />
                <div>
                  <span className="font-semibold text-[#241D17]">Insulated Thermal Dry-Ice Pack</span>
                  <p className="text-[11px] text-[#7C6E61]">Guarantees frozen transit up to 6 hours ($3.50)</p>
                </div>
              </label>
              <span className="font-mono text-[#C86438] font-semibold tabular-nums">+$3.50</span>
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout Button */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#E8DEC8] bg-white/80 space-y-3">
            <div className="space-y-1.5 text-xs text-[#5E5145]">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-mono tabular-nums">${rawSubtotal.toFixed(2)}</span>
              </div>
              {addInsulatedTote && (
                <div className="flex justify-between">
                  <span>Dry-Ice Thermal Packaging:</span>
                  <span className="font-mono tabular-nums">$3.50</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Local Tax (8.5%):</span>
                <span className="font-mono tabular-nums">${(subtotal * 0.085).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#241D17] pt-2 border-t border-[#EAE2D5]">
                <span>Total:</span>
                <span className="font-mono text-base tabular-nums">
                  ${(subtotal * 1.085).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 px-4 text-xs font-semibold text-white bg-[#241D17] hover:bg-[#3D3228] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Proceed to Fast Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
