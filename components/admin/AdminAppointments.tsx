'use client';

import React, { useState } from 'react';
import { useClinic } from '@/context/ClinicContext';
import { Appointment, AppointmentStatus } from '@/types/clinic';
import { buildWhatsAppMessageUrl } from '@/lib/storage';
import { 
  Download, 
  Search, 
  Filter, 
  MessageSquare, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Edit3, 
  Plus, 
  X,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

export default function AdminAppointments() {
  const { 
    appointments, 
    doctors, 
    services, 
    settings, 
    updateAppointmentStatus, 
    rescheduleAppointment, 
    deleteAppointment, 
    exportCsv, 
    createAppointment,
    currentUser,
    showToast 
  } = useClinic();

  const isSuperAdmin = currentUser?.role === 'Super Admin';

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [filterDoctor, setFilterDoctor] = useState<string>('Semua');
  const [filterDate, setFilterDate] = useState<string>('');

  // Modals
  const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [rescheduleNotes, setRescheduleNotes] = useState('');

  // Manual Creation Modal
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualDoctorId, setManualDoctorId] = useState(doctors[0]?.id || '');
  const [manualServiceId, setManualServiceId] = useState(services[0]?.id || '');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualTime, setManualTime] = useState('09:00');
  const [manualNotes, setManualNotes] = useState('');

  const filteredAppointments = appointments.filter((apt) => {
    const matchSearch = apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientPhone.includes(searchQuery);
    const matchStatus = filterStatus === 'Semua' || apt.status === filterStatus;
    const matchDoctor = filterDoctor === 'Semua' || apt.doctorId === filterDoctor;
    const matchDate = !filterDate || apt.appointmentDate === filterDate;
    return matchSearch && matchStatus && matchDoctor && matchDate;
  });

  const handleOpenReschedule = (apt: Appointment) => {
    setRescheduleApt(apt);
    setNewDate(apt.appointmentDate);
    setNewTime(apt.appointmentTimeSlot);
    setRescheduleNotes(apt.adminNotes || '');
  };

  const handleSaveReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleApt || !newDate || !newTime) return;
    rescheduleAppointment(rescheduleApt.id, newDate, newTime, rescheduleNotes);
    setRescheduleApt(null);
  };

  const handleManualCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName || !manualPhone) {
      showToast('Nama dan nomor telepon wajib diisi.');
      return;
    }
    const doc = doctors.find((d) => d.id === manualDoctorId) || doctors[0];
    const srv = services.find((s) => s.id === manualServiceId) || services[0];

    createAppointment({
      patientName: manualName,
      patientPhone: manualPhone,
      patientEmail: '-',
      patientNik: '-',
      patientBirthDate: '1990-01-01',
      patientGender: 'L',
      patientAddress: 'Pendaftaran Loket Langsung',
      visitType: 'Baru',
      doctorId: doc.id,
      doctorName: doc.name,
      doctorSpecialization: doc.specialization,
      serviceId: srv.id,
      serviceName: srv.name,
      appointmentDate: manualDate,
      appointmentTimeSlot: manualTime,
      complaintsNotes: manualNotes || 'Pendaftaran langsung via resepsionis',
    });

    setIsManualModalOpen(false);
    setManualName('');
    setManualPhone('');
    setManualNotes('');
    showToast('Janji temu manual berhasil ditambahkan.');
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'Confirmed':
        return <span className="text-emerald-700 font-semibold text-[11px]">Terkonfirmasi</span>;
      case 'Pending':
        return <span className="text-amber-700 font-semibold text-[11px]">Pending</span>;
      case 'Completed':
        return <span className="text-slate-600 font-semibold text-[11px]">Selesai</span>;
      case 'Cancelled':
        return <span className="text-rose-600 font-semibold text-[11px]">Dibatalkan</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Daftar Janji Temu Pasien
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola pendaftaran konsultasi, status pemeriksaan, dan ekspor data ke Excel/CSV.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Export to CSV button (PRD requirement) */}
          <button
            onClick={exportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-sm transition-colors cursor-pointer"
            title="Download CSV Janji Temu"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Ekspor ke Excel / CSV</span>
          </button>

          {isSuperAdmin && (
            <button
              onClick={() => setIsManualModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Booking Manual</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, kode booking, nomor WA..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900 placeholder:text-slate-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
            >
              <option value="Semua">Semua Status (Pending, Confirmed, dll)</option>
              <option value="Pending">Menunggu Konfirmasi (Pending)</option>
              <option value="Confirmed">Terkonfirmasi (Confirmed)</option>
              <option value="Completed">Selesai (Completed)</option>
              <option value="Cancelled">Dibatalkan (Cancelled)</option>
            </select>
          </div>

          {/* Doctor Filter */}
          <div>
            <select
              value={filterDoctor}
              onChange={(e) => setFilterDoctor(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
            >
              <option value="Semua">Semua Dokter Pemeriksa</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 text-slate-900"
            />
          </div>
        </div>

        {(searchQuery || filterStatus !== 'Semua' || filterDoctor !== 'Semua' || filterDate) && (
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>Menemukan {filteredAppointments.length} dari {appointments.length} data janji temu</span>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterStatus('Semua');
                setFilterDoctor('Semua');
                setFilterDate('');
              }}
              className="text-teal-700 hover:underline font-semibold cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        )}
      </div>

      {/* Appointments Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Kode / Antrean</th>
                <th className="py-3 px-4">Nama Pasien & Kontak</th>
                <th className="py-3 px-4">Dokter & Layanan</th>
                <th className="py-3 px-4">Jadwal Kunjungan</th>
                <th className="py-3 px-4">Keluhan</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Tindakan Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    Tidak ada janji temu yang sesuai dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50 transition-colors">
                    
                    {/* Booking Code & Queue */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900">{apt.bookingCode}</div>
                      <div className="text-[11px] text-teal-800 font-semibold">Antrean #{apt.queueNumber}</div>
                    </td>

                    {/* Patient Name & WA */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{apt.patientName}</div>
                      <div className="text-[11px] font-mono text-slate-500">{apt.patientPhone}</div>
                      <div className="text-[10px] text-slate-400">{apt.visitType} · {apt.patientGender === 'L' ? 'Laki-laki' : 'Perempuan'}</div>
                    </td>

                    {/* Doctor & Service */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-900">{apt.doctorName}</div>
                      <div className="text-[11px] text-slate-500">{apt.serviceName}</div>
                    </td>

                    {/* Appointment Date & Time */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="text-slate-900 font-medium">{apt.appointmentDate}</div>
                      <div className="text-[11px] text-teal-700 font-semibold">{apt.appointmentTimeSlot} WIB</div>
                    </td>

                    {/* Complaints */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="line-clamp-2 text-slate-600 text-[11px]">
                        {apt.complaintsNotes || '-'}
                      </p>
                      {apt.adminNotes && (
                        <p className="text-[10px] text-amber-700 mt-0.5 line-clamp-1">
                          Catatan: {apt.adminNotes}
                        </p>
                      )}
                    </td>

                    {/* Status with quick selector */}
                    <td className="py-3.5 px-4">
                      {isSuperAdmin ? (
                        <select
                          value={apt.status}
                          onChange={(e) => updateAppointmentStatus(apt.id, e.target.value as AppointmentStatus)}
                          className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 font-medium focus:outline-none focus:ring-1 focus:ring-teal-700"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      ) : (
                        getStatusBadge(apt.status)
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        
                        {/* WhatsApp Notification Direct link */}
                        <a
                          href={buildWhatsAppMessageUrl(apt, settings.whatsapp)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded cursor-pointer"
                          title="Kirim Konfirmasi via WhatsApp"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>

                        {isSuperAdmin && (
                          <>
                            {/* Reschedule Button */}
                            <button
                              onClick={() => handleOpenReschedule(apt)}
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded cursor-pointer"
                              title="Jadwal Ulang (Reschedule)"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => {
                                if (confirm(`Hapus data janji temu ${apt.bookingCode} (${apt.patientName})?`)) {
                                  deleteAppointment(apt.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reschedule Modal */}
      {rescheduleApt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
            <button
              onClick={() => setRescheduleApt(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Jadwal Ulang (Reschedule) Janji Temu
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Pasien: <strong>{rescheduleApt.patientName}</strong> ({rescheduleApt.bookingCode})
            </p>

            <form onSubmit={handleSaveReschedule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal Baru
                </label>
                <input
                  type="date"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Slot Waktu Baru
                </label>
                <input
                  type="text"
                  required
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="Contoh: 10:30"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Alasan Reschedule
                </label>
                <textarea
                  rows={2}
                  value={rescheduleNotes}
                  onChange={(e) => setRescheduleNotes(e.target.value)}
                  placeholder="Misal: Pasien meminta pemindahan waktu karena ada rapat mendadak..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleApt(null)}
                  className="flex-1 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg"
                >
                  Simpan Jadwal Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manual Appointment Creation Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsManualModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Tambah Janji Temu Manual (Walk-in / Telepon)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Gunakan untuk pasien yang mendaftar langsung di meja resepsionis klinik.
            </p>

            <form onSubmit={handleManualCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Pasien *
                  </label>
                  <input
                    type="text"
                    required
                    value={manualName}
                    onChange={(e) => setManualName(e.target.value)}
                    placeholder="Nama lengkap"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={manualPhone}
                    onChange={(e) => setManualPhone(e.target.value)}
                    placeholder="08123456789"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dokter Pemeriksa
                  </label>
                  <select
                    value={manualDoctorId}
                    onChange={(e) => setManualDoctorId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  >
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Layanan
                  </label>
                  <select
                    value={manualServiceId}
                    onChange={(e) => setManualServiceId(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    required
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jam Slot
                  </label>
                  <input
                    type="text"
                    required
                    value={manualTime}
                    onChange={(e) => setManualTime(e.target.value)}
                    placeholder="09:00"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Keluhan Pasien
                </label>
                <textarea
                  rows={2}
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  placeholder="Keluhan singkat pasien..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="flex-1 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg"
                >
                  Daftarkan Pasien
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
