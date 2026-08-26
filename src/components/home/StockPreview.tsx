import React, { useState } from 'react';
import { ArrowRight, Flame, Sparkles, Smartphone, Watch, Tablet, Laptop, Headphones, Tag } from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { PhoneCard } from '../stock/PhoneCard';

export const StockPreview: React.FC = () => {
  const { availablePhones, setActiveView, setFilters } = useInventory();
  const [selectedTab, setSelectedTab] = useState<string>('All');

  const filterTabs = [
    { id: 'All', label: 'All Stock', icon: Tag },
    { id: 'Phones', label: 'Phones', icon: Smartphone },
    { id: 'Watches', label: 'Watches', icon: Watch },
    { id: 'Tablets', label: 'Tablets', icon: Tablet },
    { id: 'Laptops', label: 'Laptops', icon: Laptop },
    { id: 'Accessories', label: 'Accessories', icon: Headphones },
    { id: 'PriceDrop', label: '🔥 Price Drops', icon: Flame },
  ];

  const displayedPhones = availablePhones
    .filter(phone => {
      if (selectedTab === 'All') return true;
      if (selectedTab === 'PriceDrop') return phone.priceDrop;
      return (phone.category || 'Phones') === selectedTab;
    })
    .slice(0, 6);

  const handleViewAll = () => {
    if (selectedTab === 'PriceDrop') {
      setFilters(prev => ({ ...prev, onlyPriceDrop: true, category: 'All' }));
    } else if (selectedTab !== 'All') {
      setFilters(prev => ({ ...prev, category: selectedTab, onlyPriceDrop: false }));
    } else {
      setFilters(prev => ({ ...prev, category: 'All', onlyPriceDrop: false }));
    }
    setActiveView('stock');
  };

  return (
    <section className="py-16 bg-slate-50 text-slate-900 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-700 font-mono">
              Live Store Floor Stock
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Featured Verified Devices & Gadgets
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Check our currently available pre-owned gadgets before visiting or reserving on WhatsApp.
            </p>
          </div>

          <button
            onClick={handleViewAll}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-bold text-blue-700 hover:text-blue-800 transition-colors cursor-pointer self-start md:self-auto shadow-xs"
            id="preview-view-all-btn"
          >
            <span>View Full Catalogue ({availablePhones.length} Items)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {filterTabs.map(tab => {
            const isActive = selectedTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer shadow-2xs ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedPhones.map(phone => (
            <PhoneCard
              key={phone.id}
              phone={phone}
              onSelect={(p) => setActiveView('detail', p.id)}
            />
          ))}
        </div>

        {/* Bottom Banner to Explore all stock */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-900">Looking for a specific model, watch size or laptop spec?</h4>
            <p className="text-xs text-slate-600">
              Our inventory updates in real-time. Use our full filter catalog or contact us directly on WhatsApp.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('stock')}
              className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              Open Full Stock Page
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
