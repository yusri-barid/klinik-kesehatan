export type UserRole = 'Super Admin' | 'Content Editor';

export interface ClinicSetting {
  clinicName: string;
  clinicTagline: string;
  clinicType: string;
  accreditationText: string;
  skKemenkes: string;
  address: string;
  city: string;
  postalCode: string;
  phoneEmergency: string;
  phoneReception: string;
  whatsapp: string;
  email: string;
  operatingHoursWeekday: string;
  operatingHoursWeekend: string;
  operatingHoursUgd: string;
  mapEmbedUrl: string;
  googleReviewScore: number;
  googleReviewCount: number;
  socialInstagram: string;
  socialFacebook: string;
  socialYoutube: string;
  announcementText: string;
  announcementActive: boolean;
  heroHeadline: string;
  heroSubheadline: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialization: string;
  sip: string;
  experienceYears: number;
  education: string;
  bio: string;
  avatarUrl: string;
  consultationFee: number;
  daysActive: string[];
  hoursText: string;
  timeSlots: string[];
  quotaPerDay: number;
  isLeave: boolean;
  leaveReason?: string;
}

export type ServiceCategory = 'Poliklinik Umum' | 'Dokter Spesialis' | 'Diagnostik & Lab' | 'Layanan Khusus';

export interface MedicalService {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  estimatedDuration: string;
  priceMin: number;
  priceMax?: number;
  doctorInCharge: string;
  iconName: string;
  isAvailable: boolean;
  features: string[];
}

export interface ClinicFacility {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  specifications: string[];
}

export type AppointmentStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: string;
  bookingCode: string;
  patientName: string;
  patientNik: string;
  patientPhone: string;
  patientEmail: string;
  patientBirthDate: string;
  patientGender: 'L' | 'P';
  patientAddress: string;
  visitType: 'Baru' | 'Kontrol';
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  serviceId: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTimeSlot: string;
  complaintsNotes: string;
  status: AppointmentStatus;
  queueNumber: number;
  createdAt: string;
  confirmedAt?: string;
  adminNotes?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  doctorAuthor: string;
  doctorTitle: string;
  readTimeMinutes: number;
  publishedAt: string;
  coverImageUrl: string;
  tags: string[];
  status: 'Published' | 'Draft';
}

export interface AdminUser {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  email: string;
}
