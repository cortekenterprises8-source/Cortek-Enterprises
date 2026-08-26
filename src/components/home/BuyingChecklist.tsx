import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  CirclePlay, 
  ShieldCheck, 
  ExternalLink
} from 'lucide-react';
import { BUYER_INSPECTION_CHECKLIST } from '../../data/mockVideos';
import { SITE_CONFIG } from '../../config/siteConfig';

export const BuyingChecklist: React.FC = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const toggleExpand = (idx: number) => {
    setExpandedIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <section className="py-16 bg-white text-slate-900 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 font-mono">
              Buyer Awareness & Self-Testing
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              Buying a Used Phone? Check These First.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Whether you buy from Cortek or anywhere else in Karol Bagh, use this practical 7-step inspection checklist to avoid paying for altered parts.
            </p>
          </div>

          <a
            href={SITE_CONFIG.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-bold text-red-700 transition-colors cursor-pointer self-start md:self-auto shadow-xs"
          >
            <CirclePlay className="w-4 h-4 text-red-600" />
            <span>Watch Cortek's Buying Guides</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Checklist Accordion / Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {BUYER_INSPECTION_CHECKLIST.map((item, idx) => {
            const isExpanded = expandedIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'bg-slate-50 border-emerald-500 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => toggleExpand(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-start gap-3.5">
                    <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {item.step}
                    </span>
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-emerald-700 font-semibold mt-1">
                        Test: {item.keyCheck}
                      </p>
                    </div>
                  </div>

                  <div className="text-slate-400 p-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-emerald-600" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-600 space-y-3 border-t border-slate-200 animate-in fade-in duration-150">
                    <p className="leading-relaxed">
                      {item.description}
                    </p>
                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2 shadow-2xs">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>At Cortek Karol Bagh, our technicians test this live in front of you.</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
