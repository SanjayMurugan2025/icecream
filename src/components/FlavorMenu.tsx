import React, { useState, useMemo } from 'react';
import { FLAVORS } from '../data/flavors';
import { Flavor, FlavorCategory, DietaryTag } from '../types/creamery';
import { Search, Sparkles, Plus, Eye, Check, X } from 'lucide-react';

interface FlavorMenuProps {
  onSelectFlavorFor3D: (flavor: Flavor) => void;
  onAddScoopToCart: (flavor: Flavor) => void;
  onAddPintToCart: (flavor: Flavor) => void;
}

export const FlavorMenu: React.FC<FlavorMenuProps> = ({
  onSelectFlavorFor3D,
  onAddScoopToCart,
  onAddPintToCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<FlavorCategory>('all');
  const [selectedDietary, setSelectedDietary] = useState<DietaryTag[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const categories: { id: FlavorCategory; label: string }[] = [
    { id: 'all', label: 'All Creations' },
    { id: 'classic', label: 'Classic Craft' },
    { id: 'botanical', label: 'Botanical & Citrus' },
    { id: 'chocolate', label: 'Decadent Cocoa' },
    { id: 'sorbetto', label: 'Sorbetto (Dairy-Free)' },
    { id: 'seasonal', label: 'Seasonal Batches' },
  ];

  const dietaryOptions: { id: DietaryTag; label: string }[] = [
    { id: 'vegan', label: 'Vegan / Plant-Based' },
    { id: 'gluten-free', label: 'Gluten-Free' },
    { id: 'nut-free', label: 'Nut-Free' },
  ];

  const toggleDietary = (tag: DietaryTag) => {
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredFlavors = useMemo(() => {
    return FLAVORS.filter((flavor) => {
      // Category filter
      if (selectedCategory !== 'all' && flavor.category !== selectedCategory) {
        return false;
      }
      // Dietary filter
      if (selectedDietary.length > 0) {
        const matchesAll = selectedDietary.every((tag) => flavor.dietary.includes(tag));
        if (!matchesAll) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = flavor.name.toLowerCase().includes(q);
        const matchesDesc = flavor.description.toLowerCase().includes(q);
        const matchesOrigin = flavor.origin.toLowerCase().includes(q);
        const matchesIngredients = flavor.ingredients.some((ing) => ing.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesOrigin && !matchesIngredients) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, selectedDietary, searchQuery]);

  const handleAddScoop = (flavor: Flavor) => {
    onAddScoopToCart(flavor);
    setRecentlyAddedId(flavor.id + '-scoop');
    setTimeout(() => setRecentlyAddedId(null), 1200);
  };

  const handleAddPint = (flavor: Flavor) => {
    onAddPintToCart(flavor);
    setRecentlyAddedId(flavor.id + '-pint');
    setTimeout(() => setRecentlyAddedId(null), 1200);
  };

  return (
    <section id="menu" className="py-16 md:py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#E8DEC8]">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-semibold text-[#8B3B18] uppercase tracking-wider">
              The Churn Room Catalog
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#241D17] tracking-tight">
              Interactive Flavor Menu
            </h2>
            <p className="text-sm sm:text-base text-[#5E5145] leading-relaxed">
              Every recipe is spun fresh each morning in 4-gallon batches. Click 3D Preview on any scoop to examine its churned texture, roasted particles, and tasting profile.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7E71]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by flavor, nut, berry..."
              className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#DDD0BF] rounded-xl text-sm text-[#241D17] placeholder:text-[#9A8D80] focus:outline-hidden focus:ring-2 focus:ring-[#C86438]/30 focus:border-[#C86438] transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="space-y-4 mb-10">
          {/* Category Tabs (Segmented Control per Section 1.A) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#241D17] text-white shadow-xs'
                      : 'bg-[#F2ECE1] text-[#5E5145] hover:bg-[#E8DEC8] hover:text-[#241D17]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Dietary Checkboxes & Counter */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#7C6E61] mr-1">Dietary Filter:</span>
              {dietaryOptions.map((diet) => {
                const isChecked = selectedDietary.includes(diet.id);
                return (
                  <button
                    key={diet.id}
                    onClick={() => toggleDietary(diet.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg transition-colors cursor-pointer border ${
                      isChecked
                        ? 'bg-[#8EA66E]/15 border-[#789158] text-[#3E5224] font-semibold'
                        : 'bg-white border-[#E0D5C5] text-[#5E5145] hover:border-[#C8BAA7]'
                    }`}
                  >
                    {isChecked ? <Check className="w-3 h-3 text-[#506D2D]" /> : null}
                    <span>{diet.label}</span>
                  </button>
                );
              })}
              {selectedDietary.length > 0 && (
                <button
                  onClick={() => setSelectedDietary([])}
                  className="text-xs text-[#C86438] hover:underline ml-1"
                >
                  Reset
                </button>
              )}
            </div>

            <p className="text-xs text-[#7C6E61] font-mono tabular-nums">
              Showing {filteredFlavors.length} of {FLAVORS.length} flavors
            </p>
          </div>
        </div>

        {/* Empty State */}
        {filteredFlavors.length === 0 && (
          <div className="text-center py-16 bg-[#F5EFE4] rounded-2xl border border-dashed border-[#DDD0BF]">
            <p className="text-base font-serif text-[#241D17] mb-1">No churned flavors match your filter</p>
            <p className="text-xs text-[#7C6E61] mb-4">Try clearing dietary filters or searching for another ingredient.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedDietary([]);
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#241D17] rounded-xl hover:bg-[#3D3228]"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* 3-Column Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredFlavors.map((flavor) => {
            const isScoopJustAdded = recentlyAddedId === flavor.id + '-scoop';
            const isPintJustAdded = recentlyAddedId === flavor.id + '-pint';

            return (
              <div
                key={flavor.id}
                className="group relative flex flex-col justify-between bg-white rounded-2xl border border-[#E8DEC8] hover:border-[#D1BFAB] shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Top Visual Swatch Banner & 3D Interactive trigger */}
                <div
                  className="relative h-44 sm:h-48 w-full p-4 flex flex-col justify-between overflow-hidden cursor-pointer"
                  style={{
                    background: `radial-gradient(circle at 60% 40%, ${flavor.colorHex}ee, ${flavor.secondaryColorHex})`,
                  }}
                  onClick={() => onSelectFlavorFor3D(flavor)}
                >
                  {/* Subtle swirl art overlay */}
                  <div
                    className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none"
                    style={{
                      backgroundImage: `radial-gradient(${flavor.colorHex} 2px, transparent 2px)`,
                      backgroundSize: '16px 16px',
                    }}
                  />

                  {/* Clean unboxed category label */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[11px] font-medium tracking-wider uppercase text-white/90 drop-shadow-xs">
                      {flavor.category.toUpperCase()}
                    </span>

                    {flavor.seasonalBadge && (
                      <span className="text-[11px] font-semibold text-amber-950 bg-amber-200/90 backdrop-blur-xs px-2 py-0.5 rounded-md">
                        {flavor.seasonalBadge}
                      </span>
                    )}
                  </div>

                  {/* 3D Inspect Cue Center Bubble */}
                  <div className="relative z-10 self-center my-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectFlavorFor3D(flavor);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-stone-900 rounded-full shadow-md text-xs font-semibold backdrop-blur-sm transform transition-all group-hover:scale-105"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#C86438]" />
                      <span>Launch 3D Studio</span>
                    </button>
                  </div>

                  {/* Origin watermark bottom left */}
                  <div className="relative z-10 text-[11px] text-white/80 font-medium truncate drop-shadow-xs">
                    {flavor.origin}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Unboxed metadata line per Section 1.A */}
                    <div className="flex items-center gap-1.5 text-xs text-[#7C6E61] mb-1.5 flex-wrap">
                      <span>{flavor.italianName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">${flavor.priceScoop.toFixed(2)} scoop</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">${flavor.pricePint.toFixed(2)} pint</span>
                    </div>

                    <h3 className="text-xl font-serif font-bold text-[#241D17] group-hover:text-[#C86438] transition-colors">
                      {flavor.name}
                    </h3>

                    <p className="text-xs text-[#5E5145] leading-relaxed mt-2 line-clamp-3">
                      {flavor.description}
                    </p>
                  </div>

                  {/* Flavor Taste Meter & Dietary Info */}
                  <div className="space-y-2.5 pt-3 border-t border-[#F0E8DC]">
                    {/* Sweetness & Richness Scales */}
                    <div className="grid grid-cols-2 gap-3 text-[11px] text-[#7C6E61]">
                      <div className="flex items-center justify-between">
                        <span>Sweetness:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((dot) => (
                            <span
                              key={dot}
                              className={`w-1.5 h-1.5 rounded-full ${
                                dot <= flavor.sweetness ? 'bg-[#C86438]' : 'bg-[#E5DACB]'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span>Richness:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((dot) => (
                            <span
                              key={dot}
                              className={`w-1.5 h-1.5 rounded-full ${
                                dot <= flavor.richness ? 'bg-[#8EA66E]' : 'bg-[#E5DACB]'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Unboxed dietary indicators */}
                    <div className="flex items-center gap-2 text-[11px] text-[#8C7E71] flex-wrap">
                      {flavor.dietary.map((tag, idx) => (
                        <React.Fragment key={tag}>
                          {idx > 0 && <span aria-hidden="true">/</span>}
                          <span className="capitalize">{tag.replace('-', ' ')}</span>
                        </React.Fragment>
                      ))}
                      {flavor.allergens.length > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-[#A16246]">Contains {flavor.allergens.join(', ')}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => handleAddScoop(flavor)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl transition-all ${
                        isScoopJustAdded
                          ? 'bg-[#8EA66E] text-white'
                          : 'bg-[#FAF5EC] hover:bg-[#F3E8D8] text-[#241D17] border border-[#DDD0BF]'
                      }`}
                    >
                      {isScoopJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-[#C86438]" />
                          <span>Add Scoop</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleAddPint(flavor)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl transition-all ${
                        isPintJustAdded
                          ? 'bg-[#8EA66E] text-white'
                          : 'bg-[#241D17] hover:bg-[#3D3228] text-white'
                      }`}
                    >
                      {isPintJustAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Pint Added!</span>
                        </>
                      ) : (
                        <span>Take-Home Pint</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
