import React from 'react';
import farmImg from '../assets/images/story_farm_creamery_1791181771816.jpg';
import ingredientsImg from '../assets/images/craft_ingredients_showcase_1791181750247.jpg';
import waffleImg from '../assets/images/waffle_cone_fresh_craft_1791181760690.jpg';
import { Sparkles, Compass, ShieldCheck } from 'lucide-react';

export const CraftStorySection: React.FC = () => {
  return (
    <section id="craft" className="py-20 md:py-28 bg-[#F5EFE4] border-y border-[#E8DEC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#8B3B18] uppercase tracking-wider">
            <span>Philosophy &amp; Provenance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#241D17] tracking-tight text-balance">
            Slow churned, dense by nature, free of artificial air.
          </h2>
          <p className="text-base sm:text-lg text-[#5E5145] leading-relaxed">
            Industrial ice cream whips 50% to 100% air into dairy to inflate cartons. We churn slowly in micro 4-gallon batches at -7°C with only 26% natural overrun, delivering an incomparably dense, velvety mouthfeel that melts cleanly across your palate.
          </p>
        </div>

        {/* 3 Pillars Bento / Editorial Story Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pillar 1: Dairy */}
          <div className="bg-white rounded-3xl overflow-hidden border border-[#E8DEC8] shadow-xs flex flex-col group hover:shadow-md transition-all">
            <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
              <img
                src={farmImg}
                alt="High alpine pasture meadow at dawn with heritage Jersey cows"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-4 text-xs font-semibold text-white drop-shadow-xs">
                Alpine Pasture Herd
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs text-[#7C6E61]">Pillar 01 · Raw Dairy</span>
                <h3 className="text-xl font-serif font-bold text-[#241D17] mt-1">
                  100% Grass-Fed Jersey Milk
                </h3>
                <p className="text-xs text-[#5E5145] leading-relaxed mt-2.5">
                  Jersey cows produce naturally richer butterfat (5.4%) and A2 beta-casein proteins. We source raw milk within 40 miles of our creamery and pasteurize on-site at lower temperatures to preserve sweet floral notes.
                </p>
              </div>
              <div className="pt-3 border-t border-[#F0E8DC] text-[11px] text-[#7C6E61] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#8EA66E]" />
                <span>Valley Springs Pastures (Single Origin)</span>
              </div>
            </div>
          </div>

          {/* Pillar 2: Ingredients */}
          <div className="bg-white rounded-3xl overflow-hidden border border-[#E8DEC8] shadow-xs flex flex-col group hover:shadow-md transition-all">
            <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
              <img
                src={ingredientsImg}
                alt="Flatlay of single-origin cocoa, Bronte pistachios, and bourbon vanilla"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-4 text-xs font-semibold text-white drop-shadow-xs">
                Zero Flavor Pastes or Syrups
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs text-[#7C6E61]">Pillar 02 · Ingredients</span>
                <h3 className="text-xl font-serif font-bold text-[#241D17] mt-1">
                  Single-Estate Extracts &amp; Nuts
                </h3>
                <p className="text-xs text-[#5E5145] leading-relaxed mt-2.5">
                  We refuse artificial flavor pastes. Our pistachios bear the Bronte DOP seal from Mount Etna, our vanilla beans come from Madagascar cured in the sun, and our cocoa is single-estate Sur del Lago criollo.
                </p>
              </div>
              <div className="pt-3 border-t border-[#F0E8DC] text-[11px] text-[#7C6E61] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8EA66E]" />
                <span>Certified Protected Designation of Origin</span>
              </div>
            </div>
          </div>

          {/* Pillar 3: Waffle Cones */}
          <div className="bg-white rounded-3xl overflow-hidden border border-[#E8DEC8] shadow-xs flex flex-col group hover:shadow-md transition-all">
            <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
              <img
                src={waffleImg}
                alt="Hand-rolled golden waffle cones freshly baked beside melted dark chocolate"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-4 text-xs font-semibold text-white drop-shadow-xs">
                Fresh Every 45 Minutes
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs text-[#7C6E61]">Pillar 03 · Bakery</span>
                <h3 className="text-xl font-serif font-bold text-[#241D17] mt-1">
                  Hand-Rolled Vanilla Waffle Cones
                </h3>
                <p className="text-xs text-[#5E5145] leading-relaxed mt-2.5">
                  A great scoop deserves a fresh vessel. Our pastry team presses thin waffle batter on Belgian brass irons every 45 minutes, hand-shaping them while still glowing warm with cultured butter and brown sugar.
                </p>
              </div>
              <div className="pt-3 border-t border-[#F0E8DC] text-[11px] text-[#7C6E61] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C86438]" />
                <span>Baked In-Shop All Day</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
