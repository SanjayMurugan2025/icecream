import React, { useState } from 'react';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-[#211A15] text-[#D8CEBF] pt-16 pb-12 border-t border-[#3A3027]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Row: Brand & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-[#3A3027]">
          <div className="md:col-span-5 space-y-4">
            <h3 className="text-2xl font-serif font-bold text-white tracking-tight">
              Melt &amp; Churn Artisan Creamery
            </h3>
            <p className="text-xs text-[#A69989] leading-relaxed max-w-sm">
              Slow-churned Italian gelato and American craft ice cream spun daily from 100% pasture-raised Jersey milk. Inspected in real-time 3D, delivered in dry ice.
            </p>
            <div className="text-xs text-[#8C7E6F] space-y-1">
              <p>Daily Parlor Hours: 11:00 AM – 11:00 PM</p>
              <p>Certified Organic &amp; Non-GMO Dairy Partner</p>
            </div>
          </div>

          {/* Secret Flavor Club */}
          <div className="md:col-span-7 bg-[#2B221B] p-6 rounded-3xl border border-[#42362C] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#F3C398] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Secret Batch Society</span>
              </div>
              <h4 className="text-lg font-serif font-bold text-white">
                Be the first to taste our limited Friday experimental batches.
              </h4>
              <p className="text-xs text-[#A69989] mt-1">
                Subscribers receive 48-hour early access to seasonal pints before our parlor batch runs out.
              </p>
            </div>

            {subscribed ? (
              <p className="text-xs font-medium text-emerald-400 bg-emerald-950/60 p-3 rounded-xl border border-emerald-800/40">
                Grazie! You are on the VIP tasting list for our upcoming releases.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for tasting invites"
                  className="flex-1 px-4 py-2.5 bg-[#1C1612] border border-[#4A3D32] rounded-xl text-xs text-white placeholder:text-[#7A6B5C] focus:outline-hidden focus:border-[#C86438]"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#C86438] hover:bg-[#B35227] rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <span>Join List</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Middle Row: Quick Navigation & Allergen Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs text-[#A69989]">
          <div>
            <h5 className="font-semibold text-white mb-2.5">Menu Collections</h5>
            <ul className="space-y-1.5">
              <li><a href="#menu" className="hover:text-white transition-colors">Sicilian Pistachio &amp; Nuts</a></li>
              <li><a href="#menu" className="hover:text-white transition-colors">Single-Origin Chocolates</a></li>
              <li><a href="#menu" className="hover:text-white transition-colors">Botanical &amp; Floral Creams</a></li>
              <li><a href="#menu" className="hover:text-white transition-colors">Dairy-Free Sorbetti</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-2.5">Parlor Locations</h5>
            <ul className="space-y-1.5">
              <li><a href="#locations" className="hover:text-white transition-colors">Downtown Heritage Flagship</a></li>
              <li><a href="#locations" className="hover:text-white transition-colors">Coastal Promenade Pavilion</a></li>
              <li><a href="#locations" className="hover:text-white transition-colors">Botanical Gardens Kiosk</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-2.5">Dietary &amp; Sourcing</h5>
            <ul className="space-y-1.5">
              <li><span className="text-[#8C7E6F]">100% Certified Nut Separation Area</span></li>
              <li><span className="text-[#8C7E6F]">Egg-Free Sorbetti Available</span></li>
              <li><span className="text-[#8C7E6F]">Biodegradable Plant Straws &amp; Cups</span></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-white mb-2.5">Craft Guarantee</h5>
            <p className="text-[11px] leading-relaxed text-[#8C7E6F]">
              If your delivery does not arrive frozen solid or your cone cracks in transit, we will immediately re-deliver or refund with zero hassle.
            </p>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-6 border-t border-[#30261E] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A6B5C]">
          <p>© {new Date().getFullYear()} Melt &amp; Churn Artisan Creamery LLC. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Churned with love &amp; real butterfat</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
