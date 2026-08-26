import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  BatteryCharging, 
  Eye, 
  Smartphone, 
  Camera, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Activity,
  Check,
  X,
  ScanLine
} from 'lucide-react';
import { WhatsAppButton } from '../common/WhatsAppButton';

interface ComponentCheck {
  id: string;
  name: string;
  category: string;
  icon: any;
  genuineSpecs: string;
  scamRisk: string;
  cortekTestScore: string;
  cortekVerificationMethod: string;
  waveformData: number[];
  status: 'passed' | 'warning';
}

export const HardwareDiagnosticSimulator: React.FC = () => {
  const [selectedPartId, setSelectedPartId] = useState<string>('battery');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'interactive' | 'comparison'>('interactive');

  const componentsData: ComponentCheck[] = [
    {
      id: 'battery',
      name: 'Battery Chemistry & Cycle Count',
      category: 'Power Management',
      icon: BatteryCharging,
      genuineSpecs: 'Original factory lithium-ion cells showing true chemical discharge curve (84% - 96% health).',
      scamRisk: 'Reprogrammed tag-on boost flex chip forcing iOS Settings to lie at "100% Health" while shutting down at 25%.',
      cortekTestScore: '100% Authenticated (No Boost Flex Detected)',
      cortekVerificationMethod: '3uTools + hardware multimeter cycle analysis verifying direct BMS serial integrity.',
      waveformData: [45, 60, 55, 75, 82, 88, 92, 89, 87, 85],
      status: 'passed'
    },
    {
      id: 'display',
      name: 'Super Retina XDR / AMOLED Panel',
      category: 'Display & Touch',
      icon: Eye,
      genuineSpecs: 'Factory Samsung/LG OEM OLED with 120Hz ProMotion, TrueTone EEPROM sync, and razor-thin bezels.',
      scamRisk: 'Cheap aftermarket Incell LCD with thick chin, washed out gray blacks, high heat, and 40% higher battery drain.',
      cortekTestScore: 'Original Factory OLED + TrueTone Sync Verified',
      cortekVerificationMethod: 'Optical spectral colorimeter + ambient light sensor EEPROM programmer calibration.',
      waveformData: [70, 85, 95, 98, 100, 96, 94, 98, 95, 99],
      status: 'passed'
    },
    {
      id: 'faceid',
      name: 'TrueDepth Dot Projector & Biometrics',
      category: 'Security & Sensors',
      icon: ScanLine,
      genuineSpecs: 'Factory paired infrared flood illuminator and dot projector without jumper bypass wires.',
      scamRisk: 'Damaged or bypassed flex causing "Face ID Disabled" or unsafe uncalibrated biometric reads.',
      cortekTestScore: 'Hardware Cryptographic Match Confirmed',
      cortekVerificationMethod: 'Direct Secure Enclave key handshake verification in diagnostics mode.',
      waveformData: [30, 65, 80, 90, 95, 92, 94, 98, 95, 97],
      status: 'passed'
    },
    {
      id: 'motherboard',
      name: 'A-Series / Snapdragon Logic Board',
      category: 'Core Processor',
      icon: Cpu,
      genuineSpecs: 'Factory sealed sandwich board with untouched thermal dissipation graphite and no heat gun residue.',
      scamRisk: 'Salvaged water-damaged board with bridged jumper wires and reworked power IC chips prone to death.',
      cortekTestScore: 'Zero Board Rework / Factory Seal Intact',
      cortekVerificationMethod: 'Thermal imaging under 100% stress load to verify uniform heat spread.',
      waveformData: [50, 70, 80, 85, 90, 92, 88, 91, 89, 90],
      status: 'passed'
    },
    {
      id: 'cameras',
      name: 'Optics & OIS Gyroscope Array',
      category: 'Imaging System',
      icon: Camera,
      genuineSpecs: 'Original Sony CMOS sensor with hardware Sensor-Shift OIS stabilization and clean lens coating.',
      scamRisk: 'Glued secondary lens, dust trapped inside glass, or fake replica telephoto modules.',
      cortekTestScore: '4K 60FPS Sensor Shift OIS 100% Operational',
      cortekVerificationMethod: 'Laser collimator alignment + micro-vibration gyroscope calibration.',
      waveformData: [60, 75, 85, 92, 95, 98, 96, 94, 95, 98],
      status: 'passed'
    }
  ];

  const selectedComponent = componentsData.find(c => c.id === selectedPartId) || componentsData[0];

  const triggerScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 800);
  };

  return (
    <section className="py-20 bg-white text-slate-900 border-b border-slate-200/80 relative overflow-hidden" id="diagnostics">
      
      {/* Ambient background glow & tech grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-100/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-12">
        
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold font-mono">
              <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>CORTEK TRUESCAN™ DIAGNOSTICS LAB</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Every Phone Tested Live <br />
              <span className="luxury-gradient-text">Down to the Component Level.</span>
            </h2>
            
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              We reject 6 out of 10 market phones due to hidden alterations. Select any internal component below to understand how Cortek Karol Bagh verifies original factory integrity.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start lg:self-auto shadow-xs">
            <button
              onClick={() => setActiveTab('interactive')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'interactive'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Interactive Diagnostic Bay
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'comparison'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Real vs Refurbished Matrix
            </button>
          </div>
        </div>

        {/* Diagnostic Simulator Main UI */}
        {activeTab === 'interactive' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Left Nav: Component Selector Buttons (4 Cols) */}
            <div className="lg:col-span-4 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono block px-2">
                  Select Sub-System to Inspect
                </span>
                
                {componentsData.map(comp => {
                  const Icon = comp.icon;
                  const isSelected = selectedPartId === comp.id;
                  return (
                    <button
                      key={comp.id}
                      onClick={() => {
                        setSelectedPartId(comp.id);
                        triggerScan();
                      }}
                      className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-emerald-50/70 border-emerald-500 shadow-sm translate-x-1'
                          : 'bg-slate-50/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-200 text-slate-700'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className={`text-sm font-bold leading-tight ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                            {comp.name}
                          </h4>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {comp.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[11px] font-bold text-emerald-700 font-mono">PASS</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* In-Store Live Test Notice */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-slate-800 space-y-2 mt-4">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Karol Bagh In-Person Privilege</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  When you visit our counter, you can connect any phone to our 3uTools diagnostic rig and test all 40+ hardware parameters yourself before paying.
                </p>
              </div>
            </div>

            {/* Right Display: High-Tech Diagnostic Telemetry Box (8 Cols) */}
            <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-md relative overflow-hidden flex flex-col justify-between space-y-6">
              
              {/* Scan Overlay Effect */}
              {isScanning && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-20 flex items-center justify-center animate-in fade-in duration-100">
                  <div className="text-xs font-mono font-bold text-emerald-700 flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-emerald-300 shadow-md">
                    <Activity className="w-4 h-4 animate-spin text-emerald-600" />
                    <span>SYNCHRONIZING EEPROM REGISTERS...</span>
                  </div>
                </div>
              )}

              {/* Telemetry Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center shadow-xs">
                    <selectedComponent.icon className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-widest block">
                      DIAGNOSTIC CHANNEL: {selectedComponent.category.toUpperCase()}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 leading-tight">
                      {selectedComponent.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold font-mono flex items-center gap-1.5 shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{selectedComponent.cortekTestScore}</span>
                  </div>
                </div>
              </div>

              {/* Waveform Telemetry Visualizer */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" /> LIVE HARDWARE RESPONSE SIGNAL
                  </span>
                  <span>LATENCY: 0.8ms | INTEGRITY: 100%</span>
                </div>
                
                {/* Visual Audio/Signal Bars */}
                <div className="h-16 flex items-end gap-1.5 pt-2">
                  {selectedComponent.waveformData.map((val, idx) => (
                    <div
                      key={idx}
                      className="flex-1 bg-gradient-to-t from-emerald-600 to-teal-500 rounded-t-sm transition-all duration-500"
                      style={{ height: `${val}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Genuine vs Scam Comparison Deep Dive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Cortek Genuine Guarantee */}
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Cortek Factory Pre-Owned Standard:</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {selectedComponent.genuineSpecs}
                  </p>
                </div>

                {/* Second Hand Market Trap */}
                <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
                  <div className="flex items-center gap-1.5 text-rose-800 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Common Market Alteration Trap:</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {selectedComponent.scamRisk}
                  </p>
                </div>

              </div>

              {/* Bottom Verification Method */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="text-slate-600">
                  <strong className="text-slate-900">Cortek Lab Test Method: </strong>
                  <span>{selectedComponent.cortekVerificationMethod}</span>
                </div>

                <WhatsAppButton
                  productName={`Diagnostic inquiry on ${selectedComponent.name}`}
                  size="sm"
                  label="Ask Technician on WhatsApp"
                  className="shrink-0"
                />
              </div>

            </div>

          </div>
        ) : (
          /* Real vs Altered Matrix Table */
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-md overflow-x-auto space-y-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-3 px-4 font-bold uppercase">Hardware Component</th>
                  <th className="py-3 px-4 font-bold uppercase text-emerald-700 bg-emerald-50 rounded-t-xl">
                    Cortek Pre-Owned (100% Genuine)
                  </th>
                  <th className="py-3 px-4 font-bold uppercase text-rose-700 bg-rose-50 rounded-t-xl">
                    Refurbished / Repaired Units
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {componentsData.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2">
                        <c.icon className="w-4 h-4 text-emerald-600" />
                        <span>{c.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-800 bg-emerald-50/40 leading-relaxed font-medium">
                      <div className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{c.genuineSpecs}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-600 bg-rose-50/30 leading-relaxed">
                      <div className="flex items-start gap-2">
                        <X className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>{c.scamRisk}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </section>
  );
};
