import React from 'react';
import { MessageCircle, BellRing, Sparkles, ArrowRight, Users } from 'lucide-react';
import { SITE_CONFIG } from '../../config/siteConfig';

export const WhatsAppCommunity: React.FC = () => {
  return (
    <section className="py-16 bg-slate-50 text-slate-900 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="relative rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-white border border-emerald-200 p-8 sm:p-12 overflow-hidden shadow-sm">
          
          {/* Background subtle glowing circle */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            
            {/* Left Content */}
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold font-mono">
                <Users className="w-3.5 h-3.5 text-emerald-700" />
                <span>Cortek VIP Broadcast Channel</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Get New Deals First
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Join the Cortek WhatsApp community for daily incoming stock drops, unlisted flagship arrivals, and exclusive pre-owned price cuts before they sell out.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant alerts when iPhones & Galaxies arrive</span>
                </div>
                <div className="flex items-center gap-2">
                  <BellRing className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Zero spam — stock updates & prices only</span>
                </div>
              </div>
            </div>

            {/* Right Action CTA Button */}
            <div className="w-full lg:w-auto shrink-0 flex flex-col items-center sm:items-start lg:items-center gap-3">
              <a
                href={SITE_CONFIG.whatsappCommunityUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base flex items-center justify-center gap-3 shadow-md shadow-emerald-600/20 transition-all hover:scale-105 cursor-pointer text-center"
                id="join-whatsapp-community-btn"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Join WhatsApp Community</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <span className="text-[11px] text-slate-500 text-center">
                Direct group link • Free to join • Karol Bagh, New Delhi
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
