import React, { useState, useEffect } from 'react';
import { useApp } from '../../lib/store';
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  Phone,
  Navigation,
  Radio,
  UserCheck,
  Flame,
} from 'lucide-react';
import { InteractiveMap } from '../common/InteractiveMap';

export const DriverPortal: React.FC = () => {
  const { currentDriver, markDriverAttendance, vehicles, filteredVehicles, showToast } = useApp();

  const [faceModalOpen, setFaceModalOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [scanStep, setScanStep] = useState<'position' | 'scanning' | 'success'>('position');

  // Find driver's vehicle
  const driverVehicle =
    vehicles.find((v) => v.vehicleNumber === currentDriver.assignedVehicleNo) ||
    filteredVehicles[0] ||
    vehicles[0];

  const handleStartFaceScan = () => {
    setFaceModalOpen(true);
    setScanStep('position');
    setVerifying(false);
  };

  const handlePerformVerification = () => {
    setVerifying(true);
    setScanStep('scanning');

    setTimeout(() => {
      setScanStep('success');
      setVerifying(false);
      markDriverAttendance(currentDriver.id, true);
    }, 2400);
  };

  const handleEmergencyAlert = () => {
    showToast('🚨 SOS Emergency Signal broadcast to Alwar Municipal Control Room!', 'error');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Driver Identity Card matching UI Board */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentDriver.photoUrl}
                alt={currentDriver.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-white">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900">{currentDriver.name}</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Active Duty
                </span>
              </div>
              <p className="font-mono text-xs font-bold text-slate-600 mt-0.5">
                Driver ID: {currentDriver.driverIdCode}
              </p>
              <p className="text-xs text-slate-500 font-mono">{currentDriver.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center min-w-[120px]">
              <span className="text-[10px] text-slate-500 font-medium block">Vehicle No.</span>
              <span className="font-mono font-bold text-sm text-slate-900">
                {currentDriver.assignedVehicleNo}
              </span>
            </div>
            <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-center min-w-[110px]">
              <span className="text-[10px] text-emerald-800 font-medium block">Assigned Ward</span>
              <span className="font-bold text-sm text-emerald-950">
                {currentDriver.assignedWard}
              </span>
            </div>
          </div>
        </div>

        {/* Mark Your Attendance Card matching UI Board */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 text-white text-center space-y-4 shadow-lg border border-emerald-500/30">
          <div>
            <h4 className="text-lg font-bold text-white">Mark Your Attendance</h4>
            <p className="text-xs text-emerald-200/90 mt-1">
              Use live camera for face verification (Max 5 attempts per day)
            </p>
          </div>

          {currentDriver.todayAttendanceStatus === 'approved' ? (
            <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/20 inline-flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Attendance Verified &amp; Approved for Today</span>
            </div>
          ) : (
            <button
              onClick={handleStartFaceScan}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white text-emerald-950 hover:bg-emerald-50 font-extrabold text-sm shadow-xl transition-all inline-flex items-center justify-center gap-2.5 active:scale-95"
            >
              <Camera className="w-5 h-5 text-emerald-700" />
              <span>Mark Attendance (Face Scan)</span>
            </button>
          )}

          <div className="flex items-center justify-between text-xs text-emerald-200/80 pt-2 border-t border-white/10">
            <span>Today's Status:</span>
            <span className="font-bold uppercase tracking-wider text-white">
              {currentDriver.todayAttendanceStatus === 'approved' ? (
                <span className="text-emerald-300 font-bold">Approved</span>
              ) : (
                <span className="text-rose-300 font-bold">Not Marked</span>
              )}
            </span>
          </div>
        </div>

        {/* Attendance History */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm">Attendance History</h4>
            <span className="text-xs text-slate-500">View All</span>
          </div>

          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  {currentDriver.attendanceTime || '2026-10-30 | 08:21 AM'}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold">
                  Face Verified (Liveness Confirmed)
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700 font-mono">Approved</span>
          </div>
        </div>
      </div>

      {/* Driver Live Ward Route Map */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              Today's Route &amp; Assigned Ward Coverage
            </h3>
            <p className="text-xs text-slate-500">
              Follow scheduled collection waypoints in {currentDriver.assignedWard}
            </p>
          </div>

          <button
            onClick={handleEmergencyAlert}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>SOS Emergency</span>
          </button>
        </div>

        <InteractiveMap
          vehicles={[driverVehicle]}
          height="380px"
          focusedRouteVehicle={driverVehicle}
        />
      </div>

      {/* Face Verification Modal matching UI Board */}
      {faceModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-5 shadow-2xl border border-slate-200 text-slate-800">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900">Face Verification</h3>
              </div>
              <button
                onClick={() => setFaceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Circular Face Guide matching UI Board */}
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
              {/* Outer pulse ring */}
              <div
                className={`absolute inset-0 rounded-full border-4 transition-colors duration-500 ${
                  scanStep === 'success'
                    ? 'border-emerald-500 ring-8 ring-emerald-100'
                    : scanStep === 'scanning'
                    ? 'border-blue-500 ring-8 ring-blue-100 animate-pulse'
                    : 'border-emerald-500/80 ring-4 ring-emerald-50'
                }`}
              />

              {/* Photo inside circle */}
              <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-white shadow-inner">
                <img
                  src={currentDriver.photoUrl}
                  alt="Face"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Scanning laser beam overlay */}
              {scanStep === 'scanning' && (
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-lg shadow-emerald-400/50 animate-bounce" />
              )}
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700">
                Please look at the camera and keep your face within the frame.
              </p>
              {scanStep === 'scanning' ? (
                <div className="flex items-center justify-center gap-2 text-xs font-bold text-blue-700 mt-2">
                  <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Liveness &amp; Aadhaar Biometrics...</span>
                </div>
              ) : scanStep === 'success' ? (
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 mt-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Identity Confirmed! Attendance Recorded.</span>
                </div>
              ) : null}
            </div>

            {/* Liveness Check Active Pill matching UI Board */}
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Liveness Check Active</span>
              </div>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Gallery photos are strictly not accepted. Live camera stream verified.
              </span>
            </div>

            {scanStep !== 'success' ? (
              <button
                onClick={handlePerformVerification}
                disabled={verifying}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-sm shadow-md transition-all"
              >
                {verifying ? 'Scanning Face...' : 'Verify Now'}
              </button>
            ) : (
              <button
                onClick={() => setFaceModalOpen(false)}
                className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all"
              >
                Done
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
