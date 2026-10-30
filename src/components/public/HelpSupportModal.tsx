import React from 'react';
import { Phone, Mail, HelpCircle, ShieldCheck, FileText, ExternalLink, Leaf } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpSupportModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const faqs = [
    {
      q: 'How does live GPS vehicle tracking work?',
      a: 'Each municipal auto-tipper is equipped with an AIS-140 certified GPS device broadcasting real-time coordinates. You can monitor their location, heading, and distance to your ward.',
    },
    {
      q: 'Can I lodge a complaint without creating an account?',
      a: 'Yes! TheAutoDip allows quick anonymous or guest submissions. However, registered users can track resolution progress and earn milestone badges.',
    },
    {
      q: 'What is the weekly ₹1,000 giveaway?',
      a: 'Citizens who achieve 50 verified completed complaint resolutions are automatically enrolled into a weekly municipal lottery for ₹1,000 to reward active civic participation.',
    },
    {
      q: 'What happens if a vehicle deviates from its scheduled route?',
      a: 'The system triggers automatic Route Deviation Alerts on the Government Admin Portal, notifying ward sanitary supervisors immediately.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full my-auto overflow-hidden shadow-2xl border border-slate-200 text-slate-800">
        <div className="bg-gradient-to-r from-slate-900 to-emerald-950 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">About &amp; Citizen Support</h3>
              <p className="text-xs text-emerald-300">TheAutoDip Municipal Cleanliness System</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-lg p-1">
            ✕
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5 text-xs text-slate-600">
          {/* Official Helplines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider block">
                Swachh Rajasthan Toll-Free
              </span>
              <div className="text-base font-bold text-emerald-950 font-mono mt-1">
                1800-180-2442
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Available 24x7 across all districts</p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
              <span className="text-[10px] text-rose-800 font-bold uppercase tracking-wider block">
                Biohazard &amp; Emergency Hotline
              </span>
              <div className="text-base font-bold text-rose-950 font-mono mt-1">
                0144-2338822
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Alwar Municipal Control Room</p>
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>About TheAutoDip System</span>
            </h4>
            <p className="leading-relaxed">
              TheAutoDip is an end-to-end Smart Solid Waste Management and Telematics platform deployed for municipal councils across Rajasthan. It connects citizens directly with GPS-tracked auto-hopper tippers, enabling live tracking, instantaneous photographic grievance reporting, driver attendance, and fuel monitoring.
            </p>
          </div>

          {/* FAQs */}
          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Frequently Asked Questions</span>
            </h4>
            <div className="space-y-2.5">
              {faqs.map((f, i) => (
                <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                  <div className="font-bold text-slate-800">{f.q}</div>
                  <div className="text-slate-600 mt-1 leading-relaxed">{f.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-end bg-slate-50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
