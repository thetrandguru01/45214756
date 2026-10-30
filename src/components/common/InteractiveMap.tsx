import React, { useState, useId } from 'react';
import { Vehicle } from '../../types';
import {
  Navigation,
  Compass,
  Maximize2,
  ZoomIn,
  ZoomOut,
  MapPin,
  AlertTriangle,
  Radio,
  Layers,
  Settings,
  Truck,
  Phone,
  Gauge,
  Fuel,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../lib/store';

interface InteractiveMapProps {
  vehicles: Vehicle[];
  selectedVehicleId?: string | null;
  onSelectVehicle?: (vehicle: Vehicle) => void;
  height?: string;
  showAllControls?: boolean;
  centerDistrict?: string;
  focusedRouteVehicle?: Vehicle | null;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  height = '460px',
  showAllControls = true,
  centerDistrict = 'Alwar',
  focusedRouteVehicle,
}) => {
  const { gpsConfig, updateGpsConfig, showToast } = useApp();
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [mapMode, setMapMode] = useState<'streets' | 'satellite' | 'dark'>('streets');
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedPin, setSelectedPin] = useState<Vehicle | null>(
    focusedRouteVehicle || (selectedVehicleId ? vehicles.find((v) => v.id === selectedVehicleId) || null : null)
  );
  const filterId = useId();

  // Pick focused vehicle
  const activeFocus = focusedRouteVehicle || selectedPin || (selectedVehicleId ? vehicles.find((v) => v.id === selectedVehicleId) : null);

  // Geographic bounds approximation centered on Rajasthan cities (Alwar ~ 27.55, 76.63)
  const baseLat = activeFocus ? activeFocus.currentLat : centerDistrict.toLowerCase().includes('khairthal') ? 27.7972 : 27.5530;
  const baseLng = activeFocus ? activeFocus.currentLng : centerDistrict.toLowerCase().includes('khairthal') ? 76.6508 : 76.6346;

  // Convert lat/lng to normalized SVG map coordinates
  const latLngToCoords = (lat: number, lng: number) => {
    const latSpan = 0.08 / zoomLevel;
    const lngSpan = 0.12 / zoomLevel;

    const x = ((lng - (baseLng - lngSpan / 2)) / lngSpan) * 800;
    const y = (((baseLat + latSpan / 2) - lat) / latSpan) * 500;
    return { x, y };
  };

  const statusColors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
    on_route: { bg: 'bg-emerald-500/10', text: 'text-emerald-700', border: 'border-emerald-500', dot: 'bg-emerald-500' },
    active: { bg: 'bg-blue-500/10', text: 'text-blue-700', border: 'border-blue-500', dot: 'bg-blue-500' },
    idle: { bg: 'bg-slate-500/10', text: 'text-slate-700', border: 'border-slate-400', dot: 'bg-slate-400' },
    inactive: { bg: 'bg-rose-500/10', text: 'text-rose-700', border: 'border-rose-500', dot: 'bg-rose-500' },
    maintenance: { bg: 'bg-amber-500/10', text: 'text-amber-700', border: 'border-amber-500', dot: 'bg-amber-500' },
  };

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 select-none"
      style={{ height }}
    >
      {/* Top Map Status Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* GPS Badge as in UI Board */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-md backdrop-blur-md border ${
              gpsConfig.mode === 'demo_simulated'
                ? 'bg-blue-900/90 text-blue-100 border-blue-400/40'
                : 'bg-emerald-800/90 text-emerald-100 border-emerald-400/40'
            }`}
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>{gpsConfig.mode === 'demo_simulated' ? 'DEMO GPS DATA' : 'LIVE GPS CONNECTED'}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 shadow-sm border border-slate-200">
            <Compass className="w-3.5 h-3.5 text-slate-500" />
            <span>{centerDistrict} Sector Telemetry</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <button
            onClick={() => {
              setMapMode(mapMode === 'streets' ? 'satellite' : mapMode === 'satellite' ? 'dark' : 'streets');
              showToast(`Map layer switched to ${mapMode === 'streets' ? 'Satellite Grid' : mapMode === 'satellite' ? 'Night Navigation' : 'City Streets'}`);
            }}
            title="Toggle Map Style"
            className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-700 shadow-sm border border-slate-200 hover:shadow transition-all"
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowConfigModal(true)}
            title="Configure GPS API / Google Maps"
            className="p-2 rounded-xl bg-white/90 hover:bg-white text-slate-700 shadow-sm border border-slate-200 hover:shadow transition-all flex items-center gap-1"
          >
            <Settings className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Map Graphic Canvas / Visual Contours */}
      <div
        className={`w-full h-full relative transition-colors duration-300 ${
          mapMode === 'streets'
            ? 'bg-gradient-to-br from-slate-100 via-emerald-50/20 to-slate-200'
            : mapMode === 'satellite'
            ? 'bg-slate-900'
            : 'bg-slate-950 text-white'
        }`}
      >
        <svg
          viewBox="0 0 800 500"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern id="road-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke={mapMode === 'streets' ? '#e2e8f0' : '#1e293b'}
                strokeWidth="1"
              />
            </pattern>
            {/* Soft glow for vehicle radar */}
            <filter id={`radar-glow-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Grid */}
          <rect width="100%" height="100%" fill="url(#road-grid)" />

          {/* Decorative City Road Network (Simulated Real Alwar / City Arterial Roads) */}
          <g stroke={mapMode === 'streets' ? '#cbd5e1' : '#334155'} strokeWidth="5" fill="none" opacity="0.6">
            <path d="M 0,250 C 200,240 350,220 500,280 C 650,340 750,320 800,310" />
            <path d="M 380,0 C 400,180 410,320 450,500" />
            <path d="M 120,500 C 220,380 320,300 480,240 C 620,180 720,100 800,80" />
            <path d="M 50,80 Q 250,140 400,240 T 750,420" strokeWidth="3" strokeDasharray="6,4" />
          </g>

          {/* Green municipal parks / water bodies */}
          <path
            d="M 280,140 Q 320,120 360,150 T 380,200 Q 330,220 290,190 Z"
            fill={mapMode === 'streets' ? '#dcfce7' : '#064e3b'}
            stroke={mapMode === 'streets' ? '#86efac' : '#047857'}
            strokeWidth="1.5"
            opacity="0.8"
          />
          <text
            x="315"
            y="170"
            fill={mapMode === 'streets' ? '#15803d' : '#34d399'}
            fontSize="10"
            fontWeight="bold"
            fontFamily="sans-serif"
          >
            City Park &amp; Greens
          </text>

          {/* Route path for active or selected vehicle */}
          {activeFocus && activeFocus.routeWaypoints.length > 1 && (
            <g>
              {/* Route shadow line */}
              <polyline
                points={activeFocus.routeWaypoints
                  .map(([lat, lng]) => {
                    const { x, y } = latLngToCoords(lat, lng);
                    return `${x},${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke={activeFocus.routeDeviationAlert ? '#ef4444' : '#0284c7'}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.3"
              />
              {/* Route main line */}
              <polyline
                points={activeFocus.routeWaypoints
                  .map(([lat, lng]) => {
                    const { x, y } = latLngToCoords(lat, lng);
                    return `${x},${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke={activeFocus.routeDeviationAlert ? '#dc2626' : '#2563eb'}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={activeFocus.routeDeviationAlert ? '8,4' : 'none'}
              />
              {/* Route start and end indicators */}
              {(() => {
                const start = latLngToCoords(
                  activeFocus.routeWaypoints[0][0],
                  activeFocus.routeWaypoints[0][1]
                );
                const end = latLngToCoords(
                  activeFocus.routeWaypoints[activeFocus.routeWaypoints.length - 1][0],
                  activeFocus.routeWaypoints[activeFocus.routeWaypoints.length - 1][1]
                );
                return (
                  <>
                    <circle cx={start.x} cy={start.y} r="5" fill="#15803d" stroke="#ffffff" strokeWidth="2" />
                    <circle cx={end.x} cy={end.y} r="5" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
                  </>
                );
              })()}
            </g>
          )}

          {/* Vehicle Markers */}
          {vehicles.map((v) => {
            const { x, y } = latLngToCoords(v.currentLat, v.currentLng);
            const isSelected = activeFocus?.id === v.id;
            const isOnRoute = v.status === 'on_route';

            return (
              <g
                key={v.id}
                transform={`translate(${x}, ${y})`}
                className="cursor-pointer transition-transform duration-300 hover:scale-110"
                onClick={() => {
                  setSelectedPin(v);
                  if (onSelectVehicle) onSelectVehicle(v);
                }}
              >
                {/* Radar pulse ripple for on-route vehicles */}
                {isOnRoute && (
                  <circle
                    r="22"
                    fill={v.routeDeviationAlert ? '#ef4444' : '#16a34a'}
                    opacity="0.2"
                    className="animate-ping"
                  />
                )}

                {/* Outer halo if selected */}
                {isSelected && (
                  <circle
                    r="24"
                    fill="none"
                    stroke={v.routeDeviationAlert ? '#dc2626' : '#1e3a8a'}
                    strokeWidth="2.5"
                    strokeDasharray="4,2"
                  />
                )}

                {/* Vehicle Marker Pin */}
                <circle
                  r="14"
                  fill={
                    v.routeDeviationAlert
                      ? '#dc2626'
                      : v.status === 'on_route'
                      ? '#16a34a'
                      : v.status === 'active'
                      ? '#0284c7'
                      : '#64748b'
                  }
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  filter={`url(#radar-glow-${filterId})`}
                />

                {/* Direction arrow / heading indicator */}
                <g transform={`rotate(${v.heading})`}>
                  <polygon points="0,-10 4,-5 -4,-5" fill="#ffffff" />
                </g>

                {/* Truck icon in center */}
                <circle r="4" fill="#ffffff" />

                {/* Number Plate tag */}
                <g transform="translate(0, 24)">
                  <rect
                    x="-42"
                    y="-9"
                    width="84"
                    height="18"
                    rx="4"
                    fill="#0f172a"
                    stroke={v.routeDeviationAlert ? '#ef4444' : isSelected ? '#38bdf8' : '#334155'}
                    strokeWidth="1.5"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="8.5"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {v.vehicleNumber}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Selected Vehicle Floating Info Card */}
        {activeFocus && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-88 z-20 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-slate-200">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                    {activeFocus.vehicleNumber}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      statusColors[activeFocus.status]?.bg || 'bg-slate-100'
                    } ${statusColors[activeFocus.status]?.text || 'text-slate-700'}`}
                  >
                    {activeFocus.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{activeFocus.model}</p>
              </div>

              <button
                onClick={() => setSelectedPin(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Route Deviation Banner if triggered */}
            {activeFocus.routeDeviationAlert && (
              <div className="mt-2.5 p-2 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-1.5 text-xs text-rose-800">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Route Deviation Alert:</span>
                  <p className="text-[11px] text-rose-700">{activeFocus.deviationDetails || 'Vehicle left scheduled ward perimeter'}</p>
                </div>
              </div>
            )}

            {/* Telemetry Stats Grid */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-center">
              <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Distance</span>
                <span className="text-xs font-bold text-emerald-700">{activeFocus.totalDistanceTodayKm} km</span>
              </div>
              <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-500 block">Speed</span>
                <span className="text-xs font-bold text-slate-800">{activeFocus.speedKmh} km/h</span>
              </div>
              <div className="bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-500 block">{activeFocus.fuelType}</span>
                <span className="text-xs font-bold text-blue-700">{activeFocus.fuelLevelPct}%</span>
              </div>
            </div>

            {/* Driver & Ward info */}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-600 bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                  {activeFocus.driverName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 leading-tight">{activeFocus.driverName}</p>
                  <p className="text-[10px] text-slate-500">{activeFocus.ward} ({activeFocus.city})</p>
                </div>
              </div>

              <a
                href={`tel:${activeFocus.driverPhone}`}
                className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                title="Call Driver"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Last location */}
            <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{activeFocus.lastUpdatedLocation}</span>
            </div>
          </div>
        )}

        {/* Bottom Zoom & Compass Controls */}
        {showAllControls && (
          <div className="absolute right-3 bottom-3 z-20 flex flex-col gap-1.5">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.3, 2.5))}
              className="w-8 h-8 rounded-lg bg-white/95 text-slate-700 shadow border border-slate-200 flex items-center justify-center hover:bg-slate-50 font-bold"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.3, 0.7))}
              className="w-8 h-8 rounded-lg bg-white/95 text-slate-700 shadow border border-slate-200 flex items-center justify-center hover:bg-slate-50 font-bold"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                setSelectedPin(null);
              }}
              className="w-8 h-8 rounded-lg bg-white/95 text-slate-700 shadow border border-slate-200 flex items-center justify-center hover:bg-slate-50"
              title="Reset View"
            >
              <Navigation className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
        )}
      </div>

      {/* GPS & Google Maps Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-slate-800">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-lg text-slate-900">GPS &amp; Maps API Integration</h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">GPS Telemetry Source Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateGpsConfig({ mode: 'demo_simulated' })}
                    className={`p-3 rounded-xl border text-left font-medium transition-all ${
                      gpsConfig.mode === 'demo_simulated'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-sm">Demo Simulation</div>
                    <span className="text-xs text-slate-500">Built-in authentic telemetry for Rajasthan cities</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateGpsConfig({ mode: 'custom_api' })}
                    className={`p-3 rounded-xl border text-left font-medium transition-all ${
                      gpsConfig.mode === 'custom_api'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-sm">Custom GPS API</div>
                    <span className="text-xs text-slate-500">Connect Gov AIS-140 GPS tracker server</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Replaceable GPS API Endpoint URL
                </label>
                <input
                  type="text"
                  value={gpsConfig.customApiUrl}
                  onChange={(e) => updateGpsConfig({ customApiUrl: e.target.value })}
                  placeholder="https://gps.api.rajasthan.gov.in/v1/telemetry"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Government AIS-140 device telematics endpoint for raw NMEA / JSON lat-long packets.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Google Maps API Key (Optional)
                </label>
                <input
                  type="text"
                  value={gpsConfig.googleMapsApiKey}
                  onChange={(e) => updateGpsConfig({ googleMapsApiKey: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  If set, enables high-res satellite tiles and traffic overlays via Google Maps Platform.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
                >
                  Save &amp; Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
