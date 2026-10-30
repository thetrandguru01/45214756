import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  PortalType,
  Vehicle,
  Complaint,
  AdminUser,
  DriverUser,
  FuelRecord,
  DailyReport,
  Badge,
  NotificationItem,
  SystemGpsConfig,
  ComplaintStatus,
  VehicleStatus,
  User,
} from '../types';
import {
  INITIAL_VEHICLES,
  INITIAL_COMPLAINTS,
  INITIAL_ADMINS,
  INITIAL_DRIVERS,
  INITIAL_FUEL_RECORDS,
  INITIAL_REPORTS,
  INITIAL_NOTIFICATIONS,
  SYSTEM_BADGES,
  RAJASTHAN_HIERARCHY,
} from '../data/mockData';
import confetti from 'canvas-confetti';

interface AppContextType {
  // Navigation & Portals
  portal: PortalType;
  setPortal: (p: PortalType) => void;
  publicTab: string;
  setPublicTab: (t: string) => void;
  govTab: string;
  setGovTab: (t: string) => void;
  showSplash: boolean;
  setShowSplash: (show: boolean) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;

  // Users & Auth
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  admin: AdminUser | null;
  setAdmin: (admin: AdminUser | null) => void;
  switchAdmin: (adminId: string) => void;
  currentDriver: DriverUser;
  setCurrentDriver: React.Dispatch<React.SetStateAction<DriverUser>>;
  loginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  loginAsCitizen: (phone: string, name?: string) => void;
  logoutCitizen: () => void;

  // Location & Hierarchy
  selectedDistrict: string;
  setSelectedDistrict: (d: string) => void;
  selectedCity: string;
  setSelectedCity: (c: string) => void;
  selectedWard: string;
  setSelectedWard: (w: string) => void;

  // Vehicles & GPS
  vehicles: Vehicle[];
  filteredVehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  setSelectedVehicle: (v: Vehicle | null) => void;
  updateVehicleStatus: (id: string, status: VehicleStatus) => void;
  addVehicle: (v: Omit<Vehicle, 'id'>) => void;
  gpsConfig: SystemGpsConfig;
  updateGpsConfig: (cfg: Partial<SystemGpsConfig>) => void;

