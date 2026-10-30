import React, { useState } from 'react';
import {
  Leaf,
  Truck,
  Building2,
  Users,
  Bell,
  User as UserIcon,
  ChevronDown,
  ShieldCheck,
  Check,
  LogOut,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../../lib/store';
import { RAJASTHAN_HIERARCHY } from '../../data/mockData';

export const Header: React.FC = () => {
  const {
    portal,
    setPortal,
    user,
    admin,
    switchAdmin,
    setLoginModalOpen,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    selectedDistrict,
    setSelectedDistrict,
    setSelectedCity,
    resetAllDataToDefaults,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showDistrictMenu, setShowDistrictMenu] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Rajasthan Govt Official Flag Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-emerald-950 text-white text-[11px] px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-emerald-300">Clean Rajasthan • Green Rajasthan</span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-300">Swachh Bharat Urban Mission Phase 1</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Multi-City District Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowDistrictMenu(!showDistrictMenu)}
              className="flex items-center gap-1 text-[11px] bg-white/10 hover:bg-white/20 px-2.5 py-0.5 rounded-full text-slate-200 transition-colors border border-white/10"
            >
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>{selectedDistrict} District</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showDistrictMenu && (
              <div className="absolute right-0 mt-1 w-56 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Select District (Multi-City Hierarchy)
                </div>
                {RAJASTHAN_HIERARCHY.districts.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setSelectedDistrict(d.name);
                      setSelectedCity(d.cities[0].name);
                      setShowDistrictMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 ${
                      selectedDistrict.toLowerCase() === d.name.toLowerCase()
                        ? 'font-bold text-emerald-700 bg-emerald-50/50'
                        : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <span>{d.name}</span>
                      <span className="block text-[10px] text-slate-400">
                        {d.cities.map((c) => c.name).join(', ')}
                      </span>
                    </div>
                    {selectedDistrict.toLowerCase() === d.name.toLowerCase() && (
                      <Check className="w-4 h-4 text-emerald-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={resetAllDataToDefaults}
            title="Reset to default data"
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden md:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div
          onClick={() => setPortal('public')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-slate-900">
                The<span className="text-emerald-600">AutoDip</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-200">
                Official
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium -mt-0.5 hidden xs:block">
              Smart Garbage Vehicle Tracking &amp; Cleanliness
            </p>
          </div>
        </div>

        {/* 3 Portal Navigation Pills (As on UI Board) */}
        <nav className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setPortal('public')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
              portal === 'public'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Public</span>
          </button>

          <button
            onClick={() => setPortal('government')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
              portal === 'government'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Government</span>
          </button>

          <button
            onClick={() => setPortal('driver')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all ${
              portal === 'driver'
                ? 'bg-blue-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Driver</span>
          </button>
        </nav>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-2">
          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-[10px] text-white font-bold flex items-center justify-center ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50">
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Notifications</h4>
                    <span className="text-[11px] text-slate-500">{unreadCount} unread updates</span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                          !n.read ? 'bg-emerald-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-xs font-semibold ${!n.read ? 'text-slate-900' : 'text-slate-600'}`}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                            {n.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User / Admin Profile pill */}
          {portal === 'government' ? (
            <div className="relative">
              <button
                onClick={() => setShowAdminMenu(!showAdminMenu)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors text-xs font-semibold"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-900 font-bold flex items-center justify-center text-xs">
                  {admin ? admin.name.charAt(0) : 'G'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-[11px] leading-tight font-bold">{admin?.name}</div>
                  <div className="text-[9px] text-emerald-300 font-normal">{admin?.assignedDistrict} Officer</div>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showAdminMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900">{admin?.name}</p>
                    <p className="text-[11px] text-slate-500">{admin?.department}</p>
                    <p className="text-[10px] font-mono text-emerald-700 font-bold mt-0.5">
                      Badge: {admin?.badgeNumber}
                    </p>
                  </div>

                  <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400">
                    Switch Officer (Test Multi-City RBAC)
                  </div>
                  <button
                    onClick={() => {
                      switchAdmin('adm-01');
                      setShowAdminMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-800">Suresh Kumar</div>
                      <div className="text-[10px] text-slate-500">Alwar District Officer</div>
                    </div>
                    {admin?.id === 'adm-01' && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>

                  <button
                    onClick={() => {
                      switchAdmin('adm-02');
                      setShowAdminMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-800">Pooja Sharma</div>
                      <div className="text-[10px] text-slate-500">Khairthal-Tijara Officer</div>
                    </div>
                    {admin?.id === 'adm-02' && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>

                  <button
                    onClick={() => {
                      switchAdmin('adm-03');
                      setShowAdminMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-800">Dr. Rajendra Singh</div>
                      <div className="text-[10px] text-slate-500">State Admin (All Districts)</div>
                    </div>
                    {admin?.id === 'adm-03' && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                </div>
              )}
            </div>
          ) : portal === 'public' ? (
            user.isRegistered ? (
              <div
                onClick={() => setLoginModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 cursor-pointer transition-colors text-xs font-semibold"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline font-bold">{user.name.split(' ')[0]}</span>
              </div>
            ) : (
              <button
                onClick={() => setLoginModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                Sign In
              </button>
            )
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold">
              <Truck className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">Driver Active</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
