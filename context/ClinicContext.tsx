'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ClinicSetting,
  Doctor,
  MedicalService,
  ClinicFacility,
  Appointment,
  Article,
  AdminUser,
  UserRole,
  AppointmentStatus,
} from '@/types/clinic';
import {
  DEFAULT_CLINIC_SETTINGS,
  DEFAULT_DOCTORS,
  DEFAULT_SERVICES,
  DEFAULT_FACILITIES,
  DEFAULT_ARTICLES,
  DEFAULT_APPOINTMENTS,
  DEFAULT_ADMIN_USERS,
} from '@/lib/clinic-data';
import {
  loadFromStorage,
  saveToStorage,
  exportAppointmentsToCsv,
  resetClinicDataToDefault,
} from '@/lib/storage';

interface ClinicContextType {
  // Settings
  settings: ClinicSetting;
  updateSettings: (newSettings: Partial<ClinicSetting>) => void;

  // Services
  services: MedicalService[];
  addService: (service: Omit<MedicalService, 'id'>) => void;
  updateService: (id: string, updated: Partial<MedicalService>) => void;
  deleteService: (id: string) => void;
  toggleServiceAvailability: (id: string) => void;

  // Doctors
  doctors: Doctor[];
  addDoctor: (doctor: Omit<Doctor, 'id'>) => void;
  updateDoctor: (id: string, updated: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  toggleDoctorLeave: (id: string, reason?: string) => void;

  // Facilities
  facilities: ClinicFacility[];
  addFacility: (facility: Omit<ClinicFacility, 'id'>) => void;
  updateFacility: (id: string, updated: Partial<ClinicFacility>) => void;
  deleteFacility: (id: string) => void;

  // Articles
  articles: Article[];
  addArticle: (article: Omit<Article, 'id'>) => void;
  updateArticle: (id: string, updated: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  toggleArticleStatus: (id: string) => void;

  // Appointments
  appointments: Appointment[];
  createAppointment: (
    data: Omit<Appointment, 'id' | 'bookingCode' | 'queueNumber' | 'createdAt' | 'status'>
  ) => { appointment: Appointment; bookingCode: string };
  updateAppointmentStatus: (id: string, status: AppointmentStatus, notes?: string) => void;
  rescheduleAppointment: (id: string, newDate: string, newTimeSlot: string, adminNotes?: string) => void;
  deleteAppointment: (id: string) => void;
  exportCsv: () => void;
  findAppointmentByCodeOrPhone: (query: string) => Appointment[];

  // Auth & Mode
  currentUser: AdminUser | null;
  isAdminLoggedIn: boolean;
  activeView: 'public' | 'admin';
  adminTab: 'overview' | 'appointments' | 'doctors' | 'services' | 'facilities' | 'articles' | 'settings';
  setActiveView: (view: 'public' | 'admin') => void;
  setAdminTab: (tab: 'overview' | 'appointments' | 'doctors' | 'services' | 'facilities' | 'articles' | 'settings') => void;
  loginAsAdmin: (role: UserRole) => void;
  logoutAdmin: () => void;
  switchUserRole: (role: UserRole) => void;

  // Modals & Navigation triggers
  isBookingModalOpen: boolean;
  preselectedDoctorId: string | null;
  preselectedServiceId: string | null;
  openBookingModal: (doctorId?: string, serviceId?: string) => void;
  closeBookingModal: () => void;

  isTrackModalOpen: boolean;
  openTrackModal: () => void;
  closeTrackModal: () => void;

  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;

  toastMessage: string | null;
  showToast: (msg: string) => void;
  resetAllData: () => void;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export function ClinicProvider({ children }: { children: React.ReactNode }) {
  // States with lazy initializers
  const [settings, setSettings] = useState<ClinicSetting>(() =>
    loadFromStorage('medika_clinic_settings_v1', DEFAULT_CLINIC_SETTINGS)
  );
  const [doctors, setDoctors] = useState<Doctor[]>(() =>
    loadFromStorage('medika_clinic_doctors_v1', DEFAULT_DOCTORS)
  );
  const [services, setServices] = useState<MedicalService[]>(() =>
    loadFromStorage('medika_clinic_services_v1', DEFAULT_SERVICES)
  );
  const [facilities, setFacilities] = useState<ClinicFacility[]>(() =>
    loadFromStorage('medika_clinic_facilities_v1', DEFAULT_FACILITIES)
  );
  const [articles, setArticles] = useState<Article[]>(() =>
    loadFromStorage('medika_clinic_articles_v1', DEFAULT_ARTICLES)
  );
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    loadFromStorage('medika_clinic_appointments_v1', DEFAULT_APPOINTMENTS)
  );
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(() =>
    loadFromStorage<AdminUser | null>('medika_clinic_auth_v1', null)
  );

  // UI state
  const [activeView, setActiveView] = useState<'public' | 'admin'>('public');
  const [adminTab, setAdminTab] = useState<'overview' | 'appointments' | 'doctors' | 'services' | 'facilities' | 'articles' | 'settings'>('overview');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [preselectedDoctorId, setPreselectedDoctorId] = useState<string | null>(null);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | null>(null);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Settings
  const updateSettings = (newSettings: Partial<ClinicSetting>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveToStorage('medika_clinic_settings_v1', updated);
      return updated;
    });
    showToast('Pengaturan umum klinik berhasil disimpan.');
  };

