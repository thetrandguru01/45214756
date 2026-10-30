import React, { useState, useRef } from 'react';
import { useApp } from '../../lib/store';
import {
  Camera,
  Upload,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import { RAJASTHAN_HIERARCHY } from '../../data/mockData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'formFirst' | 'photoFirst';
}

const SAMPLE_GARBAGE_PHOTOS = [
  {
    title: 'Overflowing Municipal Bin',
    url: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80',
    category: 'Overflowing Dumpster',
  },
  {
    title: 'Plastic Waste on Roadside',
    url: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80',
    category: 'Road Litter / Plastic',
  },
  {
    title: 'Dry Leaves & Debris Pile',
    url: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=600&q=80',
    category: 'Unattended Garbage Dump',
  },
];

export const ComplaintRegistrationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialMode = 'formFirst',
}) => {
  const { user, registerComplaint, selectedDistrict, selectedCity, selectedWard, showToast } = useApp();

  const [step, setStep] = useState<number>(initialMode === 'photoFirst' ? 1 : 1);
  const [photoUrl, setPhotoUrl] = useState<string>(
    initialMode === 'photoFirst' ? '' : SAMPLE_GARBAGE_PHOTOS[0].url
  );
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Overflowing Dumpster');
  const [description, setDescription] = useState('');
  const [complainantName, setComplainantName] = useState(user.name || '');
  const [complainantPhone, setComplainantPhone] = useState(user.phone || '');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [stateName, setStateName] = useState('Rajasthan');
  const [district, setDistrict] = useState(selectedDistrict);
  const [city, setCity] = useState(selectedCity);
  const [ward, setWard] = useState(selectedWard);
  const [address, setAddress] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'emergency'>('high');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentDistrictObj =
    RAJASTHAN_HIERARCHY.districts.find(
      (d) => d.name.toLowerCase() === district.toLowerCase()
    ) || RAJASTHAN_HIERARCHY.districts[0];

  const currentCityObj =
    currentDistrictObj.cities.find(
      (c) => c.name.toLowerCase() === city.toLowerCase()
    ) || currentDistrictObj.cities[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoUrl(reader.result as string);
        showToast('Photo uploaded from device successfully', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!photoUrl) {
      showToast('Please provide a photo of the garbage site', 'error');
      setStep(2);
      return;
    }

    const created = registerComplaint({
      title: title || `${category} reported at ${ward}`,
      category,
      description: description || 'Garbage accumulation requiring immediate auto-tipper collection.',
      photoUrl,
      complainantName: isAnonymous ? 'Anonymous Citizen' : complainantName || 'Resident',
      complainantPhone: isAnonymous ? 'Hidden' : complainantPhone || '+91 98765 43210',
      isAnonymous,
      state: stateName,
      district,
      city,
      ward,
      address: address || `Near main market lane, ${ward}, ${city}`,
      lat: currentCityObj.center[0] + (Math.random() * 0.01 - 0.005),
      lng: currentCityObj.center[1] + (Math.random() * 0.01 - 0.005),
      priority,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full my-auto overflow-hidden shadow-2xl border border-slate-200 text-slate-800">
        {/* Header matching UI board */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white p-1 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h3 className="font-bold text-base text-white">Register a Complaint</h3>
              <p className="text-[11px] text-emerald-300">Public Swachhata Grievance Portal</p>
            </div>
          </div>

          {/* Stepper Indicator as on UI Board */}
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${
                step === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 text-center text-[10px] flex items-center justify-center">
                1
              </span>
              <span>Details</span>
            </div>
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${
                step === 2 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 text-center text-[10px] flex items-center justify-center">
                2
              </span>
              <span>Photo</span>
            </div>
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full ${
                step === 3 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white/20 text-center text-[10px] flex items-center justify-center">
                3
              </span>
              <span>Review</span>
            </div>
          </div>
        </div>

        {/* Multi-step form body */}
        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
          {/* STEP 1: Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Report Anonymously?</span>
                  <span className="text-[11px] text-slate-500">Your phone/name will not be shared publicly</span>
                </div>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
              </div>

              {!isAnonymous && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={complainantName}
                      onChange={(e) => setComplainantName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={complainantPhone}
                      onChange={(e) => setComplainantPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Multi-City Hierarchy Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State (Mandatory)
                  </label>
                  <select
                    disabled
                    value={stateName}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-700"
                  >
                    <option value="Rajasthan">Rajasthan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    District *
                  </label>
                  <select
                    value={district}
                    onChange={(e) => {
                      const newDist = e.target.value;
                      setDistrict(newDist);
                      const dObj = RAJASTHAN_HIERARCHY.districts.find((d) => d.name === newDist);
                      if (dObj) {
                        setCity(dObj.cities[0].name);
                        setWard(dObj.cities[0].wards[0]);
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / Tehsil *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => {
                      const newCity = e.target.value;
                      setCity(newCity);
                      const cObj = currentDistrictObj.cities.find((c) => c.name === newCity);
                      if (cObj) setWard(cObj.wards[0]);
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assigned Ward (1–50) *
                  </label>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    {currentCityObj.wards.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Waste Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Overflowing Dumpster">Overflowing Dumpster</option>
                    <option value="Road Litter / Plastic">Road Litter / Plastic</option>
                    <option value="Unattended Garbage Dump">Unattended Garbage Dump</option>
                    <option value="Dead Animal / Biohazard">Dead Animal / Biohazard (Urgent)</option>
                    <option value="Sewage / Stagnant Water">Sewage / Stagnant Water</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specific Street / House / Landmark Address *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Near Govt Senior Secondary School, Scheme 10"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description &amp; Urgency Note
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue, estimated size of pile, or hazards..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Continue to Photo Upload</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Photo Upload */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center">
                <h4 className="font-bold text-slate-900 text-base">Upload Complaint Photo</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visual proof ensures faster vehicle dispatch &amp; automatic badge tracking
                </p>
              </div>

              {/* Photo Preview or Drop Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative border-2 border-dashed border-emerald-400/80 bg-emerald-50/40 rounded-3xl p-6 text-center cursor-pointer hover:bg-emerald-50 transition-all flex flex-col items-center justify-center min-h-[200px]"
              >
                {photoUrl ? (
                  <div className="relative w-full">
                    <img
                      src={photoUrl}
                      alt="Complaint preview"
                      className="w-full h-48 object-cover rounded-2xl shadow-md border border-emerald-300"
                    />
                    <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-1 rounded-lg flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Photo Attached</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                      <Camera className="w-8 h-8" />
                    </div>
                    <span className="font-bold text-sm text-slate-900">
                      Tap to upload photo or choose from gallery
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      JPG, PNG, WebP up to 10MB
                    </span>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {/* Preset Sample Trash Photos for instant testing */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Or select a sample situation for quick demo:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SAMPLE_GARBAGE_PHOTOS.map((sample, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setPhotoUrl(sample.url);
                        setCategory(sample.category);
                        showToast(`Selected "${sample.title}"`, 'info');
                      }}
                      className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                        photoUrl === sample.url
                          ? 'border-emerald-600 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={sample.url}
                        alt={sample.title}
                        className="w-full h-16 object-cover"
                      />
                      <div className="p-1 bg-white text-[10px] font-medium text-slate-700 truncate text-center">
                        {sample.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!photoUrl}
                  className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Review &amp; Submit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Review */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
                <div className="flex items-start gap-3">
                  <img
                    src={photoUrl}
                    alt="Review"
                    className="w-20 h-20 rounded-xl object-cover shrink-0 border border-emerald-300 shadow-sm"
                  />
                  <div className="text-xs space-y-1">
                    <span className="font-bold text-emerald-900 block text-sm">{category}</span>
                    <p className="text-slate-700 font-medium">
                      {ward}, {city}, {district}
                    </p>
                    <p className="text-slate-500 truncate">{address || 'No landmark specified'}</p>
                    <p className="text-[10px] text-slate-400">
                      Reported by: {isAnonymous ? 'Anonymous' : complainantName || 'Citizen'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-600">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Immediate Action SLA</span>
                </div>
                <p>
                  Assigned auto-tipper driver will receive GPS coordinates directly on their onboard navigation device.
                </p>
                <p className="text-emerald-700 font-semibold">
                  Upon verified resolution, this counts toward your Clean Warrior badge &amp; weekly ₹1,000 lottery!
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Submit Complaint Now</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
