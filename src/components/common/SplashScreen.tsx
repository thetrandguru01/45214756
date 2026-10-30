import React, { useEffect, useState } from 'react';
import { Leaf, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { useApp } from '../../lib/store';

export const SplashScreen: React.FC = () => {
  const { setShowSplash } = useApp();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setShowSplash(false), 300);
          return 100;
        }
        return prev + 12;
      });
    }, 120);

    return () => clearInterval(timer);
  }, [setShowSplash]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white p-8">
      {/* Top Gov Header */}
      <div className="w-full flex items-center justify-between text-xs tracking-wider text-emerald-400 font-semibold uppercase">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Govt of Rajasthan • Smart Cleanliness Initiative
        </span>
        <span className="text-slate-400">Phase 1</span>
      </div>

      {/* Main Brand Hero */}
      <div className="flex flex-col items-center text-center max-w-sm">
        <div className="relative mb-6">
          {/* Animated Glow Halo */}
          <div className="absolute -inset-4 bg-emerald-500/30 rounded-3xl blur-xl animate-pulse" />

          {/* Logo Badge */}
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-2xl border border-emerald-400/40">
            <div className="relative">
              <Leaf className="w-12 h-12 text-white" />
              <div className="absolute -bottom-1 -right-1 bg-slate-900 p-1 rounded-full border border-emerald-300">
                <Truck className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
          The<span className="text-emerald-400">AutoDip</span>
        </h1>
        <p className="text-xs uppercase tracking-widest text-emerald-300/90 font-bold mb-3">
          Smart Garbage Vehicle Tracking &amp; City Cleanliness
        </p>
        <p className="text-xs text-slate-300 leading-relaxed">
          Clean Rajasthan • Green Rajasthan • Real-time GPS &amp; Public Accountability
        </p>
      </div>

      {/* Loading Progress & Action */}
      <div className="w-full max-w-xs space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Initializing Telemetry &amp; Wards</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button
          onClick={() => setShowSplash(false)}
          className="w-full mt-4 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-emerald-200 border border-emerald-500/20 transition-all text-center"
        >
          Skip into App &rarr;
        </button>
      </div>
    </div>
  );
};