  // Services
  const addService = (newService: Omit<MedicalService, 'id'>) => {
    const id = `srv-${Date.now().toString().slice(-4)}`;
    setServices((prev) => {
      const updated = [{ ...newService, id }, ...prev];
      saveToStorage('medika_clinic_services_v1', updated);
      return updated;
    });
    showToast(`Layanan "${newService.name}" berhasil ditambahkan.`);
  };

  const updateService = (id: string, updatedFields: Partial<MedicalService>) => {
    setServices((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, ...updatedFields } : s));
      saveToStorage('medika_clinic_services_v1', updated);
      return updated;
    });
    showToast('Data layanan medis berhasil diperbarui.');
  };

  const deleteService = (id: string) => {
    setServices((prev) => {
      const updated = prev.filter((s) => s.id !== id);
      saveToStorage('medika_clinic_services_v1', updated);
      return updated;
    });
    showToast('Layanan medis berhasil dihapus.');
  };

  const toggleServiceAvailability = (id: string) => {
    setServices((prev) => {
      const updated = prev.map((s) => (s.id === id ? { ...s, isAvailable: !s.isAvailable } : s));
      saveToStorage('medika_clinic_services_v1', updated);
      return updated;
    });
  };

  // Doctors
  const addDoctor = (newDoc: Omit<Doctor, 'id'>) => {
    const id = `doc-${Date.now().toString().slice(-4)}`;
    setDoctors((prev) => {
      const updated = [{ ...newDoc, id }, ...prev];
      saveToStorage('medika_clinic_doctors_v1', updated);
      return updated;
    });
    showToast(`Data dokter "${newDoc.name}" berhasil didaftarkan.`);
  };

  const updateDoctor = (id: string, updatedFields: Partial<Doctor>) => {
    setDoctors((prev) => {
      const updated = prev.map((d) => (d.id === id ? { ...d, ...updatedFields } : d));
      saveToStorage('medika_clinic_doctors_v1', updated);
      return updated;
    });
    showToast('Profil dokter dan jadwal berhasil diperbarui.');
  };

  const deleteDoctor = (id: string) => {
    setDoctors((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      saveToStorage('medika_clinic_doctors_v1', updated);
      return updated;
    });
    showToast('Data dokter berhasil dihapus.');
  };

  const toggleDoctorLeave = (id: string, reason?: string) => {
    setDoctors((prev) => {
      const updated = prev.map((d) =>
        d.id === id ? { ...d, isLeave: !d.isLeave, leaveReason: !d.isLeave ? (reason || 'Cuti Tugas / Seminar') : undefined } : d
      );
      saveToStorage('medika_clinic_doctors_v1', updated);
      return updated;
    });
    showToast('Status praktik / cuti dokter diperbarui.');
  };

  // Facilities
  const addFacility = (fac: Omit<ClinicFacility, 'id'>) => {
    const id = `fac-${Date.now().toString().slice(-4)}`;
    setFacilities((prev) => {
      const updated = [{ ...fac, id }, ...prev];
      saveToStorage('medika_clinic_facilities_v1', updated);
      return updated;
    });
    showToast(`Fasilitas "${fac.name}" berhasil ditambahkan.`);
  };

  const updateFacility = (id: string, updatedFields: Partial<ClinicFacility>) => {
    setFacilities((prev) => {
      const updated = prev.map((f) => (f.id === id ? { ...f, ...updatedFields } : f));
      saveToStorage('medika_clinic_facilities_v1', updated);
      return updated;
    });
    showToast('Data fasilitas berhasil disimpan.');
  };

  const deleteFacility = (id: string) => {
    setFacilities((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      saveToStorage('medika_clinic_facilities_v1', updated);
      return updated;
    });
    showToast('Fasilitas berhasil dihapus.');
  };

  // Articles
  const addArticle = (art: Omit<Article, 'id'>) => {
    const id = `art-${Date.now().toString().slice(-4)}`;
    setArticles((prev) => {
      const updated = [{ ...art, id }, ...prev];
      saveToStorage('medika_clinic_articles_v1', updated);
      return updated;
    });
    showToast('Artikel edukasi kesehatan berhasil dipublikasikan.');
  };

  const updateArticle = (id: string, updatedFields: Partial<Article>) => {
    setArticles((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, ...updatedFields } : a));
      saveToStorage('medika_clinic_articles_v1', updated);
      return updated;
    });
    showToast('Artikel berhasil diperbarui.');
  };

  const deleteArticle = (id: string) => {
    setArticles((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      saveToStorage('medika_clinic_articles_v1', updated);
      return updated;
    });
    showToast('Artikel berhasil dihapus.');
  };

  const toggleArticleStatus = (id: string) => {
    setArticles((prev) => {
      const updated: Article[] = prev.map((a) =>
        a.id === id ? { ...a, status: (a.status === 'Published' ? 'Draft' : 'Published') as 'Published' | 'Draft' } : a
      );
      saveToStorage('medika_clinic_articles_v1', updated);
      return updated;
    });
  };

  // Appointments
  const createAppointment = (
    data: Omit<Appointment, 'id' | 'bookingCode' | 'queueNumber' | 'createdAt' | 'status'>
  ) => {
    const id = `apt-${Date.now()}`;
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const bookingCode = `MED-${randomDigits}`;

    // Calculate queue number for that doctor on that date
    const sameDayBookings = appointments.filter(
      (a) => a.doctorId === data.doctorId && a.appointmentDate === data.appointmentDate
    );
    const queueNumber = sameDayBookings.length + 1;

    const newAppointment: Appointment = {
      ...data,
      id,
      bookingCode,
      queueNumber,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => {
      const updated = [newAppointment, ...prev];
      saveToStorage('medika_clinic_appointments_v1', updated);
      return updated;
    });

    return { appointment: newAppointment, bookingCode };
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus, notes?: string) => {
    setAppointments((prev) => {
      const updated = prev.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            status,
            confirmedAt: status === 'Confirmed' ? new Date().toISOString() : a.confirmedAt,
            adminNotes: notes !== undefined ? notes : a.adminNotes,
          };
        }
        return a;
      });
      saveToStorage('medika_clinic_appointments_v1', updated);
      return updated;
    });
    showToast(`Status pendaftaran janji temu diubah menjadi "${status}".`);
  };

  const rescheduleAppointment = (
    id: string,
    newDate: string,
    newTimeSlot: string,
    adminNotes?: string
  ) => {
    setAppointments((prev) => {
      const updated: Appointment[] = prev.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            appointmentDate: newDate,
            appointmentTimeSlot: newTimeSlot,
            status: 'Confirmed' as AppointmentStatus,
            adminNotes: adminNotes || `Jadwal disesuaikan menjadi ${newDate} pk ${newTimeSlot}`,
          };
        }
        return a;
      });
      saveToStorage('medika_clinic_appointments_v1', updated);
      return updated;
    });
    showToast('Jadwal kunjungan pasien berhasil diubah.');
  };

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      saveToStorage('medika_clinic_appointments_v1', updated);
      return updated;
    });
    showToast('Data janji temu berhasil dihapus.');
  };

  const exportCsv = () => {
    exportAppointmentsToCsv(appointments);
    showToast('File CSV janji temu berhasil diunduh.');
  };

  const findAppointmentByCodeOrPhone = (query: string): Appointment[] => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return appointments.filter((apt) => {
      const codeMatch = apt.bookingCode.toLowerCase().includes(q);
      const phoneClean = apt.patientPhone.replace(/\D/g, '');
      const queryClean = q.replace(/\D/g, '');
      const phoneMatch = queryClean.length >= 4 && phoneClean.includes(queryClean);
      const nameMatch = apt.patientName.toLowerCase().includes(q);
      return codeMatch || phoneMatch || nameMatch;
    });
  };

  // Auth
  const loginAsAdmin = (role: UserRole) => {
    const user = DEFAULT_ADMIN_USERS.find((u) => u.role === role) || DEFAULT_ADMIN_USERS[0];
    setCurrentUser(user);
    saveToStorage('medika_clinic_auth_v1', user);
    setActiveView('admin');
    setIsLoginModalOpen(false);
    showToast(`Selamat datang di CMS, ${user.fullName} (${user.role})`);
  };

  const logoutAdmin = () => {
    setCurrentUser(null);
    saveToStorage('medika_clinic_auth_v1', null);
    setActiveView('public');
    showToast('Anda telah keluar dari CMS Admin.');
  };

  const switchUserRole = (role: UserRole) => {
    const user = DEFAULT_ADMIN_USERS.find((u) => u.role === role) || DEFAULT_ADMIN_USERS[0];
    setCurrentUser(user);
    saveToStorage('medika_clinic_auth_v1', user);
    showToast(`Role aktif beralih ke: ${role}`);
  };

  // Booking Modal
  const openBookingModal = (doctorId?: string, serviceId?: string) => {
    setPreselectedDoctorId(doctorId || null);
    setPreselectedServiceId(serviceId || null);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    setPreselectedDoctorId(null);
    setPreselectedServiceId(null);
  };

  const openTrackModal = () => setIsTrackModalOpen(true);
  const closeTrackModal = () => setIsTrackModalOpen(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <ClinicContext.Provider
      value={{
        settings,
        updateSettings,
        services,
        addService,
        updateService,
        deleteService,
        toggleServiceAvailability,
        doctors,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        toggleDoctorLeave,
        facilities,
        addFacility,
        updateFacility,
        deleteFacility,
        articles,
        addArticle,
        updateArticle,
        deleteArticle,
        toggleArticleStatus,
        appointments,
        createAppointment,
        updateAppointmentStatus,
        rescheduleAppointment,
        deleteAppointment,
        exportCsv,
        findAppointmentByCodeOrPhone,
        currentUser,
        isAdminLoggedIn: !!currentUser,
        activeView,
        adminTab,
        setActiveView,
        setAdminTab,
        loginAsAdmin,
        logoutAdmin,
        switchUserRole,
        isBookingModalOpen,
        preselectedDoctorId,
        preselectedServiceId,
        openBookingModal,
        closeBookingModal,
        isTrackModalOpen,
        openTrackModal,
        closeTrackModal,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        toastMessage,
        showToast,
        resetAllData: resetClinicDataToDefault,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
}

export function useClinic() {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
}
