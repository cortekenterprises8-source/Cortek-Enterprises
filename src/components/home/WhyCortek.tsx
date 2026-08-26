import React from 'react';
import { 
  ShieldCheck, 
  Search, 
  Video, 
  MessageCircle, 
  XCircle, 
  CheckCircle2, 
  Eye
} from 'lucide-react';

export const WhyCortek: React.FC = () => {
  const pillars = [
    {
      icon: Search,
      title: "Transparent Information",
      description: "Clear condition grading and exact price listings. No hidden charges, no sudden price surprises when you visit our counter.",
      tag: "Honest Pricing"
    },
    {
      icon: Eye,
      title: "Know What You're Buying",
      description: "Review detailed battery health, cosmetic descriptions, and in-box accessories online before spending time traveling to Karol Bagh.",
      tag: "Upfront Details"
    },
    {
      icon: Video,
      title: "Customer Education",
      description: "Cortek actively produces video guides exposing altered battery chips, duplicate screens, and deceptive practices in the second-hand market.",
      tag: "Anti-Scam Guides"
    },
    {
      icon: MessageCircle,
      title: "Direct WhatsApp Enquiry",
      description: "Check stock online and message our counter directly. Get immediate availability confirmation and answers to all technical questions.",
      tag: "Fast Communication"
    }
  ];

  const comparisonRows = [
    {
      feature: "Phone Category",
      cortek: "100% Genuine Pre-Owned / Used",
      market: "Often altered 'Refurbished' units with replica shells"
    },
    {
      feature: "Display Panels",
      cortek: "Original Factory OLED / LCD (True Tone verified)",
      market: "Frequent aftermarket duplicate LCDs with poor color"
    },
    {
      feature: "Battery Health Reporting",
      cortek: "True authentic cycle capacity (e.g. 84% - 95%)",
      market: "Risk of reprogrammed fake '100%' battery booster chips"
    },
    {
      feature: "In-Store Live Diagnostics",
      cortek: "Full hands-on testing of Face ID, mic, and cameras encouraged",
      market: "Rushed transactions without diagnostic software check"
    },
    {
      feature: "Pricing Transparency",
      cortek: "Fixed catalog prices listed publicly online",
      market: "Variable pricing based on bargaining skills"
    }
  ];

  return (
    <section className="py-16 bg-slate-50 text-slate-900 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 font-mono">
            Our Core Philosophy
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Buy Used. Buy With Confidence.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            The second-hand mobile market is full of confusing terms and hidden modifications. Cortek Enterprises was built on the foundation of radical transparency.
          </p>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-emerald-500/40 hover:shadow-md transition-all duration-300 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-emerald-700 text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Standard Cortek Practice</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Table: Cortek vs Altered Market */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Cortek Pre-Owned vs. Altered "Refurbished" Market
            </h3>
            <p className="text-xs text-slate-600">
              Why we strictly stay away from the refurbished label and protect our customers from hidden part replacements.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-3 px-4 font-bold uppercase tracking-wider">Aspect</th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 rounded-t-xl">
                    Cortek Pre-Owned Standards
                  </th>
                  <th className="py-3 px-4 font-bold uppercase tracking-wider text-rose-800 bg-rose-50 rounded-t-xl">
                    Risky Refurbished Market
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisonRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      {row.feature}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-emerald-900 bg-emerald-50/40">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{row.cortek}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 bg-rose-50/20">
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>{row.market}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
};
