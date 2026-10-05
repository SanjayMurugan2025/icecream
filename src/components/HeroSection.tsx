import React, { useState } from 'react';
import { FLAVORS, TOPPINGS } from '../data/flavors';
import { Flavor } from '../types/creamery';
import { ThreeIceCreamViewer } from './ThreeIceCreamViewer';
import { ThreeHeroCanvas } from './ThreeHeroCanvas';
import { Sparkles, ArrowRight, RotateCw, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HeroSectionProps {
  onOpenStudioWithFlavor: (flavor: Flavor) => void;
  onQuickAdd: (flavor: Flavor) => void;
  onExploreMenu: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenStudioWithFlavor,
  onQuickAdd,
  onExploreMenu,
}) => {
  const featuredFlavors = FLAVORS.filter((f) => f.featured);
  const [selectedHeroFlavor, setSelectedHeroFlavor] = useState<Flavor>(featuredFlavors[0] || FLAVORS[0]);
  const [biteCount, setBiteCount] = useState(0);

  const handleHeroBite = () => {
    setBiteCount((prev) => prev + 1);
    confetti({
      particleCount: 28,
      spread: 60,
      origin: { y: 0.65 },
      colors: [selectedHeroFlavor.colorHex, '#E88B69', '#FFECCC', '#D89E62'],
    });
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 border-b border-[#EAE2D5]">
      {/* 3D Floating Particle Background */}
      <ThreeHeroCanvas />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#8B3B18] tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-[#C86438] animate-ping" />
              <span>Small-Batch Italian Slow Churn</span>
              <span aria-hidden="true">·</span>
              <span>Daily Fresh Waffle Cones</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#241D17] leading-[1.08] tracking-tight text-balance">
              Artisan scoops, churned with passion &amp; rendered in 3D.
            </h1>

            <p className="text-base sm:text-lg text-[#5E5145] leading-relaxed max-w-xl">
              Experience the creamy texture of grass-fed Jersey milk, single-origin Venezuelan cocoa, and Etna pistachios before your first spoon. Inspect our craft in real-time 3D, customize your cone, and order for express counter pickup or dry-ice delivery.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onOpenStudioWithFlavor(selectedHeroFlavor)}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-[#241D17] hover:bg-[#3D3228] rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 group whitespace-nowrap hover:scale-102"
              >
                <Sparkles className="w-4 h-4 text-[#F3C398] group-hover:rotate-12 transition-transform" />
                <span>Customize in 3D Studio</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreMenu}
                className="px-6 py-3.5 text-sm font-semibold text-[#241D17] bg-white hover:bg-[#F8F2E8] border border-[#DDD0BF] rounded-xl shadow-xs transition-all whitespace-nowrap"
              >
                Browse Menu ({FLAVORS.length} Flavors)
              </button>
            </div>

            {/* Quick Hero Flavor Selector Pills */}
            <div className="pt-4 border-t border-[#EAE2D5]/80">
              <p className="text-xs font-medium text-[#7C6E61] mb-2.5">
                Featured 3D Showcases (Click to Switch):
              </p>
              <div className="flex flex-wrap gap-2">
                {featuredFlavors.map((flavor) => {
                  const isSelected = selectedHeroFlavor.id === flavor.id;
                  return (
                    <button
                      key={flavor.id}
                      onClick={() => setSelectedHeroFlavor(flavor)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[#241D17] text-white shadow-xs'
                          : 'bg-white/80 hover:bg-white text-[#5E5145] border border-[#E5DACB]'
                      }`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: flavor.colorHex }}
                      />
                      <span className="truncate max-w-[140px]">{flavor.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive Ice Cream Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Backing Ambient Halo */}
              <div
                className="absolute inset-0 rounded-3xl blur-3xl opacity-35 transition-colors duration-700"
                style={{ backgroundColor: selectedHeroFlavor.colorHex }}
              />

              {/* 3D Viewer Container */}
              <div className="relative bg-[#FAF7F2]/80 backdrop-blur-sm p-4 sm:p-6 rounded-3xl border border-[#E8DEC8] shadow-xl">
                <div className="aspect-[4/4.2] sm:aspect-[4/3.8] w-full">
                  <ThreeIceCreamViewer
                    primaryFlavor={selectedHeroFlavor}
                    scoopCount={1}
                    vessel="waffle-cone"
                    sauces={[]}
                    toppings={TOPPINGS.filter((t) => t.id === 'roasted-bronte-pistachios')}
                    interactive={true}
                    className="w-full h-full shadow-inner"
                    onTakeBite={handleHeroBite}
                  />
                </div>

                {/* Card footer details & quick order bar */}
                <div className="mt-4 pt-3 border-t border-[#EAE2D5] flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-serif font-bold text-[#241D17] flex items-center gap-2">
                      <span>{selectedHeroFlavor.name}</span>
                    </h3>
                    <p className="text-xs text-[#7C6E61] truncate max-w-xs">
                      {selectedHeroFlavor.origin} · ${selectedHeroFlavor.priceScoop.toFixed(2)} single scoop
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onQuickAdd(selectedHeroFlavor)}
                      className="px-4 py-2 text-xs font-semibold text-white bg-[#C86438] hover:bg-[#B35227] rounded-xl shadow-xs transition-all whitespace-nowrap active:scale-95"
                    >
                      Quick Add Scoop
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Claim-to-Proof Adjacency Strip */}
        <div className="mt-14 pt-8 border-t border-[#E8DEC8] grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#241D17] font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4 text-[#8EA66E] shrink-0" />
              <span>100% Jersey Cream</span>
            </div>
            <p className="text-xs text-[#7C6E61]">
              Single-herd grass-fed pasture milk from High Alpine Valley farms.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#241D17] font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4 text-[#8EA66E] shrink-0" />
              <span>Slow-Churned Daily</span>
            </div>
            <p className="text-xs text-[#7C6E61]">
              Micro 4-gallon Italian horizontal batch freezers with 28% overrun.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#241D17] font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4 text-[#8EA66E] shrink-0" />
              <span>45-Min Waffle Bake</span>
            </div>
            <p className="text-xs text-[#7C6E61]">
              Cones hand-rolled fresh on brass irons with real brown butter.
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#241D17] font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4 text-[#8EA66E] shrink-0" />
              <span>Dry-Ice Pack Guarantee</span>
            </div>
            <p className="text-xs text-[#7C6E61]">
              Orders stay frozen solid at -18°C for up to 6 hours during delivery.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
