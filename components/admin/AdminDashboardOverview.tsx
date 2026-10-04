'use client';

import React from 'react';
import { useClinic } from '@/context/ClinicContext';
import { buildWhatsAppMessageUrl } from '@/lib/storage';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  AlertCircle, 
  MessageSquare, 
  ArrowRight,
  Stethoscope
} from 'lucide-react';

export default function AdminDashboardOverview() {
  const { 
    appointments, 
    doctors, 
    services, 
    settings, 
    setAdminTab, 
    updateAppointmentStatus, 
    currentUser 
  } = useClinic();

  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter((a) => a.status === 'Pending');
  const confirmedAppointments = appointments.filter((a) => a.status === 'Confirmed');
  const completedAppointments = appointments.filter((a) => a.status === 'Completed');
  const activeDoctors = doctors.filter((d) => !d.isLeave);

  const isSuperAdmin = currentUser?.role === 'Super Admin';

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Halo, {currentUser?.fullName || 'Administrator'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Panel ringkasan operasional harian {settings.clinicName}. Role aktif: <span className="font-semibold text-teal-800">{currentUser?.role}</span>
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setAdminTab('appointments')}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            Lihat Semua Janji Temu
          </button>
        </div>
      </div>

      {/* Metrics Grid with Tabular Numerals */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Total Booking Masuk</span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums font-mono">
            {totalAppointments}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Riwayat pendaftaran online
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-amber-200/80 bg-amber-50/20 shadow-sm">
          <div className="flex items-center justify-between text-xs text-amber-800 mb-2 font-medium">
            <span>Menunggu Konfirmasi</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-900 tabular-nums font-mono">
            {pendingAppointments.length}
          </div>
          <div className="text-[11px] text-amber-700/80 mt-1">
            Perlu ditinjau oleh staf loket
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-emerald-200/80 bg-emerald-50/20 shadow-sm">
          <div className="flex items-center justify-between text-xs text-emerald-800 mb-2 font-medium">
            <span>Terkonfirmasi</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-900 tabular-nums font-mono">
            {confirmedAppointments.length}
          </div>
          <div className="text-[11px] text-emerald-700/80 mt-1">
            Siap untuk jadwal konsultasi
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>Dokter Praktik Aktif</span>
            <Stethoscope className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums font-mono">
            {activeDoctors.length} / {doctors.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {doctors.length - activeDoctors.length} dokter sedang cuti
          </div>
        </div>

      </div>

      {/* Pending Appointments Action Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Pendaftaran Janji Temu Terbaru (Menunggu Konfirmasi)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hubungi pasien untuk konfirmasi jadwal kunjungan
            </p>
          </div>
          <button
            onClick={() => setAdminTab('appointments')}
            className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
          >
            <span>Semua Data</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingAppointments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-slate-600 font-medium">Semua pendaftaran telah terkonfirmasi.</p>
            <p className="text-slate-400 mt-1">Tidak ada antrean pending saat ini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Kode Booking</th>
                  <th className="py-3 px-4">Nama Pasien</th>
                  <th className="py-3 px-4">Dokter & Poli</th>
                  <th className="py-3 px-4">Jadwal Rencana</th>
                  <th className="py-3 px-4">WhatsApp</th>
                  <th className="py-3 px-4 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingAppointments.slice(0, 5).map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {apt.bookingCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{apt.patientName}</div>
                      <div className="text-[11px] text-slate-400">{apt.visitType} · #{apt.queueNumber}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{apt.doctorName}</div>
                      <div className="text-[11px] text-slate-400">{apt.serviceName}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {apt.appointmentDate} <span className="text-slate-400">({apt.appointmentTimeSlot} WIB)</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {apt.patientPhone}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={buildWhatsAppMessageUrl(apt, settings.whatsapp)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded"
                          title="Chat Pasien via WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>

                        {isSuperAdmin && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'Confirmed')}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-medium text-[11px] cursor-pointer"
                          >
                            Konfirmasi
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Access Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => setAdminTab('doctors')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm cursor-pointer transition-all"
        >
          <h4 className="text-sm font-bold text-slate-900 mb-1">
            Kelola Roster & Cuti Dokter
          </h4>
          <p className="text-xs text-slate-500 mb-3">
            Atur hari praktik mingguan, jam shift, serta penandaan dokter cuti/libur.
          </p>
          <span className="text-xs font-semibold text-teal-700 flex items-center gap-1">
            <span>Buka Dokter & Jadwal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div
          onClick={() => setAdminTab('services')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm cursor-pointer transition-all"
        >
          <h4 className="text-sm font-bold text-slate-900 mb-1">
            Katalog Layanan & Estimasi Tarif
          </h4>
          <p className="text-xs text-slate-500 mb-3">
            Update biaya konsultasi, deskripsi poliklinik, dan fitur fasilitas medis.
          </p>
          <span className="text-xs font-semibold text-teal-700 flex items-center gap-1">
            <span>Buka Layanan Medis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <div
          onClick={() => setAdminTab('articles')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-slate-300 shadow-sm cursor-pointer transition-all"
        >
          <h4 className="text-sm font-bold text-slate-900 mb-1">
            Publikasi Artikel Kesehatan (CMS)
          </h4>
          <p className="text-xs text-slate-500 mb-3">
            Tulis dan sunting artikel edukasi pasien dengan editor teks lengkap.
          </p>
          <span className="text-xs font-semibold text-teal-700 flex items-center gap-1">
            <span>Buka Artikel Edukasi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

    </div>
  );
}
