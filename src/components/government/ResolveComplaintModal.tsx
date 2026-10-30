import React, { useState, useRef } from 'react';
import { useApp } from '../../lib/store';
import { Complaint, ComplaintStatus } from '../../types';
import {
  CheckCircle2,
  Truck,
  UserCheck,
  Camera,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface Props {
  complaint: Complaint | null;
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_CLEANED_PHOTOS = [
  {
    title: 'Site Emptied & Limed',
    url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Cleaned Footpath & Cleared Drain',
    url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Disinfected Commercial Dumpster',
    url: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=600&q=80',
  },
];

export const ResolveComplaintModal: React.FC<Props> = ({ complaint, isOpen, onClose }) => {
  const { updateComplaintStatus, filteredVehicles, admin, showToast } = useApp();

  const [status, setStatus] = useState<ComplaintStatus>(complaint?.status || 'assigned');
  const [remarks, setRemarks] = useState(
    complaint?.resolutionRemarks ||
      'Hopper tipper deployed. Garbage cleared, disposed at municipal transfer station, and disinfectant lime applied.'
  );
  const [resolutionPhoto, setResolutionPhoto] = useState(
    complaint?.resolutionPhotoUrl || SAMPLE_CLEANED_PHOTOS[0].url
  );
  const [assignedVehicle, setAssignedVehicle] = useState(
    complaint?.assignedVehicleNo || (filteredVehicles[0]?.vehicleNumber || 'RJ 02 AB 1234')
  );
  const [assignedStaff, setAssignedStaff] = useState(
    complaint?.assignedOfficer || `${admin?.name || 'Sanitary Inspector'} (Field Team)`
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !complaint) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateComplaintStatus(
      complaint.id,
      status,
      remarks,
      status === 'resolved' ? resolutionPhoto : undefined,
      'STF-FIELD-01',
      assignedVehicle
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full my-auto overflow-hidden shadow-2xl border border-slate-200 text-slate-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 p-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold bg-white/20 px-2 py-0.5 rounded">
                #{complaint.id}
              </span>
              <h3 className="font-bold text-base text-white">Grievance Action &amp; Resolution</h3>
            </div>
            <p className="text-[11px] text-emerald-300 mt-0.5">
              {complaint.ward}, {complaint.city} ({complaint.district})
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold text-lg p-1">
            ✕
          </button>
        </div>

        {/* Complaint Info & Action Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-4 text-xs">
          {/* Complaint Preview */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-start gap-3">
            <img
              src={complaint.photoUrl}
              alt="Citizen photo"
              className="w-20 h-20 rounded-xl object-cover border border-slate-300 shrink-0"
            />
            <div>
              <span className="font-bold text-slate-900 text-sm block">{complaint.title}</span>
              <span className="text-[11px] text-slate-500 block">{complaint.description}</span>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] bg-slate-200 font-bold px-2 py-0.5 rounded text-slate-700">
                  {complaint.category}
                </span>
                <span className="text-[10px] text-slate-500">
                  By: {complaint.complainantName} ({complaint.complainantPhone})
                </span>
              </div>
            </div>
          </div>

          {/* Status Switcher */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
              Update Grievance Status *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['assigned', 'in_progress', 'resolved'] as ComplaintStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`py-2 px-3 rounded-xl border text-center font-bold capitalize transition-all ${
                    status === st
                      ? st === 'resolved'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle & Staff Assignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Dispatch Auto-Tipper Vehicle *
              </label>
              <select
                value={assignedVehicle}
                onChange={(e) => setAssignedVehicle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {filteredVehicles.map((v) => (
                  <option key={v.id} value={v.vehicleNumber}>
                    {v.vehicleNumber} ({v.ward})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Supervising Officer *
              </label>
              <input
                type="text"
                value={assignedStaff}
                onChange={(e) => setAssignedStaff(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Resolution Proof Photo Upload */}
          {status === 'resolved' && (
            <div className="border-t pt-3 space-y-2">
              <label className="block font-bold text-slate-800 text-xs uppercase tracking-wider">
                Attach Resolution Proof Photograph *
              </label>
              <p className="text-[11px] text-slate-500">
                Official proof mandatory for closing grievance and awarding citizen Swachhata badges.
              </p>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative border-2 border-dashed border-emerald-300 bg-emerald-50/50 rounded-2xl p-4 text-center cursor-pointer hover:bg-emerald-50 transition-colors flex items-center justify-center gap-4"
              >
                {resolutionPhoto ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={resolutionPhoto}
                      alt="Proof"
                      className="w-20 h-16 object-cover rounded-xl border border-emerald-400 shadow-xs"
                    />
                    <div className="text-left">
                      <span className="font-bold text-emerald-950 block">Resolution Photo Attached</span>
                      <span className="text-[10px] text-emerald-700">Tap to upload fresh snapshot from device</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                    <Camera className="w-5 h-5" />
                    <span>Upload Clean Site Proof</span>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => setResolutionPhoto(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>

              {/* Sample Proof Photos */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {SAMPLE_CLEANED_PHOTOS.map((s, idx) => (
                  <div
                    key={idx}
                    onClick={() => setResolutionPhoto(s.url)}
                    className={`cursor-pointer rounded-xl overflow-hidden border transition-all ${
                      resolutionPhoto === s.url
                        ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={s.url} alt={s.title} className="w-full h-12 object-cover" />
                    <div className="p-1 bg-white text-[9px] text-slate-600 truncate text-center font-medium">
                      {s.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Remarks */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Field Action Remarks / Disposal Notes
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save &amp; Update Grievance</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
