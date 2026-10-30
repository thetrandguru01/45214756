import React, { useState } from 'react';
import { Truck, Camera, Award, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import { useApp } from '../../lib/store';

export const OnboardingModal: React.FC = () => {
  const { showOnboarding, setShowOnboarding, setPortal } = useApp();
  const [step, setStep] = useState(0);

  if (!showOnboarding) return null;

  const slides = [
    {
      title: 'Real-time Garbage Auto-Tipper Tracking',
      desc: 'Track live municipal garbage vehicles in your ward. Know exact arrival timings, live route status, and vehicle numbers.',
      icon: <Truck className="w-12 h-12 text-emerald-600" />,
      tag: 'Live GPS Telemetry',
    },
    {
      title: 'Instant Cleanliness Complaint Filing',
      desc: 'Snap a photo of unattended trash or overflowing bins. Direct dispatch to municipal sanitation staff without visiting offices.',
      icon: <Camera className="w-12 h-12 text-blue-600" />,
      tag: 'Photo & Geotag Verification',
    },
    {
      title: 'Badges & Weekly ₹1,000 Giveaway',
      desc: 'Earn badges like Clean Warrior, Local Hero, and enter the official ₹1,000 weekly community cleanliness giveaway after 50 verified reports.',
      icon: <Award className="w-12 h-12 text-emerald-700" />,
      tag: 'Citizen Rewards',
    },
  ];

  const current = slides[step];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-emerald-950 p-6 text-white text-center relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{current.tag}</span>
          </div>
          <h2 className="text-xl font-bold">{current.title}</h2>
        </div>

        {/* Slide Body */}
        <div className="p-6 text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-inner">
            {current.icon}
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">{current.desc}</p>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`h-2 rounded-full transition-all ${
                  i === step ? 'w-6 bg-emerald-600' : 'w-2 bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer controls */}
        <div className="p-6 pt-0 flex items-center justify-between gap-3">
          <button
            onClick={() => setShowOnboarding(false)}
            className="text-xs text-slate-400 hover:text-slate-600 font-semibold px-3 py-2"
          >
            Skip Intro
          </button>

          {step < slides.length - 1 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-all ml-auto"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setShowOnboarding(false)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm shadow-md transition-all ml-auto"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Get Started</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
