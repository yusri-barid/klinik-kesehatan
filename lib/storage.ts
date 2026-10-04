import { 
  ClinicSetting, 
  Doctor, 
  MedicalService, 
  ClinicFacility, 
  Appointment, 
  Article, 
  AdminUser 
} from '@/types/clinic';
import {
  DEFAULT_CLINIC_SETTINGS,
  DEFAULT_DOCTORS,
  DEFAULT_SERVICES,
  DEFAULT_FACILITIES,
  DEFAULT_ARTICLES,
  DEFAULT_APPOINTMENTS,
  DEFAULT_ADMIN_USERS,
} from './clinic-data';

const STORAGE_KEY_SETTINGS = 'medika_clinic_settings_v1';
const STORAGE_KEY_DOCTORS = 'medika_clinic_doctors_v1';
const STORAGE_KEY_SERVICES = 'medika_clinic_services_v1';
const STORAGE_KEY_FACILITIES = 'medika_clinic_facilities_v1';
const STORAGE_KEY_ARTICLES = 'medika_clinic_articles_v1';
const STORAGE_KEY_APPOINTMENTS = 'medika_clinic_appointments_v1';
const STORAGE_KEY_AUTH = 'medika_clinic_auth_v1';

export function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (err) {
    console.warn(`Failed to read from localStorage key "${key}":`, err);
    return fallback;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to save to localStorage key "${key}":`, err);
  }
}

export function getInitialClinicData() {
  return {
    settings: loadFromStorage<ClinicSetting>(STORAGE_KEY_SETTINGS, DEFAULT_CLINIC_SETTINGS),
    doctors: loadFromStorage<Doctor[]>(STORAGE_KEY_DOCTORS, DEFAULT_DOCTORS),
    services: loadFromStorage<MedicalService[]>(STORAGE_KEY_SERVICES, DEFAULT_SERVICES),
    facilities: loadFromStorage<ClinicFacility[]>(STORAGE_KEY_FACILITIES, DEFAULT_FACILITIES),
    articles: loadFromStorage<Article[]>(STORAGE_KEY_ARTICLES, DEFAULT_ARTICLES),
    appointments: loadFromStorage<Appointment[]>(STORAGE_KEY_APPOINTMENTS, DEFAULT_APPOINTMENTS),
    auth: loadFromStorage<AdminUser | null>(STORAGE_KEY_AUTH, null),
  };
}

export function persistAllData(data: {
  settings?: ClinicSetting;
  doctors?: Doctor[];
  services?: MedicalService[];
  facilities?: ClinicFacility[];
  articles?: Article[];
  appointments?: Appointment[];
  auth?: AdminUser | null;
}) {
  if (data.settings) saveToStorage(STORAGE_KEY_SETTINGS, data.settings);
  if (data.doctors) saveToStorage(STORAGE_KEY_DOCTORS, data.doctors);
  if (data.services) saveToStorage(STORAGE_KEY_SERVICES, data.services);
  if (data.facilities) saveToStorage(STORAGE_KEY_FACILITIES, data.facilities);
  if (data.articles) saveToStorage(STORAGE_KEY_ARTICLES, data.articles);
  if (data.appointments) saveToStorage(STORAGE_KEY_APPOINTMENTS, data.appointments);
  if (data.auth !== undefined) saveToStorage(STORAGE_KEY_AUTH, data.auth);
}

export function resetClinicDataToDefault() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY_SETTINGS);
  localStorage.removeItem(STORAGE_KEY_DOCTORS);
  localStorage.removeItem(STORAGE_KEY_SERVICES);
  localStorage.removeItem(STORAGE_KEY_FACILITIES);
  localStorage.removeItem(STORAGE_KEY_ARTICLES);
  localStorage.removeItem(STORAGE_KEY_APPOINTMENTS);
  window.location.reload();
}

/**
 * Generates an Excel/Sheets compatible CSV from appointments
 */
export function exportAppointmentsToCsv(appointments: Appointment[]): void {
  const headers = [
    'Kode Booking',
    'Tanggal Kunjungan',
    'Slot Waktu',
    'Status',
    'No Antrean',
    'Nama Pasien',
    'No WhatsApp',
    'Email',
    'NIK',
    'Tanggal Lahir',
    'Jenis Kelamin',
    'Jenis Kunjungan',
    'Dokter',
    'Spesialisasi',
    'Layanan',
    'Keluhan',
    'Tanggal Pendaftaran'
  ];

  const escapeCsv = (str: string | number | undefined) => {
    if (str === undefined || str === null) return '""';
    const s = String(str).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = appointments.map((apt) => [
    escapeCsv(apt.bookingCode),
    escapeCsv(apt.appointmentDate),
    escapeCsv(apt.appointmentTimeSlot),
    escapeCsv(apt.status),
    escapeCsv(apt.queueNumber),
    escapeCsv(apt.patientName),
    escapeCsv(`'${apt.patientPhone}`), // apostrophe prevents excel stripping leading zero
    escapeCsv(apt.patientEmail),
    escapeCsv(`'${apt.patientNik}`),
    escapeCsv(apt.patientBirthDate),
    escapeCsv(apt.patientGender === 'L' ? 'Laki-laki' : 'Perempuan'),
    escapeCsv(apt.visitType),
    escapeCsv(apt.doctorName),
    escapeCsv(apt.doctorSpecialization),
    escapeCsv(apt.serviceName),
    escapeCsv(apt.complaintsNotes),
    escapeCsv(apt.createdAt),
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const timestamp = new Date().toISOString().slice(0, 10);
  link.setAttribute('download', `Daftar_Janji_Temu_Klinik_MedikaSehat_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Creates formatted WhatsApp click-to-chat URL
 */
export function buildWhatsAppMessageUrl(apt: Appointment, clinicWhatsapp: string): string {
  const cleanPhone = apt.patientPhone.replace(/\D/g, '').replace(/^0/, '62');
  const text = `Halo Bapak/Ibu *${apt.patientName}*,\n\nTerima kasih telah mendaftar di *Klinik Medika Sehat*.\nBerikut konfirmasi janji temu Anda:\n\n` +
    `📋 *Kode Booking:* ${apt.bookingCode}\n` +
    `🔢 *Nomor Antrean:* #${apt.queueNumber}\n` +
    `👨‍⚕️ *Dokter:* ${apt.doctorName}\n` +
    `🏥 *Layanan:* ${apt.serviceName}\n` +
    `📅 *Tanggal:* ${apt.appointmentDate}\n` +
    `⏰ *Waktu:* ${apt.appointmentTimeSlot} WIB\n` +
    `📌 *Status:* *${apt.status.toUpperCase()}*\n\n` +
    `Mohon hadir 15 menit sebelum jam jadwal di resepsionis klinik. Bila ada perubahan jadwal, mohon konfirmasi melalui nomor ini.\n\nSalam sehat,\n*Klinik Medika Sehat*`;

  return `https://wa.me/${cleanPhone || clinicWhatsapp}?text=${encodeURIComponent(text)}`;
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}
