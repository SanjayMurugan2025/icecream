import React from 'react';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { CartItem } from '../types/creamery';

interface NavbarProps {
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenStudio: () => void;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cart,
  onOpenCart,
  onOpenStudio,
  onNavigate,
}) => {
  const totalItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EAE2D5] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-2xl font-serif font-bold tracking-tight text-[#241D17] hover:text-[#C86438] transition-colors whitespace-nowrap"
        >
          Melt &amp; Churn
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5E5145]">
          <button
            onClick={() => onNavigate('menu')}
            className="hover:text-[#241D17] transition-colors whitespace-nowrap"
          >
            Flavors
          </button>
          <button
            onClick={() => onNavigate('studio')}
            className="hover:text-[#241D17] transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <span>3D Studio</span>
          </button>
          <button
            onClick={() => onNavigate('craft')}
            className="hover:text-[#241D17] transition-colors whitespace-nowrap"
          >
            Our Craft
          </button>
          <button
            onClick={() => onNavigate('locations')}
            className="hover:text-[#241D17] transition-colors whitespace-nowrap"
          >
            Shops
          </button>
          <button
            onClick={() => onNavigate('story')}
            className="hover:text-[#241D17] transition-colors whitespace-nowrap"
          >
            Story
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenStudio}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#8B3B18] bg-[#F7EBE4] hover:bg-[#F3DDD2] border border-[#E9C5B2] rounded-xl transition-all whitespace-nowrap shadow-xs hover:scale-102"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C86438]" />
            <span>Customize Scoop</span>
          </button>

          <button
            onClick={onOpenCart}
            aria-label={`Shopping bag with ${totalItemCount} items`}
            className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#241D17] hover:bg-[#3D3228] rounded-xl transition-all shadow-xs hover:scale-102 whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4 text-[#F3ECE1]" />
            <span className="hidden sm:inline">Bag</span>
            <span className="bg-[#C86438] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center tabular-nums">
              {totalItemCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
