import React from 'react';
import { STORES } from '../data/flavors';
import { StoreLocation } from '../types/creamery';
import storeImg from '../assets/images/hero_artisan_gelateria_1791181737436.jpg';
import { MapPin, Clock, Phone, User, ArrowRight } from 'lucide-react';

interface LocationsSectionProps {
  onSelectStoreForOrder: (storeId: string) => void;
}

export const LocationsSection: React.FC<LocationsSectionProps> = ({
  onSelectStoreForOrder,
}) => {
  return (
    <section id="locations" className="py-20 md:py-28 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#E8DEC8]">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-semibold text-[#8B3B18] uppercase tracking-wider">
              Visit Us in Person
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#241D17]">
              Our Scoop Parlors &amp; Micro-Laboratories
            </h2>
            <p className="text-sm sm:text-base text-[#5E5145]">
              Watch our gelatieri spin the daily batches behind glass windows, enjoy fresh waffle cones, or pick up online orders directly from the express insulated counter.
            </p>
          </div>

          <div className="text-xs text-[#7C6E61]">
            <span>Fast In-Store Pickup: Ready in under 12 minutes</span>
          </div>
        </div>

        {/* Store Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {STORES.map((store, idx) => (
            <div
              key={store.id}
              className="bg-white rounded-3xl border border-[#E8DEC8] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              {idx === 0 && (
                <div className="relative aspect-[16/9] w-full bg-stone-200 overflow-hidden">
                  <img
                    src={storeImg}
                    alt="Downtown Flagship Gelateria interior with warm terrazzo counter"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-[#241D17]/85 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
                    Flagship &amp; Roastery
                  </div>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-[#8B3B18]">
                      {store.neighborhood}
                    </span>
                    <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                      {store.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-[#241D17]">
                    {store.name}
                  </h3>

                  <div className="mt-4 space-y-2 text-xs text-[#5E5145]">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#C86438] shrink-0 mt-0.5" />
                      <span>{store.address}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-[#7C6E61] shrink-0" />
                      <span>{store.hours}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#7C6E61] shrink-0" />
                      <span>{store.phone}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-[#F0E8DC] text-[11px] text-[#7C6E61]">
                      <User className="w-3.5 h-3.5 text-[#8EA66E] shrink-0" />
                      <span>Head Scooper: {store.scoopMasterToday}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#F0E8DC] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#7C6E61]">
                    Queue: {store.currentWaitTime}
                  </span>

                  <button
                    onClick={() => onSelectStoreForOrder(store.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#241D17] hover:bg-[#3D3228] rounded-xl transition-all"
                  >
                    <span>Order Here</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
