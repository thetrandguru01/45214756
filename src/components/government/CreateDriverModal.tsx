import React, { useState, useRef } from 'react';
import { useApp } from '../../lib/store';
import { DriverUser } from '../../types';
import {
  User,
  Phone,
  MapPin,
  Truck,
  Camera,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { RAJASTHAN_HIERARCHY } from '../../data/mockData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateDriverModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { createDriverAccount, selectedDistrict, selectedCity, showToast } = useApp();

  const [step, setStep] = useState<'form' | 'credentials'>('form');
  const [fullName, setFullName] = useState('Suresh Kumar');
  const [mobileNumber, setMobileNumber] = useState('+91 98765 43210');
  const [address, setAddress] = useState('House No. 12, Village, Alwar, Rajasthan - 301001');
  const [vehicleNumber, setVehicleNumber] = useState('RJ 02 AB 1234');
  const [wardNumber, setWardNumber] = useState('Ward 45');
  const [driverPhoto, setDriverPhoto] = useState(
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  );
  const [aadhaarFront, setAadhaarFront] = useState(
    'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?auto=format&fit=crop&w=400&q=80'
  );
  const [aadhaarBack, setAadhaarBack] = useState(
    'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?auto=format&fit=crop&w=400&q=80'
  );

  const [createdResult, setCreatedResult] = useState<{
    driver: DriverUser;
    tempPassword: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    const res = createDriverAccount({
      name: fullName,
      phone: mobileNumber,
      address,
      district: selectedDistrict,
      assignedVehicleNo: vehicleNumber,
      assignedWard: wardNumber,
      photoUrl: driverPhoto,
      aadhaarFrontUrl: aadhaarFront,
      aadhaarBackUrl: aadhaarBack,
    });

    setCreatedResult(res);
    setStep('credentials');
  };

  const handleCopyCredentials = () => {
    if (!createdResult) return;
    const text = `TheAutoDip Driver Credentials:\nDriver ID: ${createdResult.driver.driverIdCode}\nUsername: ${createdResult.driver.driverIdCode.toLowerCase()}@theautodip.in\nTemporary Password: ${createdResult.tempPassword}\nAssigned Vehicle: ${createdResult.driver.assignedVehicleNo}\nWard: ${createdResult.driver.assignedWard}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    showToast('Credentials copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full my-auto overflow-hidden shadow-2xl border border-slate-200 text-slate-800">
        {/* Header matching UI Board */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {step === 'form' ? 'Create New Driver Account' : 'Generated Driver Credentials'}
              </h3>
              <p className="text-[11px] text-emerald-300">
                {selectedDistrict} Municipal Corporation Fleet Enrollment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-bold text-lg p-1"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        {step === 'form' ? (
          <form onSubmit={handleCreate} className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto space-y-4">
            <div className="border-b pb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Driver Personal Information
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-2.5">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Residential Address *
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Photos & Aadhaar KYC Section matching UI Board */}
            <div className="border-b pb-3 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Driver Identity &amp; Verification Documents
              </h4>

              {/* Driver Portrait */}
              <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <img
                  src={driverPhoto}
                  alt="Driver"
                  className="w-14 h-14 rounded-xl object-cover border border-slate-300 shadow-xs"
                />
                <div className="flex-1">
                  <span className="text-xs font-bold text-slate-800 block">Driver Photograph *</span>
                  <span className="text-[10px] text-slate-500 block mb-1">
                    Clear front-facing photo used for AI face verification
                  </span>
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold text-[10px] hover:bg-slate-50"
                  >
                    Change Photo
                  </button>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setDriverPhoto(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </div>

              {/* Aadhaar Cards front & back matching UI Board */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-700 block mb-1">
                    Aadhaar Card (Front) *
                  </span>
                  <img
                    src={aadhaarFront}
                    alt="Aadhaar Front"
                    className="w-full h-16 object-cover rounded-lg border border-slate-200 mb-1.5"
                  />
                  <span className="text-[9px] text-emerald-700 font-semibold block">
                    ✓ Verified Document
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
                  <span className="text-[10px] font-bold text-slate-700 block mb-1">
                    Aadhaar Card (Back) *
                  </span>
                  <img
                    src={aadhaarBack}
                    alt="Aadhaar Back"
                    className="w-full h-16 object-cover rounded-lg border border-slate-200 mb-1.5"
                  />
                  <span className="text-[9px] text-emerald-700 font-semibold block">
                    ✓ Address Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Assignment Section matching UI Board */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Fleet &amp; Ward Assignment
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Vehicle Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assigned Ward Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={wardNumber}
                    onChange={(e) => setWardNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-4"
            >
              <span>Generate Driver Account</span>
            </button>
          </form>
        ) : (
          /* Credentials Screen matching UI Board */
          <div className="p-6 space-y-5 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center ring-8 ring-emerald-50 shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="font-extrabold text-slate-900 text-lg">
                Driver Account Created Successfully!
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Share these credentials with the driver securely. Password is permanent and cannot be viewed again.
              </p>
            </div>

            {/* Credentials Card matching UI Board */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-sans">Driver ID (Login ID):</span>
                <span className="font-bold text-slate-900 text-sm">
                  {createdResult?.driver.driverIdCode}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-sans">Email / Username:</span>
                <span className="font-bold text-slate-800">
                  {createdResult?.driver.driverIdCode.toLowerCase()}@theautodip.in
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-sans">Assigned Vehicle:</span>
                <span className="font-bold text-emerald-700">
                  {createdResult?.driver.assignedVehicleNo} ({createdResult?.driver.assignedWard})
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-sans">Generated Password:</span>
                <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  {createdResult?.tempPassword}
                </span>
              </div>
            </div>

            <button
              onClick={handleCopyCredentials}
              className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Credentials'}</span>
            </button>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-left flex items-start gap-2 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Important:</span>
                <p className="text-[11px] text-amber-700">
                  Password is permanent. You can only reset it later if needed by district supervisor.
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                setStep('form');
              }}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
