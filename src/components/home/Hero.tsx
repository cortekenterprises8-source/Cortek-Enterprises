import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  MapPin, 
  Star,
  Search,
  Flame,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { SITE_CONFIG, formatINR } from '../../config/siteConfig';
import { useInventory } from '../../context/InventoryContext';
import { WhatsAppButton } from '../common/WhatsAppButton';

interface HeroProps {
  onOpenSearch?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenSearch }) => {
  const { setActiveView, availablePhones, setFilters } = useInventory();
  const [activePreviewIndex, setActivePreviewIndex] = useState(0);

  const handleQuickJump = (brand: string) => {
    setFilters(prev => ({ ...prev, brand, searchQuery: '' }));
    setActiveView('stock');
  };

  const previewPhones = availablePhones.slice(0, 4);
  const currentPreview = previewPhones[activePreviewIndex] || previewPhones[0];

  return (
    <section className="relative overflow-hidden bg-slate-50 pt-8 pb-16 sm:py-20 border-b border-slate-200/80">
      
      {/* Background ambient lighting & cyber grid for cool light tone */}
      <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-emerald-100/50 via-teal-50/20 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-72 h-72 bg-emerald-100/40 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Main 2-Column Hero Grid */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
          
          {/* Left Column: Core Brand Positioning & Typography */}
          <div className="w-full lg:max-w-2xl space-y-6 text-center lg:text-left">
            
            {/* Top Verified Badges Bar */}
            <div className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                KAROL BAGH LIVE COUNTER: {availablePhones.length} PHONES READY
              </span>

              <a
                href={SITE_CONFIG.googleReviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-xs flex items-center gap-1.5 transition-colors"
                title="View Google Reviews"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>4.9★ Google Reviews (380+)</span>
              </a>

              <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white text-slate-700 border border-slate-200 flex items-center gap-1.5 shadow-xs">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                Karol Bagh, New Delhi
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-[64px] font-black text-slate-900 tracking-tight leading-[1.08]">
                100% Genuine Used. <br />
                <span className="luxury-gradient-text">
                  Zero Altered Parts.
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {SITE_CONFIG.subTagline} Check unboosted battery health, genuine OLED serials, and transparent in-store pricing before you visit.
              </p>
            </div>

            {/* Anti-Refurbished Clarity Box */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 text-xs text-slate-800 flex items-start gap-3.5 text-left shadow-sm">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0 border border-emerald-200">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-xs space-y-1">
                <p className="font-bold text-slate-900 text-sm">Strict Anti-Refurbished & Anti-Scam Standard</p>
                <p className="text-slate-600 leading-relaxed">
                  We never install counterfeit duplicate displays, fake 100% battery boost flex chips, or salvaged water-damaged logic boards.
                </p>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-1">
              <button
                onClick={() => setActiveView('stock')}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] cursor-pointer"
                id="hero-primary-stock-cta"
              >
                <span>Explore Live Stock Catalog</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <WhatsAppButton
                size="lg"
                label="WhatsApp Store Counter"
                variant="outline"
                className="w-full sm:w-auto px-7 py-4 rounded-2xl text-base bg-white hover:bg-slate-50 text-slate-800 border-slate-300"
              />
            </div>

            {/* Quick Search Shortcut Launcher */}
            <div className="pt-1 flex items-center justify-center lg:justify-start">
              <button
                onClick={() => onOpenSearch ? onOpenSearch() : setActiveView('stock')}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs text-slate-600 hover:text-slate-900 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
              >
                <Search className="w-4 h-4 text-emerald-600" />
                <span>Search iPhone 14 Pro, S23 Ultra, 256GB...</span>
                <kbd className="hidden sm:inline px-2 py-0.5 text-[10px] font-mono bg-slate-100 rounded border border-slate-200 text-slate-500">
                  Ctrl + K
                </kbd>
              </button>
            </div>

          </div>

          {/* Right Column: Device Spotlight Showcase (Cool Light Tone) */}
          <div className="w-full lg:max-w-md space-y-4">
            
            {/* Spotlight Showcase Card */}
            {currentPreview && (
              <div className="relative rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-md space-y-5 overflow-hidden">
                
                {/* Header with Live Counter Badge */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center font-black text-xs shadow-xs">
                      CK
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Spotlight Device</h4>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">100% Genuine</span>
                      </div>
                      <p className="text-[11px] text-slate-500">Karol Bagh Store Unit</p>
                    </div>
                  </div>

                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold font-mono">
                    READY FOR PICKUP
                  </span>
                </div>

                {/* Device Image Preview with Interactive Tabs */}
                <div 
                  onClick={() => setActiveView('detail', currentPreview.id)}
                  className="relative h-48 rounded-2xl overflow-hidden bg-slate-100 cursor-pointer group"
                >
                  <img
                    src={currentPreview.images[0]}
                    alt={currentPreview.model}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">
                        {currentPreview.brand}
                      </span>
                      <h3 className="text-base font-bold text-white leading-tight">
                        {currentPreview.model}
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-black text-white">{formatINR(currentPreview.price)}</span>
                      {currentPreview.batteryHealth && (
                        <span className="text-[11px] text-emerald-300 font-semibold block">
                          {currentPreview.batteryHealth}% Battery
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Switch Between Spotlight Phones */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {previewPhones.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => setActivePreviewIndex(idx)}
                      className={`p-2 rounded-xl border transition-all text-left cursor-pointer ${
                        activePreviewIndex === idx
                          ? 'bg-emerald-50 border-emerald-500 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={p.images[0]}
                        alt={p.model}
                        className="w-full h-8 object-cover rounded-lg mb-1"
                      />
                      <p className="text-[10px] font-bold text-slate-900 truncate">{p.model.split(' ')[0]} {p.model.split(' ')[1]}</p>
                      <p className="text-[9px] text-emerald-700 font-bold">{formatINR(p.price)}</p>
                    </button>
                  ))}
                </div>

                {/* Inspect Details & Hold Pass CTA */}
                <div className="pt-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveView('detail', currentPreview.id)}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Full Diagnostic Spec</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <WhatsAppButton
                    productName={`${currentPreview.brand} ${currentPreview.model} (${currentPreview.storage})`}
                    price={currentPreview.price}
                    size="sm"
                    label="WhatsApp Hold"
                  />
                </div>

              </div>
            )}

            {/* Quick Brand Jump Chips */}
            <div className="flex items-center justify-between gap-2 text-xs">
              <button
                onClick={() => handleQuickJump('Apple')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-center font-semibold transition-colors cursor-pointer shadow-xs"
              >
                iPhones ({availablePhones.filter(p => p.brand === 'Apple').length})
              </button>
              <button
                onClick={() => handleQuickJump('Samsung')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-center font-semibold transition-colors cursor-pointer shadow-xs"
              >
                Samsung ({availablePhones.filter(p => p.brand === 'Samsung').length})
              </button>
              <button
                onClick={() => handleQuickJump('OnePlus')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-center font-semibold transition-colors cursor-pointer shadow-xs"
              >
                OnePlus
              </button>
              <button
                onClick={() => { setFilters(prev => ({ ...prev, onlyPriceDrop: true })); setActiveView('stock'); }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-amber-50 border border-amber-200 text-amber-700 text-center font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs"
              >
                <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                Deals
              </button>
            </div>

          </div>

        </div>

        {/* Stats Ribbon in Cool Light Tone */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-200">
          
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1 text-center sm:text-left">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">100%</span>
            <p className="text-xs font-bold text-emerald-700">Genuine Factory Parts</p>
            <p className="text-[11px] text-slate-500">Zero duplicate screens or boosted flexes</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1 text-center sm:text-left">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">40+</span>
            <p className="text-xs font-bold text-emerald-700">Point Hardware Inspection</p>
            <p className="text-[11px] text-slate-500">TrueTone, FaceID, Cameras & BMS verified</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1 text-center sm:text-left">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">₹0</span>
            <p className="text-xs font-bold text-emerald-700">Hidden Fees / Surprise Costs</p>
            <p className="text-[11px] text-slate-500">Exact live prices with store billing</p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1 text-center sm:text-left">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">4.9★</span>
            <p className="text-xs font-bold text-emerald-700">Google Reviews Rating</p>
            <p className="text-[11px] text-slate-500">380+ Karol Bagh store customer reviews</p>
          </div>

        </div>

      </div>
    </section>
  );
};
