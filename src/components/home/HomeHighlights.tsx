import React, { useState } from 'react';
import { 
  ShieldCheck, 
  BatteryCharging, 
  Receipt, 
  MapPin, 
  ArrowRight, 
  Search, 
  Star, 
  CheckCircle2, 
  Smartphone, 
  Watch, 
  Tablet, 
  Laptop, 
  Headphones, 
  Sparkles, 
  PhoneCall, 
  MessageCircle,
  Eye,
  Wrench,
  QrCode,
  Flame,
  Check,
  Box,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { useInventory } from '../../context/InventoryContext';
import { SITE_CONFIG, formatINR } from '../../config/siteConfig';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { PhoneItem } from '../../types';

interface HomeHighlightsProps {
  onOpenSearch: () => void;
}

export const HomeHighlights: React.FC<HomeHighlightsProps> = ({ onOpenSearch }) => {
  const { availablePhones, setActiveView, setFilters, loading, apiError, refreshPhones } = useInventory();
  const [selectedCat, setSelectedCat] = useState<string>('All');

  const categories = [
    { label: 'All Stock', icon: Sparkles, value: 'All' },
    { label: 'iPhones', icon: Smartphone, value: 'Phones' },
    { label: 'Watches', icon: Watch, value: 'Watches' },
    { label: 'iPads / Tablets', icon: Tablet, value: 'Tablets' },
    { label: 'MacBooks & Laptops', icon: Laptop, value: 'Laptops' },
    { label: 'Accessories', icon: Headphones, value: 'Accessories' }
  ];

  // Highlights stock items: up to 10 items in ultra-compact mini blocks
  const featuredStock = availablePhones
    .filter(p => selectedCat === 'All' || (p.category || 'Phones') === selectedCat)
    .slice(0, 10);

  const handleSelectCategory = (catValue: string) => {
    setSelectedCat(catValue);
  };

  const handleExploreFullCatalog = (catValue?: string) => {
    if (catValue && catValue !== 'All') {
      setFilters(prev => ({ ...prev, category: catValue as any }));
    } else {
      setFilters(prev => ({ ...prev, category: 'All' }));
    }
    setActiveView('stock');
  };

  const handleOpenDetail = (phone: PhoneItem) => {
    setActiveView('detail', phone.id);
  };

  return (
    <div className="space-y-10 sm:space-y-14 pb-12">

      {/* 1. FEATURED LIVE STOCK SHOWCASE FIRST ON HOME PAGE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-5 pt-4 sm:pt-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold uppercase tracking-wider font-mono">
                Live Karol Bagh Counter
              </span>
              {selectedCat !== 'All' && (
                <span className="text-xs text-slate-500 font-bold">• {selectedCat}</span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              Popular Gadgets In Stock Today
            </h2>
          </div>

          <button
            onClick={() => handleExploreFullCatalog(selectedCat)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
          >
            <span>View All ({availablePhones.length} Units)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* API Error */}
        {apiError && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-red-700 font-semibold">Unable to load inventory</p>
              <p className="text-[11px] text-red-600">{apiError}</p>
            </div>
            <button
              onClick={refreshPhones}
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer shrink-0"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && !apiError && (
          <div className="py-12 text-center space-y-2">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Loading latest stock...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !apiError && featuredStock.length === 0 && (
          <div className="py-12 text-center space-y-2">
            <Smartphone className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-500">No stock available right now</p>
            <p className="text-xs text-slate-400">Check back soon or contact us on WhatsApp</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
            {featuredStock.map(phone => {
              const isSold = phone.status === 'Sold Out';
              return (
                <div
                  key={phone.id}
                  onClick={() => handleOpenDetail(phone)}
                  className={`group bg-white rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-2xs hover:shadow-sm hover:border-blue-400 hover:-translate-y-0.5 cursor-pointer ${
                    isSold ? 'border-slate-200 opacity-75' : 'border-slate-200/90'
                  }`}
                  id={`home-stock-block-${phone.id}`}
                >
                <div>
                  <div className="relative h-24 sm:h-28 w-full overflow-hidden bg-slate-100">
                    <img
                      src={phone.images[0]}
                      alt={`${phone.brand} ${phone.model}`}
                      loading="lazy"
                      className={`w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105 ${
                        isSold ? 'grayscale' : ''
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

                    <div className="absolute top-1.5 left-1.5 right-1.5 flex items-center justify-between pointer-events-none">
                      {phone.category && phone.category !== 'Phones' ? (
                        <span className="px-1 py-0.2 text-[8px] font-extrabold rounded bg-blue-600 text-white font-mono uppercase shadow-2xs">
                          {phone.category}
                        </span>
                      ) : phone.priceDrop ? (
                        <span className="px-1 py-0.2 text-[8px] font-bold rounded bg-amber-500 text-slate-950 flex items-center gap-0.5 shadow-2xs">
                          <Flame className="w-2 h-2 fill-slate-950" />
                          Drop
                        </span>
                      ) : (
                        <span className="px-1 py-0.2 text-[8px] font-bold rounded bg-slate-950/70 text-slate-200 backdrop-blur-2xs font-mono">
                          {phone.brand}
                        </span>
                      )}

                      {phone.batteryHealth ? (
                        <span className="px-1 py-0.2 text-[8px] font-bold rounded bg-emerald-950/85 text-emerald-300 border border-emerald-500/30 backdrop-blur-2xs font-mono flex items-center gap-0.5">
                          <BatteryCharging className="w-2 h-2" />
                          {phone.batteryHealth}%
                        </span>
                      ) : (
                        <span className="px-1 py-0.2 text-[8px] font-bold rounded bg-slate-950/80 text-slate-300 backdrop-blur-2xs">
                          {phone.status}
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-1 left-1.5 right-1.5 flex items-center justify-between text-[8px] font-mono text-slate-200 pointer-events-none">
                      <span className="truncate max-w-[80px]">{phone.stockTag || `ID: ${phone.id.slice(0, 6)}`}</span>
                      <span className="text-emerald-300 font-bold">{phone.condition.split(' ')[0]}</span>
                    </div>
                  </div>

                  <div className="p-2 sm:p-2.5 space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-tight">
                        {phone.model}
                      </h3>
                      {phone.storage !== 'N/A' && (
                        <span className="text-[9px] font-bold text-slate-600 bg-slate-100 px-1 py-0.2 rounded font-mono shrink-0">
                          {phone.storage}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[9px] text-slate-500 flex-wrap">
                      <span className="truncate max-w-[70px]">{phone.colour}</span>
                      {phone.billAvailable && (
                        <>
                          <span>•</span>
                          <span className="text-blue-700 font-semibold flex items-center gap-0.5">
                            <Check className="w-2 h-2" /> Bill
                          </span>
                        </>
                      )}
                      {phone.inBox.originalBox && (
                        <>
                          <span>•</span>
                          <span className="text-slate-500">Box</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-2 sm:p-2.5 pt-0 space-y-1.5">
                  <div className="flex items-baseline justify-between pt-1 border-t border-slate-100">
                    <div className="font-black text-xs sm:text-sm text-slate-900 tracking-tight">
                      {formatINR(phone.price)}
                    </div>
                    {phone.originalMsp && (
                      <span className="text-[9px] text-emerald-700 font-bold font-mono">
                        Save {Math.round(((phone.originalMsp - phone.price) / phone.originalMsp) * 100)}%
                      </span>
                    )}
                  </div>
                </div>
                </div>
              );
            })}
        </div>
      </section>
      
      {/* 2. FOUR MAIN TRUST HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Highlight 1 */}
          <div className="relative overflow-hidden p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 cortek-premium-card space-y-3 hover:-translate-y-1 hover:border-blue-300 transition-all">
            <div className="absolute inset-x-0 top-0 h-1 bg-blue-500" />
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Genuine Display & Parts</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">Original components checked before listing.</p>
            </div>
          </div>

          {/* Highlight 2 */}
          <div className="relative overflow-hidden p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 cortek-premium-card space-y-3 hover:-translate-y-1 hover:border-emerald-300 transition-all">
            <div className="absolute inset-x-0 top-0 h-1 bg-emerald-500" />
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <BatteryCharging className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Authentic Battery Health</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">Real battery percentage, never boosted.</p>
            </div>
          </div>

          {/* Highlight 3 */}
          <div className="relative overflow-hidden p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 cortek-premium-card space-y-3 hover:-translate-y-1 hover:border-amber-300 transition-all">
            <div className="absolute inset-x-0 top-0 h-1 bg-amber-500" />
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
              <Receipt className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Bill & Testing Warranty</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">Clear pricing with store-backed support.</p>
            </div>
          </div>

          {/* Highlight 4 */}
          <div className="relative overflow-hidden p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 cortek-premium-card space-y-3 hover:-translate-y-1 hover:border-purple-300 transition-all">
            <div className="absolute inset-x-0 top-0 h-1 bg-purple-500" />
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">4.9★ Karol Bagh Store</h3>
              <p className="text-xs text-slate-500 leading-relaxed mt-1">Walk in, inspect, and verify before paying.</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
