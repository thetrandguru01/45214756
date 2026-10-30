import React from 'react';
import { AppProvider, useApp } from './lib/store';
import { Header } from './components/common/Header';
import { SplashScreen } from './components/common/SplashScreen';
import { OnboardingModal } from './components/common/OnboardingModal';
import { Toast } from './components/common/Toast';
import { AuthModal } from './components/public/AuthModal';
import { PublicHome } from './components/public/PublicHome';
import { GovPortal } from './components/government/GovPortal';
import { DriverPortal } from './components/driver/DriverPortal';
import { ShieldCheck, Leaf, Heart, ExternalLink, Phone, Building2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { portal, setPortal, showSplash, showOnboarding } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Splash Screen */}
      {showSplash && <SplashScreen />}

      {/* Onboarding Screen */}
      {showOnboarding && <OnboardingModal />}

      {/* Global Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {portal === 'public' && <PublicHome />}
        {portal === 'government' && <GovPortal />}
        {portal === 'driver' && <DriverPortal />}
      </main>

      {/* Auth & OTP Modal */}
      <AuthModal />

      {/* Toast Notification Container */}
      <Toast />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                  <Leaf className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-base tracking-tight">TheAutoDip</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Smart Solid Waste Telematics, AIS-140 GPS Vehicle Tracking &amp; Ward Cleanliness Grievance Redressal System.
              </p>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Govt of Rajasthan • Urban Local Bodies</span>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
                Connected Portals
              </h5>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setPortal('public')}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Public Citizen Grievance Portal
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPortal('government')}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Government Command Center
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setPortal('driver')}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Driver Attendance &amp; Route Terminal
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
                Emergency &amp; Helpline
              </h5>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Toll-Free: 1800-180-2442</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-rose-400" />
                  <span>Biohazard Alert: 0144-2338822</span>
                </li>
                <li className="text-[11px] text-slate-400 mt-1">
                  24/7 Central Sanitation Control Room, Alwar
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
                System Standards
              </h5>
              <div className="space-y-2 text-[11px] text-slate-400">
                <p>• AIS-140 GPS Compliance</p>
                <p>• Multi-City District RBAC Isolation</p>
                <p>• Biometric Facial Liveness Verification</p>
                <p>• Automated Daily Solid Waste Reporting</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
            <div>
              © 2026 TheAutoDip System • All Rights Reserved • Clean Rajasthan Green Rajasthan
            </div>
            <div className="font-mono text-slate-400">
              Build v1.0.0-PROD • Rajasthan Phase 1
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
