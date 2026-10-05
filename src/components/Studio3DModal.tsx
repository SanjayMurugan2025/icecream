import React, { useState } from 'react';
import { FLAVORS, TOPPINGS, VESSELS } from '../data/flavors';
import { Flavor, Topping, VesselType, CartItem } from '../types/creamery';
import { ThreeIceCreamViewer } from './ThreeIceCreamViewer';
import { X, Sparkles, Check, Plus, Minus, ArrowRight, RotateCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Studio3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFlavor?: Flavor | null;
  onAddToCart: (item: CartItem) => void;
}

export const Studio3DModal: React.FC<Studio3DModalProps> = ({
  isOpen,
  onClose,
  initialFlavor,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  const defaultFlavor = initialFlavor || FLAVORS[0];

  const [scoopCount, setScoopCount] = useState<1 | 2 | 3>(1);
  const [scoop1, setScoop1] = useState<Flavor>(defaultFlavor);
  const [scoop2, setScoop2] = useState<Flavor>(FLAVORS[1] || defaultFlavor);
  const [scoop3, setScoop3] = useState<Flavor>(FLAVORS[2] || defaultFlavor);
  const [selectedVessel, setSelectedVessel] = useState<VesselType>('waffle-cone');
  const [selectedSauces, setSelectedSauces] = useState<Topping[]>([]);
  const [selectedToppings, setSelectedToppings] = useState<Topping[]>([]);
  const [activeStepTab, setActiveStepTab] = useState<'scoops' | 'vessel' | 'toppings'>('scoops');
  const [isSuccessPuff, setIsSuccessPuff] = useState(false);

  // Price calculations
  const vesselObj = VESSELS.find((v) => v.id === selectedVessel) || VESSELS[0];
  const scoopsPrice =
    scoop1.priceScoop +
    (scoopCount >= 2 ? scoop2.priceScoop * 0.85 : 0) +
    (scoopCount === 3 ? scoop3.priceScoop * 0.75 : 0);
  const toppingsPrice =
    selectedSauces.reduce((acc, s) => acc + s.price, 0) +
    selectedToppings.reduce((acc, t) => acc + t.price, 0);
  const totalPrice = scoopsPrice + vesselObj.price + toppingsPrice;

  const toggleSauce = (sauce: Topping) => {
    setSelectedSauces((prev) =>
      prev.some((s) => s.id === sauce.id)
        ? prev.filter((s) => s.id !== sauce.id)
        : [...prev, sauce]
    );
  };

  const toggleTopping = (topping: Topping) => {
    setSelectedToppings((prev) =>
      prev.some((t) => t.id === topping.id)
        ? prev.filter((t) => t.id !== topping.id)
        : [...prev, topping]
    );
  };

  const handleSprinkleShower = () => {
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.4 },
      colors: [scoop1.colorHex, '#E88B69', '#FFECCC', '#D89E62', '#382218'],
    });
  };

  const handleAddCreationToCart = () => {
    const scoopsArray = [scoop1];
    if (scoopCount >= 2) scoopsArray.push(scoop2);
    if (scoopCount === 3) scoopsArray.push(scoop3);

    const newItem: CartItem = {
      id: 'custom-' + Date.now(),
      type: 'custom-scoop',
      vessel: selectedVessel,
      scoops: scoopsArray,
      sauces: selectedSauces,
      toppings: selectedToppings,
      quantity: 1,
      unitPrice: totalPrice,
    };

    setIsSuccessPuff(true);
    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      onAddToCart(newItem);
      setIsSuccessPuff(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E8DEC8] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E8DEC8] flex items-center justify-between bg-white/70">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-900">
              <Sparkles className="w-5 h-5 text-[#C86438]" />
            </span>
            <div>
              <h2 className="text-xl font-serif font-bold text-[#241D17]">
                3D Custom Scoop Studio
              </h2>
              <p className="text-xs text-[#7C6E61]">
                Craft your bespoke cone or cup with physics-enabled real-time preview
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
            aria-label="Close studio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Left Column: 3D Real-time Canvas */}
          <div className="lg:col-span-7 p-4 sm:p-6 flex flex-col justify-between bg-gradient-to-b from-[#F7F2E8] to-[#EFE6D7] border-b lg:border-b-0 lg:border-r border-[#E8DEC8]">
            {/* 3D Viewer */}
            <div className="relative aspect-square sm:aspect-[4/3.8] w-full max-h-[460px] mx-auto">
              <ThreeIceCreamViewer
                primaryFlavor={scoop1}
                secondaryFlavor={scoopCount >= 2 ? scoop2 : null}
                tertiaryFlavor={scoopCount === 3 ? scoop3 : null}
                scoopCount={scoopCount}
                vessel={selectedVessel}
                sauces={selectedSauces}
                toppings={selectedToppings}
                interactive={true}
                className="w-full h-full shadow-lg"
                onTakeBite={handleSprinkleShower}
              />
            </div>

            {/* Quick interactive action bar underneath 3D canvas */}
            <div className="mt-4 flex items-center justify-between gap-3 bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-[#E5DACB]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#241D17]">
                  {scoopCount} {scoopCount === 1 ? 'Scoop' : 'Scoops'} · {vesselObj.name.split(' ')[0]}
                </span>
                <span className="text-xs text-[#7C6E61]">
                  ({selectedSauces.length + selectedToppings.length} toppings)
                </span>
              </div>

              <button
                onClick={handleSprinkleShower}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#8B3B18] bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C86438]" />
                <span>Shower Sprinkles</span>
              </button>
            </div>
          </div>

          {/* Right Column: Customizer Controls */}
          <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between overflow-y-auto space-y-6">
            {/* Step Selection Tabs */}
            <div className="flex items-center gap-1 p-1 bg-[#EFE6D8] rounded-xl">
              <button
                onClick={() => setActiveStepTab('scoops')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeStepTab === 'scoops'
                    ? 'bg-white text-[#241D17] shadow-xs'
                    : 'text-[#7C6E61] hover:text-[#241D17]'
                }`}
              >
                1. Flavors
              </button>
              <button
                onClick={() => setActiveStepTab('vessel')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeStepTab === 'vessel'
                    ? 'bg-white text-[#241D17] shadow-xs'
                    : 'text-[#7C6E61] hover:text-[#241D17]'
                }`}
              >
                2. Vessel
              </button>
              <button
                onClick={() => setActiveStepTab('toppings')}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeStepTab === 'toppings'
                    ? 'bg-white text-[#241D17] shadow-xs'
                    : 'text-[#7C6E61] hover:text-[#241D17]'
                }`}
              >
                3. Toppings
              </button>
            </div>

            {/* TAB 1: SCOOPS & FLAVORS */}
            {activeStepTab === 'scoops' && (
              <div className="space-y-5">
                {/* Scoop Count Selector */}
                <div>
                  <label className="text-xs font-semibold text-[#241D17] block mb-2">
                    How many scoops would you like?
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {([1, 2, 3] as const).map((cnt) => (
                      <button
                        key={cnt}
                        onClick={() => setScoopCount(cnt)}
                        className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                          scoopCount === cnt
                            ? 'bg-[#241D17] text-white border-[#241D17] shadow-xs'
                            : 'bg-white border-[#E0D5C5] text-[#5E5145] hover:border-[#C8BAA7]'
                        }`}
                      >
                        {cnt === 1 ? 'Single' : cnt === 2 ? 'Double' : 'Triple'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scoop 1 Flavor Selector */}
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-[#241D17]">
                    Base Scoop Flavor:
                  </span>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                    {FLAVORS.map((f) => {
                      const isSelected = scoop1.id === f.id;
                      return (
                        <button
                          key={f.id}
                          onClick={() => setScoop1(f)}
                          className={`flex items-center gap-2 p-2 rounded-xl text-left border transition-all text-xs ${
                            isSelected
                              ? 'bg-white border-[#C86438] ring-1 ring-[#C86438] shadow-xs'
                              : 'bg-white/80 border-[#E8DEC8] hover:bg-white text-[#5E5145]'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                            style={{ backgroundColor: f.colorHex }}
                          />
                          <span className="truncate font-medium">{f.name.split(' ')[0]} {f.name.split(' ')[1] || ''}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Scoop 2 Flavor Selector (if >= 2) */}
                {scoopCount >= 2 && (
                  <div className="space-y-1.5 pt-2 border-t border-[#E8DEC8]">
                    <span className="text-xs font-semibold text-[#241D17]">
                      Second Scoop Flavor:
                    </span>
                    <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                      {FLAVORS.map((f) => {
                        const isSelected = scoop2.id === f.id;
                        return (
                          <button
                            key={f.id}
                            onClick={() => setScoop2(f)}
                            className={`flex items-center gap-2 p-2 rounded-xl text-left border transition-all text-xs ${
                              isSelected
                                ? 'bg-white border-[#C86438] ring-1 ring-[#C86438] shadow-xs'
                                : 'bg-white/80 border-[#E8DEC8] hover:bg-white text-[#5E5145]'
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                              style={{ backgroundColor: f.colorHex }}
                            />
                            <span className="truncate font-medium">{f.name.split(' ')[0]} {f.name.split(' ')[1] || ''}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Scoop 3 Flavor Selector (if == 3) */}
                {scoopCount === 3 && (
                  <div className="space-y-1.5 pt-2 border-t border-[#E8DEC8]">
                    <span className="text-xs font-semibold text-[#241D17]">
                      Top Crown Scoop Flavor:
                    </span>
                    <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto pr-1">
                      {FLAVORS.map((f) => {
                        const isSelected = scoop3.id === f.id;
                        return (
                          <button
                            key={f.id}
                            onClick={() => setScoop3(f)}
                            className={`flex items-center gap-2 p-2 rounded-xl text-left border transition-all text-xs ${
                              isSelected
                                ? 'bg-white border-[#C86438] ring-1 ring-[#C86438] shadow-xs'
                                : 'bg-white/80 border-[#E8DEC8] hover:bg-white text-[#5E5145]'
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                              style={{ backgroundColor: f.colorHex }}
                            />
                            <span className="truncate font-medium">{f.name.split(' ')[0]} {f.name.split(' ')[1] || ''}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: VESSEL SELECTION */}
            {activeStepTab === 'vessel' && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-[#241D17] block">
                  Select Base Vessel:
                </label>
                <div className="space-y-2.5">
                  {VESSELS.map((v) => {
                    const isSelected = selectedVessel === v.id;
                    return (
                      <div
                        key={v.id}
                        onClick={() => setSelectedVessel(v.id)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-white border-[#C86438] ring-1 ring-[#C86438] shadow-xs'
                            : 'bg-white/70 border-[#E8DEC8] hover:bg-white hover:border-[#D6C7B2]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-[#241D17]">{v.name}</span>
                          <span className="text-xs font-mono font-semibold text-[#C86438] tabular-nums">
                            {v.price > 0 ? `+$${v.price.toFixed(2)}` : 'Included'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#7C6E61] mt-1 leading-snug">
                          {v.subtitle}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: TOPPINGS & DRIZZLES */}
            {activeStepTab === 'toppings' && (
              <div className="space-y-4">
                {/* Sauces */}
                <div>
                  <span className="text-xs font-semibold text-[#241D17] block mb-2">
                    Warm Sauces &amp; Glazes (Rendered in 3D):
                  </span>
                  <div className="space-y-2">
                    {TOPPINGS.filter((t) => t.category === 'sauce').map((sauce) => {
                      const isAdded = selectedSauces.some((s) => s.id === sauce.id);
                      return (
                        <button
                          key={sauce.id}
                          onClick={() => toggleSauce(sauce)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all ${
                            isAdded
                              ? 'bg-white border-[#C86438] ring-1 ring-[#C86438] shadow-xs'
                              : 'bg-white/70 border-[#E8DEC8] hover:bg-white text-[#5E5145]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-3.5 h-3.5 rounded-full shrink-0"
                              style={{ backgroundColor: sauce.color }}
                            />
                            <span className="font-medium text-[#241D17]">{sauce.name}</span>
                          </div>
                          <span className="font-mono text-[#C86438] tabular-nums">
                            {isAdded ? 'Selected (+$' + sauce.price.toFixed(2) + ')' : '+$' + sauce.price.toFixed(2)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Crunches & Fresh */}
                <div className="pt-2 border-t border-[#E8DEC8]">
                  <span className="text-xs font-semibold text-[#241D17] block mb-2">
                    Artisan Crunches &amp; Fresh Toppings:
                  </span>
                  <div className="space-y-2">
                    {TOPPINGS.filter((t) => t.category !== 'sauce').map((topping) => {
                      const isAdded = selectedToppings.some((t) => t.id === topping.id);
                      return (
                        <button
                          key={topping.id}
                          onClick={() => toggleTopping(topping)}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition-all ${
                            isAdded
                              ? 'bg-white border-[#8EA66E] ring-1 ring-[#8EA66E] shadow-xs'
                              : 'bg-white/70 border-[#E8DEC8] hover:bg-white text-[#5E5145]'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-3.5 h-3.5 rounded-full shrink-0"
                              style={{ backgroundColor: topping.color }}
                            />
                            <span className="font-medium text-[#241D17]">{topping.name}</span>
                          </div>
                          <span className="font-mono text-[#5E783B] tabular-nums">
                            {isAdded ? 'Selected (+$' + topping.price.toFixed(2) + ')' : '+$' + topping.price.toFixed(2)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Checkout CTA Module */}
            <div className="pt-4 border-t border-[#E8DEC8] space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#5E5145]">Calculated Total:</span>
                <span className="text-xl font-bold font-serif text-[#241D17] font-mono tabular-nums">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddCreationToCart}
                  disabled={isSuccessPuff}
                  className="flex-1 py-3 px-4 text-xs font-semibold text-white bg-[#241D17] hover:bg-[#3D3228] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <Sparkles className="w-4 h-4 text-[#F3C398]" />
                  <span>{isSuccessPuff ? 'Added to Bag!' : 'Add Custom Creation to Bag'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
