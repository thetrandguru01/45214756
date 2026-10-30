import React, { useState } from 'react';
import { useApp } from '../../lib/store';
import { ShieldCheck, Phone, User, CheckCircle, ArrowRight, KeyRound, Sparkles, LogOut } from 'lucide-react';
import { RAJASTHAN_HIERARCHY } from '../../data/mockData';

export const AuthModal: React.FC = () => {
  const { loginModalOpen, setLoginModalOpen, user, loginAsCitizen, logoutCitizen, showToast } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'otp'>('login');
  const [phoneNumber, setPhoneNumber] = useState(user.phone || '');
  const [fullName, setFullName] = useState(user.name || '');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);

  if (!loginModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      showToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }
    setMode('otp');
    setTimer(45);
    showToast('OTP sent to your mobile: 428190', 'info');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpCode.join('');
    if (entered.length < 6 && entered !== '428190') {
      // allow default if not filled
    }
    loginAsCitizen(phoneNumber, fullName || 'Rahul Sharma');
  };

  const handleQuickOtpFill = () => {
    setOtpCode(['4', '2', '8', '1', '9', '0']);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 text-slate-800">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 to-emerald-950 p-6 text-white text-center relative">
          <button
            onClick={() => setLoginModalOpen(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-lg"
          >
            ✕
          </button>
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-2">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold">
            {user.isRegistered && mode === 'login'
              ? 'Citizen Profile'
              : mode === 'otp'
              ? 'OTP Verification'
              : mode === 'register'
              ? 'Citizen Registration'
              : 'Citizen Login'}
          </h3>
          <p className="text-xs text-emerald-300/90 mt-1">
            TheAutoDip • Verified Swachhata Identity
          </p>
        </div>

        {/* Profile Mode if already logged in */}
        {user.isRegistered && mode === 'login' ? (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4 bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white font-bold text-xl flex items-center justify-center shadow-md">
                {user.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-base text-slate-900">{user.name}</h4>
                <p className="text-xs text-slate-600 font-mono">{user.phone}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] bg-emerald-600 text-white font-semibold px-2 py-0.5 rounded-full">
                    {user.district} Citizen
                  </span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                    {user.resolvedComplaintsCount} Cleanups
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Registered Ward:</span>
                <span className="font-semibold text-slate-800">{user.ward} ({user.city})</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Unlocked Badges:</span>
                <span className="font-semibold text-emerald-700">{user.unlockedBadgeIds.length} Badges</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">Weekly ₹1,000 Giveaway:</span>
                <span className="font-semibold text-blue-700">
                  {user.resolvedComplaintsCount}/50 Verified Complaints
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  logoutCitizen();
                  setMode('login');
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-semibold text-xs transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>

              <button
                type="button"
                onClick={() => setLoginModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : mode === 'otp' ? (
          /* OTP Screen */
          <form onSubmit={handleVerifyOtp} className="p-6 space-y-4">
            <div className="text-center">
              <p className="text-xs text-slate-600">
                We sent a 6-digit verification code to
              </p>
              <p className="text-sm font-bold text-slate-900 font-mono">{phoneNumber}</p>
            </div>

            <div className="flex items-center justify-center gap-2">
              {otpCode.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const next = [...otpCode];
                    next[idx] = e.target.value;
                    setOtpCode(next);
                  }}
                  className="w-11 h-12 text-center text-lg font-bold rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 text-slate-900 font-mono"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <button
                type="button"
                onClick={handleQuickOtpFill}
                className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Autofill Demo OTP (428190)</span>
              </button>
              <span>Resend in {timer}s</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Verify &amp; Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800"
            >
              Change Phone Number
            </button>
          </form>
        ) : (
          /* Login / Register Form */
          <form onSubmit={handleSendOtp} className="p-6 space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-sm font-semibold text-slate-500">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phoneNumber.replace('+91 ', '')}
                  onChange={(e) => setPhoneNumber(`+91 ${e.target.value.replace(/\D/g, '')}`)}
                  placeholder="98765 43210"
                  className="w-full pl-12 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                An SMS with one-time verification code will be sent.
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Get OTP</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              {mode === 'login' ? (
                <p className="text-xs text-slate-600">
                  New citizen to TheAutoDip?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    Create Account
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    Log In
                  </button>
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
