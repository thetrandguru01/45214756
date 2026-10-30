import React, { useState } from 'react';
import { useApp } from '../../lib/store';
import { Complaint, ComplaintStatus } from '../../types';
import {
  Search,
  CheckCircle2,
  Clock,
  Truck,
  UserCheck,
  MapPin,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Image as ImageIcon,
  Share2,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const ComplaintTrackingModal: React.FC<Props> = ({ isOpen, onClose, initialQuery = '' }) => {
  const { complaints, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedResult, setSelectedResult] = useState<Complaint | null>(
    complaints.length > 0 ? complaints[0] : null
  );

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      showToast('Please enter a Complaint ID or Mobile Number', 'error');
      return;
    }

    const match = complaints.find(
      (c) =>
        c.id.toLowerCase().includes(query) ||
        c.complainantPhone.replace(/\s+/g, '').includes(query.replace(/\s+/g, ''))
    );

    if (match) {
      setSelectedResult(match);
      showToast(`Found record for ${match.id}`, 'success');
    } else {
      showToast(`No complaint found matching "${searchQuery}"`, 'error');
    }
  };

  const steps: { key: ComplaintStatus; label: string; desc: string }[] = [
    { key: 'submitted', label: 'Submitted', desc: 'Complaint logged in municipal portal' },
    { key: 'assigned', label: 'Assigned', desc: 'Sanitary Inspector & Tipper dispatched' },
    { key: 'in_progress', label: 'In Progress', desc: 'Sanitation workers actively on-site' },
    { key: 'resolved', label: 'Resolved', desc: 'Waste cleared & verified with resolution photo' },
  ];

  const getStepIndex = (status: ComplaintStatus) => {
    switch (status) {
      case 'submitted':
        return 0;
      case 'assigned':
        return 1;
      case 'in_progress':
        return 2;
      case 'resolved':
        return 3;
      case 'rejected':
        return -1;
      default:
        return 0;
    }
  };

  const currentStepIdx = selectedResult ? getStepIndex(selectedResult.status) : 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full my-auto overflow-hidden shadow-2xl border border-slate-200 text-slate-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-emerald-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Track Complaint Status</h3>
              <p className="text-[11px] text-emerald-300">Live Municipal Grievance Tracking</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold text-lg p-1"
          >
            ✕
          </button>
        </div>

        {/* Search Bar matching UI Board: "Enter Complaint ID / Mobile Number -> Track" */}
        <div className="p-5 border-b border-slate-100 bg-slate-50">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Complaint ID (e.g. 89412) or Mobile..."
                className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
            >
              Track
            </button>
          </form>

          {/* Quick chip suggestions */}
          <div className="flex items-center gap-2 mt-2.5 overflow-x-auto text-[11px] text-slate-500">
            <span className="shrink-0 font-medium">Recent Reports:</span>
            {complaints.slice(0, 3).map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedResult(c)}
                className={`px-2 py-0.5 rounded-md font-mono shrink-0 border transition-colors ${
                  selectedResult?.id === c.id
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                #{c.id.split('-').pop()} ({c.status})
              </button>
            ))}
          </div>
        </div>

        {/* Selected Complaint Detail View */}
        {selectedResult ? (
          <div className="p-5 max-h-[60vh] overflow-y-auto space-y-5">
            {/* Status Summary Banner */}
            <div className="flex items-start justify-between gap-3 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black text-slate-900">
                    #{selectedResult.id}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                      selectedResult.status === 'resolved'
                        ? 'bg-emerald-600 text-white'
                        : selectedResult.status === 'in_progress'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-white'
                    }`}
                  >
                    {selectedResult.status.replace('_', ' ')}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 mt-1">{selectedResult.title}</h4>
                <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>
                    {selectedResult.address || selectedResult.ward}, {selectedResult.city} (
                    {selectedResult.district})
                  </span>
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate-400 block">Reported On</span>
                <span className="text-xs font-semibold text-slate-700 font-mono">
                  {selectedResult.createdAt}
                </span>
              </div>
            </div>

            {/* Step Timeline */}
            <div className="py-2">
              <h5 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
                Progress Status Timeline
              </h5>
              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {steps.map((s, idx) => {
                  const isDone = currentStepIdx >= idx;
                  const isCurrent = currentStepIdx === idx;

                  return (
                    <div key={s.key} className="relative">
                      {/* Timeline dot */}
                      <div
                        className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isDone
                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isDone ? '✓' : idx + 1}
                      </div>

                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold ${
                            isCurrent
                              ? 'text-emerald-700'
                              : isDone
                              ? 'text-slate-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {s.label}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                            Active Step
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{s.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Assigned Details */}
            {(selectedResult.assignedOfficer || selectedResult.assignedVehicleNo) && (
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-2">
                <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Assigned Field Sanitation Team</span>
                </h5>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Auto-Tipper Vehicle</span>
                    <span className="font-mono font-bold text-slate-800">
                      {selectedResult.assignedVehicleNo || 'Vehicle Dispatched'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Sanitary Inspector</span>
                    <span className="font-semibold text-slate-800">
                      {selectedResult.assignedOfficer || 'Ward Supervisor'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Before vs After Resolution Photographs */}
            <div>
              <h5 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>Verification Photographs</span>
              </h5>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 mb-1 block">
                    Before (Citizen Complaint)
                  </span>
                  <div className="rounded-xl overflow-hidden border border-slate-200 shadow-xs h-36 bg-slate-100">
                    <img
                      src={selectedResult.photoUrl}
                      alt="Before cleanup"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-slate-500 mb-1 block">
                    After (Cleaned &amp; Disinfected)
                  </span>
                  {selectedResult.resolutionPhotoUrl ? (
                    <div className="rounded-xl overflow-hidden border border-emerald-300 shadow-xs h-36 bg-emerald-50">
                      <img
                        src={selectedResult.resolutionPhotoUrl}
                        alt="After cleanup resolution"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-300 h-36 flex flex-col items-center justify-center p-3 text-center text-slate-400">
                      <Clock className="w-6 h-6 mb-1 text-slate-300" />
                      <span className="text-[11px] font-medium">Pending field resolution</span>
                      <span className="text-[9px] text-slate-400">Photo will appear once staff uploads proof</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Resolution Remarks */}
            {selectedResult.resolutionRemarks && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                <span className="font-bold text-emerald-900 block mb-0.5">Municipal Officer Remark:</span>
                <p className="text-emerald-800 leading-relaxed">{selectedResult.resolutionRemarks}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400 text-sm">
            Enter a Complaint ID above to view real-time tracking details.
          </div>
        )}

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
