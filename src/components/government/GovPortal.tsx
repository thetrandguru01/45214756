import React, { useState } from 'react';
import { useApp } from '../../lib/store';
import { InteractiveMap } from '../common/InteractiveMap';
import { CreateDriverModal } from './CreateDriverModal';
import { ResolveComplaintModal } from './ResolveComplaintModal';
import { Vehicle, Complaint, FuelRecord, DailyReport, VehicleStatus } from '../../types';
import { RAJASTHAN_HIERARCHY } from '../../data/mockData';
import {
  LayoutDashboard,
  Truck,
  FileText,
  Users,
  Compass,
  Fuel,
  BarChart3,
  Settings,
  Bell,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  Download,
  Printer,
  Search,
  Filter,
  Layers,
  Phone,
  ShieldCheck,
  ChevronRight,
  Radio,
  MapPin,
  Flame,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

export const GovPortal: React.FC = () => {
  const {
    admin,
    govTab,
    setGovTab,
    vehicles,
    filteredVehicles,
    complaints,
    filteredComplaints,
    drivers,
    filteredDrivers,
    fuelRecords,
    addFuelRecord,
    reports,
    generateNextDayReport,
    selectedDistrict,
    setSelectedDistrict,
    selectedCity,
    setSelectedCity,
    gpsConfig,
    updateGpsConfig,
    updateVehicleStatus,
    showToast,
  } = useApp();

  // Modals & local state
  const [createDriverOpen, setCreateDriverOpen] = useState(false);
  const [activeComplaintForAction, setActiveComplaintForAction] = useState<Complaint | null>(null);
  const [vehicleFilter, setVehicleFilter] = useState<'all' | 'on_route' | 'active' | 'idle' | 'inactive'>('all');
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [fuelModalOpen, setFuelModalOpen] = useState(false);
  const [newFuelVehicle, setNewFuelVehicle] = useState(filteredVehicles[0]?.vehicleNumber || 'RJ 02 AB 1234');
  const [newFuelLitres, setNewFuelLitres] = useState('12.5');
  const [newFuelOdometer, setNewFuelOdometer] = useState('42300');
  const [newFuelCost, setNewFuelCost] = useState('1062.5');

  // Stats calculation matching UI Board
  const totalVehiclesCount = filteredVehicles.length || 106;
  const activeCount = filteredVehicles.filter((v) => v.status === 'active' || v.status === 'on_route').length || 94;
  const inactiveCount = filteredVehicles.filter((v) => v.status === 'inactive' || v.status === 'idle').length || 12;
  const onRouteCount = filteredVehicles.filter((v) => v.status === 'on_route').length || 72;
  const driversCount = filteredDrivers.length || 108;
  const complaintsCount = filteredComplaints.length || 24;
  const routeDeviationCount = filteredVehicles.filter((v) => v.routeDeviationAlert).length;

  // Filtered vehicles list
  const displayedVehicles = filteredVehicles.filter((v) => {
    const matchesFilter =
      vehicleFilter === 'all'
        ? true
        : vehicleFilter === 'active'
        ? v.status === 'active' || v.status === 'on_route'
        : v.status === vehicleFilter;

    const matchesSearch =
      v.vehicleNumber.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
      v.driverName.toLowerCase().includes(vehicleSearch.toLowerCase()) ||
      v.ward.toLowerCase().includes(vehicleSearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // Export report to CSV
  const handleExportCSV = (rep: DailyReport) => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Field,Value',
        `Report ID,${rep.id}`,
        `Date,${rep.date}`,
        `District,${rep.district}`,
        `City,${rep.city}`,
        `Total Vehicles Deployed,${rep.totalVehiclesDeployed}`,
        `Active Vehicles,${rep.activeVehicles}`,
        `Total KM Travelled,${rep.totalKmTravelled} km`,
        `Working Hours Average,${rep.avgWorkingHours} hrs`,
        `Fuel Filled,${rep.fuelFilledLitres} L`,
        `Estimated Fuel Consumed,${rep.estimatedFuelConsumedLitres} L`,
        `Areas Covered,${rep.areasCoveredCount} wards`,
        `Areas Missed,${rep.areasMissedCount} wards`,
        `GPS Uptime,${rep.gpsUptimePct}%`,
        `Complaints Resolved,${rep.complaintsResolved}`,
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TheAutoDip_${rep.district}_Report_${rep.date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`CSV report downloaded for ${rep.district} (${rep.date})`, 'success');
  };

  const handlePrintPDF = () => {
    window.print();
  };

  const handleAddFuelRecord = (e: React.FormEvent) => {
    e.preventDefault();
    addFuelRecord({
      date: new Date().toISOString().split('T')[0],
      vehicleNumber: newFuelVehicle,
      district: selectedDistrict,
      fuelLitres: parseFloat(newFuelLitres),
      totalCostInr: parseFloat(newFuelCost),
      odometerReadingKm: parseInt(newFuelOdometer),
      calculatedMileageKmpl: 5.9,
      fuelStation: 'Govt Authorized CNG Terminal, Delhi Road',
      recordedBy: admin?.name || 'District Supervisor',
    });
    setFuelModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Officer Jurisdiction Sub-Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
              Government Administration Control Room
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-xs text-slate-300 font-mono">
              AIS-140 Live Gateway
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {admin ? `${admin.assignedDistrict} District Command Center` : 'State Admin Center'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Logged in: <span className="text-white font-bold">{admin?.name}</span> ({admin?.department}) •{' '}
            <span className="font-mono text-emerald-300">Badge #{admin?.badgeNumber}</span>
          </p>
        </div>

        {/* Multi-City Isolation Indicator */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <div>
            <span className="text-[10px] text-slate-300 uppercase font-bold block">
              Jurisdiction Isolation (RBAC)
            </span>
            <span className="font-bold text-white">
              {admin?.assignedDistrict === 'All'
                ? 'Statewide Multi-District Access'
                : `Restricted to ${admin?.assignedDistrict} (Isolated)`}
            </span>
          </div>
        </div>
      </div>

      {/* Admin Horizontal Tab Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-semibold">
        {[
          { id: 'dashboard', label: 'Admin Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'vehicles', label: 'Vehicle Fleet & GPS', icon: <Truck className="w-4 h-4" /> },
          { id: 'drivers', label: 'Drivers & Attendance', icon: <Users className="w-4 h-4" /> },
          { id: 'routes', label: 'Route & Coverage', icon: <Compass className="w-4 h-4" /> },
          { id: 'fuel', label: 'Fuel Monitoring', icon: <Fuel className="w-4 h-4" /> },
          { id: 'complaints', label: 'Grievance Management', icon: <FileText className="w-4 h-4" /> },
          { id: 'reports', label: 'Daily / Weekly Reports', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'settings', label: 'GPS / API Settings', icon: <Settings className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setGovTab(tab.id)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl shrink-0 transition-all ${
              govTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* SCREEN 1: ADMIN DASHBOARD */}
      {govTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Metrics Cards matching UI Board (Total 106, Active 94, Inactive 12, Drivers 108, Complaints 24) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
            {/* Total Vehicles */}
            <div
              onClick={() => {
                setVehicleFilter('all');
                setGovTab('vehicles');
              }}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-400 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Total Vehicles</span>
                <Truck className="w-4 h-4 text-slate-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">106</div>
              <span className="text-[10px] text-slate-500 font-medium mt-1 block">
                Approved Hoppers
              </span>
            </div>

            {/* Active Vehicles */}
            <div
              onClick={() => {
                setVehicleFilter('active');
                setGovTab('vehicles');
              }}
              className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs hover:border-emerald-400 cursor-pointer transition-all bg-emerald-50/20"
            >
              <div className="flex items-center justify-between text-emerald-700 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Active</span>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-2xl font-black text-emerald-800 font-mono">94</div>
              <span className="text-[10px] text-emerald-700 font-medium mt-1 block">
                Operating Today
              </span>
            </div>

            {/* Inactive Vehicles */}
            <div
              onClick={() => {
                setVehicleFilter('inactive');
                setGovTab('vehicles');
              }}
              className="bg-white p-4 rounded-2xl border border-rose-200 shadow-xs hover:border-rose-400 cursor-pointer transition-all bg-rose-50/20"
            >
              <div className="flex items-center justify-between text-rose-700 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Inactive</span>
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-black text-rose-800 font-mono">12</div>
              <span className="text-[10px] text-rose-700 font-medium mt-1 block">
                Standby / Workshop
              </span>
            </div>

            {/* Drivers */}
            <div
              onClick={() => setGovTab('drivers')}
              className="bg-white p-4 rounded-2xl border border-blue-200 shadow-xs hover:border-blue-400 cursor-pointer transition-all bg-blue-50/20"
            >
              <div className="flex items-center justify-between text-blue-700 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Drivers</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-blue-800 font-mono">108</div>
              <span className="text-[10px] text-blue-700 font-medium mt-1 block">
                Aadhaar KYC Enrolled
              </span>
            </div>

            {/* Complaints */}
            <div
              onClick={() => setGovTab('complaints')}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-400 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider">Complaints</span>
                <FileText className="w-4 h-4 text-slate-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono">24</div>
              <span className="text-[10px] text-slate-500 font-medium mt-1 block">
                Grievances Logged
              </span>
            </div>
          </div>

          {/* Route Deviation Banner if triggered */}
          {routeDeviationCount > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">
                    {routeDeviationCount} Route Deviation Alert Active in {selectedDistrict}
                  </h4>
                  <p className="text-xs text-rose-700 mt-0.5">
                    Vehicle RJ 02 GH 3456 deviated 380m from scheduled ward corridor into Sector 3 bypass.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setGovTab('routes')}
                className="px-3.5 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shrink-0 transition-colors"
              >
                Inspect Route &rarr;
              </button>
            </div>
          )}

          {/* Live Vehicle Tracking Map Card matching UI Board */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  Live Vehicle Tracking (AIS-140 GPS)
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time location, speed, fuel and route adherence for {selectedDistrict} fleet
                </p>
              </div>

              {/* Quick Actions matching UI Board buttons */}
              <div className="flex items-center gap-2 overflow-x-auto">
                <button
                  onClick={() => setGovTab('routes')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors shrink-0"
                >
                  <Compass className="w-3.5 h-3.5 text-blue-600" />
                  <span>Route Monitoring</span>
                </button>
                <button
                  onClick={() => setGovTab('fuel')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors shrink-0"
                >
                  <Fuel className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Fuel &amp; Mileage</span>
                </button>
                <button
                  onClick={() => setGovTab('reports')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors shrink-0"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
                  <span>Reports</span>
                </button>
                <button
                  onClick={() => setGovTab('complaints')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors shrink-0"
                >
                  <FileText className="w-3.5 h-3.5 text-rose-600" />
                  <span>Complaints</span>
                </button>
              </div>
            </div>

            {/* Interactive Map */}
            <InteractiveMap
              vehicles={filteredVehicles}
              height="440px"
              centerDistrict={selectedDistrict}
            />
          </div>

          {/* Quick Vehicle Status List matching UI board sidebar */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-base">Fleet Operational Status</h4>
              <button
                onClick={() => setGovTab('vehicles')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                View All {filteredVehicles.length} Vehicles &rarr;
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredVehicles.map((v) => (
                <div key={v.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full shrink-0 ${
                        v.status === 'on_route'
                          ? 'bg-emerald-500 animate-pulse'
                          : v.status === 'idle'
                          ? 'bg-slate-400'
                          : 'bg-rose-500'
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-900">
                          Vehicle {v.vehicleNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            v.status === 'on_route'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {v.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {v.ward} • Driver: {v.driverName} • {v.model}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      {v.totalDistanceTodayKm} km
                    </span>
                    <span className="text-[10px] text-slate-400 block">Today's Run</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 2: VEHICLE FLEET & GPS */}
      {govTab === 'vehicles' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Vehicle Fleet Master Registry</h3>
              <p className="text-xs text-slate-500">
                Manage auto-hoppers, telemetry transponders, and driver assignments for {selectedDistrict}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCreateDriverOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Enroll Driver &amp; Tipper</span>
              </button>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
              {(['all', 'on_route', 'active', 'idle', 'inactive'] as const).map((flt) => (
                <button
                  key={flt}
                  onClick={() => setVehicleFilter(flt)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all shrink-0 ${
                    vehicleFilter === flt
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {flt.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={vehicleSearch}
                onChange={(e) => setVehicleSearch(e.target.value)}
                placeholder="Search number, driver, ward..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Vehicles Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Vehicle Plate</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Assigned Ward</th>
                    <th className="p-3.5">Driver &amp; Contact</th>
                    <th className="p-3.5">Fuel / Energy</th>
                    <th className="p-3.5">Today KM</th>
                    <th className="p-3.5">GPS Health</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedVehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-slate-900">
                        {v.vehicleNumber}
                        <span className="block text-[10px] text-slate-500 font-sans font-normal">
                          {v.model}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full ${
                            v.status === 'on_route'
                              ? 'bg-emerald-100 text-emerald-800'
                              : v.status === 'idle'
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {v.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-800">
                        {v.ward}
                        <span className="block text-[10px] text-slate-400">{v.city}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-slate-800 block">{v.driverName}</span>
                        <span className="font-mono text-[10px] text-slate-500">{v.driverPhone}</span>
                      </td>
                      <td className="p-3.5 font-mono">
                        <span className="font-bold text-slate-800">{v.fuelType}</span>
                        <span className="text-slate-500 ml-1">({v.fuelLevelPct}%)</span>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-emerald-700">
                        {v.totalDistanceTodayKm} km
                      </td>
                      <td className="p-3.5">
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                          <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                          <span>Active 3s</span>
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <select
                            value={v.status}
                            onChange={(e) => updateVehicleStatus(v.id, e.target.value as VehicleStatus)}
                            className="px-2 py-1 rounded-lg border border-slate-300 text-[10px] font-semibold bg-white"
                          >
                            <option value="on_route">On Route</option>
                            <option value="active">Active</option>
                            <option value="idle">Idle</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 3: DRIVERS & ATTENDANCE */}
      {govTab === 'drivers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Driver Fleet &amp; Facial Attendance</h3>
              <p className="text-xs text-slate-500">
                Aadhaar KYC verified auto-tipper operators, daily punch logs &amp; vehicle allocations
              </p>
            </div>

            <button
              onClick={() => setCreateDriverOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Driver Account</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredDrivers.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={d.photoUrl}
                    alt={d.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-300 shadow-xs"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-sm text-slate-900">{d.name}</h4>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.2 rounded-full">
                        Active
                      </span>
                    </div>
                    <p className="font-mono text-xs font-bold text-emerald-800 mt-0.5">
                      {d.driverIdCode}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">{d.phone}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assigned Vehicle:</span>
                    <span className="font-mono font-bold text-slate-800">{d.assignedVehicleNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assigned Ward:</span>
                    <span className="font-bold text-slate-800">{d.assignedWard}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Today's Attendance:</span>
                    <span
                      className={`font-bold ${
                        d.todayAttendanceStatus === 'approved'
                          ? 'text-emerald-700'
                          : 'text-rose-700'
                      }`}
                    >
                      {d.todayAttendanceStatus === 'approved' ? '✓ Approved (Face Match)' : 'Not Marked'}
                    </span>
                  </div>
                  {d.attendanceTime && (
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Punch Time:</span>
                      <span>{d.attendanceTime}</span>
                    </div>
                  )}
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Aadhaar KYC Verified</span>
                  </span>
                  <a
                    href={`tel:${d.phone}`}
                    className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call Driver</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCREEN 4: ROUTE & COVERAGE MONITORING */}
      {govTab === 'routes' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Ward Route Coverage &amp; Deviation Audit</h3>
              <p className="text-xs text-slate-500">
                Scheduled corridors, missed municipal collection bins, and geofence boundary checks
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Overall Ward Coverage</span>
              <span className="text-xl font-black text-emerald-700 font-mono">96.8%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Route Deviation Incidents */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Geofence Route Deviations</span>
                </h4>
                <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                  1 Alert Active
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold text-rose-900">
                  <span className="font-mono">Vehicle RJ 02 GH 3456</span>
                  <span className="text-[10px] bg-rose-200 px-2 py-0.5 rounded">Ward 12 (Bhiwadi)</span>
                </div>
                <p className="text-rose-800 leading-relaxed">
                  Deviated 380m from scheduled ward corridor into Sector 3 bypass. Flagged by automated GPS corridor validator.
                </p>
                <div className="flex items-center justify-between pt-1 text-[11px] text-rose-700 font-medium">
                  <span>Driver: Mohit Saini</span>
                  <a href="tel:+919414088990" className="underline font-bold">
                    Call Driver Now
                  </a>
                </div>
              </div>
            </div>

            {/* Area Coverage Status */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Area Coverage Summary</span>
                </h4>
                <span className="text-[10px] text-slate-500 font-mono">Today's Shift</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Total Wards in {selectedDistrict}:</span>
                  <span className="font-bold text-slate-900">50 Wards</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Wards Fully Completed:</span>
                  <span className="font-bold text-emerald-700">48 Wards (96%)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-600">Wards In Progress:</span>
                  <span className="font-bold text-blue-700">2 Wards (Ward 12, Ward 45)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-600">Missed Bins Reported:</span>
                  <span className="font-bold text-slate-800">0 Bins</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 5: FUEL MONITORING */}
      {govTab === 'fuel' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Fuel &amp; Energy Telemetry Logs</h3>
              <p className="text-xs text-slate-500">
                Odometer telemetry, actual vs estimated consumption, and authorized dispensary records
              </p>
            </div>

            <button
              onClick={() => setFuelModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Record Fuel Fill Entry</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5">Vehicle Plate</th>
                    <th className="p-3.5">Fuel Filled</th>
                    <th className="p-3.5">Cost (INR)</th>
                    <th className="p-3.5">Odometer</th>
                    <th className="p-3.5">Calc Mileage</th>
                    <th className="p-3.5">Dispensary Station</th>
                    <th className="p-3.5">Approved By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fuelRecords.map((f) => (
                    <tr key={f.id} className="hover:bg-slate-50/80">
                      <td className="p-3.5 font-mono text-slate-600">{f.date}</td>
                      <td className="p-3.5 font-mono font-bold text-slate-900">{f.vehicleNumber}</td>
                      <td className="p-3.5 font-mono font-bold text-emerald-700">{f.fuelLitres} L</td>
                      <td className="p-3.5 font-mono font-bold text-slate-800">₹{f.totalCostInr}</td>
                      <td className="p-3.5 font-mono text-slate-600">{f.odometerReadingKm} km</td>
                      <td className="p-3.5 font-mono font-bold text-blue-700">
                        {f.calculatedMileageKmpl} km/l
                      </td>
                      <td className="p-3.5 text-slate-600 text-[11px]">{f.fuelStation}</td>
                      <td className="p-3.5 text-slate-500 text-[11px]">{f.recordedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 6: GRIEVANCE MANAGEMENT */}
      {govTab === 'complaints' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Citizen Grievance Resolution Desk</h3>
              <p className="text-xs text-slate-500">
                Action pending reports, assign sanitary auto-hoppers, and attach resolution proof
              </p>
            </div>
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
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          c.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
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
                    <p className="text-[10px] text-slate-500">
                      Complainant: {c.complainantName} ({c.complainantPhone})
                    </p>
                  </div>
                </div>

                {c.resolutionPhotoUrl && (
                  <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Resolution photograph verified on-site.</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setActiveComplaintForAction(c)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <span>Action Grievance &rarr;</span>
                  </button>

                  <span className="text-[10px] text-slate-400">
                    Priority: <strong className="uppercase text-slate-700">{c.priority}</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCREEN 7: DAILY / WEEKLY / MONTHLY REPORTS */}
      {govTab === 'reports' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-2xl border border-slate-200 no-print">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">
                Automated Municipal Solid Waste Reports
              </h3>
              <p className="text-xs text-slate-500">
                Daily, Weekly, Monthly performance audits with one-click PDF &amp; CSV export
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => generateNextDayReport(selectedDistrict)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs transition-colors border border-emerald-300"
              >
                <Clock className="w-4 h-4" />
                <span>Auto-Generate Next-Day Report</span>
              </button>

              <button
                onClick={handlePrintPDF}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs"
              >
                <Printer className="w-4 h-4" />
                <span>Print PDF</span>
              </button>
            </div>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 print-break-inside-avoid"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-slate-900">
                        Municipal Solid Waste Report: {rep.district} ({rep.city})
                      </span>
                      {rep.generatedAutomatically && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          Auto-Generated
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      Date of Audit: {rep.date} • Report Ref #{rep.id}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 no-print">
                    <button
                      onClick={() => handleExportCSV(rep)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download CSV</span>
                    </button>
                  </div>
                </div>

                {/* Audit Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-500 block">Total KM Travelled</span>
                    <span className="text-base font-bold text-slate-900 font-mono">
                      {rep.totalKmTravelled} km
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-500 block">Vehicles Deployed</span>
                    <span className="text-base font-bold text-emerald-700 font-mono">
                      {rep.activeVehicles} / {rep.totalVehiclesDeployed}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-500 block">Fuel Filled / Estimated</span>
                    <span className="text-base font-bold text-blue-700 font-mono">
                      {rep.fuelFilledLitres}L / {rep.estimatedFuelConsumedLitres}L
                    </span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-500 block">Grievances Cleared</span>
                    <span className="text-base font-bold text-purple-700 font-mono">
                      {rep.complaintsResolved} / {rep.complaintsReceived}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs pt-1">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Areas Covered:</span>
                    <span className="font-bold text-slate-800">{rep.areasCoveredCount} Wards</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">GPS Uptime:</span>
                    <span className="font-bold text-emerald-700">{rep.gpsUptimePct}%</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Route Deviations:</span>
                    <span className="font-bold text-slate-800">{rep.routeDeviationIncidents}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SCREEN 8: SETTINGS & REPLACEABLE GPS INTEGRATION */}
      {govTab === 'settings' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-lg">System Telematics &amp; API Settings</h3>
            <p className="text-xs text-slate-500">
              Configure government AIS-140 GPS device gateways, telemetry polling rates and Google Maps integration
            </p>
          </div>

          <div className="space-y-4 max-w-2xl text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Replaceable Government GPS API Endpoint
              </label>
              <input
                type="text"
                value={gpsConfig.customApiUrl}
                onChange={(e) => updateGpsConfig({ customApiUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Endpoint providing live vehicle NMEA/JSON telemetry streams from onboard vehicle transponders.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Telemetry Ping Interval (Seconds)
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={gpsConfig.updateIntervalSeconds}
                onChange={(e) =>
                  updateGpsConfig({ updateIntervalSeconds: parseInt(e.target.value) || 3 })
                }
                className="w-32 px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Google Maps API Configuration Key (Optional)
              </label>
              <input
                type="text"
                value={gpsConfig.googleMapsApiKey}
                onChange={(e) => updateGpsConfig({ googleMapsApiKey: e.target.value })}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Replaceable Maps API key for high-res vector tiles &amp; satellite imaging.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Record Fuel Entry Modal */}
      {fuelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-slate-800">
            <h3 className="font-bold text-base text-slate-900 mb-4">Record Fuel Dispensary Entry</h3>
            <form onSubmit={handleAddFuelRecord} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vehicle Plate</label>
                <select
                  value={newFuelVehicle}
                  onChange={(e) => setNewFuelVehicle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-bold"
                >
                  {filteredVehicles.map((v) => (
                    <option key={v.id} value={v.vehicleNumber}>
                      {v.vehicleNumber} ({v.ward})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Fuel Filled (Litres / Kg)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newFuelLitres}
                  onChange={(e) => setNewFuelLitres(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Odometer Reading (KM)</label>
                <input
                  type="number"
                  required
                  value={newFuelOdometer}
                  onChange={(e) => setNewFuelOdometer(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Total Cost (INR)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newFuelCost}
                  onChange={(e) => setNewFuelCost(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setFuelModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Driver Creation Modal */}
      <CreateDriverModal
        isOpen={createDriverOpen}
        onClose={() => setCreateDriverOpen(false)}
      />

      {/* Complaint Action Modal */}
      <ResolveComplaintModal
        complaint={activeComplaintForAction}
        isOpen={!!activeComplaintForAction}
        onClose={() => setActiveComplaintForAction(null)}
      />
    </div>
  );
};
