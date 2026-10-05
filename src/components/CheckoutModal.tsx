import React, { useState } from 'react';
import { CartItem, StoreLocation, OrderDetails } from '../types/creamery';
import { STORES } from '../data/flavors';
import { X, CheckCircle2, ShieldCheck, MapPin, Clock, CreditCard, Sparkles, Truck, Store } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  preselectedStoreId?: string;
  onOrderPlaced: (order: OrderDetails) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  preselectedStoreId,
  onOrderPlaced,
}) => {
  if (!isOpen) return null;

  const [fulfillment, setFulfillment] = useState<'pickup' | 'delivery'>('pickup');
  const [selectedStore, setSelectedStore] = useState<string>(preselectedStoreId || STORES[0].id);

  // Form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'apple-pay' | 'card' | 'cash'>('apple-pay');
  const [tipPercent, setTipPercent] = useState<number>(18);
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Calculations
  const rawSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  const deliveryFee = fulfillment === 'delivery' ? (rawSubtotal >= 35 ? 0 : 4.5) : 0;
  const tax = rawSubtotal * 0.085;
  const tip = (rawSubtotal * tipPercent) / 100;
  const grandTotal = rawSubtotal + deliveryFee + tax + tip;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Please enter your full name for order pickup / delivery receipt.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please provide a mobile phone number for order updates.');
      return;
    }
    if (fulfillment === 'delivery' && !address.trim()) {
      setErrorMessage('Please enter your delivery street address.');
      return;
    }
    if (paymentMethod === 'card' && (!cardNumber || cardNumber.length < 14)) {
      setErrorMessage('Please enter a valid credit card number.');
      return;
    }

    setIsSubmitting(true);

    const orderId = 'MC-' + Math.floor(100000 + Math.random() * 900000);
    const order: OrderDetails = {
      orderId,
      placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fulfillmentType: fulfillment,
      storeId: selectedStore,
      customerName: name,
      customerEmail: email || 'guest@example.com',
      customerPhone: phone,
      deliveryAddress: fulfillment === 'delivery' ? address : undefined,
      deliveryNotes: deliveryNotes || undefined,
      items: [...cart],
      subtotal: rawSubtotal,
      tax,
      deliveryFee,
      tip,
      total: grandTotal,
      paymentMethod,
      status: 'confirmed',
      estimatedArrivalMinutes: fulfillment === 'pickup' ? 12 : 28,
    };

    setTimeout(() => {
      setIsSubmitting(false);
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.5 },
      });
      onOrderPlaced(order);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E8DEC8] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8DEC8] flex items-center justify-between bg-white/70">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#241D17]">
              Checkout &amp; Order Hand-Off
            </h2>
            <p className="text-xs text-[#7C6E61]">
              Fast fulfillment with cold-chain dry-ice assurance
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-100"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {errorMessage}
            </div>
          )}

          {/* Fulfillment Toggle */}
          <div>
            <label className="text-xs font-semibold text-[#241D17] block mb-2">
              Fulfillment Method:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFulfillment('pickup')}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                  fulfillment === 'pickup'
                    ? 'bg-white border-[#C86438] ring-1 ring-[#C86438] shadow-xs'
                    : 'bg-white/70 border-[#E8DEC8] text-[#5E5145]'
                }`}
              >
                <Store className={`w-5 h-5 ${fulfillment === 'pickup' ? 'text-[#C86438]' : 'text-stone-400'}`} />
                <div>
                  <div className="text-xs font-bold text-[#241D17]">Express Counter Pickup</div>
                  <div className="text-[11px] text-[#7C6E61]">Ready in ~10–12 minutes (Free)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFulfillment('delivery')}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                  fulfillment === 'delivery'
                    ? 'bg-white border-[#C86438] ring-1 ring-[#C86438] shadow-xs'
                    : 'bg-white/70 border-[#E8DEC8] text-[#5E5145]'
                }`}
              >
                <Truck className={`w-5 h-5 ${fulfillment === 'delivery' ? 'text-[#C86438]' : 'text-stone-400'}`} />
                <div>
                  <div className="text-xs font-bold text-[#241D17]">Direct Frozen Courier</div>
                  <div className="text-[11px] text-[#7C6E61]">Packed with Dry Ice (~25–30m)</div>
                </div>
              </button>
            </div>
          </div>

          {/* Store Selection (if pickup) */}
          {fulfillment === 'pickup' ? (
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#241D17] block">
                Select Pickup Parlor:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {STORES.map((s) => (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => setSelectedStore(s.id)}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      selectedStore === s.id
                        ? 'bg-white border-[#C86438] ring-1 ring-[#C86438]'
                        : 'bg-white/70 border-[#E8DEC8] text-[#5E5145]'
                    }`}
                  >
                    <div className="font-bold text-[#241D17] truncate">{s.name.split(' ')[0]} {s.name.split(' ')[1] || ''}</div>
                    <div className="text-[11px] text-[#7C6E61] mt-0.5">{s.neighborhood}</div>
                    <div className="text-[10px] text-emerald-700 font-mono mt-1">{s.currentWaitTime}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Address input (if delivery) */
            <div className="space-y-3 bg-white p-4 rounded-2xl border border-[#E8DEC8]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#241D17]">
                <MapPin className="w-4 h-4 text-[#C86438]" />
                <span>Delivery Address &amp; Instructions</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street Address, Apt / Suite / Floor *"
                  className="sm:col-span-2 px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DDD0BF] rounded-xl text-xs text-[#241D17] focus:outline-hidden focus:ring-1 focus:ring-[#C86438]"
                />
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="Door code, leave at porch, ring buzzer..."
                  className="sm:col-span-2 px-3.5 py-2.5 bg-[#FAF7F2] border border-[#DDD0BF] rounded-xl text-xs text-[#241D17] focus:outline-hidden focus:ring-1 focus:ring-[#C86438]"
                />
              </div>
            </div>
          )}

          {/* Customer Details */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-[#241D17] block">
              Contact &amp; Notification:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name *"
                className="px-3.5 py-2.5 bg-white border border-[#DDD0BF] rounded-xl text-xs text-[#241D17] focus:outline-hidden focus:ring-1 focus:ring-[#C86438]"
              />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Mobile Phone (SMS updates) *"
                className="px-3.5 py-2.5 bg-white border border-[#DDD0BF] rounded-xl text-xs text-[#241D17] focus:outline-hidden focus:ring-1 focus:ring-[#C86438]"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email (for receipt)"
                className="px-3.5 py-2.5 bg-white border border-[#DDD0BF] rounded-xl text-xs text-[#241D17] focus:outline-hidden focus:ring-1 focus:ring-[#C86438]"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-[#241D17] block">
              Payment Method:
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('apple-pay')}
                className={`py-3 px-2 text-center rounded-xl border text-xs font-semibold transition-all ${
                  paymentMethod === 'apple-pay'
                    ? 'bg-black text-white border-black shadow-xs'
                    : 'bg-white border-[#E0D5C5] text-[#241D17]'
                }`}
              >
                Apple / Google Pay
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-3 px-2 text-center rounded-xl border text-xs font-semibold transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-[#241D17] text-white border-[#241D17] shadow-xs'
                    : 'bg-white border-[#E0D5C5] text-[#241D17]'
                }`}
              >
                Credit / Debit Card
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`py-3 px-2 text-center rounded-xl border text-xs font-semibold transition-all ${
                  paymentMethod === 'cash'
                    ? 'bg-[#241D17] text-white border-[#241D17] shadow-xs'
                    : 'bg-white border-[#E0D5C5] text-[#241D17]'
                }`}
              >
                Cash on Pickup
              </button>
            </div>

            {paymentMethod === 'card' && (
              <div className="p-3.5 bg-white rounded-2xl border border-[#E8DEC8] space-y-2.5">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="Card Number (e.g. 4242 •••• •••• 4242)"
                  maxLength={19}
                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-[#DDD0BF] rounded-lg text-xs"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="px-3 py-2 bg-[#FAF7F2] border border-[#DDD0BF] rounded-lg text-xs"
                  />
                  <input
                    type="password"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    placeholder="CVC"
                    maxLength={4}
                    className="px-3 py-2 bg-[#FAF7F2] border border-[#DDD0BF] rounded-lg text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tip Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#241D17]">
              <span>Tip for the Daily Scoop Team:</span>
              <span className="font-mono text-[#C86438] tabular-nums">${tip.toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[15, 18, 20, 0].map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTipPercent(t)}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    tipPercent === t
                      ? 'bg-[#241D17] text-white border-[#241D17]'
                      : 'bg-white border-[#E0D5C5] text-[#5E5145]'
                  }`}
                >
                  {t === 0 ? 'No Tip' : `${t}%`}
                </button>
              ))}
            </div>
          </div>

          {/* Order Summary Breakdown */}
          <div className="p-4 bg-white/90 rounded-2xl border border-[#E8DEC8] space-y-2 text-xs text-[#5E5145]">
            <div className="flex justify-between">
              <span>Items ({cart.reduce((a, b) => a + b.quantity, 0)}):</span>
              <span className="font-mono tabular-nums">${rawSubtotal.toFixed(2)}</span>
            </div>
            {fulfillment === 'delivery' && (
              <div className="flex justify-between">
                <span>Courier Delivery:</span>
                <span className="font-mono tabular-nums">
                  {deliveryFee === 0 ? 'FREE ($35+)' : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax (8.5%):</span>
              <span className="font-mono tabular-nums">${tax.toFixed(2)}</span>
            </div>
            {tip > 0 && (
              <div className="flex justify-between">
                <span>Staff Tip ({tipPercent}%):</span>
                <span className="font-mono tabular-nums">${tip.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm text-[#241D17] pt-2 border-t border-[#F0E8DC]">
              <span>Total to Pay:</span>
              <span className="font-mono text-base tabular-nums">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-4 text-xs font-bold text-white bg-[#241D17] hover:bg-[#3D3228] rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-70 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Confirming with Churn Room...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#F3C398]" />
                <span>Place Order (${grandTotal.toFixed(2)})</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
