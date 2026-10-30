import React from 'react';
import { useApp } from '../../lib/store';
import {
  Award,
  Gift,
  ShieldCheck,
  Crown,
  HeartPulse,
  Sparkles,
  Trophy,
  Medal,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const RewardsDashboard: React.FC = () => {
  const { user, badges, triggerBadgeCelebration, showToast, updateComplaintStatus, complaints } = useApp();

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6" />;
      case 'Crown':
        return <Crown className="w-6 h-6" />;
      case 'HeartPulse':
        return <HeartPulse className="w-6 h-6" />;
      case 'Sparkles':
        return <Sparkles className="w-6 h-6" />;
      case 'Award':
        return <Award className="w-6 h-6" />;
      case 'Medal':
        return <Medal className="w-6 h-6" />;
      case 'Trophy':
        return <Trophy className="w-6 h-6" />;
      case 'Gift':
        return <Gift className="w-6 h-6" />;
      default:
        return <Award className="w-6 h-6" />;
    }
  };

  const completedCount = user.resolvedComplaintsCount;
  const giveawayGoal = 50;
  const giveawayProgress = Math.min(Math.round((completedCount / giveawayGoal) * 100), 100);

  // Quick simulate button to verify resolution and unlock badges dynamically
  const handleSimulateResolution = () => {
    const unres = complaints.find((c) => c.status !== 'resolved');
    if (unres) {
      updateComplaintStatus(
        unres.id,
        'resolved',
        'Cleaned and verified by Municipal Sanitation Team during live verification test.',
        'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80'
      );
    } else {
      triggerBadgeCelebration('Clean Warrior Milestone');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Weekly ₹1,000 Giveaway Qualification */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-emerald-950 p-6 sm:p-8 text-white shadow-xl border border-emerald-500/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-400/30">
              <Gift className="w-3.5 h-3.5 text-emerald-400" />
              <span>Rajasthan Swachhata Citizen Incentive</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Weekly ₹1,000 Citizen Giveaway
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Report and achieve <span className="font-bold text-white">50 successfully verified &amp; resolved complaints</span> to become eligible for the weekly ₹1,000 lottery cash prize! Only approved, resolved grievances count.
            </p>

            {/* Progress Bar towards 50 */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold font-mono">
                <span className="text-emerald-300">
                  {completedCount} of 50 Verified Cleanups Completed
                </span>
                <span className="text-white">{giveawayProgress}%</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full transition-all duration-500"
                  style={{ width: `${giveawayProgress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 text-center shrink-0 min-w-[200px]">
            <span className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider block">
              Giveaway Prize Pool
            </span>
            <div className="text-3xl font-black text-white font-mono mt-1">₹1,000</div>
            <span className="text-[10px] text-slate-300 block mt-0.5">Every Sunday 08:00 PM</span>
            <div className="mt-3 pt-3 border-t border-white/10 text-xs font-semibold">
              {completedCount >= 50 ? (
                <span className="text-emerald-400 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Eligible for Draw!
                </span>
              ) : (
                <span className="text-slate-300">
                  {50 - completedCount} more verified cleanups needed
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Badges Milestone Grid */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Milestone Achievement Badges</h3>
            <p className="text-xs text-slate-500">
              Official Swachhata honors unlocked through verified community complaints
            </p>
          </div>

          {/* Verification simulator button for instant user testing */}
          <button
            onClick={handleSimulateResolution}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-bold transition-colors border border-emerald-300"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Simulate Verified Clean-up (+1 Badge Point)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((b) => {
            const isUnlocked = completedCount >= b.requirementCount;

            return (
              <div
                key={b.id}
                className={`relative rounded-2xl p-5 border transition-all ${
                  isUnlocked
                    ? 'bg-white border-emerald-300 shadow-md ring-1 ring-emerald-500/20'
                    : 'bg-slate-50/80 border-slate-200 opacity-75'
                }`}
              >
                {/* Badge Top Status */}
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      isUnlocked
                        ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {getBadgeIcon(b.iconName)}
                  </div>

                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                      <Lock className="w-3 h-3" />
                      <span>{b.requirementCount} Verified Cleanups</span>
                    </span>
                  )}
                </div>

                <h4 className="font-bold text-sm text-slate-900 mb-1">{b.name}</h4>
                <p className="text-xs text-slate-600 leading-relaxed min-h-[48px]">
                  {b.description}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Official Reward:</span>
                  <span className="font-bold text-emerald-700 font-mono">+{b.rewardPoints} Pts</span>
                </div>

                {isUnlocked && (
                  <div className="mt-2 text-[10px] text-emerald-800 bg-emerald-50 p-1.5 rounded-lg border border-emerald-100 font-medium truncate">
                    🎁 {b.perk}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
