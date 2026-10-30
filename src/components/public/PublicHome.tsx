import React, { useState } from 'react';
import { useApp } from '../../lib/store';
import { InteractiveMap } from '../common/InteractiveMap';
import { ComplaintRegistrationModal } from './ComplaintRegistrationModal';
import { ComplaintTrackingModal } from './ComplaintTrackingModal';
import { RewardsDashboard } from './RewardsDashboard';
import { HelpSupportModal } from './HelpSupportModal';
import { RAJASTHAN_HIERARCHY } from '../../data/mockData';
import {
  FileText,
  Camera,
  MapPin,
  Search,
  Truck,
  Award,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Lock,
  ChevronRight,
  ExternalLink,
  Phone,
  Building2,
  Radio,
} from 'lucide-react';
import { Vehicle } from '../../types';

export const PublicHome: React.FC = () => {
  const {
    user,
    setPortal,
    publicTab,
    setPublicTab,
    vehicles,
    filteredVehicles,
    complaints,
    filteredComplaints,
    selectedDistrict,
    setSelectedDistrict,
    selectedCity,
    setSelectedCity,
    selectedWard,
    setSelectedWard,
    setLoginModalOpen,
    showToast,
  } = useApp();

  // Modals state
  const [complaintModalOpen, setComplaintModalOpen] = useState(false);
  const [complaintModalMode, setComplaintModalMode] = useState<'formFirst' | 'photoFirst'>('formFirst');
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [trackingQuery, setTrackingQuery] = useState('');
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [focusedVehicle, setFocusedVehicle] = useState<Vehicle | null>(null);

  // Selector state for "Track Garbage Vehicle" card
  const currentDistrictObj =
    RAJASTHAN_HIERARCHY.districts.find(
      (d) => d.name.toLowerCase() === selectedDistrict.toLowerCase()
    ) || RAJASTHAN_HIERARCHY.districts[0];

  const currentCityObj =
    currentDistrictObj.cities.find(
      (c) => c.name.toLowerCase() === selectedCity.toLowerCase()
    ) || currentDistrictObj.cities[0];

  const handleTrackVehicleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Find active vehicle for this ward or city
    const match = filteredVehicles.find(
      (v) => v.ward.toLowerCase() === selectedWard.toLowerCase()
    ) || filteredVehicles[0];

    if (match) {
      setFocusedVehicle(match);
      setPublicTab('map');
      showToast(`Tracking ${match.vehicleNumber} deployed for ${selectedWard}`, 'success');
    } else {
      showToast(`No vehicle deployed in ${selectedWard} right now`, 'info');
    }
  };

  const handleTrackComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingQuery) {
      showToast('Please enter your Complaint ID or Mobile', 'error');
      return;
    }
    setTrackingModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 overflow-x-auto gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {[
            { id: 'home', label: 'Home Dashboard', icon: <Building2 className="w-4 h-4" /> },
            { id: 'map', label: 'Live Vehicle Tracking', icon: <Truck className="w-4 h-4" /> },
            { id: 'complaints', label: 'Complaint History', icon: <FileText className="w-4 h-4" /> },
            { id: 'rewards', label: 'Badges & Rewards', icon: <Award className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setPublicTab(tab.id);
                if (tab.id === 'map' && !focusedVehicle && filteredVehicles.length > 0) {
                  setFocusedVehicle(filteredVehicles[0]);
                }
              }}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                publicTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setHelpModalOpen(true)}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-700 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors shrink-0"
        >
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          <span className="hidden sm:inline">Help &amp; FAQs</span>
        </button>
      </div>

      {/* TAB 1: HOME DASHBOARD */}
      {publicTab === 'home' && (
        <div className="space-y-8">
          {/* Main 3 Action Boards matching UI Board Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 1: Register a Complaint */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                    <FileText className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200">
                    No Login Required
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900">Register a Complaint</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Report overflowing bins, illegal street dumps, plastic litter or biohazards in your ward with geotagged photo proof.
                </p>
              </div>

              {/* Two Action Buttons exactly matching UI Board */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={() => {
                    setComplaintModalMode('formFirst');
                    setComplaintModalOpen(true);
                  }}
                  className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-left transition-all group"
                >
                  <div className="flex items-center justify-between text-emerald-700 font-bold text-xs mb-1">
                    <span>Fill Form &rarr;</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block leading-tight">
                    Then Upload Photo
                  </span>
                </button>

                <button
                  onClick={() => {
                    setComplaintModalMode('photoFirst');
                    setComplaintModalOpen(true);
                  }}
                  className="p-3 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-left transition-all group"
                >
                  <div className="flex items-center justify-between text-blue-700 font-bold text-xs mb-1">
                    <span>Upload Photo &rarr;</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block leading-tight">
                    Then Fill Details
                  </span>
                </button>
              </div>
            </div>

            {/* Card 2: Track Garbage Vehicle */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-xs">
                  <Truck className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  <Radio className="w-3 h-3 text-blue-600 animate-pulse" />
                  <span>Live AIS-140 GPS</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-900">Track Garbage Vehicle</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                Check live location, vehicle number, and arrival status for your ward tipper.
              </p>

              <form onSubmit={handleTrackVehicleSubmit} className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Select District
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => {
                      const dName = e.target.value;
                      setSelectedDistrict(dName);
                      const dObj = RAJASTHAN_HIERARCHY.districts.find((d) => d.name === dName);
                      if (dObj) {
                        setSelectedCity(dObj.cities[0].name);
                        setSelectedWard(dObj.cities[0].wards[0]);
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {RAJASTHAN_HIERARCHY.districts.map((d) => (
                      <option key={d.id} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Select Area / City
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => {
                      const cName = e.target.value;
                      setSelectedCity(cName);
                      const cObj = currentDistrictObj.cities.find((c) => c.name === cName);
                      if (cObj) setSelectedWard(cObj.wards[0]);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {currentDistrictObj.cities.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Select Ward
                  </label>
                  <select
                    value={selectedWard}
                    onChange={(e) => setSelectedWard(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {currentCityObj.wards.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5" />
                  <span>Track Now</span>
                </button>
              </form>
            </div>

            {/* Card 3: Track Complaint Status */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shadow-xs">
                    <Clock className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                    Grievance Audit
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900">Track Complaint Status</h3>
                <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                  Enter your complaint registration ID or registered mobile to view assigned team, before/after photos and resolution audit.
                </p>

                <form onSubmit={handleTrackComplaintSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Complaint ID / Mobile Number
                    </label>
                    <input
                      type="text"
                      value={trackingQuery}
                      onChange={(e) => setTrackingQuery(e.target.value)}
                      placeholder="e.g. 89412 or 9876543210"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Track Status</span>
                  </button>
                </form>
              </div>

              {/* Sample Complaints Pill List */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                <span className="font-semibold block mb-1">Quick Sample IDs:</span>
                <div className="flex flex-wrap gap-1.5">
                  {complaints.slice(0, 2).map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setTrackingQuery(c.id);
                        setTrackingModalOpen(true);
                      }}
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 font-mono text-[10px] text-slate-700"
                    >
                      #{c.id.split('-').pop()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cleanliness Statistics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Active Fleet</span>
                <span className="text-xl font-bold text-slate-900 font-mono">
                  {filteredVehicles.filter((v) => v.status === 'on_route' || v.status === 'active').length}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold block">
                  On Duty in {selectedDistrict}
                </span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Cleanups Resolved</span>
                <span className="text-xl font-bold text-slate-900 font-mono">
                  {filteredComplaints.filter((c) => c.status === 'resolved').length}
                </span>
                <span className="text-[10px] text-blue-700 font-semibold block">Verified by Photo</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Pending Cleanups</span>
                <span className="text-xl font-bold text-slate-900 font-mono">
                  {filteredComplaints.filter((c) => c.status !== 'resolved').length}
                </span>
                <span className="text-[10px] text-rose-700 font-semibold block">In Progress Today</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Weekly Giveaway</span>
                <span className="text-xl font-bold text-slate-900 font-mono">₹1,000</span>
                <span className="text-[10px] text-purple-700 font-semibold block">50 Cleanups Target</span>
              </div>
            </div>
          </div>

          {/* Live Nearby Vehicles Preview */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Nearby Garbage Auto-Tippers in {selectedDistrict}
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time GPS coordinates, vehicle registration number, and operating status
                </p>
              </div>

              <button
                onClick={() => setPublicTab('map')}
                className="self-start sm:self-auto text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <span>View Full Map</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Compact Map Preview */}
            <InteractiveMap
              vehicles={filteredVehicles}
              height="360px"
              centerDistrict={selectedDistrict}
              onSelectVehicle={(veh) => {
                setFocusedVehicle(veh);
              }}
            />

            {/* Nearby Vehicles List Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {filteredVehicles.slice(0, 3).map((v) => (
                <div
                  key={v.id}
                  onClick={() => {
                    setFocusedVehicle(v);
                    setPublicTab('map');
                  }}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {v.vehicleNumber}
                      </span>
                      <p className="text-xs font-semibold text-slate-800 mt-1">{v.ward}</p>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        v.status === 'on_route'
                          ? 'bg-emerald-100 text-emerald-800'
                          : v.status === 'idle'
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {v.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                    <span className="text-[11px] text-slate-500">Distance Today:</span>
                    <span className="font-bold text-emerald-700 font-mono">{v.totalDistanceTodayKm} km</span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-1">
                    📍 {v.lastUpdatedLocation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIVE VEHICLE TRACKING FULL MAP */}
      {publicTab === 'map' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Live Garbage Vehicle Telemetry Map
              </h3>
              <p className="text-xs text-slate-500">
                AIS-140 GPS transponder feed for {selectedDistrict} ({selectedCity})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">Focus Vehicle:</span>
              <select
                value={focusedVehicle?.id || ''}
                onChange={(e) => {
                  const found = filteredVehicles.find((v) => v.id === e.target.value);
                  setFocusedVehicle(found || null);
                }}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-mono font-bold"
              >
                <option value="">All Vehicles</option>
                {filteredVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.vehicleNumber} ({v.ward}) - {v.status.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <InteractiveMap
            vehicles={filteredVehicles}
            height="550px"
            centerDistrict={selectedDistrict}
            focusedRouteVehicle={focusedVehicle}
          />
        </div>
      )}

      {/* TAB 3: COMPLAINT HISTORY */}
      {publicTab === 'complaints' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Cleanliness Complaints History</h3>
              <p className="text-xs text-slate-500">
                All public grievances logged for {selectedDistrict} District
              </p>
            </div>

            <button
              onClick={() => {
                setComplaintModalMode('formFirst');
                setComplaintModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              + File New Complaint
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredComplaints.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        #{c.id}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          c.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {c.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 mt-1">{c.title}</h4>
                  </div>

                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {c.createdAt}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img
                    src={c.photoUrl}
                    alt={c.title}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="text-xs space-y-1 text-slate-600">
                    <p className="font-medium text-slate-800">
                      📍 {c.address || c.ward}, {c.city}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{c.description}</p>
                    {c.assignedVehicleNo && (
                      <p className="text-[10px] text-emerald-700 font-semibold">
                        Assigned: {c.assignedVehicleNo} ({c.assignedOfficer || 'Sanitary Inspector'})
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      setTrackingQuery(c.id);
                      setTrackingModalOpen(true);
                    }}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <span>View Resolution Audit</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {c.status === 'resolved' && (
                    <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified Cleanup
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: REWARDS & BADGE DASHBOARD */}
      {publicTab === 'rewards' && <RewardsDashboard />}

      {/* Modals */}
      <ComplaintRegistrationModal
        isOpen={complaintModalOpen}
        onClose={() => setComplaintModalOpen(false)}
        initialMode={complaintModalMode}
      />

      <ComplaintTrackingModal
        isOpen={trackingModalOpen}
        onClose={() => setTrackingModalOpen(false)}
        initialQuery={trackingQuery}
      />

      <HelpSupportModal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
      />

      {/* BOTTOM ADMIN PORTAL OPTION AS INSTRUCTED IN SECTION 6 */}
      <div className="mt-12 pt-8 border-t border-slate-200">
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="font-bold text-sm text-white">Government Administration Portal</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Authorized Personnel
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Multi-City Vehicle Fleet Control, Driver Credentials, Fuel &amp; Automated Daily Reports
              </p>
            </div>
          </div>

          <button
            onClick={() => setPortal('government')}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors shrink-0 flex items-center gap-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Open Government Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