  // Complaints
  complaints: Complaint[];
  filteredComplaints: Complaint[];
  selectedComplaint: Complaint | null;
  setSelectedComplaint: (c: Complaint | null) => void;
  registerComplaint: (newComplaint: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Complaint;
  updateComplaintStatus: (
    id: string,
    status: ComplaintStatus,
    officerRemarks?: string,
    resolutionPhotoUrl?: string,
    assignedStaffId?: string,
    assignedVehicleNo?: string
  ) => void;

  // Drivers & Attendance
  drivers: DriverUser[];
  filteredDrivers: DriverUser[];
  createDriverAccount: (data: Omit<DriverUser, 'id' | 'driverIdCode' | 'todayAttendanceStatus' | 'livenessVerified'>) => {
    driver: DriverUser;
    tempPassword: string;
  };
  markDriverAttendance: (driverId: string, approved: boolean) => void;

  // Fuel Records
  fuelRecords: FuelRecord[];
  addFuelRecord: (record: Omit<FuelRecord, 'id'>) => void;

  // Reports
  reports: DailyReport[];
  generateNextDayReport: (district: string) => DailyReport;

  // Badges & Rewards
  badges: Badge[];
  triggerBadgeCelebration: (badgeName: string) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  toastMessage: { text: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;

  // Reset demo state
  resetAllDataToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  VEHICLES: 'theautodip_vehicles_v1',
  COMPLAINTS: 'theautodip_complaints_v1',
  DRIVERS: 'theautodip_drivers_v1',
  FUEL: 'theautodip_fuel_v1',
  REPORTS: 'theautodip_reports_v1',
  USER: 'theautodip_user_v1',
  NOTIFICATIONS: 'theautodip_notifs_v1',
  GPS_CONFIG: 'theautodip_gps_config_v1',
  SPLASH_SEEN: 'theautodip_splash_seen_v1',
  ONBOARDING_SEEN: 'theautodip_onboarding_seen_v1',
};

const DEFAULT_USER: User = {
  id: 'usr-default',
  name: 'Rahul Sharma',
  phone: '+91 98765 43210',
  email: 'rahul.sharma@example.com',
  isRegistered: true,
  district: 'Alwar',
  city: 'Alwar City',
  ward: 'Ward 45',
  resolvedComplaintsCount: 1,
  unlockedBadgeIds: ['badge-1'],
};

const DEFAULT_GPS_CONFIG: SystemGpsConfig = {
  mode: 'demo_simulated',
  customApiUrl: 'https://gps.api.rajasthan.gov.in/v1/telemetry',
  apiKey: 'DEMO_SECURE_TOKEN_RJ_ALW',
  updateIntervalSeconds: 3,
  googleMapsApiKey: '',
  useGoogleMapsEmbed: false,
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Splash & Onboarding
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    return !sessionStorage.getItem(LOCAL_STORAGE_KEYS.SPLASH_SEEN);
  });
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return !localStorage.getItem(LOCAL_STORAGE_KEYS.ONBOARDING_SEEN);
  });

  // Portal Navigation
  const [portal, setPortalState] = useState<PortalType>('public');
  const [publicTab, setPublicTab] = useState<string>('home');
  const [govTab, setGovTab] = useState<string>('dashboard');

  // Hierarchy selections
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Alwar');
  const [selectedCity, setSelectedCity] = useState<string>('Alwar City');
  const [selectedWard, setSelectedWard] = useState<string>('Ward 45');

  // User & Admin Auth
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [admin, setAdmin] = useState<AdminUser | null>(INITIAL_ADMINS[0]); // Suresh Kumar (Alwar District Officer)
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Driver portal current user
  const [currentDriver, setCurrentDriver] = useState<DriverUser>(INITIAL_DRIVERS[0]);

  // Entities
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.VEHICLES);
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.COMPLAINTS);
    return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
  });

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const [drivers, setDrivers] = useState<DriverUser[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.DRIVERS);
    return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
  });

  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.FUEL);
    return saved ? JSON.parse(saved) : INITIAL_FUEL_RECORDS;
  });

  const [reports, setReports] = useState<DailyReport[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.REPORTS);
    return saved ? JSON.parse(saved) : INITIAL_REPORTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [gpsConfig, setGpsConfig] = useState<SystemGpsConfig>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.GPS_CONFIG);
    return saved ? JSON.parse(saved) : DEFAULT_GPS_CONFIG;
  });

  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = useCallback((text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  }, []);

  const triggerBadgeCelebration = useCallback((badgeName: string) => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#16a34a', '#1e3a8a', '#38bdf8', '#ffffff'],
    });
    showToast(`🏆 Badge Unlocked: ${badgeName}!`, 'success');
  }, [showToast]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.DRIVERS, JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.FUEL, JSON.stringify(fuelRecords));
  }, [fuelRecords]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }, [reports]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.GPS_CONFIG, JSON.stringify(gpsConfig));
  }, [gpsConfig]);

  // Handle splash dismissal
  const handleSetShowSplash = (show: boolean) => {
    setShowSplash(show);
    if (!show) {
      sessionStorage.setItem(LOCAL_STORAGE_KEYS.SPLASH_SEEN, 'true');
    }
  };

  const handleSetShowOnboarding = (show: boolean) => {
    setShowOnboarding(show);
    if (!show) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.ONBOARDING_SEEN, 'true');
    }
  };

  // Switch Portal with smooth transitions
  const setPortal = (p: PortalType) => {
    setPortalState(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync selected district with Admin's assigned role
  useEffect(() => {
    if (portal === 'government' && admin) {
      if (admin.assignedDistrict !== 'All') {
        setSelectedDistrict(admin.assignedDistrict);
        if (admin.assignedCity) {
          setSelectedCity(admin.assignedCity);
        }
      }
    }
  }, [portal, admin]);

  // Switch Admin user (for multi-city demonstration)
  const switchAdmin = (adminId: string) => {
    const found = INITIAL_ADMINS.find((a) => a.id === adminId);
    if (found) {
      setAdmin(found);
      if (found.assignedDistrict !== 'All') {
        setSelectedDistrict(found.assignedDistrict);
      }
      showToast(`Switched to ${found.name} (${found.assignedDistrict})`, 'info');
    }
  };

  // Filtered by multi-city access control
  const filteredVehicles = vehicles.filter((v) => {
    if (portal === 'government' && admin && admin.assignedDistrict !== 'All') {
      return v.district.toLowerCase() === admin.assignedDistrict.toLowerCase();
    }
    return v.district.toLowerCase() === selectedDistrict.toLowerCase();
  });

  const filteredComplaints = complaints.filter((c) => {
    if (portal === 'government' && admin && admin.assignedDistrict !== 'All') {
      return c.district.toLowerCase() === admin.assignedDistrict.toLowerCase();
    }
    return c.district.toLowerCase() === selectedDistrict.toLowerCase();
  });

  const filteredDrivers = drivers.filter((d) => {
    if (portal === 'government' && admin && admin.assignedDistrict !== 'All') {
      return d.district.toLowerCase() === admin.assignedDistrict.toLowerCase();
    }
    return d.district.toLowerCase() === selectedDistrict.toLowerCase();
  });

  // Simulated GPS Telemetry heartbeat when mode is demo_simulated
  useEffect(() => {
    if (gpsConfig.mode !== 'demo_simulated') return;

    const interval = setInterval(() => {
      setVehicles((prev) =>
        prev.map((v) => {
          if (v.status !== 'on_route' && v.status !== 'active') return v;

          // Tiny nudge along heading to simulate continuous live moving vehicle
          const angle = (v.heading * Math.PI) / 180;
          const deltaLat = Math.cos(angle) * 0.00015;
          const deltaLng = Math.sin(angle) * 0.00015;

          const newLat = v.currentLat + deltaLat;
          const newLng = v.currentLng + deltaLng;
          const newDist = parseFloat((v.totalDistanceTodayKm + 0.03).toFixed(2));
          const newFuelConsumed = parseFloat((v.estimatedConsumptionL + 0.005).toFixed(2));

          // Slight random heading wobble
          const newHeading = (v.heading + (Math.random() * 8 - 4) + 360) % 360;

          return {
            ...v,
            currentLat: newLat,
            currentLng: newLng,
            heading: Math.round(newHeading),
            totalDistanceTodayKm: newDist,
            estimatedConsumptionL: newFuelConsumed,
            gpsStatus: 'connected',
          };
        })
      );
    }, gpsConfig.updateIntervalSeconds * 1000);

    return () => clearInterval(interval);
  }, [gpsConfig.mode, gpsConfig.updateIntervalSeconds]);

  // Citizen auth
  const loginAsCitizen = (phone: string, name?: string) => {
    const updated: User = {
      ...user,
      phone,
      name: name || user.name || 'Resident Citizen',
      isRegistered: true,
    };
    setUser(updated);
    setLoginModalOpen(false);
    showToast(`Welcome ${updated.name}! Successfully signed in.`, 'success');
  };

  const logoutCitizen = () => {
    setUser({
      id: 'usr-guest',
      name: 'Guest Citizen',
      phone: '',
      isRegistered: false,
      district: selectedDistrict,
      city: selectedCity,
      ward: selectedWard,
      resolvedComplaintsCount: 0,
      unlockedBadgeIds: [],
    });
    showToast('Signed out of Citizen account.', 'info');
  };

  // Vehicle management
  const updateVehicleStatus = (id: string, status: VehicleStatus) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, status } : v))
    );
    showToast(`Vehicle status updated to ${status.replace('_', ' ').toUpperCase()}`, 'success');
  };

  const addVehicle = (v: Omit<Vehicle, 'id'>) => {
    const id = `veh-${Date.now()}`;
    const newV: Vehicle = { ...v, id };
    setVehicles((prev) => [newV, ...prev]);
    showToast(`Vehicle ${v.vehicleNumber} successfully added to fleet!`, 'success');
  };

  const updateGpsConfig = (cfg: Partial<SystemGpsConfig>) => {
    setGpsConfig((prev) => {
      const updated = { ...prev, ...cfg };
      return updated;
    });
    showToast('GPS & Maps configuration updated successfully!', 'success');
  };

  // Complaint Management & Automatic Badges
  const registerComplaint = (newComplaintData: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newId = `TAD-CMP-2026-${randomSuffix}`;
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const complaint: Complaint = {
      ...newComplaintData,
      id: newId,
      status: 'submitted',
      createdAt: formattedDate,
      updatedAt: formattedDate,
    };

    setComplaints((prev) => [complaint, ...prev]);

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Cleanliness Complaint Registered',
      message: `Complaint #${newId} recorded for ${complaint.address || complaint.ward}. Municipal team dispatched.`,
      timestamp: 'Just now',
      read: false,
      type: 'complaint',
      targetDistrict: complaint.district,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showToast(`Complaint #${newId} submitted successfully!`, 'success');

    return complaint;
  };

  const updateComplaintStatus = (
    id: string,
    status: ComplaintStatus,
    officerRemarks?: string,
    resolutionPhotoUrl?: string,
    assignedStaffId?: string,
    assignedVehicleNo?: string
  ) => {
    let resolvedItem: Complaint | null = null;
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated: Complaint = {
            ...c,
            status,
            updatedAt: formattedDate,
            ...(officerRemarks ? { resolutionRemarks: officerRemarks } : {}),
            ...(resolutionPhotoUrl ? { resolutionPhotoUrl } : {}),
            ...(assignedStaffId ? { assignedStaffId } : {}),
            ...(assignedVehicleNo ? { assignedVehicleNo } : {}),
            ...(status === 'resolved' ? { resolvedAt: formattedDate } : {}),
          };
          if (status === 'resolved' && c.status !== 'resolved') {
            resolvedItem = updated;
          }
          return updated;
        }
        return c;
      })
    );

    // If marked resolved, update citizen stats and check badges!
    if (status === 'resolved') {
      setUser((prevUser) => {
        const newCount = prevUser.resolvedComplaintsCount + 1;
        const currentBadges = [...prevUser.unlockedBadgeIds];

        // Check badges
        SYSTEM_BADGES.forEach((b) => {
          if (newCount >= b.requirementCount && !currentBadges.includes(b.id)) {
            currentBadges.push(b.id);
            triggerBadgeCelebration(b.name);
          }
        });

        return {
          ...prevUser,
          resolvedComplaintsCount: newCount,
          unlockedBadgeIds: currentBadges,
        };
      });

      // Notification
      const notif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Complaint Resolved',
        message: `Complaint #${id} marked RESOLVED. Cleanliness verified with resolution photograph.`,
        timestamp: 'Just now',
        read: false,
        type: 'complaint',
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    showToast(`Complaint #${id} updated to ${status.toUpperCase()}!`, 'success');
  };

  // Driver management
  const createDriverAccount = (data: Omit<DriverUser, 'id' | 'driverIdCode' | 'todayAttendanceStatus' | 'livenessVerified'>) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const distCode = data.district.toUpperCase().slice(0, 3);
    const driverIdCode = `AD-RJ-${distCode}-${randomNum}`;
    const id = `drv-${Date.now()}`;
    const tempPassword = `Q7#zk9!mP3@bL`;

    const newDriver: DriverUser = {
      ...data,
      id,
      driverIdCode,
      todayAttendanceStatus: 'not_marked',
      livenessVerified: false,
    };

    setDrivers((prev) => [newDriver, ...prev]);
    showToast(`Driver account ${driverIdCode} created successfully!`, 'success');

    return { driver: newDriver, tempPassword };
  };

  const markDriverAttendance = (driverId: string, approved: boolean) => {
    const now = new Date();
    const formatted = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    setDrivers((prev) =>
      prev.map((d) =>
        d.id === driverId
          ? {
              ...d,
              todayAttendanceStatus: approved ? 'approved' : 'rejected',
              attendanceTime: formatted,
              livenessVerified: approved,
            }
          : d
      )
    );

    if (currentDriver.id === driverId) {
      setCurrentDriver((prev) => ({
        ...prev,
        todayAttendanceStatus: approved ? 'approved' : 'rejected',
        attendanceTime: formatted,
        livenessVerified: approved,
      }));
    }

    if (approved) {
      showToast('Face Attendance marked & verified successfully!', 'success');
    } else {
      showToast('Attendance verification could not be completed.', 'error');
    }
  };

  // Fuel records
  const addFuelRecord = (record: Omit<FuelRecord, 'id'>) => {
    const id = `fuel-${Date.now()}`;
    const newRecord: FuelRecord = { ...record, id };
    setFuelRecords((prev) => [newRecord, ...prev]);
    showToast(`Fuel log added for ${record.vehicleNumber}: ${record.fuelLitres}L filled`, 'success');
  };

  // Auto report generation
  const generateNextDayReport = (district: string) => {
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() + 1);
    const nextDate = dateObj.toISOString().split('T')[0];

    const distVehicles = vehicles.filter((v) => v.district.toLowerCase() === district.toLowerCase());
    const totalVeh = distVehicles.length || 25;
    const activeVeh = distVehicles.filter((v) => v.status === 'on_route' || v.status === 'active').length || Math.round(totalVeh * 0.9);
    const totalKm = Math.round(distVehicles.reduce((acc, v) => acc + v.totalDistanceTodayKm, 0) * 1.05) || 1280;

    const newReport: DailyReport = {
      id: `rep-${district.toLowerCase().slice(0, 3)}-${nextDate.replace(/-/g, '')}`,
      date: nextDate,
      district,
      city: selectedCity,
      totalVehiclesDeployed: totalVeh,
      activeVehicles: activeVeh,
      totalKmTravelled: totalKm,
      avgWorkingHours: 7.5,
      fuelFilledLitres: parseFloat((totalKm * 0.23).toFixed(1)),
      estimatedFuelConsumedLitres: parseFloat((totalKm * 0.22).toFixed(1)),
      areasCoveredCount: 48,
      areasMissedCount: 1,
      gpsUptimePct: 98.6,
      attendancePct: 96.8,
      complaintsReceived: 14,
      complaintsResolved: 14,
      routeDeviationIncidents: 0,
      generatedAutomatically: true,
    };

    setReports((prev) => [newReport, ...prev]);
    showToast(`Automated scheduled report for ${nextDate} created!`, 'success');
    return newReport;
  };

  // Notification actions
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'info');
  };

  // Reset to defaults
  const resetAllDataToDefaults = () => {
    localStorage.clear();
    setVehicles(INITIAL_VEHICLES);
    setComplaints(INITIAL_COMPLAINTS);
    setDrivers(INITIAL_DRIVERS);
    setFuelRecords(INITIAL_FUEL_RECORDS);
    setReports(INITIAL_REPORTS);
    setUser(DEFAULT_USER);
    setNotifications(INITIAL_NOTIFICATIONS);
    setGpsConfig(DEFAULT_GPS_CONFIG);
    showToast('Reset all database records to Rajasthan defaults', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        portal,
        setPortal,
        publicTab,
        setPublicTab,
        govTab,
        setGovTab,
        showSplash,
        setShowSplash: handleSetShowSplash,
        showOnboarding,
        setShowOnboarding: handleSetShowOnboarding,

        user,
        setUser,
        admin,
        setAdmin,
        switchAdmin,
        currentDriver,
        setCurrentDriver,
        loginModalOpen,
        setLoginModalOpen,
        loginAsCitizen,
        logoutCitizen,

        selectedDistrict,
        setSelectedDistrict,
        selectedCity,
        setSelectedCity,
        selectedWard,
        setSelectedWard,

        vehicles,
        filteredVehicles,
        selectedVehicle,
        setSelectedVehicle,
        updateVehicleStatus,
        addVehicle,
        gpsConfig,
        updateGpsConfig,

        complaints,
        filteredComplaints,
        selectedComplaint,
        setSelectedComplaint,
        registerComplaint,
        updateComplaintStatus,

        drivers,
        filteredDrivers,
        createDriverAccount,
        markDriverAttendance,

        fuelRecords,
        addFuelRecord,

        reports,
        generateNextDayReport,

        badges: SYSTEM_BADGES,
        triggerBadgeCelebration,

        notifications,
        markNotificationRead,
        clearAllNotifications,
        toastMessage,
        showToast,

        resetAllDataToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
