import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Smartphone, 
  BatteryCharging, 
  Lock, 
  MapPin, 
  QrCode,
  Sparkles
} from 'lucide-react';
import { SITE_CONFIG, formatINR } from '../../config/siteConfig';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { useInventory } from '../../context/InventoryContext';

export const ImeiVerificationTool: React.FC = () => {
  const { availablePhones } = useInventory();
  const [inputImei, setInputImei] = useState('');
  const [selectedSample, setSelectedSample] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);
  const [customerName, setCustomerName] = useState('');

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputImei.trim();
    setSelectedSample(null);
    setSearched(true);
  };

  return (
    <section className="py-20 bg-slate-50 text-slate-900 border-b border-slate-200/80 relative overflow-hidden" id="authenticity-checker">
      
      {/* Background decorations */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold font-mono">
            <QrCode className="w-3.5 h-3.5 text-emerald-600" />
            <span>CORTEK STORE HOLD PASS & IMEI VERIFIER</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Check Authenticity & <br />
            <span className="luxury-gradient-text">Generate In-Store Reservation Pass</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Submit a 15-digit IMEI to request an internal verification record. Results are shown only when a trusted provider or completed store inspection supplies them.
          </p>
        </div>

        {/* Interactive Search Box */}
        <div className="max-w-2xl mx-auto space-y-4">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <Search className="w-5 h-5 text-emerald-600 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={inputImei}
              onChange={e => setInputImei(e.target.value)}
              placeholder="Enter 15-digit IMEI or select sample phone below..."
              className="w-full pl-12 pr-36 py-4 rounded-2xl bg-white border border-slate-200 focus:border-emerald-500 text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none shadow-xs"
            />
            <button
              type="submit"
              className="absolute right-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              Request Verification
            </button>
          </form>

        </div>

        {searched && !selectedSample && (
          <div className="max-w-2xl mx-auto rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            No verification result is available yet. A trusted provider or completed Cortek inspection is required before authenticity, lock, or hardware claims can be displayed.
          </div>
        )}

        {/* Verification Result Certificate Card */}
        {searched && selectedSample && (
          <div className="max-w-4xl mx-auto rounded-3xl bg-white border border-slate-200 shadow-md p-6 sm:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            {/* Certificate Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      OFFICIAL CERTIFICATE
                    </span>
                    <span className="text-xs text-slate-500 font-mono">TAG: {selectedSample.storeTag}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    {selectedSample.model}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    IMEI: {selectedSample.imei} • Color: {selectedSample.color}
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-slate-500 block font-medium">In-Store Deal Price</span>
                <span className="text-2xl font-black text-slate-900">{formatINR(selectedSample.price)}</span>
              </div>
            </div>

            {/* Hardware Telemetry Parameters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <BatteryCharging className="w-4 h-4 text-emerald-600" />
                  <span>Battery Health & Cycles</span>
                </div>
                <div className="text-base font-bold text-emerald-700">
                  {selectedSample.batteryCapacity} ({selectedSample.batteryCycle})
                </div>
                <p className="text-[10px] text-slate-500">Unboosted BMS verified cycle capacity</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>iCloud & Carrier Lock</span>
                </div>
                <div className="text-base font-bold text-slate-900">
                  {selectedSample.icloudStatus}
                </div>
                <p className="text-[10px] text-emerald-700 font-semibold">Factory unlocked for all 5G SIMs</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-2 text-slate-600 font-medium">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>Display & TrueTone</span>
                </div>
                <div className="text-base font-bold text-slate-900 truncate">
                  {selectedSample.displaySerial.split('(')[0]}
                </div>
                <p className="text-[10px] text-slate-500">Original factory display calibration</p>
              </div>

            </div>

            {/* In-Store Hold Pass Generator Form */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-white border border-emerald-200 space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Reserve this device for 2 Hours (Karol Bagh Store Hold Pass)</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Enter your name to generate a guaranteed store hold pass so the device is kept aside for your in-person visit.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="Your Name (e.g. Rahul Sharma)"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full sm:w-80 px-4 py-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-xs"
                />

                <WhatsAppButton
                  productName={`[STORE HOLD PASS REQUEST] ${selectedSample.model} (${selectedSample.color}) - Tag: ${selectedSample.storeTag} for customer: ${customerName || 'Walk-in Guest'}`}
                  price={selectedSample.price}
                  size="md"
                  label="Claim Store Hold Pass on WhatsApp"
                  className="w-full sm:w-auto"
                />
              </div>

              <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Valid at Cortek Counter, Karol Bagh, New Delhi
                </span>
                <span>•</span>
                <span>Zero advance deposit required</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
