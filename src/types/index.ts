export type PortalType = 'public' | 'government' | 'driver';

export type VehicleStatus = 'active' | 'on_route' | 'idle' | 'inactive' | 'maintenance';

export type GpsStatus = 'connected' | 'demo_data' | 'offline';

export type ComplaintStatus = 'submitted' | 'assigned' | 'in_progress' | 'resolved' | 'rejected';

export type ComplaintPriority = 'low' | 'medium' | 'high' | 'emergency';

export interface LocationHierarchy {
  country: string; // "India"
  state: string; // "Rajasthan"
  district: string; // "Alwar" | "Khairthal-Tijara" | "Jaipur"
  city: string; // "Alwar City" | "Bhiwadi" | "Khairthal"
  wards: string[]; // ["Ward 01", "Ward 02", ..., "Ward 50"]
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  isRegistered: boolean;
  district: string;
  city: string;
  ward: string;
  resolvedComplaintsCount: number;
  unlockedBadgeIds: string[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'state_admin' | 'district_officer' | 'ward_supervisor';
  state: string;
  assignedDistrict: string; // "Alwar" or "Khairthal-Tijara" or "All"
  assignedCity?: string;
  department: string;
  badgeNumber: string;
}

export interface DriverUser {
  id: string;
  driverIdCode: string; // "AD-RJ-ALW-0001"
  name: string;
  phone: string;
  address: string;
  district: string;
  assignedVehicleNo: string;
  assignedWard: string;
  photoUrl: string;
  aadhaarFrontUrl?: string;
  aadhaarBackUrl?: string;
  todayAttendanceStatus: 'not_marked' | 'approved' | 'rejected';
  attendanceTime?: string;
  livenessVerified: boolean;
}

export interface Vehicle {
  id: string;
  vehicleNumber: string; // "RJ 02 AB 1234"
  model: string; // "Tata Ace Hopper Tipper"
  status: VehicleStatus;
  gpsStatus: GpsStatus;
  district: string;
  city: string;
  ward: string;
  driverName: string;
  driverPhone: string;
  driverIdCode: string;
  currentLat: number;
  currentLng: number;
  heading: number;
  speedKmh: number;
  startLocation: string;
  endLocation: string;
  lastUpdatedLocation: string;
  totalDistanceTodayKm: number;
  fuelType: 'CNG' | 'Diesel' | 'Electric';
  fuelLevelPct: number;
  estimatedConsumptionL: number;
  routeDeviationAlert: boolean;
  deviationDetails?: string;
  routeWaypoints: [number, number][];
}

export interface Complaint {
  id: string; // "TAD-CMP-2026-89412"
  title: string;
  category: string;
  description: string;
  photoUrl: string;
  resolutionPhotoUrl?: string;
  complainantName: string;
  complainantPhone: string;
  isAnonymous: boolean;
  state: string;
  district: string;
  city: string;
  ward: string;
  address: string;
  lat: number;
  lng: number;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  assignedOfficer?: string;
  assignedStaffId?: string;
  assignedVehicleNo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolutionRemarks?: string;
}

export interface FuelRecord {
  id: string;
  date: string;
  vehicleNumber: string;
  district: string;
  fuelLitres: number;
  totalCostInr: number;
  odometerReadingKm: number;
  calculatedMileageKmpl: number;
  fuelStation: string;
  recordedBy: string;
}

export interface DailyReport {
  id: string;
  date: string;
  district: string;
  city: string;
  totalVehiclesDeployed: number;
  activeVehicles: number;
  totalKmTravelled: number;
  avgWorkingHours: number;
  fuelFilledLitres: number;
  estimatedFuelConsumedLitres: number;
  areasCoveredCount: number;
  areasMissedCount: number;
  gpsUptimePct: number;
  attendancePct: number;
  complaintsReceived: number;
  complaintsResolved: number;
  routeDeviationIncidents: number;
  generatedAutomatically: boolean;
}

export interface Badge {
  id: string;
  name: string;
  requirementCount: number;
  description: string;
  iconName: string;
  perk: string;
  rewardPoints: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'complaint' | 'vehicle' | 'attendance' | 'alert' | 'reward';
  targetDistrict?: string;
}

export interface SystemGpsConfig {
  mode: 'demo_simulated' | 'custom_api';
  customApiUrl: string;
  apiKey: string;
  updateIntervalSeconds: number;
  googleMapsApiKey: string;
  useGoogleMapsEmbed: boolean;
}
