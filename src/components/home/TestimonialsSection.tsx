import React from 'react';
import { Star, ShieldCheck, MapPin, CheckCircle2, ExternalLink, ThumbsUp, MessageSquarePlus } from 'lucide-react';
import { DEMO_TESTIMONIALS } from '../../data/mockVideos';
import { SITE_CONFIG } from '../../config/siteConfig';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50 text-slate-900 border-b border-slate-200/80 relative overflow-hidden" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 relative z-10">
        
        {/* Header & Google Score Card */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 pb-2">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>VERIFIED CUSTOMER TESTIMONIALS</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Real Google Reviews from <br />
              <span className="luxury-gradient-text">Karol Bagh In-Store Buyers</span>
            </h2>
            
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              100% genuine customer reviews from smartphone buyers who visited our Karol Bagh store counter to test and purchase pre-owned phones.
            </p>
          </div>

          {/* Google Summary Badge */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-5 shrink-0">
            <div className="flex items-center gap-3.5">
              {/* Google G icon container */}
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-xl text-slate-800 shadow-xs">
                <span className="text-blue-600">G</span>
                <span className="text-red-500">o</span>
                <span className="text-amber-500">o</span>
                <span className="text-blue-600">g</span>
                <span className="text-emerald-500">l</span>
                <span className="text-red-500">e</span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black text-slate-900 font-mono">4.9</span>
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Based on 380+ Karol Bagh store ratings
                </p>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

            <a
              href={SITE_CONFIG.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm hover:shadow"
            >
              <span>View Google Reviews</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Testimonials 6-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DEMO_TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3.5">
                {/* Rating & Verified badge */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Verified Google Review
                  </span>
                </div>

                {/* Comment */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  "{item.comment}"
                </p>
              </div>

              {/* Author & Device Info */}
              <div className="pt-3.5 border-t border-slate-100 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                      {item.customerName}
                    </h4>
                    {item.reviewerBadge && (
                      <span className="text-[10px] text-slate-500 font-medium block">
                        {item.reviewerBadge}
                      </span>
                    )}
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      {item.city}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 block">
                      {item.devicePurchased}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">{item.date}</span>
                  </div>
                </div>

                {item.likesCount && (
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 pt-1">
                    <ThumbsUp className="w-3 h-3 text-slate-400" />
                    <span>{item.likesCount} people found this helpful</span>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>

        {/* Footer CTA linking to Google link */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Purchased a phone from our Karol Bagh store?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Share your honest feedback on Google to help fellow buyers make informed decisions.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={SITE_CONFIG.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Leave a Google Review</span>
            </a>

            <a
              href={SITE_CONFIG.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open in Google Maps</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
