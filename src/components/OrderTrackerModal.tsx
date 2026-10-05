import React, { useState, useEffect } from 'react';
import { OrderDetails } from '../types/creamery';
import { STORES } from '../data/flavors';
import { CheckCircle2, Clock, MapPin, Sparkles, ChefHat, Package, Check, X, Phone } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OrderTrackerModalProps {
  order: OrderDetails | null;
  onClose: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const [currentStepIndex, setCurrentStepIndex] = useState(1); // 0=confirmed, 1=churning, 2=packing, 3=ready
  const [secondsLeft, setSecondsLeft] = useState(order.estimatedArrivalMinutes * 60);

  const store = STORES.find((s) => s.id === order.storeId) || STORES[0];

  const steps = [
    {
      title: 'Order Confirmed',
      desc: 'Ticket sent directly to the pastry station.',
      icon: CheckCircle2,
    },
    {
      title: 'Cold-Room Hand Scooping',
      desc: `${store.scoopMasterToday} is carving your scoops from the 4-gallon churn tubs.`,
      icon: ChefHat,
    },
    {
      title: 'Glazes & Dry-Ice Packing',
      desc: 'Drizzles applied, placed in compostable insulated box with dry-ice pucks.',
      icon: Package,
    },
    {
      title: order.fulfillmentType === 'pickup' ? 'Ready for Counter Pickup' : 'Out for Express Delivery',
      desc: order.fulfillmentType === 'pickup'
        ? `Head to the Express Counter at ${store.name}. Show your order ID.`
        : `Courier is on route to ${order.deliveryAddress}. Keep your phone handy!`,
      icon: Sparkles,
    },
  ];

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto advance stages for delightful customer experience
  useEffect(() => {
    const stepTimer = setTimeout(() => {
      if (currentStepIndex < 3) {
        setCurrentStepIndex((prev) => {
          const next = prev + 1;
          if (next === 3) {
            confetti({ particleCount: 70, spread: 90 });
          }
          return next;
        });
      }
    }, 12000);

    return () => clearTimeout(stepTimer);
  }, [currentStepIndex]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E8DEC8] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-[#241D17] text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono tracking-wider text-[#F3C398] uppercase">
                Order #{order.orderId}
              </span>
              <span className="text-[11px] bg-white/15 px-2 py-0.5 rounded-full text-white/90">
                {order.fulfillmentType === 'pickup' ? 'Store Pickup' : 'Courier Delivery'}
              </span>
            </div>
            <h2 className="text-xl font-serif font-bold mt-1 text-white">
              Live Churn Room Tracker
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/10"
            aria-label="Close tracker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tracker Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Estimated Time Callout */}
          <div className="p-5 bg-white rounded-2xl border border-[#E8DEC8] shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs text-[#7C6E61] block mb-0.5">
                {order.fulfillmentType === 'pickup' ? 'Estimated Pickup In:' : 'Estimated Delivery In:'}
              </span>
              <div className="text-3xl font-serif font-bold text-[#241D17] font-mono tabular-nums">
                {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-[#7C6E61] block mb-0.5">Location:</span>
              <span className="text-xs font-semibold text-[#241D17]">
                {order.fulfillmentType === 'pickup' ? store.name : 'Express Transit'}
              </span>
            </div>
          </div>

          {/* Stepper progression */}
          <div className="space-y-4">
            {steps.map((step, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const isFuture = idx > currentStepIndex;
              const StepIcon = step.icon;

              return (
                <div
                  key={idx}
                  className={`flex items-start gap-4 p-4 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300 shadow-xs'
                      : isPast
                      ? 'bg-white border-[#E8DEC8]'
                      : 'bg-[#F5EFE4]/60 border-transparent opacity-60'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isPast
                        ? 'bg-[#8EA66E] text-white'
                        : isCurrent
                        ? 'bg-[#241D17] text-[#F3C398] animate-pulse'
                        : 'bg-[#EAE2D5] text-[#A69584]'
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-sm font-serif font-bold ${
                          isCurrent ? 'text-amber-950' : 'text-[#241D17]'
                        }`}
                      >
                        {step.title}
                      </h4>
                      {isCurrent && (
                        <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-[#C86438]">
                          Active Step
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#5E5145] mt-1 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Manual Advance Button for testing / preview */}
          {currentStepIndex < 3 && (
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setCurrentStepIndex((prev) => Math.min(3, prev + 1));
                  if (currentStepIndex + 1 === 3) confetti();
                }}
                className="text-xs text-[#C86438] hover:underline font-medium"
              >
                Fast-Forward to Next Stage &rarr;
              </button>
            </div>
          )}

          {/* Itemized Receipt Summary */}
          <div className="p-4 bg-white rounded-2xl border border-[#E8DEC8] space-y-3">
            <h4 className="text-xs font-semibold text-[#241D17] uppercase tracking-wider">
              Order Receipt ({order.customerName})
            </h4>
            <div className="space-y-2 text-xs divide-y divide-[#F5EFE6]">
              {order.items.map((item, i) => (
                <div key={i} className="pt-2 first:pt-0 flex justify-between">
                  <div>
                    <span className="font-semibold text-[#241D17]">
                      {item.quantity}x {item.type === 'pint' ? 'Pint' : item.vessel.replace('-', ' ')}
                    </span>
                    <p className="text-[11px] text-[#7C6E61]">
                      {item.scoops.map((s) => s.name).join(' · ')}
                    </p>
                  </div>
                  <span className="font-mono tabular-nums text-[#241D17]">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#F0E8DC] flex justify-between font-bold text-xs text-[#241D17]">
              <span>Total Paid ({order.paymentMethod}):</span>
              <span className="font-mono text-sm tabular-nums">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8DEC8] bg-white flex items-center justify-between">
          <div className="text-xs text-[#7C6E61]">
            Need help? Call parlor: {store.phone}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#241D17] hover:bg-[#3D3228] rounded-xl transition-all"
          >
            Done Tracking
          </button>
        </div>
      </div>
    </div>
  );
};
